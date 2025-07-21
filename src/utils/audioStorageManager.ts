
import { supabase } from "@/integrations/supabase/client";

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audio_url: string;
  cover_art_url?: string;
  category: 'cover' | 'original_by_saems_tunes' | 'personal_playlist';
  genre?: string;
  featured_priority?: number;
  access_level: 'free' | 'auth' | 'basic' | 'premium' | 'professional';
  created_at: string;
}

export class AudioStorageManager {
  private static instance: AudioStorageManager;
  private trackCache: Map<string, TrackMetadata> = new Map();

  static getInstance(): AudioStorageManager {
    if (!AudioStorageManager.instance) {
      AudioStorageManager.instance = new AudioStorageManager();
    }
    return AudioStorageManager.instance;
  }

  async fetchTracks(category?: string, limit?: number): Promise<TrackMetadata[]> {
    try {
      let query = supabase
        .from('tracks')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }
  }

  async getFeaturedTrack(): Promise<TrackMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('approved', true)
        .order('featured_priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching featured track:', error);
      return null;
    }
  }

  async incrementPlayCount(trackId: string, userId?: string): Promise<void> {
    try {
      await supabase.from('track_plays').insert({
        track_id: trackId,
        user_id: userId || null
      });
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  }

  cacheTrack(track: TrackMetadata): void {
    this.trackCache.set(track.id, track);
  }

  getCachedTrack(id: string): TrackMetadata | undefined {
    return this.trackCache.get(id);
  }
}

export const audioManager = AudioStorageManager.getInstance();
