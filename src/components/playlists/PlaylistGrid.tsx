
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit, Trash2, Share2, Music, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  cover_art_url?: string | null;
  category: string | null;
  is_public: boolean | null;
  play_count: number | null;
  total_duration: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  track_count?: number;
}

interface PlaylistGridProps {
  onPlaylistSelect: (playlist: Playlist) => void;
  onPlaylistEdit: (playlist: Playlist) => void;
  refreshTrigger?: number;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  onPlaylistSelect,
  onPlaylistEdit,
  refreshTrigger
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlaylists();
  }, [user, refreshTrigger]);

  const fetchPlaylists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const playlistsWithCounts = data.map(playlist => ({
        ...playlist,
        track_count: Array.isArray(playlist.playlist_tracks) ? playlist.playlist_tracks.length : 0
      }));

      setPlaylists(playlistsWithCounts);
    } catch (error) {
      toast({
        title: "Failed to load playlists",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string, playlistName: string) => {
    if (!confirm(`Are you sure you want to delete "${playlistName}"?`)) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      toast({
        title: "Playlist deleted",
        description: `${playlistName} has been deleted`
      });
    } catch (error) {
      toast({
        title: "Failed to delete playlist",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'covers': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'originals_by_saems_tunes': return 'bg-gold/10 text-gold-dark dark:text-gold-light';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case 'covers': return 'Covers';
      case 'originals_by_saems_tunes': return "Saem's Originals";
      default: return 'Personal';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-3"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
        <p className="text-muted-foreground">Create your first playlist to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
          {/* Cover Art */}
          <div 
            className="aspect-square bg-gradient-to-br from-gold/20 to-gold/5 relative cursor-pointer overflow-hidden"
            onClick={() => onPlaylistSelect(playlist)}
          >
            {playlist.cover_art_url ? (
              <img 
                src={playlist.cover_art_url} 
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-12 w-12 text-gold/60" />
              </div>
            )}
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="icon" className="bg-gold hover:bg-gold-dark rounded-full">
                <Play className="h-6 w-6 fill-current" />
              </Button>
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <Badge className={getCategoryColor(playlist.category)}>
                {getCategoryLabel(playlist.category)}
              </Badge>
            </div>

            {/* Privacy Indicator */}
            {playlist.is_public && (
              <div className="absolute top-2 right-2">
                <Users className="h-4 w-4 text-white bg-black/50 rounded p-1" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-medium line-clamp-1 mb-1">{playlist.name}</h3>
            {playlist.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {playlist.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Music className="h-3 w-3" />
                {playlist.track_count || 0} tracks
              </span>
              {playlist.total_duration && playlist.total_duration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(playlist.total_duration)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onPlaylistSelect(playlist)}
              >
                <Play className="h-3 w-3 mr-1" />
                Play
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onPlaylistEdit(playlist)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost">
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PlaylistGrid;
