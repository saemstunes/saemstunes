
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/media/AudioPlayer';
import EnhancedAnimatedList from '@/components/tracks/EnhancedAnimatedList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Music, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist?: string;
  cover_path?: string;
  audio_path: string;
  description?: string;
  created_at: string;
}

const AudioPlayerPage = () => {
  const { id } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, playTrack, pauseTrack, resumeTrack } = useAudioPlayer();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setTracks(data);
        if (id) {
          const track = data.find(t => t.id === id);
          if (track) setCurrentTrack(track);
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
  };

  const getCurrentTrackAudioUrl = () => {
    if (!currentTrack) return '';
    return currentTrack.audio_path.startsWith('http') 
      ? currentTrack.audio_path 
      : `https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/${currentTrack.audio_path}`;
  };

  const togglePlayPause = () => {
    if (state?.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading tracks...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentTrack ? (
                  <AudioPlayer
                    src={getCurrentTrackAudioUrl()}
                    trackId={currentTrack.id}
                    title={currentTrack.title}
                    artist={currentTrack.artist}
                    artwork={currentTrack.cover_path}
                    autoPlay={false}
                    showControls={true}
                    compact={false}
                  />
                ) : (
                  <div className="text-center py-16">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Track Selected</h3>
                    <p className="text-muted-foreground">
                      Choose a track from the playlist to start listening
                    </p>
                  </div>
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
                    disabled={!currentTrack}
                  >
                    {state?.isPlaying ? (
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
              </CardContent>
            </Card>
          </div>

          {/* Track List */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Tracks</CardTitle>
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
                          tracks={tracks}
                          onTrackSelect={handleTrackSelect}
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
  );
};

export default AudioPlayerPage;
