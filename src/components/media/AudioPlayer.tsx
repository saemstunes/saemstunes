import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  MoreHorizontal,
  Heart,
  Share,
  Download,
  Plus,
  Music
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePermissionRequest } from '@/lib/permissionsHelper';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaState } from '@/components/idle-state/mediaStateContext';
import { supabase } from '@/integrations/supabase/client';
import { validate as isUuid } from 'uuid';
import EnhancedAnimatedList from '@/components/tracks/EnhancedAnimatedList';
import AddToPlaylistModal from '@/components/playlists/AddToPlaylistModal';
import { ArtistMetadataManager } from '@/components/artists/ArtistMetadataManager';
import { useAuth } from '@/context/AuthContext';
import { AudioTrack } from '@/types/music';

interface Track {
  id: string | number;
  title: string;
  artist?: string | null;
  audio_path: string;
  cover_path?: string | null;
  description?: string;
  album?: string;
  slug?: string;
  duration?: number;
  approved?: boolean;
  created_at?: string;
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
  isFullPage?: boolean;
  showTrackList?: boolean;
  enablePlaylistFeatures?: boolean;
  enableSocialFeatures?: boolean;
  trackList?: AudioTrack[];
  onTrackSelect?: (track: AudioTrack) => void;
  onBack?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
  compact = false,
  isFullPage = false,
  showTrackList = false,
  enablePlaylistFeatures = false,
  enableSocialFeatures = false,
  trackList = [],
  onTrackSelect,
  onBack
}) => {
  const { setMediaPlaying } = useMediaState();
  const { user } = useAuth();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>(src || '');
  const [coverUrl, setCoverUrl] = useState<string>(artwork);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showMetadataPrompt, setShowMetadataPrompt] = useState(false);
  
  const { toast } = useToast();
  const { requestPermissionWithFeedback } = usePermissionRequest();
  const { 
    state, 
    playTrack, 
    pauseTrack, 
    resumeTrack, 
    seek, 
    setVolume, 
    toggleMute, 
    playNext,
    playPrevious,
    toggleShuffle: globalToggleShuffle,
    toggleRepeat: globalToggleRepeat,
  } = useAudioPlayer();

  // Fetch track metadata if trackId is provided
  useEffect(() => {
    const fetchTrackData = async () => {
      if (!trackId) return;
      
      try {
        setIsLoading(true);
        let query: any = supabase
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

        // Check if trackId is a valid UUID
        if (typeof trackId === 'string' && isUuid(trackId)) {
          query = query.eq('id', trackId);
        } else {
          query = query.eq('slug', trackId);
        }

        const { data, error }: { data: any; error: any } = await query.single();

        if (error) throw error;
        if (!data) return;

        setTrackData(data as any);

        // Get public URL for audio
        const audioUrl = (data as any).audio_path 
          ? supabase.storage.from('tracks').getPublicUrl((data as any).audio_path).data.publicUrl 
          : src || '';
        setAudioUrl(audioUrl);

        // Get cover URL
        const coverUrl = (data as any).cover_path 
          ? ((data as any).cover_path.startsWith('http') 
              ? (data as any).cover_path 
              : supabase.storage.from('tracks').getPublicUrl((data as any).cover_path).data.publicUrl)
          : artwork;
        setCoverUrl(coverUrl);
      } catch (err) {
        console.error('Error fetching track:', err);
        setError('Failed to load track metadata');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackData();
  }, [trackId, src, artwork]);

  // Handle artwork changes
  useEffect(() => {
    setCoverUrl(artwork);
    setImageLoaded(false);
  }, [artwork]);

  // Handle image loading errors
  const handleImageError = () => {
    if (coverUrl !== '/placeholder.svg') {
      setCoverUrl('/placeholder.svg');
    }
  };

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
    if (isFullPage) {
      globalToggleRepeat();
    } else {
      setIsRepeat(!isRepeat);
      toast({
        title: isRepeat ? 'Repeat Off' : 'Repeat On',
        description: isRepeat ? 'Track will not repeat' : 'Track will repeat when finished',
      });
    }
  };
  
  const toggleShuffle = () => {
    if (isFullPage) {
      globalToggleShuffle();
    } else {
      setIsShuffle(!isShuffle);
      toast({
        title: isShuffle ? 'Shuffle Off' : 'Shuffle On',
        description: 'This feature will work when playing multiple tracks',
      });
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like tracks",
        variant: "destructive",
      });
      return;
    }

    if (!trackData) return;
    
    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', String(trackData.id));
      setIsLiked(false);
      toast({
        title: "Removed from favorites",
        description: "Track removed from your favorites",
      });
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: user.id, track_id: String(trackData.id) });
      setIsLiked(true);
      toast({
        title: "Added to favorites",
        description: "Track added to your favorites",
      });
    }
  };

  const handleShare = async () => {
    if (!trackData) return;

    const shareData = {
      title: `${trackData?.title || 'Unknown Track'} by ${trackData?.artist || 'Unknown Artist'}`,
      text: `Listen to this track on Saem's Tunes`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Track link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share track",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download feature",
      description: "Download functionality will be available for premium users",
    });
  };

  const handleTrackSelect = (track: AudioTrack) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    } else {
      playTrack(track);
    }
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
  
  if (isFullPage) {
    return (
      <div className={cn("min-h-screen bg-gradient-to-br from-background via-muted/30 to-background w-full", className)}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {onBack && (
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Now Playing</h1>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden bg-gradient-to-b from-card to-card/80 border-gold/20 shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
                    <div className="flex-shrink-0 mx-auto lg:mx-0 w-full max-w-[320px]">
                      <div className="relative group aspect-square">
                        <img
                          src={coverUrl}
                          alt={track.name || "Album art"}
                          className={cn(
                            "w-full h-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300",
                            !imageLoaded && "opacity-0"
                          )}
                          onLoad={() => setImageLoaded(true)}
                          onError={handleImageError}
                        />
                        
                        {!imageLoaded && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                        )}
                        
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6 flex-1 text-center lg:text-left">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{track.name}</h2>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-2">{track.artist}</p>
                      </div>

                      {enableSocialFeatures && (
                        <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleLike}
                            className={cn(
                              "h-12 w-12",
                              isLiked ? "text-red-500" : "text-muted-foreground"
                            )}
                          >
                            <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                          >
                            <Share className="h-6 w-6" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="h-6 w-6" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setIsSaved(!isSaved)}>
                                <Plus className="mr-2 h-4 w-4" />
                                {isSaved ? 'Remove from saved' : 'Save track'}
                              </DropdownMenuItem>
                              
                              {user && (
                                <AddToPlaylistModal 
                                  trackId={String(track.id)} 
                                  userId={user.id}
                                >
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to playlist
                                  </DropdownMenuItem>
                                </AddToPlaylistModal>
                              )}
                              
                              <DropdownMenuItem onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
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

                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={playPrevious}
                        className="h-12 w-12"
                        title="Previous"
                      >
                        <SkipBack className="h-6 w-6" />
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="icon" 
                        onClick={togglePlay}
                        className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
                        title={isPlaying ? "Pause" : "Play"}
                        disabled={!audioUrl}
                      >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={playNext}
                        className="h-12 w-12"
                        title="Next"
                      >
                        <SkipForward className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-10 w-10", state?.isShuffled && "text-primary")}
                          onClick={toggleShuffle}
                          title="Shuffle"
                        >
                          <Shuffle className="h-5 w-5" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-10 w-10", state?.isRepeating && "text-primary")}
                          onClick={toggleRepeat}
                          title="Repeat"
                        >
                          <Repeat className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={toggleMute} 
                          className="h-10 w-10"
                          title={state?.isMuted ? "Unmute" : "Mute"}
                        >
                          {state?.isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        
                        <div className="w-24">
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
                  </div>

                  {showMetadataPrompt && trackData && (
                    <ArtistMetadataManager trackId={String(trackData.id)} />
                  )}
                </CardContent>
              </Card>
            </div>

            {showTrackList && trackList.length > 0 && (
              <div className="lg:col-span-1">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5" />
                      Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                      <div className="p-4">
                        <EnhancedAnimatedList
                          tracks={trackList}
                          onTrackSelect={handleTrackSelect}
                        />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("bg-background border rounded-lg overflow-hidden w-full", className)}>
      {/* Track info - Always visible */}
      {(track.name || track.artist) && (
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-3 min-w-0">
            {coverUrl && (
              <div className="relative flex-shrink-0">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg h-10 w-10 sm:h-12 sm:w-12" />
                )}
                <img 
                  src={coverUrl} 
                  alt={track.name || "Album art"}
                  className={cn(
                    "h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg",
                    !imageLoaded ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {track.name && <p className="font-medium text-sm sm:text-base truncate">{track.name}</p>}
              {track.artist && <p className="text-xs sm:text-sm text-muted-foreground truncate">{track.artist}</p>}
              {trackData?.description && (
                <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">
                  {trackData.description}
                </p>
              )}
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

        {/* Essential controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hidden xs:flex"
            title="Previous"
            onClick={playPrevious}
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
            className="h-8 w-8 hidden xs:flex"
            title="Next"
            onClick={playNext}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Advanced controls */}
        {showControls && (
          <>
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
                      
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={toggleMute} 
                          className="h-8 w-8"
                          title={state?.isMuted ? "Unmute" : "Mute"}
                        >
                          {state?.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <div className="flex-1 max-w-24">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                  title={state?.isMuted ? "Unmute" : "Mute"}
                >
                  {state?.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20 lg:w-24">
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
          </>
        )}
      </div>

      {/* Custom CSS */}
      <style>{`
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
