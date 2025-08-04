import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIdleState } from '@/hooks/use-idle-state';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MusicFactDisplay from './MusicFactDisplay';
import AnimatedBackground from './AnimatedBackground';

interface IdleStateManagerProps {
  idleTime?: number;
}

interface MusicFact {
  text: string;
  label: string;
}

const IdleStateManager: React.FC<IdleStateManagerProps> = ({ idleTime = 60000 }) => {
  const [showIdleContent, setShowIdleContent] = useState(false);
  const [idleMode, setIdleMode] = useState<'fact' | 'game' | 'showcase'>('fact');
  const [factFetchAttempted, setFactFetchAttempted] = useState(false);
  const [currentFact, setCurrentFact] = useState<MusicFact>({ text: '', label: 'Did You Know' });
  const location = useLocation();
  const idleWrapperRef = useRef<HTMLDivElement>(null);
  const factRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const factRotationTime = 90000;
  
  // Offline facts (40 selected from online facts)
  const offlineFacts: MusicFact[] = [
    { text: "Sound travels ~343 m/s in air (at 20°C) → Fundamental physics → Check Mini Player visualizer", label: "Fun Fact" },
    { text: "Humans hear roughly 20–20,000 Hz (range narrows with age) → Hearing limits → Try Hearing Range Analyzer", label: "Fun Fact" },
    { text: "The pentatonic scale (5 notes) is nearly universal (found in Africa, Asia, Americas) → Global roots → Quiz yourself on pentatonic scales", label: "Fun Fact" },
    { text: "Group singing lowers stress and raises oxytocin (bonding hormone) → Choir unity → Book With Us: Group Vocal Workshop", label: "Fun Fact" },
    { text: "Handel composed Messiah in just 24 days (1741) → Divine inspiration → See in Historical Infographics", label: "Fun Fact" },
    { text: "Psalm 150 calls for praise with trumpets, lyres, cymbals, and more → Instrumental praise → Experience in Infographics", label: "Fun Fact" },
    { text: "Practicing 20–30 minutes daily (spaced practice) often beats irregular long sessions → Efficient learning → Use Practice Timer for short daily drills", label: "Fun Fact" },
    { text: "The human ear is most sensitive around 2000–5000 Hz → Critical for speech & music → Use Hearing Range Analyzer to test your sensitivity", label: "Did You Know" },
    { text: "Trained singers produce a resonant singer's formant around 3 kHz to project over an orchestra → Vocal projection → Learn more in Video Tutorials: Projection Techniques", label: "Did You Know" },
    { text: "Psalm 98:4 (Make a joyful noise unto the Lord… with the sound of the trumpet, and harp) invites praise in song → Biblical encouragement → Book With Us: Worship Team rehearsal", label: "Did You Know" },
    { text: "Colossians 3:16 encourages teaching and singing psalms, hymns, and spiritual songs with gratitude → Worship practice → Use Video Tutorials: Worship Choir Basics", label: "Did You Know" },
    { text: "Playing an instrument engages both brain hemispheres, enhancing coordination and memory → Cognitive exercise → Track practice hours and improvement in Analytics Dashboard", label: "Did You Know" },
    { text: "The spacing effect shows that spreading practice over days improves retention better than cramming → Efficient practice → Schedule multiple Practice Timer sessions weekly", label: "Did You Know" },
    { text: "Using Dark Mode for extended sheet music reading can reduce eye strain under low light → Comfortable practice → Toggle Dark Mode in Settings", label: "Did You Know" },
    { text: "Singer's posture matters – try the Breath & Posture video lesson to strengthen your tone", label: "For You" },
    { text: "Teachers, use Interactive Quizzes to reinforce lessons and view class performance in Analytics Dashboard", label: "For You" },
    { text: "Parents, track your child's practice on the Progress Tracking and celebrate milestones together in Parent Dashboard", label: "For You" },
    { text: "Improve your ear by taking daily Ear Training quizzes → Aural Cognition: Ear Training Quizzes (track progress)", label: "For You" },
    { text: "Book With Us for a Group Vocal Workshop to strengthen choir skills (split cost via M-Pesa)", label: "For You" },
    { text: "Watch Vocal Tutorials on breath control and warm-ups to improve your singing (download for offline use)", label: "For You" }
  ];

  // Online facts (120 categorized facts)
  const ONLINE_FACTS: MusicFact[] = [
    // Fun Facts
    { text: "Sound travels ~343 m/s in air (at 20°C) → Fundamental physics → Check Mini Player visualizer", label: "Fun Fact" },
    { text: "Humans hear roughly 20–20,000 Hz (range narrows with age) → Hearing limits → Try Hearing Range Analyzer", label: "Fun Fact" },
    { text: "A +10 dB increase equals ~10× acoustic intensity (e.g., 50 dB is 10× 40 dB) → Sound intensity → View Mini Player meter", label: "Fun Fact" },
    { text: "A violin's sound richness comes from harmonics (integer multiples of a fundamental) → Timbre physics → Use Mini Player to watch overtones", label: "Fun Fact" },
    { text: "The circle of fifths links all 12 keys in perfect fifth steps → Key relationships → Use Interactive Quizzes to explore new keys", label: "Fun Fact" },
    { text: "The pentatonic scale (5 notes) is nearly universal (found in Africa, Asia, Americas) → Global roots → Quiz yourself on pentatonic scales", label: "Fun Fact" },
    { text: "Guido of Arezzo (~11th c.) introduced the modern 5-line staff notation → Musical literacy → See Infographics Library for evolution of notation", label: "Fun Fact" },
    { text: "Diaphragmatic (belly) breathing lets singers sustain powerful long notes → Vocal technique → Watch Video Tutorial: Breath Control Basics", label: "Fun Fact" },
    { text: "Group singing lowers stress and raises oxytocin (bonding hormone) → Choir unity → Book With Us: Group Vocal Workshop", label: "Fun Fact" },
    { text: "The kora (West African harp-lute, 21 strings) dates from the 1500s → Traditional instrument → Explore in Library courses", label: "Fun Fact" },
    { text: "The mbira (African thumb piano) has been played for centuries in Zimbabwe → Ancient lamellophone → Listen to Mbira tracks in Library", label: "Fun Fact" },
    { text: "The Australian didgeridoo is a traditional wind instrument (developed ~1000+ years ago) → World heritage → Try Tribal Rhythm module in Practice Tools", label: "Fun Fact" },
    { text: "Handel composed Messiah in just 24 days (1741) → Divine inspiration → See in Historical Infographics", label: "Fun Fact" },
    { text: "The Fisk Jubilee Singers (1871) popularized African-American spirituals globally → Faith & history → Explore Spirituals in Library", label: "Fun Fact" },
    { text: "Call-and-response singing (from West African roots) underpins African-American spirituals, engaging congregations → Participatory worship → Watch Video Tutorial: Call-Response Gospel Singing", label: "Fun Fact" },
    { text: "Psalm 150 calls for praise with trumpets, lyres, cymbals, and more → Instrumental praise → Experience in Infographics", label: "Fun Fact" },
    { text: "Beethoven wrote his 9th Symphony (1824) while nearly deaf → Overcoming adversity → See in Historical Infographics", label: "Fun Fact" },
    { text: "Singing regularly raises natural endorphins, acting as a pain reliever and mood booster → Healing power → Try Choir Video Tutorial: Praise Songs", label: "Fun Fact" },
    { text: "Practicing 20–30 minutes daily (spaced practice) often beats irregular long sessions → Efficient learning → Use Practice Timer for short daily drills", label: "Fun Fact" },
    { text: "Music streaming now dominates the industry: about 84% of US music revenue in 2023 → Changing economy → Track trends in Analytics Dashboard", label: "Fun Fact" },
    { text: "Traditional Ghanaian drums (like talking drums) often play rhythms ~60–85 BPM, mirroring a resting human heartbeat → Physiological bond → Try drum patterns in Practice Tools", label: "Fun Fact" },
    
    // Did You Know
    { text: "The human ear is most sensitive around 2000–5000 Hz → Critical for speech & music → Use Hearing Range Analyzer to test your sensitivity", label: "Did You Know" },
    { text: "C major uses no sharps/flats; each move clockwise on the circle adds one sharp (e.g. G=1♯, D=2♯) → Key signatures → Try Interactive Quizzes on key signatures", label: "Did You Know" },
    { text: "Trained singers produce a resonant singer's formant around 3 kHz to project over an orchestra → Vocal projection → Learn more in Video Tutorials: Projection Techniques", label: "Did You Know" },
    { text: "The African djembe drum originated in Mali and was popularized in the 1950s by Guinea's national orchestra → Instrument heritage → Explore African drum samples in Practice Tools", label: "Did You Know" },
    { text: "Indigenous Australian songlines encode melodies as paths across the land → Cultural cartography → Experience a Global Traditions workshop on Aboriginal music", label: "Did You Know" },
    { text: "The Chinese pentatonic scale appears in many folk traditions worldwide, bridging cultures → Universal folk element → Try the world-scale Quiz Builder in Library", label: "Did You Know" },
    { text: "Bulgaria's women's choirs are famous for unique dissonant harmonies (close seconds) → Unique harmony → Watch Video Tutorial on World Vocal Styles", label: "Did You Know" },
    { text: "Psalm 98:4 (Make a joyful noise unto the Lord… with the sound of the trumpet, and harp) invites praise in song → Biblical encouragement → Book With Us: Worship Team rehearsal", label: "Did You Know" },
    { text: "Colossians 3:16 encourages teaching and singing psalms, hymns, and spiritual songs with gratitude → Worship practice → Use Video Tutorials: Worship Choir Basics", label: "Did You Know" },
    { text: "Shape-note hymnals (e.g. Sacred Harp, 1844) used differently-shaped notes to teach communal singing → Community singing → See Sacred Harp examples in Infographics Library", label: "Did You Know" },
    { text: "African call-and-response traditions deeply influenced the structure of gospel and spiritual songs → Congregational participation → Experience call-response in Global Traditions workshops", label: "Did You Know" },
    { text: "Sight-reading music activates similar brain regions as playing it, strengthening neural connections → Brain training → Boost skills with Interactive Quizzes: Sight-Reading Trainer", label: "Did You Know" },
    { text: "Playing an instrument engages both brain hemispheres, enhancing coordination and memory → Cognitive exercise → Track practice hours and improvement in Analytics Dashboard", label: "Did You Know" },
    { text: "The spacing effect shows that spreading practice over days improves retention better than cramming → Efficient practice → Schedule multiple Practice Timer sessions weekly", label: "Did You Know" },
    { text: "Short, deliberate practice sessions (25–30 min) can yield faster progress than very long, unfocused sessions → Deliberate practice → Use Practice Timer and Progress Tracking for daily practice goals", label: "Did You Know" },
    { text: "Using Dark Mode for extended sheet music reading can reduce eye strain under low light → Comfortable practice → Toggle Dark Mode in Settings", label: "Did You Know" },
    { text: "Offline downloads let you view saved tutorials and scores anywhere (even without Wi-Fi) → Always connected → Enable Offline Downloads in the app", label: "Did You Know" },
    { text: "Church music albums and festivals can raise substantial ministry funds – modern gospel tours often support missions → Sustainable ministry → Use PayPal for concert ticketing and donations", label: "Did You Know" },
    { text: "Streaming platforms now account for ~84% of U.S. music industry revenue (2023) → Digital era → Encourage family referrals to boost support via Referral Sharing", label: "Did You Know" },
    { text: "Reverberation times vary hugely: small studios ~0.2s RT60 vs concert halls ~1.5–2s RT60 → Acoustic design → Hear different reverb by testing room presets in Mini Player", label: "Did You Know" },
    { text: "The international concert pitch A=440 Hz was agreed by major orchestras in 1939 (after U.S. adoption in 1910) → Modern tuning → Use Tuners in Practice Tools set to A440 for standard pitch", label: "Did You Know" },
    
    // For You
    { text: "Singer's posture matters – try the Breath & Posture video lesson to strengthen your tone → Video Tutorials: Posture & Breath", label: "For You" },
    { text: "Short daily practice (20 minutes) beats sporadic marathons for memory retention (spacing effect) → Practice Timer: Schedule daily 20-min sessions", label: "For You" },
    { text: "Teachers, use Interactive Quizzes to reinforce lessons and view class performance in Analytics Dashboard", label: "For You" },
    { text: "Parents, track your child's practice on the Progress Tracking and celebrate milestones together in Parent Dashboard", label: "For You" },
    { text: "Enable Dark Mode for late-night practice to reduce glare → Access: Toggle Dark Mode in Settings", label: "For You" },
    { text: "Download sheet music for offline practice (no Wi-Fi needed) → Access: Offline Downloads for scores", label: "For You" },
    { text: "Improve your ear by taking daily Ear Training quizzes → Aural Cognition: Ear Training Quizzes (track progress)", label: "For You" },
    { text: "Book With Us for a Group Vocal Workshop to strengthen choir skills (split cost via M-Pesa)", label: "For You" },
    { text: "Invite friends via Referral Sharing – earn free lesson credits when they join → Community: Referral Sharing", label: "For You" },
    { text: "Watch Vocal Tutorials on breath control and warm-ups to improve your singing (download for offline use)", label: "For You" },
    { text: "Parents, add your children to the Parent Dashboard to see weekly progress charts → Progress Tracking", label: "For You" },
    { text: "Students, tap Practice Timer daily to build routine; review improvements in Analytics Dashboard", label: "For You" },
    { text: "Teachers, award virtual badges via the Analytics Dashboard to motivate student progress", label: "For You" },
    { text: "Save Infographics for offline reading on worship music history → Access: Offline Downloads", label: "For You" },
    { text: "Explore Video Tutorials together as a family for worship songs → Community: Book With Us (family workshop)", label: "For You" },
    { text: "Use the Mini Player's loop feature to master a tricky measure → Mini Player: Loop segment tool", label: "For You" },
    { text: "Slow down video tutorials (speed control) to learn challenging vocal riffs step by step", label: "For You" },
    { text: "Tap the beat in Practice Tools (metronome) for custom tempo practice → Practice Tools: Tap Tempo tool", label: "For You" },
    { text: "Check Parent Dashboard's weekly email summary to see your child's practice stats and progress", label: "For You" },
    { text: "Use Offline Downloads to keep practicing on the go (airplane mode, retreats)", label: "For You" }
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
      setCurrentFact({ text: "Music connects people across all cultures and time periods.", label: "Did You Know" });
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
              fact={currentFact.text}
              label={currentFact.label}
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
