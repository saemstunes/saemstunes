import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X, RotateCcw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

// Chord theory definitions
interface ChordDefinition {
  name: string;
  intervals: number[]; // Semitone intervals from root
  symbol: string;
}

const CHORD_THEORY: ChordDefinition[] = [
  // Triads
  { name: "Major", intervals: [0, 4, 7], symbol: "" },
  { name: "Minor", intervals: [0, 3, 7], symbol: "m" },
  { name: "Diminished", intervals: [0, 3, 6], symbol: "°" },
  { name: "Augmented", intervals: [0, 4, 8], symbol: "+" },
  
  // Seventh chords
  { name: "Major 7th", intervals: [0, 4, 7, 11], symbol: "maj7" },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10], symbol: "7" },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], symbol: "m7" },
  { name: "Minor 7th Flat 5", intervals: [0, 3, 6, 10], symbol: "m7b5" },
  { name: "Diminished 7th", intervals: [0, 3, 6, 9], symbol: "°7" },
  
  // Suspended chords
  { name: "Suspended 2nd", intervals: [0, 2, 7], symbol: "sus2" },
  { name: "Suspended 4th", intervals: [0, 5, 7], symbol: "sus4" },
  
  // Extended chords
  { name: "Dominant 9th", intervals: [0, 4, 7, 10, 14], symbol: "9" },
  { name: "Major 9th", intervals: [0, 4, 7, 11, 14], symbol: "maj9" },
  { name: "Minor 9th", intervals: [0, 3, 7, 10, 14], symbol: "m9" },
  
  // Add chords
  { name: "Add 9", intervals: [0, 4, 7, 14], symbol: "add9" },
];

// Helper to convert semitone to note name
const getNoteName = (semitone: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[semitone % 12];
};

// Chord detection function
const detectChord = (frequencies: number[]): string => {
  if (frequencies.length < 3) return "Not a chord";
  
  // Convert frequencies to semitones from A4 (440Hz)
  const semitones = frequencies.map(freq => {
    return Math.round(12 * Math.log2(freq / 440) + 69);
  });
  
  // Normalize to C octave
  const normalized = semitones.map(s => s % 12).sort((a, b) => a - b);
  
  // Remove duplicates
  const uniqueNotes = [...new Set(normalized)];
  
  // Check against chord definitions
  for (const chord of CHORD_THEORY) {
    for (let i = 0; i < uniqueNotes.length; i++) {
      const root = uniqueNotes[i];
      const chordNotes = chord.intervals.map(interval => (root + interval) % 12).sort();
      
      // Check if current notes match chord intervals
      const isMatch = chordNotes.every(note => uniqueNotes.includes(note));
      
      if (isMatch) {
        const rootNote = getNoteName(root);
        return `${rootNote}${chord.symbol}`;
      }
    }
  }
  
  return "Unknown chord";
};

interface GuitarString {
  note: string;
  openFreq: number;
  frets: { note: string; frequency: number }[];
}

interface Chord {
  name: string;
  positions: { string: number; fret: number }[];
}

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  compressor: DynamicsCompressorNode | null;
  reverb: ConvolverNode | null;
}

