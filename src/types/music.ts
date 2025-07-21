
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  audio_url?: string;
  cover_art_url?: string;
  genre?: string[];
  play_count?: number;
  created_at?: string;
  user_id?: string;
  description?: string;
  access_level?: string;
  approved?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_art_url?: string;
  user_id: string;
  is_public: boolean;
  track_count: number;
  total_duration: number;
  play_count: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistState {
  currentPlaylist: Playlist | null;
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
}
