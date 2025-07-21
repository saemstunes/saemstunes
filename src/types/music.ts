export interface Track {
  id: string;
  title: string;
  description?: string;
  audio_path: string;
  cover_path?: string;
  user_id?: string;
  access_level?: string;
  approved?: boolean;
  created_at?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  genre?: string[];
  profile_image_url?: string;
  social_links?: Record<string, any>;
  verified_status?: boolean;
  follower_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_art_url?: string;
  user_id?: string;
  total_duration?: number;
  track_count?: number;
  is_public?: boolean;
  category?: string;
  play_count?: number;
  created_at?: string;
  updated_at?: string;
}