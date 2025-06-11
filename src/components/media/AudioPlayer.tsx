
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePermissionRequest } from '@/lib/permissionsHelper';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { requestPermissionWithFeedback } = usePermissionRequest();

  // Initialize audio element
  useEffect(() => {
    try {
      const audio = new Audio(src);
      audioRef.current = audio;
      
      const setupAudio = async () => {
        try {
          if (autoPlay) {
            const hasPermission = await requestPermissionWithFeedback('microphone', 'Audio playback');
            if (hasPermission && audio.play) {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise.then(() => {
                  setIsPlaying(true);
                }).catch(err => {
                  console.error('Autoplay failed:', err);
                  setIsPlaying(false);
                });
              }
            }
          }
          
          // Set up MediaSession API if supported
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: title || 'Unknown Track',
              artist: artist || 'Unknown Artist',
              artwork: [{ src: artwork, sizes: '512x512', type: 'image/png' }]
            });
            
            navigator.mediaSession.setActionHandler('play', () => togglePlay());
            navigator.mediaSession.setActionHandler('pause', () => togglePlay());
          }
          
        } catch (err) {
          console.error('Error setting up audio:', err);
          setError('Failed to load audio file');
          onError?.();
        }
      };
      
      setupAudio();
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.remove();
        }
      };
    } catch (err) {
      console.error('Error creating audio element:', err);
      setError('Failed to initialize audio player');
      onError?.();
    }
  }, [src, autoPlay, title, artist, artwork, onError]);

  // Set up event listeners for the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (isRepeat && audio.play) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Error replaying audio:', err));
        setIsPlaying(true);
      } else if (onEnded) {
        onEnded();
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleLoadedData = () => setIsLoading(false);
    const handleError = () => {
      setError('Error loading audio file');
      setIsLoading(false);
      onError?.();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat, onEnded, onError]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
        }
      } catch (err) {
        console.error('Error playing audio:', err);
        toast({
          title: 'Playback Error',
          description: 'Failed to play audio. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleProgressChange = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = values[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
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
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-gold animate-spin"></div>
      </div>
    );
  }
  
  if (compact) {
    // Compact player for smaller UI areas
    return (
      <div className={cn("flex items-center gap-2 p-2", className)}>
        <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1">
          <Slider 
            value={[currentTime]}
            max={duration || 100} 
            step={0.1}
            onValueChange={handleProgressChange}
            className="h-1"
          />
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    );
  }
  
  return (
    <div className={cn("bg-background border rounded-md p-4 space-y-4", className)}>
      {/* Track info */}
      {(title || artist) && (
        <div className="flex items-center gap-3">
          {artwork && (
            <img 
              src={artwork} 
              alt={title || "Album art"}
              className="h-12 w-12 object-cover rounded"
            />
          )}
          <div>
            {title && <p className="font-medium">{title}</p>}
            {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
          </div>
        </div>
      )}
      
      {/* Playback progress */}
      <div className="space-y-2">
        <div className="relative" ref={progressBarRef}>
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
      
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", isShuffle && "text-gold")}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              title="Previous"
              disabled
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon" 
              onClick={togglePlay}
              className="h-10 w-10 rounded-full bg-gold hover:bg-gold-dark text-white"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              title="Next"
              disabled
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", isRepeat && "text-gold")}
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
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]} 
              min={0} 
              max={1} 
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
