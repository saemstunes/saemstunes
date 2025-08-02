
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const factRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const factRotationTime = 15000; // 15 seconds
  
  const offlineFacts = [
    "Music connects people across all cultures and time periods.",
    "Did you know? Ethiopian Orthodox gospel choirs perform 1,600-year-old hymns",
    "Tip: Practice everyday! :)",
    "Studies found that cows produce more milk when listening to calming classical music",
    "The human ear can detect sounds ranging from 20 Hz to 20,000 Hz",
    "Tip: Sign up to enjoy a side of the app you didn't know existed"
  ];

  const { 
    isIdle, 
    isOnline, 
    getIdleTime, 
    activationCount, 
    resetActivationCount 
  } = useIdleState({
    idleTime,
    maxActivations: 5,
    onIdleStart: () => {
      setTimeout(() => setShowIdleContent(true), 1000);
    },
    onIdleEnd: () => {
      setShowIdleContent(false);
      setFactFetchAttempted(false);
    }
  });

  useEffect(() => {
    resetActivationCount();
  }, [location.pathname, resetActivationCount]);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (isIdle) {
        setShowIdleContent(false);
        setFactFetchAttempted(false);
      }
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('mousedown', handleUserInteraction, { passive: true });
    document.addEventListener('keydown', handleUserInteraction, { passive: true });
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [isIdle]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
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

  useEffect(() => {
    if (!isIdle) return;
    
    const idleTimeMs = getIdleTime();
    
    if (idleTimeMs < 120000) {
      setIdleMode('fact');
    } else if (idleTimeMs < 300000) {
      if (['/music-tools', '/discover', '/library'].includes(location.pathname)) {
        setIdleMode('showcase');
      } else {
        setIdleMode('fact');
      }
    } else {
      setIdleMode('game');
    }
  }, [isIdle, getIdleTime, isOnline, location.pathname]);
  
  const fetchMusicFact = useCallback(async () => {
    try {
      const facts = [
        "The first piano was invented in Italy by Bartolomeo Cristofori around 1700",
        "Mozart wrote his first symphony at the age of eight",
        "The Beatles have sold over 600 million albums worldwide",
        "A standard guitar has 6 strings tuned to E, A, D, G, B, and E",
        "In 1952, John Cage composed '4′33″', which consists of 4 minutes and 33 seconds of silence",
        "The longest commercially released song is 'The Rise and Fall of Bossanova' at 13 hours, 23 minutes, and 32 seconds",
        "Beethoven composed many of his most famous works after becoming completely deaf",
        "The theremin is the only instrument played without physical contact",
        "The oldest known musical instrument is a flute carved from bone, estimated to be over 40,000 years old",
        "Michael Jackson's 'Thriller' is the best-selling album of all time with over 66 million copies sold",
        "Did you know? In Saem's Tunes, you can double-tap any music tool to open advanced settings",
        "Tip: Use the metronome's visual feedback to improve your rhythm",
        "Tip: You can adjust the pitch finder's sensitivity in the settings menu",
        "Tip: Save your favorite tools to your profile for quick access",
        "Did You Know: This app has some Easter eggs! Will you find them all? :)",
        "Tip: Sign up to enjoy a side of the app you didn't know existed",
        "Tip: Practice everyday! :)",
        "Did you know? Ethiopian Orthodox gospel choirs perform 1,600-year-old hymns that have been preserved and modernized for streaming platforms",
        "The first recorded music performance took place around 3100 BCE in ancient Egypt",
        "The vibrations of a cello closely mimic the range of the human voice",
        "Studies show singing releases endorphins, instantly boosting your mood",
        "Studies found that cows produce more milk when listening to calming classical music",
        "Did you know? Tutors can leave you encouraging notes or reminders that pop up in idle mode — just like this!",
        "The human ear can detect sounds ranging from 20 Hz to 20,000 Hz",
        "A grand piano has over 12,000 parts, 10,000 of which are moving",
        "Gospel music secured the 9th spot among the most-streamed genres in Africa on Spotify in 2024",
        "Kenyan worship songs are now being taught in Bible colleges across five continents",
        "Joyous Celebration recorded their 21st album in the USA, proving African gospel's international recording industry reach",
        "Music activates every known part of the brain — more than any other stimulus",
        "Humming can reduce stress by lowering heart rate and blood pressure",
        "Amapiano's growth on Spotify is staggering. Streams skyrocketed over 5,668% between 2018 and 2023, hitting 1.4 billion in 2023 alone",
        "Did you know? Mercy Masika's 'Mwema' was adopted as the UNHCR Refugee Week anthem in 2019",
        "Did you know? Sinach's 'Way Maker' has been translated into over 50 languages and surpassed 100 million streams",
        "Ancient Greek athletes trained to specific musical rhythms to boost stamina and coordination",
      ];
      
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setCurrentFact(randomFact);
    } catch (error) {
      console.error("Error fetching music fact:", error);
      setCurrentFact("Music connects people across all cultures and time periods.");
    }
  }, []);

  useEffect(() => {
    if (showIdleContent && idleMode === 'fact') {
      if (factRotationIntervalRef.current) {
        clearInterval(factRotationIntervalRef.current);
      }
      
      factRotationIntervalRef.current = setInterval(() => {
        if (isOnline) {
          fetchMusicFact();
        } else {
          setCurrentFact(prev => {
            const availableFacts = offlineFacts.filter(fact => fact !== prev);
            return availableFacts[Math.floor(Math.random() * availableFacts.length)] || 
                   offlineFacts[0];
          });
        }
      }, factRotationTime);
    }

    return () => {
      if (factRotationIntervalRef.current) {
        clearInterval(factRotationIntervalRef.current);
        factRotationIntervalRef.current = null;
      }
    };
  }, [showIdleContent, idleMode, isOnline, factRotationTime, fetchMusicFact]);

  useEffect(() => {
    if (isIdle && showIdleContent && idleMode === 'fact' && isOnline && !factFetchAttempted) {
      fetchMusicFact();
      setFactFetchAttempted(true);
    }
    
    if (isIdle && showIdleContent && idleMode === 'fact' && !isOnline && !factFetchAttempted) {
      setCurrentFact(offlineFacts[0]);
      setFactFetchAttempted(true);
    }
  }, [isIdle, showIdleContent, idleMode, isOnline, factFetchAttempted, fetchMusicFact]);

  if (!isIdle || !showIdleContent) return null;
  
  return (
    <AnimatePresence>
      {showIdleContent && (
        <div 
          ref={idleWrapperRef}
          className="idle-state-wrapper fixed inset-0 pointer-events-auto"
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
