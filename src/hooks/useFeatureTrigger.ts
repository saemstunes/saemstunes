// hooks/useFeatureTrigger.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface UseFeatureTriggerResult {
  canShow: boolean;
  currentCount: number;
  isLoading: boolean;
  error: string | null;
  incrementTrigger: () => Promise<void>;
}

export const useFeatureTrigger = (
  featureName: string, 
  maxTriggers: number = 7
): UseFeatureTriggerResult => {
  const { user } = useAuth();
  const [canShow, setCanShow] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      if (!user) {
        setCanShow(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has reached the trigger limit
        const { data, error: fetchError } = await supabase
          .from('feature_triggers')
          .select('trigger_count')
          .eq('user_id', user.id)
          .eq('feature_name', featureName)
          .maybeSingle(); // Use maybeSingle to handle no rows

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        const count = data?.trigger_count || 0;
        setCurrentCount(count);
        setCanShow(count < maxTriggers);
      } catch (err) {
        console.error('Error checking feature access:', err);
        setError('Failed to check feature access');
        setCanShow(false); // Fail-safe: don't show on error
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureAccess();
  }, [user, featureName, maxTriggers]);

  const incrementTrigger = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Call the Supabase function to increment the trigger count
      const { data, error: incrementError } = await supabase.rpc(
        'increment_feature_trigger',
        {
          user_uuid: user.id,
          feature: featureName,
          max_count: maxTriggers
        }
      );

      if (incrementError) {
        throw new Error(incrementError.message);
      }

      const newCount = data || 1;
      setCurrentCount(newCount);
      setCanShow(newCount < maxTriggers);
    } catch (err) {
      console.error('Error incrementing feature trigger:', err);
      setError('Failed to update feature trigger');
    } finally {
      setIsLoading(false);
    }
  };

  return { canShow, currentCount, isLoading, error, incrementTrigger };
};
