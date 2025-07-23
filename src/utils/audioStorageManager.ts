
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
  play_count?: number;
  created_at: string;
  description?: string;
}

export class AudioStorageManager {
  // TODO: Replace with actual track data - remove sample data and use real tracks
  private static readonly ACTUAL_TRACKS: Omit<TrackMetadata, 'id' | 'created_at'>[] = [
    {
      title: "Pale Ulipo",
      artist: "Saem's Tunes",
      album: "Covers Collection",
      duration: 173, // 2:53 in seconds
      audio_url: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a",
      cover_art_url: "https://i.imgur.com/VfKXMyG.png",
      category: 'cover',
      genre: "Acoustic",
      featured_priority: 1,
      play_count: 2543,
      description: "Beautiful acoustic cover with heartfelt vocals"
    },
    {
      title: "I Need You More",
      artist: "Saem's Tunes",
      album: "Covers Collection", 
      duration: 53, // 0:53 in seconds
      audio_url: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/I%20Need%20You%20More.wav",
      cover_art_url: "https://i.imgur.com/6yr8BpG.jpeg",
      category: 'cover',
      genre: "Acoustic",
      featured_priority: 2,
      play_count: 1876,
      description: "Soulful acoustic performance"
    },
    {
      title: "Ni Hai",
      artist: "Saem's Tunes ft. Kendin Konge",
      album: "Originals",
      duration: 78, // 1:18 in seconds
      audio_url: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Ni%20Hai%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
      cover_art_url: "https://i.imgur.com/LJQDADg.jpeg",
      category: 'original_by_saems_tunes',
      genre: "Original",
      featured_priority: 3,
      play_count: 3421,
      description: "Original composition with powerful message"
    },
    {
      title: "Mapenzi Ya Ajabu",
      artist: "Saem's Tunes",
      album: "Originals",
      duration: 90, // 1:30 in seconds
      audio_url: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Mapenzi%20Ya%20Ajabu%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
      cover_art_url: "https://i.imgur.com/wrm7LI1.jpeg", 
      category: 'original_by_saems_tunes',
      genre: "Original",
      featured_priority: 4,
      play_count: 2198,
      description: "Inspiring original about amazing love"
    }
  ];

  static async migrateTracksToDatabase(): Promise<void> {
    try {
      // Check if tracks already exist to avoid duplicates
      const { data: existingTracks } = await supabase
        .from('tracks')
        .select('title')
        .in('title', this.ACTUAL_TRACKS.map(t => t.title));

      if (existingTracks && existingTracks.length > 0) {
        console.log('Tracks already exist in database');
        return;
      }

      // Insert tracks into database
      const tracksToInsert = this.ACTUAL_TRACKS.map(track => ({
        title: track.title,
        description: track.description || '',
        audio_path: this.extractPathFromUrl(track.audio_url),
        cover_path: track.cover_art_url ? this.extractPathFromUrl(track.cover_art_url) : null,
        access_level: 'free' as const,
        user_id: null, // These are official Saem's Tunes tracks
        approved: true
      }));

      const { error } = await supabase
        .from('tracks')
        .insert(tracksToInsert);

      if (error) throw error;
      
      console.log('Successfully migrated tracks to database');
    } catch (error) {
      console.error('Error migrating tracks:', error);
      throw error;
    }
  }

  static async getTracksByCategory(category: TrackMetadata['category']): Promise<TrackMetadata[]> {
    // TODO: Query database by category once metadata is properly stored
    return this.ACTUAL_TRACKS.filter(track => track.category === category)
      .map(track => ({
        ...track,
        id: this.generateTrackId(track.title),
        created_at: new Date().toISOString()
      }));
  }

  static async getFeaturedTrack(): Promise<TrackMetadata | null> {
    const featuredTracks = this.ACTUAL_TRACKS
      .filter(track => track.featured_priority)
      .sort((a, b) => (a.featured_priority || 0) - (b.featured_priority || 0));
    
    if (featuredTracks.length === 0) return null;
    
    return {
      ...featuredTracks[0],
      id: this.generateTrackId(featuredTracks[0].title),
      created_at: new Date().toISOString()
    };
  }

  static async getShuffledTracks(count: number): Promise<TrackMetadata[]> {
    const shuffled = [...this.ACTUAL_TRACKS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(track => ({
      ...track,
      id: this.generateTrackId(track.title),
      created_at: new Date().toISOString()
    }));
  }

  static async trackPlay(trackId: string, userId?: string): Promise<void> {
    try {
      // First check if the track exists in the database
      const { data: track } = await supabase
        .from('tracks')
        .select('id')
        .eq('id', trackId)
        .single();

      if (!track) {
        console.log('Track not found in database, skipping play tracking');
        return;
      }

      await supabase.from('track_plays').insert({
        track_id: trackId,
        user_id: userId || null
      });
    } catch (error) {
      console.error('Error tracking play:', error);
    }
  }

  private static extractPathFromUrl(url: string): string {
    // Extract path from Supabase storage URL
    const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/tracks\/(.+?)(?:\?|$)/);
    return match ? match[1] : url;
  }

  private static generateTrackId(title: string): string {
    // Generate consistent ID based on title for demo purposes
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
}
