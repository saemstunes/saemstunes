
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Heart,
  Share,
  MoreHorizontal,
  Download,
  Plus,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AudioPlayer from '@/components/media/AudioPlayer';
import { ArtistMetadataManager } from '@/components/artists/ArtistMetadataManager';
import { useMediaState } from '@/components/idle-state/mediaStateContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { validate as isUuid } from 'uuid';
import EnhancedAnimatedList from '@/components/tracks/EnhancedAnimatedList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface AudioTrack {
  id: string | number;
  src: string;
  name: string;
  artist?: string;
  artwork?: string;
  album?: string;
}

const AudioPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [trackData, setTrackData] = useState<AudioTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { setMediaPlaying } = useMediaState();
  const [showMetadataPrompt, setShowMetadataPrompt] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const { state, playTrack, pauseTrack, resumeTrack } = useAudioPlayer();

  // Optimized storage URL generator
  const getStorageUrl = useCallback((path: string | null | undefined, bucket = 'tracks'): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Handle special characters in paths
    const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
    return `${supabase.storageUrl}/object/public/${bucket}/${encodedPath}`;
  }, []);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setMediaPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setMediaPlaying]);

  // Fetch all tracks - optimized with caching
  const fetchAllTracks = useCallback(async () => {
    try {
      const { data: allTracks, error: tracksError } = await supabase
        .from('tracks')
        .select('id, title, audio_path, cover_path, artist')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 tracks for performance

      if (tracksError) throw tracksError;
      
      if (allTracks) {
        const mappedTracks = allTracks.map(track => ({
          id: track.id,
          src: getStorageUrl(track.audio_path),
          name: track.title,
          artist: track.artist,
          artwork: getStorageUrl(track.cover_path),
          album: 'Single'
        }));
        setTracks(mappedTracks);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  }, [getStorageUrl]);

  // Fetch current track - optimized
  const fetchTrackData = useCallback(async (trackId: string) => {
    try {
      let data: any = null;
      
      // First, check if we already have the track in our list
      const existingTrack = tracks.find(t => t.id === trackId);
      if (existingTrack) {
        setTrackData(existingTrack);
        setLoading(false);
        return;
      }
      
      // If not in list, fetch from API
      if (isUuid(trackId)) {
        const { data: trackData, error } = await supabase
          .from('tracks')
          .select('*')
          .eq('id', trackId)
          .single();
        
        if (error) throw error;
        data = trackData;
      } else {
        const { data: trackData, error } = await supabase
          .from('tracks')
          .select('*')
          .eq('slug', trackId)
          .single();
        
        if (error) throw error;
        data = trackData;
      }

      if (data) {
        const audioUrl = getStorageUrl(data.audio_path);
        const coverUrl = getStorageUrl(data.cover_path) || '/placeholder.svg';

        const newTrack = {
          id: data.id,
          src: audioUrl,
          name: data.title,
          artist: data.artist || 'Unknown Artist',
          artwork: coverUrl,
          album: 'Single'
        };
        
        setTrackData(newTrack);
        
        // Add to tracks list for future use
        setTracks(prev => [...prev, newTrack]);
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      toast({
        title: "Error",
        description: "Failed to load track data",
        variant: "destructive",
      });
      setTrackData({
        id: 1,
        src: '/audio/sample.mp3',
        name: 'Sample Track',
        artist: 'Sample Artist',
        artwork: '/placeholder.svg',
        album: 'Sample Album'
      });
    } finally {
      setLoading(false);
    }
  }, [getStorageUrl, toast, tracks]);

  // Handle initial data loading
  useEffect(() => {
    const init = async () => {
      // Fetch all tracks in background
      fetchAllTracks();
      
      if (location.state?.track) {
        // Handle special case for Pale Ulipo track
        let track = location.state.track;
        if (track.name === "Pale Ulipo") {
          track = {
            ...track,
            src: track.src.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
          };
        }
        
        setTrackData(track);
        setLoading(false);
      } else if (id) {
        await fetchTrackData(id);
      } else {
        setTrackData({
          id: 1,
          src: '/audio/sample.mp3',
          name: 'Sample Track',
          artist: 'Sample Artist',
          artwork: '/placeholder.svg',
          album: 'Sample Album'
        });
        setLoading(false);
      }
    };

    init();
  }, [id, location.state, fetchAllTracks, fetchTrackData]);

  // Like/Save functionality
  const checkIfLiked = useCallback(async () => {
    if (!user || !trackData) return;
    
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('track_id', String(trackData.id))
      .single();
    
    setIsLiked(!!data);
  }, [user, trackData]);

  const checkIfSaved = useCallback(async () => {
    if (!user || !trackData) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', String(trackData.id))
      .eq('content_type', 'track')
      .single();
    
    setIsSaved(!!data);
  }, [user, trackData]);

  useEffect(() => {
    if (user && trackData) {
      checkIfLiked();
      checkIfSaved();
    }
  }, [user, trackData, checkIfLiked, checkIfSaved]);

  const toggleLike = useCallback(async () => {
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
  }, [user, trackData, isLiked, toast]);

  const toggleSave = useCallback(async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save tracks",
        variant: "destructive",
      });
      return;
    }

    if (!trackData) return;
    
    if (isSaved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', String(trackData.id))
        .eq('content_type', 'track');
      setIsSaved(false);
      toast({
        title: "Removed from saved",
        description: "Track removed from your saved songs",
      });
    } else {
      await supabase
        .from('favorites')
        .insert({ 
          user_id: user.id, 
          content_id: String(trackData.id),
          content_type: 'track'
        });
      setIsSaved(true);
      toast({
        title: "Added to saved",
        description: "Track added to your saved songs",
      });
    }
  }, [user, trackData, isSaved, toast]);

  const handleShare = useCallback(async () => {
    if (!trackData) return;

    const shareData = {
      title: `${trackData.name} by ${trackData.artist}`,
      text: `Listen to ${trackData.name} on Saem's Tunes`,
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
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Unable to share track",
        variant: "destructive",
      });
    }
  }, [trackData, toast]);

  const handleDownload = useCallback(() => {
    toast({
      title: "Download feature",
      description: "Download functionality will be available for premium users",
    });
  }, [toast]);

  const handleAddToPlaylist = useCallback(() => {
    toast({
      title: "Add to playlist",
      description: "Playlist functionality coming soon",
    });
  }, [toast]);

  const handleTrackSelect = useCallback((track: AudioTrack) => {
    setTrackData(track);
    navigate(`/tracks/${track.id}`);
  }, [navigate]);

  // Handle audio errors
  const handleAudioError = useCallback(() => {
    setAudioError(true);
    toast({
      title: "Audio Error",
      description: "Unable to load the audio player. Please try refreshing the page.",
      variant: "destructive",
    });
  }, [toast]);

  const togglePlayPause = useCallback(() => {
    if (!trackData) return;
    
    if (state?.isPlaying) {
      pauseTrack();
    } else {
      if (state?.currentTrack?.id === trackData.id) {
        resumeTrack();
      } else {
        playTrack({
          id: trackData.id.toString(),
          src: trackData.src,
          name: trackData.name,
          artist: trackData.artist || '',
          artwork: trackData.artwork || '',
        });
      }
    }
  }, [trackData, state, playTrack, pauseTrack, resumeTrack]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-gold animate-spin mx-auto mb-4"></div>
            <p>Loading track...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!trackData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Track not found</h2>
            <Button onClick={() => navigate('/tracks')}>
              Back to Tracks
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${trackData?.name || 'Audio Player'} - Saem's Tunes`}</title>
        <meta name="description" content={`Listen to ${trackData?.name || 'music'} by ${trackData?.artist || 'artist'}`} />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Now Playing</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Player */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden bg-gradient-to-b from-card to-card/80 border-gold/20 shadow-2xl">
                  <CardContent className="p-6 md:p-8">
                    {/* Album Artwork and Info */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
                      {/* Artwork */}
                      <div className="flex-shrink-0 mx-auto lg:mx-0 w-full max-w-[320px]">
                        <div className="relative group aspect-square">
                          <img
                            src={trackData?.artwork || '/placeholder.svg'}
                            alt={trackData?.name || 'Track artwork'}
                            className={cn(
                              "w-full h-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300",
                              !imageLoaded && "opacity-0"
                            )}
                            onLoad={() => setImageLoaded(true)}
                          />
                          
                          {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                          )}
                          
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>

                      {/* Track Info */}
                      <div className="flex flex-col justify-center space-y-6 flex-1 text-center lg:text-left">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{trackData?.name || 'Unknown Track'}</h2>
                          <p className="text-xl md:text-2xl text-muted-foreground mb-2">{trackData?.artist || 'Unknown Artist'}</p>
                          {trackData?.album && (
                            <p className="text-lg text-muted-foreground/80">{trackData.album}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
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
                                  <DropdownMenuItem onClick={toggleSave}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isSaved ? 'Remove from saved' : 'Save track'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={handleAddToPlaylist}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to playlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>

                        {/* Audio Player */}
                        <div className="space-y-6">
                          {audioError ? (
                            <div className="text-center py-12">
                              <p className="text-muted-foreground mb-4">Unable to load audio player</p>
                              <Button onClick={() => window.location.reload()}>
                                Try Again
                              </Button>
                            </div>
                          ) : (
                            trackData && (
                              <AudioPlayer
                                src={trackData.src}
                                title={trackData.name}
                                artist={trackData.artist}
                                artwork={trackData.artwork}
                                className="bg-transparent border-0 shadow-none"
                                onError={handleAudioError}
                              />
                            )
                          )}

                          {/* Enhanced Controls */}
                          <div className="flex items-center justify-center gap-4 mt-6">
                            <Button variant="ghost" size="sm" disabled>
                              <Shuffle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled>
                              <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="lg"
                              onClick={togglePlayPause}
                              className="h-12 w-12 rounded-full"
                              disabled={!trackData}
                            >
                              {state?.isPlaying && state?.currentTrack?.id === trackData.id ? (
                                <Pause className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5 ml-0.5" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" disabled>
                              <SkipForward className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled>
                              <Repeat className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {showMetadataPrompt && trackData && (
                          <ArtistMetadataManager trackId={String(trackData.id)} />
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Track List */}
                  <div className="lg:col-span-1">
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5" />
                          Tracks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Tabs defaultValue="all" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="favorites">Favorites</TabsTrigger>
                            <TabsTrigger value="recent">Recent</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="all" className="mt-0">
                            <ScrollArea className="h-[600px]">
                              <div className="p-4">
                                <EnhancedAnimatedList
                                  tracks={tracks as any}
                                  onTrackSelect={handleTrackSelect as any}
                                />
                              </div>
                            </ScrollArea>
                          </TabsContent>
                          
                          <TabsContent value="favorites" className="mt-0">
                            <ScrollArea className="h-[600px]">
                              <div className="p-4">
                                <p className="text-center text-muted-foreground py-8">
                                  No favorite tracks yet
                                </p>
                              </div>
                            </ScrollArea>
                          </TabsContent>
                          
                          <TabsContent value="recent" className="mt-0">
                            <ScrollArea className="h-[600px]">
                              <div className="p-4">
                                <p className="text-center text-muted-foreground py-8">
                                  No recent tracks
                                </p>
                              </div>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </MainLayout>
          </>
        );
      };

      export default AudioPlayerPage;
      
