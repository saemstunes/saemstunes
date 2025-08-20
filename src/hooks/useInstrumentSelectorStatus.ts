// hooks/useInstrumentSelectorStatus.ts
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from 'react';
import { UserPreferencesService } from '@/services/userPreferencesService';

interface InstrumentSelectorAPI {
  shouldShow: boolean;
  isLoading: boolean;
  error: string | null;
  markAsShown: () => Promise<void>;
}

export const useInstrumentSelectorStatus = (): InstrumentSelectorAPI => {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SessionStorage fallback keys
  const getSessionKey = () => user?.id ? `instrument_selector_shown_${user.id}` : null;
  const getSessionCountKey = () => user?.id ? `instrument_selector_count_${user.id}` : null;

  const checkDatabaseStatus = useCallback(async () => {
    if (!user?.id) {
      setShouldShow(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const status = await UserPreferencesService.getInstrumentSelectorStatus(user.id);
      
      // Check orientation conditions (preserve existing logic)
      const shouldShowBasedOnOrientation = () => {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isLandscape = 
          window.matchMedia("(orientation: landscape)").matches || 
          window.innerWidth > window.innerHeight;
        return isLandscape || isMobile;
      };

      const finalShouldShow = status.shouldShow && shouldShowBasedOnOrientation();
      setShouldShow(finalShouldShow);
      
      // Sync with sessionStorage for performance
      const sessionKey = getSessionKey();
      if (sessionKey) {
        sessionStorage.setItem(sessionKey, status.shouldShow ? 'false' : 'true');
        sessionStorage.setItem(getSessionCountKey()!, status.viewCount.toString());
      }
      
      setError(null);
    } catch (err) {
      console.error('Database check failed, falling back to sessionStorage:', err);
      setError('Failed to load preferences');
      
      // Fallback to sessionStorage
      fallbackToSessionStorage();
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fallbackToSessionStorage = () => {
    const sessionKey = getSessionKey();
    if (!sessionKey) {
      setShouldShow(false);
      return;
    }

    const hasSeenThisSession = sessionStorage.getItem(sessionKey);
    
    if (!hasSeenThisSession) {
      // Check orientation conditions
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isLandscape = 
        window.matchMedia("(orientation: landscape)").matches || 
        window.innerWidth > window.innerHeight;
      
      setShouldShow(isLandscape || isMobile);
    } else {
      setShouldShow(false);
    }
  };

  const markAsShown = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Update database
      await UserPreferencesService.markInstrumentSelectorShown(user.id);
      
      // Update sessionStorage immediately for fast UI response
      const sessionKey = getSessionKey();
      if (sessionKey) {
        sessionStorage.setItem(sessionKey, 'true');
        const currentCount = parseInt(sessionStorage.getItem(getSessionCountKey()!) || '0');
        sessionStorage.setItem(getSessionCountKey()!, (currentCount + 1).toString());
      }
      
      setShouldShow(false);
    } catch (err) {
      console.error('Failed to mark as shown in database, using sessionStorage only:', err);
      
      // Fallback: just update sessionStorage
      const sessionKey = getSessionKey();
      if (sessionKey) {
        sessionStorage.setItem(sessionKey, 'true');
        setShouldShow(false);
      }
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      checkDatabaseStatus();
    } else {
      setShouldShow(false);
      setIsLoading(false);
    }
  }, [user?.id, checkDatabaseStatus]);

  // Cleanup old sessionStorage entries when user changes
  useEffect(() => {
    if (user?.id) {
      const allKeys = Object.keys(sessionStorage);
      allKeys.forEach(key => {
        if (key.startsWith('instrument_selector_') && !key.includes(user.id)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [user?.id]);

  return {
    shouldShow,
    isLoading,
    error,
    markAsShown
  };
};
