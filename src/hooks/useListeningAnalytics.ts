import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ListeningSession {
  id?: string;
  user_id: string;
  track_id: string;
  played_at: string;
  duration_listened: number;
  total_duration: number;
  completion_rate: number;
  session_context?: 'single' | 'playlist' | 'shuffle' | 'repeat';
  device_type?: string;
  skip_reason?: 'manual' | 'next_track' | 'previous_track' | null;
}

export interface WeeklyInsight {
  track_id: string;
  track_title: string;
  artist: string;
  play_count: number;
  total_listening_time: number;
  average_completion_rate: number;
  trend: 'up' | 'down' | 'stable';
}

export const useListeningAnalytics = () => {
  const { user } = useAuth();
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [loading, setLoading] = useState(false);

  // Track a listening session
  const trackListeningSession = useCallback(async (session: Omit<ListeningSession, 'user_id' | 'played_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('track_plays')
        .insert({
          user_id: user.id,
          track_id: session.track_id,
          played_at: new Date().toISOString(),
          // Additional metadata can be stored in a jsonb column if needed
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking listening session:', error);
    }
  }, [user]);

  // Get weekly insights
  const getWeeklyInsights = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Calculate date range for last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const { data, error } = await supabase
        .from('track_plays')
        .select(`
          track_id,
          tracks:track_id (
            title,
            artist
          )
        `)
        .eq('user_id', user.id)
        .gte('played_at', startDate.toISOString())
        .lte('played_at', endDate.toISOString());

      if (error) throw error;

      // Process data to get insights
      const trackStats = new Map<string, {
        track_id: string;
        title: string;
        artist: string;
        play_count: number;
      }>();

      data?.forEach(play => {
        const trackId = play.track_id;
        const existing = trackStats.get(trackId);
        
        if (existing) {
          existing.play_count++;
        } else {
          trackStats.set(trackId, {
            track_id: trackId,
            title: play.tracks?.title || 'Unknown',
            artist: play.tracks?.artist || 'Unknown Artist',
            play_count: 1
          });
        }
      });

      // Convert to insights format and sort by play count
      const insights: WeeklyInsight[] = Array.from(trackStats.values())
        .map(stat => ({
          track_id: stat.track_id,
          track_title: stat.title,
          artist: stat.artist,
          play_count: stat.play_count,
          total_listening_time: stat.play_count * 180, // Estimate 3 minutes per play
          average_completion_rate: 0.8, // Default estimate
          trend: (stat.play_count > 3 ? 'up' : stat.play_count === 1 ? 'stable' : 'down') as 'up' | 'down' | 'stable'
        }))
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10); // Top 10 tracks

      setWeeklyInsights(insights);
    } catch (error) {
      console.error('Error fetching weekly insights:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get total listening time
  const getTotalListeningTime = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('track_plays')
        .select('played_at')
        .eq('user_id', user.id);

      if (error) throw error;

      // Estimate total listening time (3 minutes per play)
      const total = (data?.length || 0) * 180;
      setTotalListeningTime(total);
    } catch (error) {
      console.error('Error fetching total listening time:', error);
    }
  }, [user]);

  // Generate personalized recommendations based on listening history
  const getPersonalizedRecommendations = useCallback(async () => {
    if (!user) return [];

    try {
      // Get user's most played tracks from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentPlays, error } = await supabase
        .from('track_plays')
        .select(`
          track_id,
          tracks:track_id (
            id,
            title,
            artist,
            primary_color,
            secondary_color
          )
        `)
        .eq('user_id', user.id)
        .gte('played_at', thirtyDaysAgo.toISOString())
        .limit(50);

      if (error) throw error;

      // Get unique artists from recent plays
      const artistCounts = new Map();
      recentPlays?.forEach(play => {
        const artist = play.tracks?.artist;
        if (artist) {
          artistCounts.set(artist, (artistCounts.get(artist) || 0) + 1);
        }
      });

      // Find similar tracks from top artists
      const topArtists = Array.from(artistCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([artist]) => artist);

      if (topArtists.length > 0) {
        const { data: recommendations } = await supabase
          .from('tracks')
          .select('*')
          .in('artist', topArtists)
          .eq('approved', true)
          .limit(10);

        return recommendations || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getWeeklyInsights();
      getTotalListeningTime();
    }
  }, [user, getWeeklyInsights, getTotalListeningTime]);

  return {
    weeklyInsights,
    totalListeningTime,
    loading,
    trackListeningSession,
    getWeeklyInsights,
    getPersonalizedRecommendations
  };
};