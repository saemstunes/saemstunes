import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft,
  Heart,
  Share,
  MoreHorizontal,
  Download,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AudioPlayer from '@/components/media/AudioPlayer';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaState } from '@/components/idle-state/mediaStateContext';

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
  const { setMediaPlaying } = useMediaState();

  // Add this useEffect to handle page visibility
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
  const SALAMA_TRACK = {
  id: 'featured',
  src: 'https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Cover%20Art/Salama%20-%20Saem%20x%20Simali.mp3',
  name: 'Salama (DEMO)',
  artist: "Saem's Tunes ft. Evans Simali",
  artwork: 'https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover%20Art/salama-featured.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvQ292ZXIgQXJ0L3NhbGFtYS1mZWF0dXJlZC5qcGciLCJpYXQiOjE3NDk5NTMwNTksImV4cCI6MTc4MTQ4OTA1OX0.KtKlRXxj5z5KzzbnTDWd9oRVbztRHwioGA0YN1Xjn4Q',
  album: 'NaombAoH'
};
  
  // Update the useEffect hook
useEffect(() => {
  // If we're on the featured route, set Salama as default
  if (id === 'featured') {
    setTrackData(SALAMA_TRACK);
    setLoading(false);
    return;
  }
  
  // Existing logic for other tracks
  if (location.state?.track) {
    setTrackData(location.state.track);
    setLoading(false);
  } else if (id) {
    fetchTrackData(id);
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
}, [id, location.state]);

  const fetchTrackData = async (trackId: string) => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('id', trackId)
        .single();

      if (error) throw error;

      if (data) {
        const audioUrl = data.audio_path ? 
          supabase.storage.from('tracks').getPublicUrl(data.audio_path).data.publicUrl : '';
        
        const coverUrl = data.cover_path ? 
          supabase.storage.from('tracks').getPublicUrl(data.cover_path).data.publicUrl : '';

        setTrackData({
          id: data.id,
          src: audioUrl,
          name: data.title,
          artist: data.profiles?.display_name || 'Unknown Artist',
          artwork: coverUrl || '/placeholder.svg',
          album: 'Single'
        });
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      toast({
        title: "Error",
        description: "Failed to load track data",
        variant: "destructive",
      });
      // Fallback to default data
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
  };
  

  const checkIfLiked = async () => {
    if (!user || !trackData) return;
    
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('track_id', String(trackData.id))
      .single();
    
    setIsLiked(!!data);
  };

  const checkIfSaved = async () => {
    if (!user || !trackData) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', String(trackData.id))
      .eq('content_type', 'track')
      .single();
    
    setIsSaved(!!data);
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

  const toggleSave = async () => {
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
  };

  const handleShare = async () => {
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
  };

  const handleDownload = () => {
    toast({
      title: "Download feature",
      description: "Download functionality will be available for premium users",
    });
  };

  const handleAddToPlaylist = () => {
    toast({
      title: "Add to playlist",
      description: "Playlist functionality coming soon",
    });
  };

  // Handle audio errors
  const handleAudioError = () => {
    setAudioError(true);
    toast({
      title: "Audio Error",
      description: "Unable to load the audio player. Please try refreshing the page.",
      variant: "destructive",
    });
  };

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
        <title>{`${trackData.name} - Audio Player - Saem's Tunes`}</title>
        <meta name="description" content={`Listen to ${trackData.name} by ${trackData.artist}`} />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
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

            <Card className="overflow-hidden bg-gradient-to-b from-card to-card/80 border-gold/20 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                {/* Album Artwork and Info */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
                  {/* Artwork */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="relative group">
                      <ResponsiveImage
                        src={trackData.artwork || '/placeholder.svg'}
                        alt={trackData.name}
                        className="w-80 h-80 md:w-80 md:h-80 sm:w-72 sm:h-72 rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex flex-col justify-center space-y-6 flex-1 text-center lg:text-left">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{trackData.name}</h2>
                      <p className="text-xl md:text-2xl text-muted-foreground mb-2">{trackData.artist}</p>
                      {trackData.album && (
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
                    <AudioPlayer
                      src={trackData.src}
                      title={trackData.name}
                      artist={trackData.artist}
                      artwork={trackData.artwork}
                      className="bg-transparent border-0 shadow-none"
                      onError={handleAudioError}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AudioPlayerPage;
