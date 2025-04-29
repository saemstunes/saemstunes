
import React, { useState, useEffect, useRef } from 'react';
import { useIdleState } from '@/hooks/use-idle-state';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MusicFactDisplay from './MusicFactDisplay';
import AnimatedBackground from './AnimatedBackground';
import IdleGameOverlay from './IdleGameOverlay';
import AutoShowcaseFeature from './AutoShowcaseFeature';

interface IdleStateManagerProps {
  idleTime?: number;
}

const IdleStateManager: React.FC<IdleStateManagerProps> = ({ idleTime = 60000 }) => {
  const [showIdleContent, setShowIdleContent] = useState(false);
  const [idleMode, setIdleMode] = useState<'fact' | 'game' | 'showcase'>('fact');
  const [factFetchAttempted, setFactFetchAttempted] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const location = useLocation();
  const idleWrapperRef = useRef<HTMLDivElement>(null);
  
  // Use our idle state hook with the improved configuration
  const { 
    isIdle, 
    isOnline, 
    getIdleTime, 
    activationCount, 
    resetActivationCount 
  } = useIdleState({
    idleTime,
    maxActivations: 5, // Max 5 activations before increasing wait time
    onIdleStart: () => {
      // Wait 1 second before showing idle content to prevent flashing
      setTimeout(() => setShowIdleContent(true), 1000);
    },
    onIdleEnd: () => {
      setShowIdleContent(false);
      setFactFetchAttempted(false);
    }
  });

  // Reset activation count after significant user engagement
  useEffect(() => {
    // Reset when user navigates to a different route
    resetActivationCount();
  }, [location.pathname, resetActivationCount]);

  // Add touch event listeners to detect any user interaction with the screen
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isIdle) {
        setShowIdleContent(false);
        setFactFetchAttempted(false);
      }
    };

    // Add event listeners for common user interactions
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('mousedown', handleUserInteraction, { passive: true });
    document.addEventListener('keydown', handleUserInteraction, { passive: true });
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      // Clean up event listeners
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [isIdle]);

  // Detect clicks outside idle content
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // If the idle wrapper exists and the click is not inside any idle component
      // This will exit idle mode when clicking anywhere outside idle components
      if (idleWrapperRef.current && !idleWrapperRef.current.contains(e.target as Node)) {
        setShowIdleContent(false);
      }
    };

    if (showIdleContent) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showIdleContent]);

  // Decide which idle mode to display based on idle time and online status
  useEffect(() => {
    if (!isIdle) return;
    
    const idleTimeMs = getIdleTime();
    
    if (idleTimeMs < 120000) { // First 2 minutes
      // Show facts if online, or animated background if offline
      setIdleMode('fact');
    } else if (idleTimeMs < 300000) { // Between 2-5 minutes
      // Show auto showcase on appropriate pages
      if (['/music-tools', '/discover', '/library'].includes(location.pathname)) {
        setIdleMode('showcase');
      } else {
        setIdleMode('fact');
      }
    } else { // After 5 minutes
      // Show idle game
      setIdleMode('game');
    }
  }, [isIdle, getIdleTime, isOnline, location.pathname]);
  
  // Fetch music facts if we're in online fact mode
  useEffect(() => {
    if (isIdle && showIdleContent && idleMode === 'fact' && isOnline && !factFetchAttempted) {
      fetchMusicFact();
      setFactFetchAttempted(true);
    }
  }, [isIdle, showIdleContent, idleMode, isOnline, factFetchAttempted]);
  
  // Simulated fetch function for music facts
  const fetchMusicFact = async () => {
    try {
      // Simulating API call with some predefined facts
      const facts = [
        "The first piano was invented in Italy by Bartolomeo Cristofori around 1700.",
        "Mozart wrote his first symphony at the age of eight.",
        "The Beatles have sold over 600 million albums worldwide.",
        "A standard guitar has 6 strings tuned to E, A, D, G, B, and E.",
        "In 1952, John Cage composed '4′33″', which consists of 4 minutes and 33 seconds of silence.",
        "The longest commercially released song is 'The Rise and Fall of Bossanova' at 13 hours, 23 minutes, and 32 seconds.",
        "Beethoven composed many of his most famous works after becoming completely deaf.",
        "The theremin is the only instrument played without physical contact.",
        "The oldest known musical instrument is a flute carved from bone, estimated to be over 40,000 years old.",
        "Michael Jackson's 'Thriller' is the best-selling album of all time with over 66 million copies sold.",
        "Did you know? In Saem's Tunes, you can double-tap any music tool to open advanced settings.",
        "Tip: Use the metronome's visual feedback to improve your rhythm.",
        "Tip: You can adjust the pitch finder's sensitivity in the settings menu.",
        "Tip: Save your favorite tools to your profile for quick access."
      ];
      
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setCurrentFact(randomFact);
    } catch (error) {
      console.error("Error fetching music fact:", error);
      setCurrentFact("Music connects people across all cultures and time periods.");
    }
  };

  // Don't render anything if not idle
  if (!isIdle || !showIdleContent) return null;
  
  return (
    <AnimatePresence>
      {showIdleContent && (
        <div 
          ref={idleWrapperRef}
          className="idle-state-wrapper fixed inset-0 pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <AnimatedBackground />
          
          {idleMode === 'fact' && (
            <MusicFactDisplay 
              fact={currentFact || "Did you know that music can improve your mood and cognitive performance?"}
              isOnline={isOnline}
              onInteraction={() => setShowIdleContent(false)}
            />
          )}
          
          {idleMode === 'game' && (
            <IdleGameOverlay 
              onInteraction={() => setShowIdleContent(false)}
            />
          )}
          
          {idleMode === 'showcase' && (
            <AutoShowcaseFeature 
              path={location.pathname} 
              onInteraction={() => setShowIdleContent(false)}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default IdleStateManager;
