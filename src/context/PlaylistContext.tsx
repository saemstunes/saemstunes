// src/context/PlaylistContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover_art_url: string;
  user_id: string;
  total_duration: number;
  track_count: number;
}

interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
}

interface PlaylistState {
  currentPlaylist: Playlist | null;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  playHistory: number[];
  upcomingTracks: number[];
}

interface PlaylistActions {
  createPlaylist: (name: string, description?: string) => Promise<string>;
  addToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  playPlaylist: (playlistId: string, startIndex?: number) => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
}

const PlaylistContext = createContext<PlaylistState & PlaylistActions | null>(null);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<PlaylistState>({
    currentPlaylist: null,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'none',
    playHistory: [],
    upcomingTracks: []
  });

  // Fetch playlist data
  const fetchPlaylist = useCallback(async (playlistId: string) => {
    const { data: playlistData } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single();

    const { data: tracksData } = await supabase
      .from('playlist_tracks')
      .select('track_id, position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    const trackIds = tracksData?.map(item => item.track_id) || [];
    const { data: fullTracks } = await supabase
      .from('tracks')
      .select('*')
      .in('id', trackIds);

    setState(prev => ({
      ...prev,
      currentPlaylist: playlistData,
      queue: fullTracks || [],
      currentIndex: 0,
      playHistory: [],
      upcomingTracks: Array.from({ length: (fullTracks?.length || 1) - 1 }, (_, i) => i + 1)
    }));
  }, []);

  // Playlist actions
  const createPlaylist = async (name: string, description = ''): Promise<string> => {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        name,
        description,
        user_id: user?.id,
        is_public: false
      })
      .select('id')
      .single();

    if (error) throw new Error('Playlist creation failed');
    return data.id;
  };

  const addToPlaylist = async (playlistId: string, trackId: string) => {
    // Get current max position
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
  };

  const playPlaylist = async (playlistId: string, startIndex = 0) => {
    await fetchPlaylist(playlistId);
    setState(prev => ({
      ...prev,
      currentIndex: startIndex
    }));
  };

  // Player controls
  const nextTrack = () => {
    setState(prev => {
      if (prev.repeat === 'one') return prev;
      
      const newHistory = [...prev.playHistory, prev.currentIndex];
      let nextIndex = prev.upcomingTracks.shift() || 0;
      
      if (prev.repeat === 'all' && prev.upcomingTracks.length === 0) {
        nextIndex = 0;
      }
      
      return {
        ...prev,
        currentIndex: nextIndex,
        playHistory: newHistory,
        upcomingTracks: prev.upcomingTracks
      };
    });
  };

  const value = {
    ...state,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist: async () => {}, // Implementation similar to add
    playPlaylist,
    nextTrack,
    previousTrack: () => {}, // Similar to nextTrack
    toggleShuffle: () => {}, 
    toggleRepeat: () => {},
    addToQueue: (track: Track) => {}
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be used within PlaylistProvider');
  return context;
};
