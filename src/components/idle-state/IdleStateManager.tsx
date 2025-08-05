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
    { text: "Sound moves at 767 mph—about 5 seconds to travel a mile.", label: "Fun Fact" },
    { text: "Mozart composed his first full symphony at age 8—before most kids learn algebra.", label: "Fun Fact" },
    { text: "A grand piano packs over 230 strings inside, stretched at 18 tons of total tension.", label: "Fun Fact" },
    { text: "Gospel's call-and-response style traces directly to West African communal fieldwork chants.", label: "Fun Fact" },
    { text: "When choirs sing together, their heartbeats synchronize—proven in lab studies.", label: "Fun Fact" },
    { text: "Beethoven wrote his entire Ninth Symphony while completely deaf, feeling vibrations through the floor.", label: "Fun Fact" },
    { text: "Australia's didgeridoo dates back 1,500+ years—carved by Indigenous communities from termite-hollowed eucalyptus.", label: "Fun Fact" },
    { text: "Church handbells evolved from medieval tower bells recast for small ensembles.", label: "Fun Fact" },
    { text: "Psalm 150 explicitly commands worship with tambourines, strings, and \"loud clashing cymbals.\"", label: "Did You Know" },
    { text: "Spirituals like \"Wade in the Water\" contained coded directions for escaping enslavement.", label: "Did You Know" },
    { text: "Mali's kora—a 21-string harp-lute—preserves history through hereditary griot musicians.", label: "Did You Know" },
    { text: "Zimbabwe's mbira (thumb piano) summons ancestral spirits in Shona ceremonies.", label: "Did You Know" },
    { text: "Nigerian Afrobeat fuses traditional Yoruba rhythms with jazz and funk.", label: "Did You Know" },
    { text: "Neuroscientists confirm: practicing 20 minutes daily builds skills faster than 3-hour weekend sessions.", label: "Did You Know" },
    { text: "Use the Practice Timer for 20-minute sessions—consistency outperforms marathon rehearsals.", label: "For You" },
    { text: "Parents: Check the Parent Dashboard weekly to view your child's logged practice time.", label: "For You" },
    { text: "Tap \"Download\" on Video Tutorials to save lessons for offline use.", label: "For You" },
    { text: "Strengthen pitch recognition via daily Ear Training Quizzes in the Library.", label: "For You" },
    { text: "Enable Dark Mode in Settings to reduce glare during evening practice.", label: "For You" },
    { text: "Teachers: Build custom quizzes in the Quiz Builder to reinforce lesson concepts.", label: "For You" }
  ];

  // Online facts (120 categorized facts)
  const ONLINE_FACTS: MusicFact[] = [
    // Fun Facts (0-39)
    { text: "Sound moves at 767 mph—about 5 seconds to travel a mile.", label: "Fun Fact" },
    { text: "Mozart composed his first full symphony at age 8—before most kids learn algebra.", label: "Fun Fact" },
    { text: "A grand piano packs over 230 strings inside, stretched at 18 tons of total tension.", label: "Fun Fact" },
    { text: "Gospel's call-and-response style traces directly to West African communal fieldwork chants.", label: "Fun Fact" },
    { text: "When choirs sing together, their heartbeats synchronize—proven in lab studies.", label: "Fun Fact" },
    { text: "Beethoven wrote his entire Ninth Symphony while completely deaf, feeling vibrations through the floor.", label: "Fun Fact" },
    { text: "Australia's didgeridoo dates back 1,500+ years—carved by Indigenous communities from termite-hollowed eucalyptus.", label: "Fun Fact" },
    { text: "Church handbells evolved from medieval tower bells recast for small ensembles.", label: "Fun Fact" },
    { text: "Your brain releases dopamine when you hear favorite songs—like eating chocolate.", label: "Fun Fact" },
    { text: "Blues \"bent notes\" descend directly from West African pitch-sliding techniques.", label: "Fun Fact" },
    { text: "Audiences traditionally stand during Handel's \"Hallelujah Chorus\"—a custom started by King George II.", label: "Fun Fact" },
    { text: "Newborns recognize lullabies heard in the womb for months after birth.", label: "Fun Fact" },
    { text: "Ghanaian drum patterns often match resting heart rates (60-80 BPM).", label: "Fun Fact" },
    { text: "A humming refrigerator resonates near 60 Hz—almost exactly a B♭ note.", label: "Fun Fact" },
    { text: "Violins play 4-note chords by bowing strings simultaneously—despite having only 4 strings.", label: "Fun Fact" },
    { text: "In Tuva, throat singers isolate overtones to produce two distinct pitches at once.", label: "Fun Fact" },
    { text: "Central African Pygmies use yodel-like calls to communicate across dense rainforests.", label: "Fun Fact" },
    { text: "Stradivarius violins' unique sound comes partly from wood treated with borax and minerals.", label: "Fun Fact" },
    { text: "J.S. Bach fathered 20 children—7 became professional musicians.", label: "Fun Fact" },
    { text: "\"Happy Birthday\" borrowed its melody from an 1893 school song called \"Good Morning to All.\"", label: "Fun Fact" },
    { text: "Whitney Houston holds the Guinness World Record for most-awarded female artist (415+ wins).", label: "Fun Fact" },
    { text: "Beethoven added metronome marks to his scores after meeting its inventor, Maelzel.", label: "Fun Fact" },
    { text: "The world's largest piano, built in New Zealand, weighs 1.4 tons—as heavy as a small car.", label: "Fun Fact" },
    { text: "Ancient Greek physicians prescribed flute music to treat depression and anxiety.", label: "Fun Fact" },
    { text: "Dairy cows produce 3% more milk when listening to calming music like Beethoven's Pastoral.", label: "Fun Fact" },
    { text: "\"Yesterday\" by The Beatles holds the record for most cover versions—over 2,200.", label: "Fun Fact" },
    { text: "Elvis Presley performed only in North America—his 1957 Hawaii show was his farthest concert.", label: "Fun Fact" },
    { text: "Crafting one violin requires precisely 70+ pieces of wood—maple back, spruce top, ebony fingerboard.", label: "Fun Fact" },
    { text: "Mozart wrote a comic duet (\"Duetto buffo di due gatti\") for two sopranos imitating cats.", label: "Fun Fact" },
    { text: "The shortest song ever released is \"You Suffer\" by Napalm Death—1.316 seconds.", label: "Fun Fact" },
    { text: "A Cambridge study found heavy metal fans report higher life satisfaction than other genres.", label: "Fun Fact" },
    { text: "A Steinway grand once owned by John Lennon sold for $3.22 million in 2023.", label: "Fun Fact" },
    { text: "Jimi Hendrix restrung right-handed guitars upside down—never playing left-handed models.", label: "Fun Fact" },
    { text: "Leonardo da Vinci sketched designs for a viola organista (bowed keyboard) in 1488.", label: "Fun Fact" },
    { text: "Frank Sinatra called \"My Way\" \"self-serving and indulgent\"—yet recorded it reluctantly.", label: "Fun Fact" },
    { text: "The oldest known melody is a 3,400-year-old Hurrian hymn etched on a clay tablet in Syria.", label: "Fun Fact" },
    { text: "Michael Jackson patented anti-gravity shoes in 1993 to lean forward during \"Smooth Criminal.\"", label: "Fun Fact" },
    { text: "Songbirds like thrushes use pentatonic scales—identical to human folk traditions.", label: "Fun Fact" },
    { text: "Prince played all 27 instruments on his debut album \"For You\" (1978).", label: "Fun Fact" },
    { text: "In sheet music, tacet instructs musicians to stay silent for an entire movement.", label: "Fun Fact" },

    // Did You Know (40-79)
    { text: "Psalm 150 explicitly commands worship with tambourines, strings, and \"loud clashing cymbals.\"", label: "Did You Know" },
    { text: "Spirituals like \"Wade in the Water\" contained coded directions for escaping enslavement.", label: "Did You Know" },
    { text: "Mali's kora—a 21-string harp-lute—preserves history through hereditary griot musicians.", label: "Did You Know" },
    { text: "Zimbabwe's mbira (thumb piano) summons ancestral spirits in Shona ceremonies.", label: "Did You Know" },
    { text: "Nigerian Afrobeat fuses traditional Yoruba rhythms with jazz and funk.", label: "Did You Know" },
    { text: "Neuroscientists confirm: practicing 20 minutes daily builds skills faster than 3-hour weekend sessions.", label: "Did You Know" },
    { text: "Group singing releases oxytocin—the \"bonding hormone\"—reducing stress.", label: "Did You Know" },
    { text: "Dark Mode on screens cuts blue light by 80%, easing eye strain during late-night score reading.", label: "Did You Know" },
    { text: "Downloaded lessons in Saem's Tunes work offline—tested on planes and remote areas.", label: "Did You Know" },
    { text: "Teachers monitor student progress via automated practice logs in the Parent Dashboard.", label: "Did You Know" },
    { text: "Focused 20-minute sessions engrave muscle memory more effectively than unfocused hours.", label: "Did You Know" },
    { text: "Medieval monks invented neumes—symbols above lyrics—to standardize Gregorian chant around 900 CE.", label: "Did You Know" },
    { text: "Colossians 3:16 urges believers to \"teach... with psalms, hymns, and spiritual songs.\"", label: "Did You Know" },
    { text: "The Fisk Jubilee Singers toured spirituals globally in 1871, funding their university's survival.", label: "Did You Know" },
    { text: "Bulgarian women's choirs intentionally sing close intervals (seconds) for piercing harmonies.", label: "Did You Know" },
    { text: "Indian ragas prescribe specific scales for dawn, noon, dusk, and night—each evoking distinct moods.", label: "Did You Know" },
    { text: "Balinese gamelan orchestras tune instruments to natural resonances—never equal temperament.", label: "Did You Know" },
    { text: "True perfect pitch occurs in just 1 in 10,000 people—most trained before age 7.", label: "Did You Know" },
    { text: "Synesthetes involuntarily associate musical keys with colors—B♭ might feel \"blue.\"", label: "Did You Know" },
    { text: "The circle of fifths diagrams how all 12 major keys connect through shared notes.", label: "Did You Know" },
    { text: "Baroque ensembles tuned to A=415 Hz—a half-step lower than modern orchestras (A=440).", label: "Did You Know" },
    { text: "Gregorian chant notation omitted rhythms—singers followed textual phrasing.", label: "Did You Know" },
    { text: "Wagner's operatic leitmotifs (character themes) inspired John Williams' Star Wars scores.", label: "Did You Know" },
    { text: "Miles Davis pioneered \"cool jazz\" using a Harmon mute for his trumpet's whispery tone.", label: "Did You Know" },
    { text: "Early gospel quartets like The Soul Stirrers shaped doo-wop and R&B vocal harmonies.", label: "Did You Know" },
    { text: "Flamenco blends Romani guitar, Moorish scales, and Andalusian folk dance.", label: "Did You Know" },
    { text: "Medieval church banned the tritone interval (e.g., F to B) as \"diabolus in musica\" (\"devil in music\").", label: "Did You Know" },
    { text: "Beethoven erased Napoleon's dedication from his \"Eroica\" Symphony after he declared himself emperor.", label: "Did You Know" },
    { text: "Stradivari sourced maple from Croatian forests—dense wood from slow-growing trees.", label: "Did You Know" },
    { text: "Mariachi bands feature violins, trumpets, vihuelas, and guitarróns—no drums.", label: "Did You Know" },
    { text: "Japan's traditional scale uses five tones (Ryo scale), avoiding half-steps.", label: "Did You Know" },
    { text: "Bagpipes originated in ancient Egypt—spreading to Scotland via Roman legions.", label: "Did You Know" },
    { text: "\"One Love\" by Bob Marley became Jamaica's unofficial anthem, promoting unity.", label: "Did You Know" },
    { text: "Édouard-Léon Scott de Martinville recorded the first sound (folk song \"Au Clair de la Lune\") in 1860.", label: "Did You Know" },
    { text: "Hip-hop emerged from 1970s Bronx block parties where DJs looped drum breaks.", label: "Did You Know" },
    { text: "Mozart's baptismal name: Johannes Chrysostomus Wolfgangus Theophilus Mozart.", label: "Did You Know" },
    { text: "Modern guitars descend from the oud—a Middle Eastern lute brought to Spain by Moors.", label: "Did You Know" },
    { text: "Reggae's signature rhythm accents offbeats—musicians call this \"skanking.\"", label: "Did You Know" },
    { text: "Jazz solos mirror conversations—listening, responding, and leaving space.", label: "Did You Know" },
    { text: "The Dresden Staatskapelle orchestra, founded in 1548, still performs today.", label: "Did You Know" },

    // For You (80-119)
    { text: "Use the Practice Timer for 20-minute sessions—consistency outperforms marathon rehearsals.", label: "For You" },
    { text: "Parents: Check the Parent Dashboard weekly to view your child's logged practice time.", label: "For You" },
    { text: "Tap \"Download\" on Video Tutorials to save lessons for offline use.", label: "For You" },
    { text: "Strengthen pitch recognition via daily Ear Training Quizzes in the Library.", label: "For You" },
    { text: "Enable Dark Mode in Settings to reduce glare during evening practice.", label: "For You" },
    { text: "Teachers: Build custom quizzes in the Quiz Builder to reinforce lesson concepts.", label: "For You" },
    { text: "Book group vocal workshops via the Book With Us page—ideal for choirs.", label: "For You" },
    { text: "Save sheet music to Offline Library for access without internet.", label: "For You" },
    { text: "Track practice streaks in the Analytics Dashboard to maintain motivation.", label: "For You" },
    { text: "Unlock the \"Gospel Roots\" infographic pack in the Subscription Library.", label: "For You" },
    { text: "Slow tutorial playback to 75% speed using the Speed Control toggle.", label: "For You" },
    { text: "Loop challenging measures in the Mini Player for focused repetition.", label: "For You" },
    { text: "Share practice playlists with classmates via the In-App Chat tool.", label: "For You" },
    { text: "Set weekly goals in the Progress Tracker—e.g., \"Master 2 scales.\"", label: "For You" },
    { text: "Improve timing by practicing with the Metronome tool at varied tempos.", label: "For You" },
    { text: "Start sessions with the Vocal Exercises module for healthy warm-ups.", label: "For You" },
    { text: "Parents: Opt-in for Email Summaries to receive weekly progress reports.", label: "For You" },
    { text: "Teachers: Assign Course Cards as homework—students mark them complete.", label: "For You" },
    { text: "Split group class fees via M-Pesa using the \"Shared Payment\" option.", label: "For You" },
    { text: "Earn free lesson credits when friends sign up via your Referral Sharing link.", label: "For You" },
    { text: "Book private 1-on-1 lessons through the Book Us portal.", label: "For You" },
    { text: "Organize materials into Custom Playlists (e.g., \"Recital Pieces\").", label: "For You" },
    { text: "Master hymns using Worship Tutorials—filter by difficulty level.", label: "For You" },
    { text: "Generate scales/modes in the Scale Generator for composition practice.", label: "For You" },
    { text: "Filter Analytics by song to identify challenging sections.", label: "For You" },
    { text: "Schedule Practice Reminders for consistent daily routines.", label: "For You" },
    { text: "Download Chord Charts for Sunday worship preparation.", label: "For You" },
    { text: "Request cultural workshops (e.g., \"African Drumming\") via Custom Special bookings.", label: "For You" },
    { text: "Parents: Award digital badges via the Badge System for practice milestones.", label: "For You" },
    { text: "Teachers: Create exams in the Quiz Builder with timed sections.", label: "For You" },
    { text: "Practice West African polyrhythms using the Rhythm Modules in Practice Tools.", label: "For You" },
    { text: "Bookmark tutorials in Library Playlists for quick access.", label: "For You" },
    { text: "Adjust playback volume mid-practice via the Mini Player slider.", label: "For You" },
    { text: "Rest your eyes during score study—toggle Dark Mode under Settings.", label: "For You" },
    { text: "Share achievement badges to Instagram via the Social Media export.", label: "For You" },
    { text: "Revisit completed lessons in the Viewing History tab.", label: "For You" },
    { text: "Isolate tough passages with the Loop Feature in Practice Tools.", label: "For You" },
    { text: "Parents: Approve content visibility for children in Parent Dashboard settings.", label: "For You" },
    { text: "Teachers: View class-wide progress heatmaps in the Admin Panel.", label: "For You" },
    { text: "Book holiday workshops (e.g., \"Christmas Carols\") via Custom Special.", label: "For You" }
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
