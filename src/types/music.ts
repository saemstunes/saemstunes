export interface Track {
  id: string;
  title: string;
  description?: string;
  audio_path: string;
  alternate_audio_path?: string;
  cover_path?: string;
  user_id?: string;
  access_level?: string;
  approved?: boolean;
  created_at?: string;
  artist?: string;
  duration?: number;
  slug?: string;
  youtube_url?: string;
  preview_url?: string;
  video_url?: string;
  primary_color?: string;
  secondary_color?: string;
  background_gradient?: string;
}

export interface AudioTrack {
  id: string | number;
  src: string;
  name: string;
  artist?: string;
  artwork?: string;
  album?: string;
  duration?: number;
  slug?: string;
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