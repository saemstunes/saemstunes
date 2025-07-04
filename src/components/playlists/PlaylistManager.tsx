import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Edit, Trash2, Share, Clock, Music, List, Grid3X3, MoreVertical, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { cn } from '@/lib/utils';
import PlaylistCreationModal from './PlaylistCreationModal';
import CoverArtCustomizer from './CoverArtCustomizer';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_art_url?: string;
  category: 'covers' | 'originals_by_saems_tunes' | 'personal_playlist';
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  play_count: number;
  total_duration: number;
  track_count?: number;
}

interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
  track?: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    audio_path: string;
    cover_path?: string;
  };
}

const PlaylistManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { playTrack, state } = useAudioPlayer();
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sample playlists for demonstration
  const samplePlaylists = [
    { name: "African Gospel", category: 'covers' as const, description: "Soulful African gospel music" },
    { name: "Christian Afrobeats", category: 'covers' as const, description: "Contemporary Christian beats" },
    { name: "Morning Coffee Jazz", category: 'personal_playlist' as const, description: "Perfect for morning vibes" },
    { name: "Workout Motivation", category: 'personal_playlist' as const, description: "High energy tracks" },
    { name: "Late Night Vibes", category: 'personal_playlist' as const, description: "Chill evening music" },
    { name: "Classical Focus", category: 'personal_playlist' as const, description: "Study and focus music" },
    { name: "Indie Rock Mix", category: 'personal_playlist' as const, description: "Alternative indie tracks" },
    { name: "Electronic Dreams", category: 'personal_playlist' as const, description: "Electronic masterpieces" }
  ];

  useEffect(() => {
    fetchPlaylists();
    // Create sample playlists if none exist
    createSamplePlaylists();
  }, [user]);

  const createSamplePlaylists = async () => {
    if (!user) return;
    
    try {
      // Check if user has any playlists
      const { data: existingPlaylists } = await supabase
        .from('playlists')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingPlaylists && existingPlaylists.length === 0) {
        // Create sample playlists
        const playlistsToCreate = samplePlaylists.map(playlist => ({
          name: playlist.name,
          description: playlist.description,
          category: playlist.category,
          user_id: user.id,
          is_public: playlist.category !== 'personal_playlist',
          play_count: Math.floor(Math.random() * 100),
          total_duration: Math.floor(Math.random() * 3600) + 600 // 10-70 minutes
        }));

        await supabase.from('playlists').insert(playlistsToCreate);
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Error creating sample playlists:', error);
    }
  };

  const fetchPlaylists = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks (
            id,
            track_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

        // Calculate track count for each playlist
        const playlistsWithCount = data?.map(playlist => ({
          ...playlist,
          category: playlist.category as 'covers' | 'originals_by_saems_tunes' | 'personal_playlist',
          track_count: playlist.playlist_tracks?.length || 0
        })) || [];

        setPlaylists(playlistsWithCount as Playlist[]);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('playlist_tracks')
        .select(`
          *,
          tracks:track_id (
            id,
            title,
            audio_path,
            cover_path,
            profiles:user_id (
              display_name
            )
          )
        `)
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true });

      if (error) throw error;

      setPlaylistTracks(data || []);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load playlist tracks",
        variant: "destructive",
      });
    }
  };

  const handlePlayPlaylist = async (playlist: Playlist) => {
    await fetchPlaylistTracks(playlist.id);
    if (playlistTracks.length > 0) {
      const firstTrack = playlistTracks[0];
      if (firstTrack.track) {
        playTrack({
          id: firstTrack.track.id,
          src: firstTrack.track.audio_path,
          name: firstTrack.track.title,
          artist: firstTrack.track.artist || 'Unknown Artist',
          artwork: firstTrack.track.cover_path,
          album: playlist.name
        });
      }
    }
    
    // Update play count
    await supabase
      .from('playlists')
      .update({ play_count: playlist.play_count + 1 })
      .eq('id', playlist.id);
    
    fetchPlaylists();
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
      
      fetchPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'covers': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'originals_by_saems_tunes': return 'bg-gold/10 text-gold border-gold/20';
      case 'personal_playlist': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'covers': return 'Covers';
      case 'originals_by_saems_tunes': return "Saem's Originals";
      case 'personal_playlist': return 'Personal';
      default: return 'Unknown';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredPlaylists = categoryFilter === 'all' 
    ? playlists 
    : playlists.filter(p => p.category === categoryFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Playlists</h2>
          <p className="text-muted-foreground">Manage your music collections</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="covers">Covers</option>
            <option value="originals_by_saems_tunes">Saem's Originals</option>
            <option value="personal_playlist">Personal</option>
          </select>
          
          {/* View mode toggle */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} className="bg-gold hover:bg-gold-dark text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
        </div>
      </div>

      {/* Playlists Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="p-4">
                  <div className="relative">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center mb-3 overflow-hidden">
                      {playlist.cover_art_url ? (
                        <img 
                          src={playlist.cover_art_url} 
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-12 w-12 text-muted-foreground" />
                      )}
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                          onClick={() => handlePlayPlaylist(playlist)}
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className={cn("text-xs", getCategoryColor(playlist.category))}>
                      {getCategoryLabel(playlist.category)}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg line-clamp-1">{playlist.name}</CardTitle>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{playlist.track_count || 0} tracks</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(playlist.total_duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                  {playlist.cover_art_url ? (
                    <img 
                      src={playlist.cover_art_url} 
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gold hover:bg-gold-dark text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handlePlayPlaylist(playlist)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{playlist.name}</h3>
                  <Badge variant="secondary" className={cn("text-xs", getCategoryColor(playlist.category))}>
                    {getCategoryLabel(playlist.category)}
                  </Badge>
                </div>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{playlist.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>{playlist.track_count || 0} tracks</span>
                  <span>{formatDuration(playlist.total_duration)}</span>
                  <span>{playlist.play_count} plays</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No playlists found</h3>
          <p className="text-muted-foreground mb-4">
            {categoryFilter === 'all' 
              ? "Create your first playlist to get started"
              : `No playlists in the ${getCategoryLabel(categoryFilter)} category`
            }
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="bg-gold hover:bg-gold-dark text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Playlist
          </Button>
        </div>
      )}

      {/* Modals */}
      <PlaylistCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchPlaylists();
          setShowCreateModal(false);
        }}
      />

      <CoverArtCustomizer
        isOpen={showCoverEditor}
        onClose={() => setShowCoverEditor(false)}
        playlistId={selectedPlaylist?.id}
        onSuccess={(coverUrl) => {
          if (selectedPlaylist) {
            setSelectedPlaylist({ ...selectedPlaylist, cover_art_url: coverUrl });
          }
          fetchPlaylists();
          setShowCoverEditor(false);
        }}
      />
    </div>
  );
};

export default PlaylistManager;