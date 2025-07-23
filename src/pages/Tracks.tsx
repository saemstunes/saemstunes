import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Search, Plus, Heart, CheckCircle, Share } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { PlaylistActions } from '@/components/playlists/PlaylistActions';
import AudioPlayer from '@/components/media/AudioPlayer';
import EnhancedAnimatedList from '@/components/tracks/EnhancedAnimatedList';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist?: string;
  cover_path?: string;
  audio_path: string;
  description?: string;
  created_at: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

const Tracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracks');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
    fetchPlaylists();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTracks(data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tracks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch playlists. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleShare = (track: Track) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title} by ${track.artist} on Saem's Tunes`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Share",
        description: "Sharing is not supported on this browser"
      });
    }
  };

  const toggleLike = () => {
    toast({
      title: "Like",
      description: "This feature is not yet implemented"
    });
  };

  const toggleSave = () => {
    toast({
      title: "Save",
      description: "This feature is not yet implemented"
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Music Library</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="mt-6">
            <div className="grid gap-6">
              {/* Suggested Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Suggested For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <EnhancedAnimatedList tracks={filteredTracks.slice(0, 10)} />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* All Tracks */}
              <Card>
                <CardHeader>
                  <CardTitle>All Tracks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <EnhancedAnimatedList tracks={filteredTracks} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="mt-6">
            <div className="grid gap-4">
              {playlists.map((playlist) => (
                <Card key={playlist.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Music className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {playlist.description || 'No description'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {new Date(playlist.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Playlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="mt-6">
            <div className="grid gap-6">
              {/* Albums with track listings */}
              {filteredTracks.map((track) => (
                <Card key={track.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                        {track.cover_path ? (
                          <ResponsiveImage 
                            src={track.cover_path} 
                            alt="Artist" 
                            width={48}
                            height={48}
                            mobileWidth={48}
                            mobileHeight={48}
                            className="h-12 w-12 rounded-full object-cover"
                            priority={false}
                          />
                        ) : (
                          <Music className="h-6 w-6 text-gold" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{track.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          by {track.artist || 'Unknown Artist'}
                        </p>
                        {track.description && (
                          <p className="text-sm mt-2">{track.description}</p>
                        )}
                      </div>
                      
                      {track.cover_path && (
                        <ResponsiveImage 
                          src={track.cover_path} 
                          alt="Cover" 
                          width={64}
                          height={64}
                          mobileWidth={48}
                          mobileHeight={48}
                          className="h-16 w-16 md:h-16 md:w-16 sm:h-12 sm:w-12 rounded object-cover"
                          priority={false}
                        />
                      )}
                    </div>

                    <div className="mb-4">
                      <AudioPlayer 
                        src={track.audio_path.startsWith('http') ? track.audio_path : `https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/${track.audio_path}`}
                        title={track.title}
                        artist={track.artist || 'Unknown Artist'}
                        artwork={track.cover_path}
                        compact={false}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <PlaylistActions trackId={track.id} />
                      <div className="flex items-center gap-4 flex-wrap">
                        {user && (
                          <>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Save
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Share className="h-4 w-4" />
                          Share
                        </Button>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(track.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tracks;
