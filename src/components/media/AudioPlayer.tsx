import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  MoreHorizontal
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePermissionRequest } from '@/lib/permissionsHelper';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaState } from '@/components/idle-state/mediaStateContext';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  artwork?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: () => void;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  artist,
  artwork = '/placeholder.svg',
  autoPlay = false,
  onEnded,
  onError,
  className,
  showControls = true,
  compact = false
}) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  
  const { toast } = useToast();
  const { requestPermissionWithFeedback } = usePermissionRequest();
  const { state, playTrack, pauseTrack, resumeTrack, seek, setVolume, toggleMute } = useAudioPlayer();

   // Add this useEffect to handle external state changes
  useEffect(() => {
    setMediaPlaying(state.isPlaying);
  }, [state.isPlaying, setMediaPlaying]);

  // Create track object
  const track = {
    id: src,
    src,
    name: title || 'Unknown Track',
    artist: artist || 'Unknown Artist',
    artwork,
  };

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;
  const currentTime = isCurrentTrack ? state.currentTime : 0;
  const duration = isCurrentTrack ? state.duration : 0;

  useEffect(() => {
    if (autoPlay && src) {
      handlePlay();
    }
  }, [autoPlay, src]);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      if (autoPlay) {
        const hasPermission = await requestPermissionWithFeedback('microphone', 'Audio playback');
        if (!hasPermission) {
          setIsLoading(false);
          return;
        }
      }
      
      const startTime = isCurrentTrack ? state.lastPlayedTime : 0;
      playTrack(track, startTime);
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      await handlePlay();
    }
  };
  
  const handleProgressChange = (values: number[]) => {
    const newTime = values[0];
    seek(newTime);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
  };
  
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    toast({
      title: isRepeat ? 'Repeat Off' : 'Repeat On',
      description: isRepeat ? 'Track will not repeat' : 'Track will repeat when finished',
    });
  };
  
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    toast({
      title: isShuffle ? 'Shuffle Off' : 'Shuffle On',
      description: 'This feature will work when playing multiple tracks',
    });
  };
  
  if (error) {
    return (
      <div className={cn("bg-muted rounded-md p-4 text-center", className)}>
        <p className="text-destructive">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className={cn("bg-muted rounded-md p-4 flex items-center justify-center", className)}>
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
      </div>
    );
  }
  
  if (compact) {
    // Compact player for smaller UI areas
    return (
      <div className={cn("flex items-center gap-2 p-2 min-w-0 overflow-hidden", className)}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={togglePlay} 
          className="h-8 w-8 flex-shrink-0"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <Slider 
            value={[currentTime]}
            max={duration || 100} 
            step={0.1}
            onValueChange={handleProgressChange}
            className="h-1"
          />
        </div>
        
        <span className="text-xs text-muted-foreground flex-shrink-0 hidden xs:block">
          {formatTime(currentTime)}
        </span>
      </div>
    );
  }
  
  return (
    <div className={cn("bg-background border rounded-lg overflow-hidden w-full", className)}>
      {/* Track info - Always visible */}
      {(title || artist) && (
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-3 min-w-0">
            {artwork && (
              <img 
                src={artwork} 
                alt={title || "Album art"}
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              {title && <p className="font-medium text-sm sm:text-base truncate">{title}</p>}
              {artist && <p className="text-xs sm:text-sm text-muted-foreground truncate">{artist}</p>}
            </div>
          </div>
        </div>
      )}
      
      {/* Progress section */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="space-y-2">
          <div className="relative">
            <Slider 
              value={[currentTime]}
              max={duration || 100} 
              step={0.1}
              onValueChange={handleProgressChange}
              className="cursor-pointer"
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Essential controls - Always visible */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {/* Skip back - hidden on very small screens */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hidden xs:flex"
            title="Previous"
            disabled
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          {/* Play/Pause - Always visible */}
          <Button 
            variant="default" 
            size="icon" 
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          
          {/* Skip forward - hidden on very small screens */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hidden xs:flex"
            title="Next"
            disabled
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Advanced controls - Responsive visibility */}
        {showControls && (
          <>
            {/* Mobile: Collapsible advanced controls */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center mt-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                  className="h-8 w-8"
                  title="More controls"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <AnimatePresence>
                {showAdvancedControls && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3">
                      {/* Repeat and Shuffle */}
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-8 w-8", isShuffle && "text-primary")}
                          onClick={toggleShuffle}
                          title="Shuffle"
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-8 w-8", isRepeat && "text-primary")}
                          onClick={toggleRepeat}
                          title="Repeat"
                        >
                          <Repeat className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Volume control */}
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={toggleMute} 
                          className="h-8 w-8"
                          title={state.isMuted ? "Unmute" : "Mute"}
                        >
                          {state.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <div className="flex-1 max-w-24">
                          <Slider
                            value={[state.isMuted ? 0 : state.volume]} 
                            min={0} 
                            max={1} 
                            step={0.01}
                            onValueChange={handleVolumeChange}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop: Always visible advanced controls */}
            <div className="hidden sm:flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8", isShuffle && "text-primary")}
                  onClick={toggleShuffle}
                  title="Shuffle"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8", isRepeat && "text-primary")}
                  onClick={toggleRepeat}
                  title="Repeat"
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute} 
                  className="h-8 w-8"
                  title={state.isMuted ? "Unmute" : "Mute"}
                >
                  {state.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20 lg:w-24">
                  <Slider
                    value={[state.isMuted ? 0 : state.volume]} 
                    min={0} 
                    max={1} 
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS for extra small screens */}
      <style jsx>{`
        @media (max-width: 475px) {
          .xs\\:block { display: block !important; }
          .xs\\:flex { display: flex !important; }
          .xs\\:h-12 { height: 3rem !important; }
          .xs\\:w-12 { width: 3rem !important; }
          .xs\\:text-base { font-size: 1rem !important; }
          .xs\\:text-sm { font-size: 0.875rem !important; }
        }
        @media (min-width: 475px) {
          .xs\\:block { display: block !important; }
          .xs\\:flex { display: flex !important; }
          .xs\\:h-12 { height: 3rem !important; }
          .xs\\:w-12 { width: 3rem !important; }
          .xs\\:text-base { font-size: 1rem !important; }
          .xs\\:text-sm { font-size: 0.875rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
