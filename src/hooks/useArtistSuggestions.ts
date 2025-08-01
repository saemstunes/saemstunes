import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useArtistSuggestions = (count = 4) => {
  const [suggestedArtists, setSuggestedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('id, name, slug, profile_image_url')
          .order('follower_count', { ascending: false })
          .limit(count);

        if (error) {
          console.error('Error fetching suggested artists:', error);
          return;
        }

        setSuggestedArtists(data || []);
      } catch (error) {
        console.error('Error during artist suggestions fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [count]);

  return { suggestedArtists, loading };
};
