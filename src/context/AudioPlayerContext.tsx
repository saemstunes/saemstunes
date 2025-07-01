
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useMediaState } from '@/components/idle-state/mediaStateContext';

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

    const audio = new Audio(track.src);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setState(prevState => ({
        ...prevState,
        duration: audio.duration,
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
       setMediaPlaying(false); // Add this line
      setState(prevState => ({
        ...prevState,
        isPlaying: false,
        currentTime: 0,
        lastPlayedTime: 0,
      }));
    });

    audio.addEventListener('error', () => {
      setMediaPlaying(false); // Add this line
      console.error('Audio playback error');
      setState(prevState => ({
        ...prevState,
        isPlaying: false,
      }));
    });

    audio.volume = state.isMuted ? 0 : state.volume;
  };

  // Inside AudioPlayerProvider component:
const { setMediaPlaying } = useMediaState();

  const playTrack = (track: AudioTrack, startTime: number = 0) => {
    setMediaPlaying(true); // Add this line
    // If it's the same track, just resume
    if (state.currentTrack?.id === track.id && audioRef.current) {
      audioRef.current.currentTime = startTime || state.lastPlayedTime;
      audioRef.current.play().catch(console.error);
      setState(prevState => ({
        ...prevState,
        isPlaying: true,
      }));
      return;
    }

    // New track
    setState(prevState => ({
      ...prevState,
      currentTrack: track,
      isPlaying: false,
      currentTime: startTime,
      lastPlayedTime: startTime,
    }));

    initializeAudio(track);
    
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play().then(() => {
        setState(prevState => ({
          ...prevState,
          isPlaying: true,
        }));
      }).catch(console.error);
    }
  };

  const pauseTrack = () => {
    setMediaPlaying(false); // Add this line
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
    setMediaPlaying(true); // Add this line
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setState(prevState => ({
          ...prevState,
          isPlaying: true,
        }));
      }).catch(console.error);
    }
  };

  const stopTrack = () => {
     setMediaPlaying(false); // Add this line
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
      currentTime: 0,
      lastPlayedTime: 0,
    }));
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prevState => ({
        ...prevState,
        currentTime: time,
        lastPlayedTime: time,
      }));
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

  const clearPlayer = () => {
    setMediaPlaying(false); // Add this line
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
