
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioTrack {
  id: string | number;
  src: string;
  name: string;
  artist?: string;
  artwork?: string;
  album?: string;
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  lastPlayedTime: number;
  lastPlayedTimestamp: number | null;
  error: string | null;
  isLoading: boolean;
}

interface AudioPlayerContextType {
  state: AudioPlayerState;
  playTrack: (track: AudioTrack, startTime?: number) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  clearPlayer: () => void;
  clearError: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

const MEMORY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    lastPlayedTime: 0,
    lastPlayedTimestamp: null,
    error: null,
    isLoading: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const memoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('audioPlayerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const now = Date.now();
        
        // Check if memory should be cleared (5 minutes passed)
        if (parsedState.lastPlayedTimestamp && (now - parsedState.lastPlayedTimestamp) > MEMORY_DURATION) {
          localStorage.removeItem('audioPlayerState');
          return;
        }
        
        setState(prevState => ({
          ...prevState,
          ...parsedState,
          isPlaying: false, // Never auto-play on load
          error: null, // Clear any previous errors
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error loading audio player state:', error);
        localStorage.removeItem('audioPlayerState');
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (state.currentTrack) {
      const stateToSave = {
        ...state,
        lastPlayedTimestamp: Date.now(),
        error: null, // Don't persist errors
      };
      localStorage.setItem('audioPlayerState', JSON.stringify(stateToSave));
    }
  }, [state]);

  // Clear memory after 5 minutes of inactivity
  useEffect(() => {
    if (memoryTimeoutRef.current) {
      clearTimeout(memoryTimeoutRef.current);
    }

    if (!state.isPlaying && state.currentTrack) {
      memoryTimeoutRef.current = setTimeout(() => {
        clearPlayer();
      }, MEMORY_DURATION);
    }

    return () => {
      if (memoryTimeoutRef.current) {
        clearTimeout(memoryTimeoutRef.current);
      }
    };
  }, [state.isPlaying, state.currentTrack]);

  // Clear memory when app is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        setState(prevState => ({
          ...prevState,
          lastPlayedTime: audioRef.current?.currentTime || 0,
          lastPlayedTimestamp: Date.now(),
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const initializeAudio = (track: AudioTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.remove();
    }

    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    const audio = new Audio();
    audioRef.current = audio;

    // Set up event listeners before setting src
    audio.addEventListener('loadstart', () => {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));
    });

    audio.addEventListener('loadedmetadata', () => {
      setState(prevState => ({
        ...prevState,
        duration: audio.duration,
        isLoading: false,
        error: null,
      }));
    });

    audio.addEventListener('canplay', () => {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: null,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prevState => ({
        ...prevState,
        currentTime: audio.currentTime,
        lastPlayedTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      setState(prevState => ({
        ...prevState,
        isPlaying: false,
        currentTime: 0,
        lastPlayedTime: 0,
      }));
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      const errorMessage = getAudioErrorMessage(audio.error);
      setState(prevState => ({
        ...prevState,
        isPlaying: false,
        isLoading: false,
        error: errorMessage,
      }));
    });

    audio.addEventListener('stalled', () => {
      setState(prevState => ({
        ...prevState,
        error: 'Audio playback stalled. Check your internet connection.',
        isLoading: false,
      }));
    });

    audio.addEventListener('suspend', () => {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
      }));
    });

    // Set volume and src
    audio.volume = state.isMuted ? 0 : state.volume;
    audio.src = track.src;
  };

  const getAudioErrorMessage = (error: MediaError | null): string => {
    if (!error) return 'Unknown audio error occurred';
    
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        return 'Audio playback was aborted';
      case MediaError.MEDIA_ERR_NETWORK:
        return 'Network error occurred while loading audio';
      case MediaError.MEDIA_ERR_DECODE:
        return 'Audio file is corrupted or unsupported format';
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return 'Audio format not supported';
      default:
        return 'Audio playback error occurred';
    }
  };

  const playTrack = (track: AudioTrack, startTime: number = 0) => {
    try {
      // If it's the same track, just resume
      if (state.currentTrack?.id === track.id && audioRef.current && !state.error) {
        audioRef.current.currentTime = startTime || state.lastPlayedTime;
        audioRef.current.play().then(() => {
          setState(prevState => ({
            ...prevState,
            isPlaying: true,
            error: null,
          }));
        }).catch((error) => {
          console.error('Error resuming audio:', error);
          setState(prevState => ({
            ...prevState,
            error: 'Failed to resume audio playback',
            isPlaying: false,
          }));
        });
        return;
      }

      // New track
      setState(prevState => ({
        ...prevState,
        currentTrack: track,
        isPlaying: false,
        currentTime: startTime,
        lastPlayedTime: startTime,
        error: null,
      }));

      initializeAudio(track);
      
      if (audioRef.current) {
        audioRef.current.currentTime = startTime;
        audioRef.current.play().then(() => {
          setState(prevState => ({
            ...prevState,
            isPlaying: true,
            error: null,
          }));
        }).catch((error) => {
          console.error('Error playing audio:', error);
          setState(prevState => ({
            ...prevState,
            error: 'Failed to start audio playback',
            isPlaying: false,
          }));
        });
      }
    } catch (error) {
      console.error('Error in playTrack:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to load audio track',
        isPlaying: false,
        isLoading: false,
      }));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prevState => ({
        ...prevState,
        isPlaying: false,
        lastPlayedTime: audioRef.current?.currentTime || 0,
      }));
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && !state.error) {
      audioRef.current.play().then(() => {
        setState(prevState => ({
          ...prevState,
          isPlaying: true,
          error: null,
        }));
      }).catch((error) => {
        console.error('Error resuming audio:', error);
        setState(prevState => ({
          ...prevState,
          error: 'Failed to resume audio playback',
          isPlaying: false,
        }));
      });
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
      currentTime: 0,
      lastPlayedTime: 0,
      error: null,
    }));
  };

  const seek = (time: number) => {
    if (audioRef.current && !state.error) {
      try {
        audioRef.current.currentTime = time;
        setState(prevState => ({
          ...prevState,
          currentTime: time,
          lastPlayedTime: time,
          error: null,
        }));
      } catch (error) {
        console.error('Error seeking audio:', error);
        setState(prevState => ({
          ...prevState,
          error: 'Failed to seek in audio track',
        }));
      }
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState(prevState => ({
      ...prevState,
      volume,
      isMuted: volume === 0,
    }));
  };

  const toggleMute = () => {
    const newMutedState = !state.isMuted;
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : state.volume;
    }
    setState(prevState => ({
      ...prevState,
      isMuted: newMutedState,
    }));
  };

  const clearError = () => {
    setState(prevState => ({
      ...prevState,
      error: null,
    }));
  };

  const clearPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.remove();
      audioRef.current = null;
    }
    setState({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      lastPlayedTime: 0,
      lastPlayedTimestamp: null,
      error: null,
      isLoading: false,
    });
    localStorage.removeItem('audioPlayerState');
    if (memoryTimeoutRef.current) {
      clearTimeout(memoryTimeoutRef.current);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        state,
        playTrack,
        pauseTrack,
        resumeTrack,
        stopTrack,
        seek,
        setVolume,
        toggleMute,
        clearPlayer,
        clearError,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
