
import { useState, useEffect } from 'react';

interface IdleStateOptions {
  idleTime?: number;             // Time in ms before user is considered idle
  detectionInterval?: number;    // Interval in ms to check for idle state
  onIdleStart?: () => void;      // Callback when idle starts
  onIdleEnd?: () => void;        // Callback when idle ends
  events?: string[];             // Events that reset idle timer
  initialState?: boolean;        // Initial idle state
  maxActivations?: number;       // Maximum idle activations before increasing wait time
}

export const useIdleState = ({
  idleTime = 60000,             // Default: 60 seconds (1 minute)
  detectionInterval = 1000,     // Check every 1 second
  onIdleStart = () => {},
  onIdleEnd = () => {},
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'],
  initialState = false,
  maxActivations = 5            // Default: 5 activations before increasing wait time
}: IdleStateOptions = {}) => {
  const [isIdle, setIsIdle] = useState(initialState);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);
  const [idleSince, setIdleSince] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activationCount, setActivationCount] = useState(0);
  const [currentIdleTime, setCurrentIdleTime] = useState(idleTime);
  
  useEffect(() => {
    // Online state detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    
    const startIdleTimer = () => {
      // Clear any existing timers
      clearIdleTimers();
      
      // Set a timeout to mark user as idle
      timeoutId = setTimeout(() => {
        // Check if we've reached the maximum number of activations
        if (activationCount >= maxActivations) {
          // Increase idle time for subsequent activations
          const multiplier = Math.floor(activationCount / maxActivations) + 1;
          setCurrentIdleTime(idleTime * multiplier);
        }
        
        setIsIdle(true);
        setIdleSince(new Date());
        setActivationCount(prev => prev + 1);
        onIdleStart();
        
        // Start interval to keep checking idle time
        intervalId = setInterval(() => {
          // This interval can be used to update idle duration
        }, detectionInterval);
      }, currentIdleTime);
      
      setIdleTimer(timeoutId as unknown as number);
    };
    
    const resetIdleTimer = () => {
      if (isIdle) {
        setIsIdle(false);
        setIdleSince(null);
        onIdleEnd();
      }
      startIdleTimer();
    };
    
    const clearIdleTimers = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (intervalId) clearInterval(intervalId);
    };
    
    // Set up event listeners
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
    
    // Initialize idle timer
    startIdleTimer();
    
    // Cleanup
    return () => {
      clearIdleTimers();
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [idleTime, currentIdleTime, detectionInterval, onIdleStart, onIdleEnd, events, idleTimer, isIdle, activationCount, maxActivations]);
  
  const getIdleTime = (): number => {
    if (!idleSince) return 0;
    return new Date().getTime() - idleSince.getTime();
  };

  // Method to reset the activation count (useful after user session actions)
  const resetActivationCount = () => {
    setActivationCount(0);
    setCurrentIdleTime(idleTime);
  };

  return { 
    isIdle, 
    isOnline, 
    idleSince, 
    getIdleTime, 
    activationCount, 
    resetActivationCount 
  };
};
