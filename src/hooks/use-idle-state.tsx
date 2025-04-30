import { useState, useEffect } from 'react';

interface IdleStateOptions {
  idleTime?: number;             // Time in ms before user is considered idle
  detectionInterval?: number;    // Interval in ms to check for idle state
  onIdleStart?: () => void;      // Callback when idle starts
  onIdleEnd?: () => void;        // Callback when idle ends
  events?: string[];             // Events that reset idle timer
  initialState?: boolean;        // Initial idle state
}

export const useIdleState = ({
  idleTime = 60000,             // Default: 60 seconds
  detectionInterval = 1000,     // Check every 1 second
  onIdleStart = () => {},
  onIdleEnd = () => {},
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'],
  initialState = false
}: IdleStateOptions = {}) => {
  const [isIdle, setIsIdle] = useState(initialState);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);
  const [idleSince, setIdleSince] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
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
        setIsIdle(true);
        setIdleSince(new Date());
        onIdleStart();
        
        // Start interval to keep checking idle time
        intervalId = setInterval(() => {
          // This interval can be used to update idle duration
        }, detectionInterval);
      }, idleTime);
      
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
  }, [idleTime, detectionInterval, onIdleStart, onIdleEnd, events, idleTimer, isIdle]);
  
  const getIdleTime = (): number => {
    if (!idleSince) return 0;
    return new Date().getTime() - idleSince.getTime();
  };

  return { isIdle, isOnline, idleSince, getIdleTime };
};
