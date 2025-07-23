import { useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Plus, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Shuffle, MoreHorizontal 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePermissionRequest } from '@/lib/permissionsHelper';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaState } from '@/components/idle-state/mediaStateContext';
import { supabase } from '@/integrations/supabase/client';
import { validate as isUuid } from 'uuid';

interface Track {
  id: string | number;
  title: string;
  artist?: string | null;
  audio_path: string;
  cover_path?: string | null;
  description?: string;
  profiles?: {
    avatar_url: string;
  };
}

interface AudioPlayerProps {
  src?: string;
  trackId?: string | number;
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

const TrackItem: React.FC<{
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onClick: () => void;
  onAddToPlaylist: () => void;
}> = ({ track, isPlaying, isCurrentTrack, onClick, onAddToPlaylist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const coverUrl = track.cover_path 
    ? (track.cover_path.startsWith('http') 
        ? track.cover_path 
        : supabase.storage.from('tracks').getPublicUrl(track.cover_path).data.publicUrl)
    : '/placeholder.svg';

  const handleImageError = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div
      className={cn(
        "relative p-3 rounded-lg border transition-all duration-200 cursor-pointer",
        isCurrentTrack 
          ? "bg-accent/10 dark:bg-accent/20 border-primary shadow-md" 
          : "bg-card dark:bg-card border-border hover:border-accent/50 hover:shadow-sm"
      )}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg h-12 w-12" />
          )}
          <img
            src={coverUrl}
            alt={track.title || "Album art"}
            className={cn(
              "h-12 w-12 object-cover rounded-lg",
              !imageLoaded ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-0.5" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {isCurrentTrack && (
            <motion.div 
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base truncate">
            {track.title}
          </p>
          {track.artist && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {track.artist}
            </p>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  trackId,
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
  const { setMediaPlaying } = useMediaState();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>(src || '');
  const [coverUrl, setCoverUrl] = useState<string>(artwork);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const { toast } = useToast();
  const { requestPermissionWithFeedback } = usePermissionRequest();
  const { state, playTrack, pauseTrack, resumeTrack, seek, setVolume, toggleMute } = useAudioPlayer();

  // Fetch track metadata if trackId is provided
  const fetchTrackData = useCallback(async () => {
    if (!trackId) return;

    try {
      setIsLoading(true);
      let query = supabase
        .from('tracks')
        .select(`
          id,
          title,
          artist,
          audio_path,
          cover_path,
          description,
          profiles:user_id (
            avatar_url
          )
        `);

      if (typeof trackId === 'string' && isUuid(trackId)) {
        query = query.eq('id', trackId);
      } else {
        query = query.eq('slug', trackId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      if (!data) return;

      setTrackData(data as Track);

      // Get public URL for audio
      const audioUrl = data.audio_path
        ? supabase.storage.from('tracks').getPublicUrl(data.audio_path).data.publicUrl
        : src || '';
      setAudioUrl(audioUrl);

      // Get cover URL
      const coverUrl = data.cover_path
        ? (data.cover_path.startsWith('http')
          ? data.cover_path
          : supabase.storage.from('tracks').getPublicUrl(data.cover_path).data.publicUrl)
        : artwork;
      setCoverUrl(coverUrl);
    } catch (err) {
      console.error('Error fetching track:', err);
      setError('Failed to load track metadata');
    } finally {
      setIsLoading(false);
    }
  }, [trackId, src, artwork]);

  useEffect(() => {
    fetchTrackData();
  }, [fetchTrackData]);

  // Handle external state changes
  useEffect(() => {
    if (state) {
      setMediaPlaying(state.isPlaying);
    }
  }, [state?.isPlaying, setMediaPlaying]);

  // Create track object
  const track = {
    id: trackId || src || '',
    src: audioUrl,
    name: trackData?.title || title || 'Unknown Track',
    artist: trackData?.artist || artist || 'Unknown Artist',
    artwork: coverUrl,
  };

  const isCurrentTrack = state?.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state?.isPlaying;
  const currentTime = isCurrentTrack ? (state?.currentTime || 0) : 0;
  const duration = isCurrentTrack ? (state?.duration || 0) : 0;

  useEffect(() => {
    if (autoPlay && audioUrl) {
      handlePlay();
    }
  }, [autoPlay, audioUrl]);

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

      const startTime = isCurrentTrack ? (state?.lastPlayedTime || 0) : 0;
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
    if (!audioUrl) {
      setError('No audio source available');
      return;
    }

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

  const handleAddToPlaylist = () => {
    toast({
      title: 'Added to playlist',
      description: `${track.name} has been added to your playlist`,
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
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

  return (
    <div className={cn("relative w-full max-w-full overflow-hidden", className)}>
      {/* Track List */}
      <div 
        className="h-full overflow-y-auto px-4 py-2 animated-list-scrollbar"
        onScroll={handleScroll}
      >
        <TrackItem
          track={{
            id: track.id,
            title: track.name,
            artist: track.artist,
            audio_path: audioUrl,
            cover_path: coverUrl,
          }}
          isPlaying={isPlaying}
          isCurrentTrack={isCurrentTrack}
          onClick={togglePlay}
          onAddToPlaylist={handleAddToPlaylist}
        />
      </div>

      {/* Progress and Controls */}
      <div className="bg-background border-t p-4">
        {/* Progress section */}
        <div className="space-y-2 mb-4">
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

        {/* Essential controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Shuffle"
            onClick={toggleShuffle}
          >
            <Shuffle className={cn("h-4 w-4", isShuffle && "text-primary")} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Previous"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            title={isPlaying ? "Pause" : "Play"}
            disabled={!audioUrl}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Next"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Repeat"
            onClick={toggleRepeat}
          >
            <Repeat className={cn("h-4 w-4", isRepeat && "text-primary")} />
          </Button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
            title={state?.isMuted ? "Unmute" : "Mute"}
          >
            {state?.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className="flex-1">
            <Slider
              value={[state?.isMuted ? 0 : (state?.volume || 1)]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>

      {/* Gradients */}
      <div
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          opacity: topGradientOpacity,
          background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          opacity: bottomGradientOpacity,
          background: 'linear-gradient(to top, hsl(var(--background)), transparent)'
        }}
      />
    </div>
  );
};

export default AudioPlayer;
