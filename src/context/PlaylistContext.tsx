
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Track, Playlist, PlaylistState } from '@/types/music';

interface PlaylistContextType {
  state: PlaylistState;
  loadPlaylist: (playlist: Playlist, tracks: Track[]) => void;
  playTrack: (trackIndex: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'none' | 'all' | 'one') => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackIndex: number) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

interface PlaylistProviderProps {
  children: React.ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [state, setState] = useState<PlaylistState>({
    currentPlaylist: null,
    tracks: [],
    currentTrackIndex: 0,
    isPlaying: false,
    isLoading: false,
    shuffle: false,
    repeat: 'none',
  });

  const loadPlaylist = useCallback((playlist: Playlist, tracks: Track[]) => {
    setState(prev => ({
      ...prev,
      currentPlaylist: {
        ...playlist,
        track_count: tracks.length, // Ensure track_count is included
      },
      tracks,
      currentTrackIndex: 0,
      isPlaying: false,
      isLoading: false,
    }));
  }, []);

  const playTrack = useCallback((trackIndex: number) => {
    if (trackIndex >= 0 && trackIndex < state.tracks.length) {
      setState(prev => ({
        ...prev,
        currentTrackIndex: trackIndex,
        isPlaying: true,
      }));
    }
  }, [state.tracks.length]);

  const nextTrack = useCallback(() => {
    setState(prev => {
      let nextIndex = prev.currentTrackIndex + 1;
      
      if (prev.repeat === 'one') {
        nextIndex = prev.currentTrackIndex;
      } else if (nextIndex >= prev.tracks.length) {
        nextIndex = prev.repeat === 'all' ? 0 : prev.currentTrackIndex;
      }
      
      return {
        ...prev,
        currentTrackIndex: nextIndex,
      };
    });
  }, []);

  const previousTrack = useCallback(() => {
    setState(prev => {
      let prevIndex = prev.currentTrackIndex - 1;
      
      if (prevIndex < 0) {
        prevIndex = prev.repeat === 'all' ? prev.tracks.length - 1 : 0;
      }
      
      return {
        ...prev,
        currentTrackIndex: prevIndex,
      };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({
      ...prev,
      shuffle: !prev.shuffle,
    }));
  }, []);

  const setRepeat = useCallback((mode: 'none' | 'all' | 'one') => {
    setState(prev => ({
      ...prev,
      repeat: mode,
    }));
  }, []);

  const addTrack = useCallback((track: Track) => {
    setState(prev => ({
      ...prev,
      tracks: [...prev.tracks, track],
    }));
  }, []);

  const removeTrack = useCallback((trackIndex: number) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.filter((_, index) => index !== trackIndex),
      currentTrackIndex: trackIndex <= prev.currentTrackIndex 
        ? Math.max(0, prev.currentTrackIndex - 1)
        : prev.currentTrackIndex,
    }));
  }, []);

  const value: PlaylistContextType = {
    state,
    loadPlaylist,
    playTrack,
    nextTrack,
    previousTrack,
    togglePlay,
    toggleShuffle,
    setRepeat,
    addTrack,
    removeTrack,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
