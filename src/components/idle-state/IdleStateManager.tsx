import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIdleState } from '@/hooks/use-idle-state';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MusicFactDisplay from './MusicFactDisplay';
import AnimatedBackground from './AnimatedBackground';

interface IdleStateManagerProps {
  idleTime?: number;
}

// Define a fact type with category
interface Fact {
  text: string;
  category: 'fun' | 'didyouknow' | 'foryou';
}

const IdleStateManager: React.FC<IdleStateManagerProps> = ({ idleTime = 60000 }) => {
  const [showIdleContent, setShowIdleContent] = useState(false);
  const [idleMode, setIdleMode] = useState<'fact' | 'game' | 'showcase'>('fact');
  const [factFetchAttempted, setFactFetchAttempted] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact>({ text: '', category: 'fun' });
  const location = useLocation();
  const idleWrapperRef = useRef<HTMLDivElement>(null);
  const factRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const factRotationTime = 90000; // 90 seconds
  
  // Offline facts with categories
  const offlineFacts: Fact[] = [
    { text: "Music connects people across all cultures and time periods.", category: 'fun' },
    { text: "Ethiopian Orthodox gospel choirs perform 1,600-year-old hymns", category: 'didyouknow' },
    { text: "Practice everyday! :)", category: 'foryou' },
    { text: "Studies found that cows produce more milk when listening to calming classical music", category: 'fun' },
    { text: "Tutors can leave you encouraging notes that pop up in idle mode", category: 'foryou' },
    { text: "The human ear can detect sounds ranging from 20 Hz to 20,000 Hz", category: 'didyouknow' },
    { text: "Sign up to enjoy a side of the app you didn't know existed", category: 'foryou' },
    // Additional offline facts from online set
    { text: "Sound travels ~343 m/s in air (at 20°C) → Fundamental physics → Check Mini Player visualizer.", category: 'fun' },
    { text: "Humans hear roughly 20–20,000 Hz (range narrows with age) → Hearing limits → Try Hearing Range Analyzer.", category: 'fun' },
    { text: "The circle of fifths links all 12 keys in perfect fifth steps → Key relationships → Use Interactive Quizzes.", category: 'fun' },
    { text: "Diaphragmatic breathing lets singers sustain powerful long notes → Vocal technique → Watch Video Tutorial.", category: 'didyouknow' },
    { text: "Group singing lowers stress and raises oxytocin → Choir unity → Book With Us: Group Vocal Workshop.", category: 'didyouknow' },
    { text: "The kora (West African harp-lute) dates from the 1500s → Traditional instrument → Explore in Library.", category: 'didyouknow' },
    { text: "Handel composed Messiah in just 24 days (1741) → Divine inspiration → See in Historical Infographics.", category: 'fun' },
    { text: "The Fisk Jubilee Singers (1871) popularized African-American spirituals globally → Faith & history.", category: 'didyouknow' },
    { text: "Call-and-response singing underpins African-American spirituals → Participatory worship → Watch Video Tutorial.", category: 'fun' },
    { text: "Psalm 150 calls for praise with trumpets, lyres, cymbals → Instrumental praise → Experience in Infographics.", category: 'fun' },
    { text: "PRO TIP: Singer’s posture matters – try the Breath & Posture video lesson → Video Tutorials.", category: 'foryou' },
    { text: "PRO TIP: Short daily practice beats sporadic marathons → Practice Timer: Schedule daily sessions.", category: 'foryou' },
    { text: "PRO TIP: Teachers, use Interactive Quizzes to reinforce lessons → View in Analytics Dashboard.", category: 'foryou' },
    { text: "PRO TIP: Parents, track your child’s practice → Progress Tracking in Parent Dashboard.", category: 'foryou' },
    { text: "PRO TIP: Enable Dark Mode for late-night practice → Toggle in Settings.", category: 'foryou' },
    { text: "PRO TIP: Download sheet music for offline practice → Offline Downloads for scores.", category: 'foryou' },
    { text: "Traditional Ghanaian drums mirror resting heartbeat → Physiological bond → Try in Practice Tools.", category: 'fun' },
    { text: "The human ear is most sensitive around 2000–5000 Hz → Critical for speech → Use Hearing Range Analyzer.", category: 'didyouknow' },
    { text: "C major uses no sharps/flats → Key signatures → Try Interactive Quizzes.", category: 'didyouknow' },
    { text: "Trained singers produce resonant 'singer’s formant' → Vocal projection → Learn in Video Tutorials.", category: 'didyouknow' },
    { text: "The African djembe drum originated in Mali → Instrument heritage → Explore in Practice Tools.", category: 'didyouknow' },
    { text: "Indigenous Australian songlines encode melodies as paths → Cultural cartography → Experience workshop.", category: 'didyouknow' },
    { text: "The Chinese pentatonic scale bridges cultures → Universal folk element → Try world-scale Quiz Builder.", category: 'didyouknow' },
    { text: "Psalm 98:4 invites praise in song → Biblical encouragement → Book With Us: Worship Team rehearsal.", category: 'didyouknow' },
    { text: "Colossians 3:16 encourages singing psalms → Worship practice → Use Video Tutorials.", category: 'didyouknow' },
    { text: "Shape-note hymnals taught communal singing → Community singing → See in Infographics Library.", category: 'didyouknow' },
    { text: "African call-and-response influenced gospel → Congregational participation → Experience workshops.", category: 'didyouknow' },
    { text: "PRO TIP: Improve your ear with daily Ear Training quizzes → Track progress.", category: 'foryou' },
    { text: "PRO TIP: Book With Us for Group Vocal Workshop → Split cost via M-Pesa.", category: 'foryou' },
    { text: "PRO TIP: Invite friends via Referral Sharing → Earn free lesson credits.", category: 'foryou' },
    { text: "PRO TIP: Watch Vocal Tutorials on breath control → Download for offline use.", category: 'foryou' },
    { text: "PRO TIP: Students, use Practice Timer daily → Review in Analytics Dashboard.", category: 'foryou' }
  ];

  // Online facts with categories
  const ONLINE_FACTS: Fact[] = [
    { text: "A violin’s sound richness comes from harmonics → Timbre physics → Use Mini Player to watch overtones.", category: 'fun' },
    { text: "The pentatonic scale is nearly universal → Global roots → Quiz yourself on pentatonic scales.", category: 'fun' },
    { text: "Guido of Arezzo introduced modern staff notation → Musical literacy → See in Infographics Library.", category: 'fun' },
    { text: "The mbira has been played for centuries in Zimbabwe → Ancient instrument → Listen in Library.", category: 'fun' },
    { text: "The Australian didgeridoo developed ~1000+ years ago → World heritage → Try Tribal Rhythm module.", category: 'fun' },
    { text: "Beethoven wrote his 9th Symphony while nearly deaf → Overcoming adversity → See in Historical Infographics.", category: 'fun' },
    { text: "Singing raises natural endorphins → Healing power → Try Choir Video Tutorial: Praise Songs.", category: 'fun' },
    { text: "Practicing 20–30 minutes daily beats irregular sessions → Efficient learning → Use Practice Timer.", category: 'fun' },
    { text: "Music streaming dominates industry revenue → Changing economy → Track trends in Analytics Dashboard.", category: 'fun' },
    { text: "Bulgaria’s women’s choirs use dissonant harmonies → Unique harmony → Watch Video Tutorial.", category: 'didyouknow' },
    { text: "Sight-reading activates similar brain regions as playing → Brain training → Boost with Interactive Quizzes.", category: 'didyouknow' },
    { text: "Playing an instrument engages both brain hemispheres → Cognitive exercise → Track in Analytics Dashboard.", category: 'didyouknow' },
    { text: "The spacing effect improves retention → Efficient practice → Schedule Practice Timer sessions.", category: 'didyouknow' },
    { text: "Short, deliberate sessions yield faster progress → Deliberate practice → Use Progress Tracking.", category: 'didyouknow' },
    { text: "Dark Mode reduces eye strain → Comfortable practice → Toggle in Settings.", category: 'didyouknow' },
    { text: "Offline downloads let you view content anywhere → Always connected → Enable in app.", category: 'didyouknow' },
    { text: "Church music supports missions → Sustainable ministry → Use PayPal for donations.", category: 'didyouknow' },
    { text: "Streaming accounts for 84% of music revenue → Digital era → Use Referral Sharing.", category: 'didyouknow' },
    { text: "Reverberation times vary → Acoustic design → Test room presets in Mini Player.", category: 'didyouknow' },
    { text: "Concert pitch A=440 Hz agreed in 1939 → Modern tuning → Use Tuners in Practice Tools.", category: 'didyouknow' },
    { text: "PRO TIP: Award virtual badges via Analytics Dashboard → Motivate student progress.", category: 'foryou' },
    { text: "PRO TIP: Save Infographics for offline reading → Access: Offline Downloads.", category: 'foryou' },
    { text: "PRO TIP: Explore Video Tutorials as a family → Book With Us (family workshop).", category: 'foryou' },
    { text: "PRO TIP: Use Mini Player’s loop feature → Master tricky measures.", category: 'foryou' },
    { text: "PRO TIP: Slow down video tutorials → Learn vocal riffs step by step.", category: 'foryou' },
    { text: "PRO TIP: Tap beat in Practice Tools → Custom tempo practice.", category: 'foryou' },
    { text: "PRO TIP: Check Parent Dashboard’s weekly summary → See child's progress.", category: 'foryou' },
    { text: "PRO TIP: Schedule Dark Mode automatically → Settings > Dark Mode timer.", category: 'foryou' },
    { text: "PRO TIP: View Advanced Analytics → Identify challenging songs.", category: 'foryou' },
    { text: "PRO TIP: Share playlists in In-App Chat → Collaborate with friends.", category: 'foryou' },
    { text: "PRO TIP: Sing along to worship tracks → Immersive praise practice.", category: 'foryou' },
    { text: "PRO TIP: Start morning with Progressive Warm-ups → Video Tutorials.", category: 'foryou' },
    { text: "PRO TIP: Incorporate music-history facts → Engage students with Infographics.", category: 'foryou' },
    { text: "PRO TIP: Encourage Course Cards for daily facts → Learning: Library.", category: 'foryou' },
    { text: "PRO TIP: Practice open throat technique → Vocal Video Tutorials.", category: 'foryou' },
    { text: "PRO TIP: Join online choir community → In-App Chat.", category: 'foryou' },
    { text: "PRO TIP: Export practice logs → Analytics Dashboard.", category: 'foryou' }
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
      const randomFact = ONLINE_FACTS[Math.floor(Math.random() * ONLINE_FACTS.length)];
      setCurrentFact(randomFact);
    } catch (error) {
      console.error("Error fetching music fact:", error);
      setCurrentFact({ text: "Music connects people across all cultures and time periods.", category: 'fun' });
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
            const availableFacts = offlineFacts.filter(fact => fact.text !== prev.text);
            const randomFact = availableFacts[Math.floor(Math.random() * availableFacts.length)];
            return randomFact || offlineFacts[0];
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
      const randomFact = offlineFacts[Math.floor(Math.random() * offlineFacts.length)];
      setCurrentFact(randomFact);
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
              fact={currentFact.text || "Did you know that music can improve your mood and cognitive performance?"}
              category={currentFact.category}
              isOnline={isOnline}
              onInteraction={() => setShowIdleContent(false)}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default IdleStateManager;
