import { useState, useEffect, useRef } from 'react';

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
  const [idleSince, setIdleSince] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activationCount, setActivationCount] = useState(0);
  const [currentIdleTime, setCurrentIdleTime] = useState(idleTime);
  
  // Use refs to avoid dependency issues in useEffect
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // NEW: Track media playing state
  const isMediaPlayingRef = useRef(false);
  
  // NEW: Function to update media playing state
  const setMediaPlaying = (isPlaying: boolean) => {
    isMediaPlayingRef.current = isPlaying;
    
    // If media starts playing, reset idle timer
    if (isPlaying) {
      resetIdleTimer();
    }
  };

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
  
  const startIdleTimer = () => {
    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // NEW: Don't start timer if media is playing
    if (isMediaPlayingRef.current) return;
    
    // Set a timeout to mark user as idle
    timeoutRef.current = setTimeout(() => {
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
    }, currentIdleTime);
  };
  
  const resetIdleTimer = () => {
    if (isIdle) {
      setIsIdle(false);
      setIdleSince(null);
      onIdleEnd();
    }
    
    // NEW: Only restart timer if media is not playing
    if (!isMediaPlayingRef.current) {
      startIdleTimer();
    }
  };
  
  useEffect(() => {
    // Set up event listeners
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Initialize idle timer
    startIdleTimer();
    
    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [idleTime, currentIdleTime, detectionInterval, onIdleStart, onIdleEnd, events, isIdle, activationCount, maxActivations]);
  
  const getIdleTime = (): number => {
    if (!idleSince) return 0;
    return new Date().getTime() - idleSince.getTime();
  };

  // Method to reset the activation count (useful after user session actions)
  const resetActivationCount = () => {
    setActivationCount(0);
    setCurrentIdleTime(idleTime);
  };

  // NEW: Return setMediaPlaying function
  return { 
    isIdle, 
    isOnline, 
    idleSince, 
    getIdleTime, 
    activationCount, 
    resetActivationCount,
    setMediaPlaying // NEW: Expose function to update media state
  };
};
