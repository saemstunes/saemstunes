// hooks/useInstrumentSelectorLogic.ts
import { useCallback } from 'react';
import { useInstrumentSelectorStatus } from './useInstrumentSelectorStatus';

export const useInstrumentSelectorLogic = (user: any) => {
  const { shouldShow, isLoading, error, markAsShown } = useInstrumentSelectorStatus();
  
  const handleInstrumentSelect = useCallback(async (instrument: string) => {
    await markAsShown();
  }, [markAsShown]);

  const handleBackToHome = useCallback(async () => {
    await markAsShown();
  }, [markAsShown]);

  return {
    showInstrumentSelector: shouldShow,
    isLoading,
    error,
    handleInstrumentSelect,
    handleBackToHome
  };
};
