import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteTrack {
  id: string;
  track_id: string;
  user_id: string;
  created_at: string;
  tracks?: {
    id: string;
    title: string;
    artist: string;
    cover_path: string;
    audio_path: string;
    alternate_audio_path: string;
    slug: string;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const [favoritesPlaylistId, setFavoritesPlaylistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create or get favorites playlist
  const ensureFavoritesPlaylist = useCallback(async () => {
    if (!user) return null;

    try {
      // Check if favorites playlist exists
      let { data: existingPlaylist } = await supabase
        .from('playlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Favorites')
        .eq('category', 'personal_playlist')
        .single();

      if (existingPlaylist) {
        setFavoritesPlaylistId(existingPlaylist.id);
        return existingPlaylist.id;
      }

      // Create favorites playlist
      const { data: newPlaylist, error } = await supabase
        .from('playlists')
        .insert({
          name: 'Favorites',
          description: 'Your liked tracks',
          user_id: user.id,
          category: 'personal_playlist',
          is_public: false
        })
        .select('id')
        .single();

      if (error) throw error;

      setFavoritesPlaylistId(newPlaylist.id);
      return newPlaylist.id;
    } catch (error) {
      console.error('Error ensuring favorites playlist:', error);
      return null;
    }
  }, [user]);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          tracks:track_id (
            id,
            title,
            artist,
            cover_path,
            audio_path,
            alternate_audio_path,
            slug
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites((data as FavoriteTrack[]) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add to favorites
  const addToFavorites = useCallback(async (trackId: string) => {
    if (!user) return false;

    try {
      // Add to likes table
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          track_id: trackId
        });

      if (likeError) throw likeError;

      // Ensure favorites playlist exists
      const playlistId = await ensureFavoritesPlaylist();
      if (playlistId) {
        // Add to favorites playlist
        const { data: maxPosData } = await supabase
          .from('playlist_tracks')
          .select('position')
          .eq('playlist_id', playlistId)
          .order('position', { ascending: false })
          .limit(1);

        const nextPosition = maxPosData?.length ? maxPosData[0].position + 1 : 1;

        await supabase
          .from('playlist_tracks')
          .insert({
            playlist_id: playlistId,
            track_id: trackId,
            position: nextPosition
          });
      }

      await fetchFavorites();
      
      toast({
        title: "Added to Favorites",
        description: "Track has been added to your favorites",
      });

      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add track to favorites",
        variant: "destructive",
      });
      return false;
    }
  }, [user, ensureFavoritesPlaylist, fetchFavorites, toast]);

  // Remove from favorites
  const removeFromFavorites = useCallback(async (trackId: string) => {
    if (!user) return false;

    try {
      // Remove from likes table
      const { error: likeError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', trackId);

      if (likeError) throw likeError;

      // Remove from favorites playlist if it exists
      if (favoritesPlaylistId) {
        await supabase
          .from('playlist_tracks')
          .delete()
          .eq('playlist_id', favoritesPlaylistId)
          .eq('track_id', trackId);
      }

      await fetchFavorites();
      
      toast({
        title: "Removed from Favorites",
        description: "Track has been removed from your favorites",
      });

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove track from favorites",
        variant: "destructive",
      });
      return false;
    }
  }, [user, favoritesPlaylistId, fetchFavorites, toast]);

  // Check if track is favorited
  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(fav => fav.track_id === trackId);
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (trackId: string) => {
    if (isFavorite(trackId)) {
      return await removeFromFavorites(trackId);
    } else {
      return await addToFavorites(trackId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      ensureFavoritesPlaylist();
    }
  }, [user, fetchFavorites, ensureFavoritesPlaylist]);

  return {
    favorites,
    favoritesPlaylistId,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    fetchFavorites
  };
};