const InteractiveGuitar: React.FC = () => {
  // State management
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [showDemoTip, setShowDemoTip] = useState(true);
  const [tempo, setTempo] = useState(80);
  const [waveform, setWaveform] = useState<OscillatorType>('sawtooth');
  const [isTouch, setIsTouch] = useState(false);
  const [strumDirection, setStrumDirection] = useState<'down' | 'up' | null>(null);
  const [showPick, setShowPick] = useState(false);
  const [pickPosition, setPickPosition] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const [heldChord, setHeldChord] = useState<number | null>(null);
  const [currentChordName, setCurrentChordName] = useState("");
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null,
    compressor: null,
    reverb: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const demoTimeouts = useRef<NodeJS.Timeout[]>([]);
  const activeNoteKeysByString = useRef<Map<number, string>>(new Map());
  const guitarRef = useRef<HTMLDivElement>(null);

  // Chord definitions - Fixed to match string order (E=0, A=1, D=2, G=3, B=4, E=5)
  const chords: Chord[] = [
    {
      name: "G",
      positions: [
        { string: 0, fret: 3 }, // Low E, 3rd fret
        { string: 1, fret: 2 }, // A, 2nd fret  
        { string: 5, fret: 3 }  // High E, 3rd fret
      ]
    },
    {
      name: "C", 
      positions: [
        { string: 1, fret: 3 }, // A, 3rd fret
        { string: 2, fret: 2 }, // D, 2nd fret
        { string: 4, fret: 1 }  // B, 1st fret
      ]
    },
    {
      name: "D",
      positions: [
        { string: 1, fret: 2 }, // A, 2nd fret
        { string: 2, fret: 2 }, // D, 2nd fret 
        { string: 3, fret: 3 }, // G, 3rd fret
        { string: 4, fret: 3 }  // B, 3rd fret
      ]
    },
    {
      name: "Em",
      positions: [
        { string: 1, fret: 2 }, // A, 2nd fret
        { string: 2, fret: 2 }  // D, 2nd fret
      ]
    },
    {
      name: "Am",
      positions: [
        { string: 1, fret: 2 }, // A, 2nd fret
        { string: 2, fret: 2 }, // D, 2nd fret
        { string: 3, fret: 2 }  // G, 2nd fret
      ]
    },
    {
      name: "F",
      positions: [
        { string: 0, fret: 1 }, // Low E, 1st fret
        { string: 1, fret: 1 }, // A, 1st fret
        { string: 2, fret: 3 }, // D, 3rd fret
        { string: 3, fret: 3 }, // G, 3rd fret
        { string: 4, fret: 2 }, // B, 2nd fret
        { string: 5, fret: 1 }  // High E, 1st fret
      ]
    }
  ];

  // Calculate accurate fret positions using logarithmic scale (25.4" scale length)
  const calculateFretPositions = (numFrets: number = 13) => {
    const scaleLength = 25.4; // Standard scale length in inches
    const positions: number[] = [0];
    
    for (let i = 1; i <= numFrets; i++) {
      const distance = scaleLength - (scaleLength / Math.pow(2, i / 12));
      positions.push(distance / scaleLength); // Normalize to 0-1 range
    }
    return positions;
  };

  const fretPositions = calculateFretPositions(13);

  // Generate frets with accurate note calculation
  const generateFrets = (baseFreq: number, count: number = 13) => {
    return Array.from({ length: count }, (_, i) => {
      const freq = baseFreq * Math.pow(2, i / 12);
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let noteIndex;
      
      // Calculate correct note based on string and fret
      if (baseFreq === 82.41) noteIndex = (4 + i) % 12; // Low E
      else if (baseFreq === 110.00) noteIndex = (9 + i) % 12; // A
      else if (baseFreq === 146.83) noteIndex = (2 + i) % 12; // D
      else if (baseFreq === 196.00) noteIndex = (7 + i) % 12; // G
      else if (baseFreq === 246.94) noteIndex = (11 + i) % 12; // B
      else if (baseFreq === 329.63) noteIndex = (4 + i) % 12; // High E
      else noteIndex = 0;
      
      return { note: notes[noteIndex], frequency: freq };
    });
  };

  // Guitar strings with standard tuning (thickest to thinnest)
  const strings: GuitarString[] = [
    { note: 'E', openFreq: 82.41, frets: generateFrets(82.41) },   // Low E (6th string) - THICKEST
    { note: 'A', openFreq: 110.00, frets: generateFrets(110.00) }, // A (5th string)
    { note: 'D', openFreq: 146.83, frets: generateFrets(146.83) }, // D (4th string)
    { note: 'G', openFreq: 196.00, frets: generateFrets(196.00) }, // G (3rd string)
    { note: 'B', openFreq: 246.94, frets: generateFrets(246.94) }, // B (2nd string)
    { note: 'E', openFreq: 329.63, frets: generateFrets(329.63) }  // High E (1st string) - THINNEST
  ];

  // Swipe handlers for strumming
  const swipeHandlers = useSwipeable({
    onSwipedDown: (eventData) => handleStrum('down', eventData),
    onSwipedUp: (eventData) => handleStrum('up', eventData),
    delta: 20,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
  });

  // Enhanced audio initialization
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        const compressor = context.createDynamicsCompressor();
        
        const reverb = context.createConvolver();
        const reverbGain = context.createGain();
        
        const impulseLength = context.sampleRate * 2;
        const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
          const channelData = impulse.getChannelData(channel);
          for (let i = 0; i < impulseLength; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
          }
        }
        reverb.buffer = impulse;
        
        gainNode.connect(compressor);
        compressor.connect(reverbGain);
        reverbGain.connect(reverb);
        reverb.connect(context.destination);
        compressor.connect(context.destination);
        
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        reverbGain.gain.setValueAtTime(0.3, context.currentTime);
        
        audioState.current = { context, gainNode, compressor, reverb };
        
        const resumeAudio = async () => {
          if (context.state === 'suspended') {
            await context.resume();
          }
          setAudioReady(true);
        };

        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('touchstart', resumeAudio, { once: true });
      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    };
    
    initAudio();
    setIsTouch('ontouchstart' in window);
    
    return () => {
      if (audioState.current.context) {
        audioState.current.context.close();
      }
      demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Volume and mute handling
  useEffect(() => {
    if (audioState.current.gainNode) {
      audioState.current.gainNode.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Stop all notes
  const stopAllNotes = useCallback(() => {
    oscillators.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        console.warn('Error stopping oscillator:', e);
      }
    });
    oscillators.current.clear();
    setActiveNotes(new Set());
    activeNoteKeysByString.current.clear();
    setHeldChord(null);
    setCurrentChordName("");
  }, []);

  // Reset handler for guitar
  useEffect(() => {
    const resetHandler = () => {
      stopAllNotes();
      setIsPlayingDemo(false);
      setActiveNotes(new Set());
      setCurrentChordIndex(-1);
    };
    
    window.addEventListener('reset-guitar', resetHandler);
    return () => {
      window.removeEventListener('reset-guitar', resetHandler);
    };
  }, [stopAllNotes]);

  // Detect chord when active notes change
  useEffect(() => {
    const activeFrequencies: number[] = [];
    
    activeNoteKeysByString.current.forEach((noteKey, stringIndex) => {
      const fretIndex = parseInt(noteKey.split('-')[1]);
      const frequency = strings[stringIndex].frets[fretIndex].frequency;
      activeFrequencies.push(frequency);
    });
    
    if (activeFrequencies.length > 0) {
      const chord = detectChord(activeFrequencies);
      setCurrentChordName(chord);
    } else {
      setCurrentChordName("");
    }
  }, [activeNotes]);

  // Enhanced strum function
  const handleStrum = async (direction: 'up' | 'down', eventData?: any) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    setStrumDirection(direction);
    setShowPick(true);
    
    // Calculate pick position based on swipe
    if (eventData && guitarRef.current) {
      const rect = guitarRef.current.getBoundingClientRect();
      const relativeY = eventData.event.touches ? 
        eventData.event.touches[0].clientY - rect.top :
        eventData.event.clientY - rect.top;
      setPickPosition(relativeY / rect.height);
    }

    // Get currently held frets
    const heldFrets = new Map<number, number>();
    activeNoteKeysByString.current.forEach((noteKey, stringIndex) => {
      const fretIndex = parseInt(noteKey.split('-')[1]);
      heldFrets.set(stringIndex, fretIndex);
    });

    // Strum timing - slight delay between strings for realism
    const strumDelay = direction === 'down' ? 30 : 25;
    const stringOrder = direction === 'down' ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];

    stringOrder.forEach((stringIndex, i) => {
      setTimeout(() => {
        const fretIndex = heldFrets.get(stringIndex) || 0;
        const frequency = strings[stringIndex].frets[fretIndex].frequency;
        playStrummedNote(frequency, stringIndex, fretIndex, direction);
      }, i * strumDelay);
    });

    // Add haptic feedback for mobile
    if (navigator.vibrate && isTouch) {
      navigator.vibrate(direction === 'down' ? 50 : 30);
    }

    // Hide pick animation after strum
    setTimeout(() => {
      setShowPick(false);
      setStrumDirection(null);
    }, 300);
  };

  // Play strummed note with enhanced realism
  const playStrummedNote = async (frequency: number, stringIndex: number, fretIndex: number, direction: 'up' | 'down') => {
    if (!audioState.current.context || !audioState.current.gainNode) return;

    try {
      const { context, gainNode } = audioState.current;
      const noteKey = `strum-${stringIndex}-${fretIndex}-${Date.now()}`;
      
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      // Different filter characteristics for up vs down strokes
      filter.type = 'lowpass';
      const baseFreq = direction === 'down' ? 2500 : 3000;
      filter.frequency.setValueAtTime(baseFreq + (frequency * 1.5), context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400 + frequency, context.currentTime + 1.2);
      
      // Strum-specific envelope
      const now = context.currentTime;
      const attackTime = direction === 'down' ? 0.003 : 0.002;
      const decayTime = 0.8;
      const sustainLevel = 0.15;
      const releaseTime = 1.2;
      
      const peakVolume = direction === 'down' ? volume * 0.9 : volume * 0.7;
      
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(peakVolume, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(peakVolume * sustainLevel, now + attackTime + decayTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);
      
      oscillator.start(now);
      oscillator.stop(now + attackTime + decayTime + releaseTime);
      
      // Visual feedback
      setActiveNotes(prev => new Set(prev).add(noteKey));
      
      setTimeout(() => {
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
      }, (attackTime + decayTime + releaseTime) * 1000);
      
    } catch (error) {
      console.error('Strummed note playback failed:', error);
    }
  };

  // Individual note playing (for fret tapping)
  const playNote = useCallback(async (frequency: number, stringIndex: number, fretIndex: number) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    try {
      if (audioState.current.context.state === 'suspended') {
        await audioState.current.context.resume();
        setAudioReady(true);
      }

      const { context, gainNode } = audioState.current;
      const noteKey = `${stringIndex}-${fretIndex}`;
      
      const existingKey = activeNoteKeysByString.current.get(stringIndex);
      if (existingKey) {
        const existingOsc = oscillators.current.get(existingKey);
        if (existingOsc) {
          existingOsc.stop();
          oscillators.current.delete(existingKey);
        }
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(existingKey);
          return newSet;
        });
      }

      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000 + (frequency * 2), context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500 + frequency, context.currentTime + 1.5);
      
      const now = context.currentTime;
      const attackTime = 0.005;
      const decayTime = 0.5;
      const sustainLevel = 0.2;
      const releaseTime = 1.5;
      
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volume * 0.8, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(volume * sustainLevel, now + attackTime + decayTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);
      
      oscillator.start(now);
      oscillator.stop(now + attackTime + decayTime + releaseTime);
      
      oscillators.current.set(noteKey, oscillator);
      activeNoteKeysByString.current.set(stringIndex, noteKey);
      
      setActiveNotes(prev => new Set(prev).add(noteKey));
      
      setTimeout(() => {
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
        oscillators.current.delete(noteKey);
        if (activeNoteKeysByString.current.get(stringIndex) === noteKey) {
          activeNoteKeysByString.current.delete(stringIndex);
        }
      }, (attackTime + decayTime + releaseTime) * 1000);
      
    } catch (error) {
      console.error('Note playback failed:', error);
    }
  }, [volume, isMuted, waveform]);

  // Play chord progressions with cancellation support
  const playDemo = useCallback(async () => {
    if (isPlayingDemo) {
      setIsPlayingDemo(false);
      demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
      demoTimeouts.current = [];
      stopAllNotes();
      setCurrentChordIndex(-1);
      return;
    }

    setIsPlayingDemo(true);
    setShowDemoTip(false);
    stopAllNotes();
    setCurrentChordIndex(0);

    const playChord = async (chordIndex: number) => {
      if (!isPlayingDemo) return;
      
      const chord = chords[chordIndex];
      setCurrentChordIndex(chordIndex);
      
      // Press chord positions
      chord.positions.forEach(({ string, fret }) => {
        const noteKey = `${string}-${fret}`;
        activeNoteKeysByString.current.set(string, noteKey);
        setActiveNotes(prev => new Set(prev).add(noteKey));
      });

      // Strum the chord
      for (let i = 0; i < chord.positions.length; i++) {
        demoTimeouts.current.push(setTimeout(() => {
          if (!isPlayingDemo) return;
          const { string, fret } = chord.positions[i];
          const freq = strings[string].frets[fret].frequency;
          playNote(freq, string, fret);
        }, i * 80));
      }
      
      demoTimeouts.current.push(setTimeout(() => {
        // Release chord after playing
        chord.positions.forEach(({ string }) => {
          activeNoteKeysByString.current.delete(string);
        });
        
        playChord((chordIndex + 1) % chords.length);
      }, (chord.positions.length * 80) + (60000 / tempo)));
    };

    playChord(0);
  }, [playNote, isPlayingDemo, stopAllNotes, strings, tempo]);

  // Apply chord to the guitar
  const applyChord = useCallback((chordIndex: number) => {
    stopAllNotes();
    setHeldChord(chordIndex);
    
    const chord = chords[chordIndex];
    
    // Clear existing chord positions
    activeNoteKeysByString.current.clear();
    
    // Apply new chord positions
    chord.positions.forEach(({ string, fret }) => {
      const noteKey = `${string}-${fret}`;
      activeNoteKeysByString.current.set(string, noteKey);
      setActiveNotes(prev => new Set(prev).add(noteKey));
    });
  }, [stopAllNotes]);

  // Check if a fret is part of a chord
  const isChordFret = (stringIndex: number, fretIndex: number) => {
    if (heldChord === null) return false;
    return chords[heldChord].positions.some(pos => 
      pos.string === stringIndex && pos.fret === fretIndex
    );
  };

  // Play current chord
  const playCurrentChord = () => {
    const activeFrequencies: number[] = [];
    
    activeNoteKeysByString.current.forEach((noteKey, stringIndex) => {
      const fretIndex = parseInt(noteKey.split('-')[1]);
      const frequency = strings[stringIndex].frets[fretIndex].frequency;
      activeFrequencies.push(frequency);
    });
    
    if (activeFrequencies.length > 0) {
      // Play all notes simultaneously with slight delay for strum effect
      activeFrequencies.forEach((freq, i) => {
        setTimeout(() => {
          // We need to find which string this frequency belongs to
          for (let s = 0; s < strings.length; s++) {
            const fretIndex = strings[s].frets.findIndex(f => Math.abs(f.frequency - freq) < 0.1);
            if (fretIndex !== -1) {
              playNote(freq, s, fretIndex);
              return;
            }
          }
        }, i * 30);
      });
    }
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl mx-auto p-4 sm:p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      ref={guitarRef}
      {...swipeHandlers}
    >
      {/* Background wood grain texture */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               rgba(139, 69, 19, 0.3) 0px,
               rgba(160, 82, 45, 0.2) 2px,
               rgba(139, 69, 19, 0.3) 4px
             )`
           }} />
      
      {/* Complete Guitar Layout */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 flex items-center overflow-hidden">
        
        {/* HEADSTOCK - Enhanced Design */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[15%] h-[70%] z-10">
          <div className="relative w-full h-full">
            {/* Headstock shape - more guitar-like */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 shadow-lg"
                 style={{
                   clipPath: 'polygon(0% 25%, 80% 20%, 95% 35%, 100% 50%, 95% 65%, 80% 80%, 0% 75%)'
                 }}>
              
              {/* Enhanced wood grain */}
              <div className="absolute inset-0 opacity-40"
                   style={{
                     backgroundImage: `repeating-linear-gradient(
                       0deg,
                       rgba(139, 69, 19, 0.5) 0px,
                       rgba(160, 82, 45, 0.3) 1px,
                       rgba(139, 69, 19, 0.5) 2px
                     )`
                   }} />
              
              {/* Headstock logo area */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gradient-to-br from-amber-800 to-amber-900 rounded-sm opacity-60"></div>
            </div>
            
            {/* Enhanced tuning pegs in 3+3 configuration */}
            <div className="absolute inset-0">
              {/* Top tuning pegs */}
              <div className="absolute top-6 left-3 flex flex-col gap-3">
                {[5, 4, 3].map((stringIndex) => (
                  <div key={`top-${stringIndex}`} className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-md relative">
                      <div className="absolute inset-0.5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
                    </div>
                    <div className="w-5 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 ml-1 rounded"></div>
                  </div>
                ))}
              </div>
              
              {/* Bottom tuning pegs */}
              <div className="absolute bottom-6 left-3 flex flex-col gap-3">
                {[2, 1, 0].map((stringIndex) => (
                  <div key={`bottom-${stringIndex}`} className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-md relative">
                      <div className="absolute inset-0.5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
                    </div>
                    <div className="w-5 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 ml-1 rounded"></div>
                  </div>
                ))}
              </div>
              
              {/* String notes display - reversed order (thickest at top) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 text-xs font-bold text-amber-200">
                {strings.slice().reverse().map((string, i) => (
                  <span key={i} className="text-center leading-none">{string.note}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NECK & FRETBOARD - Ends at sound hole */}
        <div className="absolute left-[12%] top-1/2 -translate-y-1/2 w-[50%] h-[65%] z-20">
          {/* Neck back */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 shadow-lg rounded-lg">
            {/* Enhanced wood grain */}
            <div className="absolute inset-0 opacity-30 rounded-lg"
                 style={{
                   backgroundImage: `repeating-linear-gradient(
                     0deg,
                     rgba(139, 69, 19, 0.4) 0px,
                     rgba(160, 82, 45, 0.2) 2px,
                     rgba(139, 69, 19, 0.4) 4px
                   )`
                 }} />
          </div>
          
          {/* Fretboard - dark ebony overlay */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-inner rounded-lg">
            {/* Binding - cream colored */}
            <div className="absolute inset-0 border-2 border-amber-100 rounded-lg"></div>
            
            {/* Nut - bone colored */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-100 via-white to-gray-100 z-30 rounded-l-lg shadow-sm"></div>
            
            {/* Fret wires with accurate logarithmic positioning */}
            {fretPositions.slice(1, 15).map((position, i) => (
              <div
                key={i + 1}
                className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 z-10 shadow-sm"
                style={{ left: `${position * 100}%` }}
              />
            ))}
            
            {/* Fret markers - mother of pearl inlays */}
            <div className="absolute inset-0 z-5" style={{ pointerEvents: 'none' }}>
              {[3, 5, 7, 9, 12].map(fret => {
                if (fret >= 15) return null;
                const position = fretPositions[fret];
                const nextPosition = fretPositions[fret + 1] || 1;
                const centerPosition = (position + nextPosition) / 2;
                return (
                  <div 
                    key={fret} 
                    className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: `${centerPosition * 100}%` }}
                  >
                    {fret === 12 ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-md border border-gray-300"></div>
                        <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-md border border-gray-300"></div>
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-md border border-gray-300"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Strings - CORRECTED ORDER (thickest at top) */}
            <div className="absolute inset-0 flex flex-col justify-evenly py-1">
              {strings.map((string, stringIndex) => {
                const isThick = stringIndex < 3;
                const stringHeight = isThick ? '2px' : '1.5px';
                const blurSize = isThick ? 4 : 2;
                const glowColor = isThick
                  ? 'rgba(139,69,19,0.8)'
                  : 'rgba(192,192,192,0.8)';

                return (
                  <motion.div
                    key={stringIndex}
                    className="relative flex items-center h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stringIndex * 0.05 }}
                  >
                    {/* String line - varying thickness with matching glow */}
                    <div 
                      className="absolute w-full transition-all duration-200 rounded-full"
                      style={{ 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        height: stringHeight,
                        background: `linear-gradient(to right, ${
                          isThick ? '#8B4513, #CD853F, #D2691E' : '#C0C0C0, #E0E0E0, #F5F5F5'
                        })`,
                        boxShadow: activeNoteKeysByString.current.has(stringIndex) 
                          ? `0 0 ${blurSize}px ${glowColor}`
                          : '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    />
                    
                    {/* Interactive fret areas */}
                    <div className="relative w-full h-full flex">
                      {string.frets.slice(0, 14).map((fret, fretIndex) => {
                        const isActive = activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}` || 
                                      isChordFret(stringIndex, fretIndex);
                        const leftPosition = fretIndex === 0 ? '0%' : `${fretPositions[fretIndex] * 100}%`;
                        const width = fretIndex === 0 ? `${fretPositions[1] * 100}%` : 
                                    fretIndex < 13 ? `${(fretPositions[fretIndex + 1] - fretPositions[fretIndex]) * 100}%` : 
                                    `${(1 - fretPositions[fretIndex]) * 100}%`;
                        
                        return (
                          <button
                            key={fretIndex}
                            className={`absolute h-full border-r border-amber-600/20 flex items-center justify-center transition-all duration-200 z-20 rounded-sm ${
                              isActive
                                ? 'bg-yellow-400/50 shadow-lg scale-105 border-yellow-500/50'
                                : 'hover:bg-amber-600/20 hover:shadow-md'
                            }`}
                            style={{ 
                              left: leftPosition,
                              width: width
                            }}
                            onClick={() => playNote(fret.frequency, stringIndex, fretIndex)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {fretIndex === 0 && (
                              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md border-2 ${
                                isChordFret(stringIndex, fretIndex) 
                                  ? 'bg-yellow-400 border-yellow-500 shadow-yellow-500/50' 
                                  : 'bg-amber-600 border-amber-500'
                              }`} />
                            )}
                            {fretIndex > 0 && (
                              <motion.div
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 shadow-sm ${
                                  isActive
                                    ? 'bg-yellow-400 border-yellow-500 shadow-yellow-500/50' 
                                    : 'bg-transparent border-white/30'
                                }`}
                                initial={{ scale: 0 }}
                                animate={{ scale: isActive ? 1.2 : 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* STRINGS SPANNING FROM NECK TO BRIDGE */}
        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-[35%] h-[25%] pointer-events-none z-15">
          <div className="absolute inset-0 flex flex-col justify-evenly">
            {strings.map((string, stringIndex) => {
              const isThick = stringIndex < 3;
              const stringHeight = isThick ? '2px' : '1.5px';
              const blurSize = isThick ? 4 : 2;
              const glowColor = isThick
                ? 'rgba(139,69,19,0.8)'
                : 'rgba(192,192,192,0.8)';

              return (
                <div 
                  key={`span-${stringIndex}`}
                  className="w-full transition-all duration-200 rounded-full"
                  style={{ 
                    height: stringHeight,
                    background: `linear-gradient(to right, ${
                      isThick ? '#8B4513, #CD853F, #D2691E' : '#C0C0C0, #E0E0E0, #F5F5F5'
                    })`,
                    boxShadow: activeNoteKeysByString.current.has(stringIndex) 
                      ? `0 0 ${blurSize}px ${glowColor}`
                      : '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* GUITAR BODY - Enhanced Design */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-full">
          {/* Guitar body with enhanced figure-8 shape */}
          <div className="relative w-full h-full">
            {/* Upper bout */}
            <div className="absolute top-0 left-0 w-full h-[42%] bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 rounded-t-full shadow-lg border-2 border-amber-600/40">
              <div className="absolute inset-0 opacity-25 rounded-t-full"
                   style={{
                     backgroundImage: `repeating-linear-gradient(
                       45deg,
                       rgba(139, 69, 19, 0.4) 0px,
                       rgba(160, 82, 45, 0.3) 2px,
                       rgba(139, 69, 19, 0.4) 4px
                     )`
                   }} />
            </div>
            
            {/* Waist - natural connection point */}
            <div className="absolute top-[38%] left-[8%] w-[84%] h-[24%] bg-gradient-to-r from-amber-500 to-amber-600 shadow-inner border-y-2 border-amber-600/40"></div>
            
            {/* Lower bout */}
            <div className="absolute bottom-0 left-0 w-full h-[42%] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-b-full shadow-lg border-2 border-amber-600/40">
              <div className="absolute inset-0 opacity-25 rounded-b-full"
                   style={{
                     backgroundImage: `repeating-linear-gradient(
                       45deg,
                       rgba(139, 69, 19, 0.4) 0px,
                       rgba(160, 82, 45, 0.3) 2px,
                       rgba(139, 69, 19, 0.4) 4px
                     )`
                   }} />
            </div>
            
            {/* Enhanced Sound hole */}
            <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black shadow-inner relative border-4 border-amber-700">
                {/* Rosette rings - more detailed */}
                <div className="absolute inset-1 rounded-full border-2 border-amber-500"></div>
                <div className="absolute inset-2 rounded-full border border-amber-400"></div>
                <div className="absolute inset-3 rounded-full border border-amber-300"></div>
                <div className="absolute inset-4 rounded-full border border-amber-200"></div>
                <div className="absolute inset-5 rounded-full border border-amber-100"></div>
                
                {/* Inner pattern */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-900 to-black opacity-80"></div>
                
                {/* Decorative dots around rosette */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-32px)`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Enhanced Bridge */}
            <div className="absolute bottom-[30%] left-[30%] -translate-x-1/2 w-20 h-3 bg-gradient-to-b from-amber-700 to-amber-900 rounded shadow-lg border border-amber-800">
              {/* Bridge pins - more detailed */}
              <div className="absolute top-0 left-0 w-full h-full flex justify-evenly items-center">
                {strings.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gradient-to-br from-white to-gray-200 rounded-full shadow-sm border border-gray-300"></div>
                ))}
              </div>
              {/* Saddle - bone colored */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-t shadow-sm"></div>
            </div>
            
            {/* Body binding */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-600/60 shadow-inner"></div>
            
            {/* Top bracing pattern (visible through finish) */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/3 left-1/4 w-12 h-0.5 bg-amber-900 rotate-45"></div>
              <div className="absolute top-1/3 right-1/4 w-12 h-0.5 bg-amber-900 -rotate-45"></div>
              <div className="absolute bottom-1/3 left-1/4 w-8 h-0.5 bg-amber-900 rotate-12"></div>
              <div className="absolute bottom-1/3 right-1/4 w-8 h-0.5 bg-amber-900 -rotate-12"></div>
            </div>
          </div>
        </div>

        {/* Pick animation */}
        <AnimatePresence>
          {showPick && (
            <motion.div
              className="absolute z-30 w-3 h-5 bg-gradient-to-b from-amber-100 to-amber-300 rounded-sm shadow-lg pointer-events-none border border-amber-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: strumDirection === 'down' ? 20 : -20,
                rotate: strumDirection === 'down' ? 15 : -15
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              style={{
                left: '75%',
                top: `${45 + pickPosition * 10}%`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Chord selection */}
      <div className="mt-4 flex justify-center flex-wrap gap-1 sm:gap-2">
        {chords.map((chord, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              heldChord === index 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                : 'bg-amber-700 text-amber-100 hover:bg-amber-600 shadow-md'
            }`}
            onClick={() => applyChord(index)}
          >
            {chord.name}
          </motion.button>
        ))}
      </div>

      {/* Current chord display */}
      {currentChordName && (
        <div className="text-center mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
          <span className="text-amber-100 font-medium">Current Chord:</span>
          <span className="ml-2 font-bold text-amber-300 text-xl">{currentChordName}</span>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
        <button
          onClick={playDemo}
          disabled={isMuted}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-lg ${
            isPlayingDemo 
              ? 'bg-gradient-to-r from-red-500/80 to-red-700/80 text-white'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white hover:from-amber-500/30 hover:to-orange-500/30'
          } ${isMuted ? 'opacity-50' : ''}`}
        >
          {isPlayingDemo ? (
            <>
              <Pause className="h-4 w-4" />
              Stop Demo
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Demo
            </>
          )}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 shadow-lg ${
            isMuted ? 'bg-red-500/20 text-red-300' : ''
          }`}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        
        <button
          onClick={stopAllNotes}
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 shadow-lg"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 shadow-lg ${showSettings ? 'bg-white/20' : ''}`}
        >
          <Settings className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 shadow-lg ${showInfo ? 'bg-white/20' : ''}`}
        >
          <Info className="h-5 w-5" />
        </button>

        {/* Play Chord Button */}
        <button
          onClick={playCurrentChord}
          disabled={currentChordName === "" || isMuted}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-lg ${
            currentChordName === "" || isMuted 
              ? 'opacity-50 bg-gray-600' 
              : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30'
          }`}
        >
          <Play className="h-4 w-4" />
          Play Chord
        </button>
      </div>

      {/* Demo tooltip */}
      <AnimatePresence>
        {showDemoTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 text-white text-sm font-medium inline-block"
          >
            <Zap className="inline w-4 h-4 mr-2" />
            {isTouch ? 'Tap frets to play • Swipe to strum' : 'Click frets to play • Drag to strum'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current chord indicator */}
      {currentChordIndex >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm border border-amber-500/30">
            <span>🎸 Playing:</span>
            <span className="font-bold">{chords[currentChordIndex].name}</span>
          </div>
        </motion.div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 mt-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Guitar Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Volume
                    </label>
                    <span className="text-amber-400 font-mono text-sm">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-white/10 rounded-lg"
                  />
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium">Tempo</label>
                    <span className="text-purple-400 font-mono text-sm">
                      {tempo} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    step="10"
                    value={tempo}
                    onChange={(e) => setTempo(parseInt(e.target.value))}
                    className="w-full accent-purple-500 bg-white/10 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-white font-medium block mb-3">Waveform</label>
                  <select
                    value={waveform}
                    onChange={(e) => setWaveform(e.target.value as OscillatorType)}
                    className="w-full bg-black/50 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="sawtooth">Sawtooth (Guitar-like)</option>
                    <option value="sine">Sine</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                  </select>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-white font-medium block mb-3">Tuning</label>
                  <div className="bg-black/50 text-white rounded-lg px-3 py-2 border border-white/20">
                    <span className="text-amber-400">Standard: E-A-D-G-B-E</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 mt-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Guitar Guide
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-amber-400 font-medium mb-2">Playing Guide</h4>
                <div className="space-y-1 text-white/80">
                  <div>• Click on frets to play notes</div>
                  <div>• Swipe vertically to strum strings</div>
                  <div>• Hold multiple frets to form chords</div>
                  <div>• Use chord buttons to apply common chords</div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-purple-400 font-medium mb-2">Chord Recognition</h4>
                <div className="space-y-1 text-white/80">
                  <div>• Recognizes major, minor, 7th chords</div>
                  <div>• Shows chord name above controls</div>
                  <div>• Play chord button strums all active notes</div>
                  <div>• Accurate fret positioning based on physics</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveGuitar;
