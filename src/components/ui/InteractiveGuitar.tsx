import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X, RotateCcw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

interface ChordDefinition {
  name: string;
  intervals: number[];
  symbol: string;
}

const CHORD_THEORY: ChordDefinition[] = [
  { name: "Major", intervals: [0, 4, 7], symbol: "" },
  { name: "Minor", intervals: [0, 3, 7], symbol: "m" },
  { name: "Diminished", intervals: [0, 3, 6], symbol: "°" },
  { name: "Augmented", intervals: [0, 4, 8], symbol: "+" },
  { name: "Major 7th", intervals: [0, 4, 7, 11], symbol: "maj7" },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10], symbol: "7" },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], symbol: "m7" },
  { name: "Minor 7th Flat 5", intervals: [0, 3, 6, 10], symbol: "m7b5" },
  { name: "Diminished 7th", intervals: [0, 3, 6, 9], symbol: "°7" },
  { name: "Suspended 2nd", intervals: [0, 2, 7], symbol: "sus2" },
  { name: "Suspended 4th", intervals: [0, 5, 7], symbol: "sus4" },
  { name: "Dominant 9th", intervals: [0, 4, 7, 10, 14], symbol: "9" },
  { name: "Major 9th", intervals: [0, 4, 7, 11, 14], symbol: "maj9" },
  { name: "Minor 9th", intervals: [0, 3, 7, 10, 14], symbol: "m9" },
  { name: "Add 9", intervals: [0, 4, 7, 14], symbol: "add9" },
];

const getNoteName = (semitone: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[semitone % 12];
};

const detectChord = (frequencies: number[]): string => {
  if (frequencies.length < 3) return "";
  
  const semitones = frequencies.map(freq => {
    return Math.round(12 * Math.log2(freq / 440) + 69);
  });
  
  const normalized = semitones.map(s => s % 12).sort((a, b) => a - b);
  const uniqueNotes = [...new Set(normalized)];
  
  for (const chord of CHORD_THEORY) {
    for (let i = 0; i < uniqueNotes.length; i++) {
      const root = uniqueNotes[i];
      const chordNotes = chord.intervals.map(interval => (root + interval) % 12).sort();
      
      const isMatch = chordNotes.every(note => uniqueNotes.includes(note));
      
      if (isMatch) {
        return `${getNoteName(root)}${chord.symbol}`;
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
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [showKeyguide, setShowKeyguide] = useState(false);
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

  const chords: Chord[] = [
    {
      name: "G Major",
      positions: [
        { string: 0, fret: 3 },
        { string: 1, fret: 2 },
        { string: 2, fret: 0 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 3 }
      ]
    },
    {
      name: "C Major",
      positions: [
        { string: 1, fret: 3 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 1 },
        { string: 5, fret: 0 }
      ]
    },
    {
      name: "D Major",
      positions: [
        { string: 0, fret: 2 },
        { string: 1, fret: 3 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 }
      ]
    },
    {
      name: "Em",
      positions: [
        { string: 0, fret: 0 },
        { string: 1, fret: 2 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ]
    }
  ];

  const calculateFretPositions = (scaleLength: number, numFrets: number) => {
    const positions: number[] = [0];
    for (let i = 1; i <= numFrets; i++) {
      positions.push(scaleLength * (1 - 1 / Math.pow(2, i / 12)));
    }
    return positions;
  };

  const FRETBOARD_SCALE_LENGTH = 0.8;
  const HEADSTOCK_WIDTH = 0.2;
  const fretPositions = calculateFretPositions(FRETBOARD_SCALE_LENGTH, 13);

  const generateFrets = (baseFreq: number, count: number = 13) => {
    return Array.from({ length: count }, (_, i) => {
      const freq = baseFreq * Math.pow(2, i / 12);
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteIndex = (i + 8) % 12;
      return { note: notes[noteIndex], frequency: freq };
    });
  };

  const strings: GuitarString[] = [
    { note: 'E', openFreq: 82.41, frets: generateFrets(82.41) },
    { note: 'A', openFreq: 110.00, frets: generateFrets(110.00) },
    { note: 'D', openFreq: 146.83, frets: generateFrets(146.83) },
    { note: 'G', openFreq: 196.00, frets: generateFrets(196.00) },
    { note: 'B', openFreq: 246.94, frets: generateFrets(246.94) },
    { note: 'E', openFreq: 329.63, frets: generateFrets(329.63) }
  ];

  const swipeHandlers = useSwipeable({
    onSwipedDown: (eventData) => handleStrum('down', eventData),
    onSwipedUp: (eventData) => handleStrum('up', eventData),
    delta: 20,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
  });

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

  useEffect(() => {
    if (audioState.current.gainNode) {
      audioState.current.gainNode.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  const handleStrum = async (direction: 'up' | 'down', eventData?: any) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    setStrumDirection(direction);
    setShowPick(true);
    
    if (eventData && guitarRef.current) {
      const rect = guitarRef.current.getBoundingClientRect();
      const relativeY = eventData.event.touches ? 
        eventData.event.touches[0].clientY - rect.top :
        eventData.event.clientY - rect.top;
      setPickPosition(relativeY / rect.height);
    }

    const heldFrets = new Map<number, number>();
    activeNoteKeysByString.current.forEach((noteKey, stringIndex) => {
      const fretIndex = parseInt(noteKey.split('-')[1]);
      heldFrets.set(stringIndex, fretIndex);
    });

    const strumDelay = direction === 'down' ? 30 : 25;
    const stringOrder = direction === 'down' ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];

    stringOrder.forEach((stringIndex, i) => {
      setTimeout(() => {
        const fretIndex = heldFrets.get(stringIndex) || 0;
        const frequency = strings[stringIndex].frets[fretIndex].frequency;
        playStrummedNote(frequency, stringIndex, fretIndex, direction);
      }, i * strumDelay);
    });

    if (navigator.vibrate && isTouch) {
      navigator.vibrate(direction === 'down' ? 50 : 30);
    }

    setTimeout(() => {
      setShowPick(false);
      setStrumDirection(null);
    }, 300);
  };

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
      
      filter.type = 'lowpass';
      const baseFreq = direction === 'down' ? 2500 : 3000;
      filter.frequency.setValueAtTime(baseFreq + (frequency * 1.5), context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400 + frequency, context.currentTime + 1.2);
      
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
      
      chord.positions.forEach(({ string, fret }) => {
        const noteKey = `${string}-${fret}`;
        activeNoteKeysByString.current.set(string, noteKey);
        setActiveNotes(prev => new Set(prev).add(noteKey));
      });

      for (let i = 0; i < chord.positions.length; i++) {
        demoTimeouts.current.push(setTimeout(() => {
          if (!isPlayingDemo) return;
          const { string, fret } = chord.positions[i];
          const freq = strings[string].frets[fret].frequency;
          playNote(freq, string, fret);
        }, i * 80));
      }
      
      demoTimeouts.current.push(setTimeout(() => {
        chord.positions.forEach(({ string }) => {
          activeNoteKeysByString.current.delete(string);
        });
        
        playChord((chordIndex + 1) % chords.length);
      }, (chord.positions.length * 80) + (60000 / tempo)));
    };

    playChord(0);
  }, [playNote, isPlayingDemo, stopAllNotes, strings, tempo]);

  const applyChord = (chordIndex: number) => {
    stopAllNotes();
    setHeldChord(chordIndex);
    
    const chord = chords[chordIndex];
    chord.positions.forEach(({ string, fret }) => {
      const noteKey = `${string}-${fret}`;
      activeNoteKeysByString.current.set(string, noteKey);
      setActiveNotes(prev => new Set(prev).add(noteKey));
    });
  };

  const isChordFret = (stringIndex: number, fretIndex: number) => {
    if (heldChord === null) return false;
    return chords[heldChord].positions.some(pos => 
      pos.string === stringIndex && pos.fret === fretIndex
    );
  };

  const playCurrentChord = () => {
    const activeFrequencies: number[] = [];
    
    activeNoteKeysByString.current.forEach((noteKey, stringIndex) => {
      const fretIndex = parseInt(noteKey.split('-')[1]);
      const frequency = strings[stringIndex].frets[fretIndex].frequency;
      activeFrequencies.push(frequency);
    });
    
    if (activeFrequencies.length > 0) {
      activeFrequencies.forEach((freq, i) => {
        setTimeout(() => {
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
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               rgba(139, 69, 19, 0.3) 0px,
               rgba(160, 82, 45, 0.2) 2px,
               rgba(139, 69, 19, 0.3) 4px
             )`
           }} />
      
      <div className="relative flex h-[500px]">
        <div className="w-1/5 relative flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-end pr-4 space-y-8 mt-8">
            {strings.map((string, i) => (
              <div 
                key={i}
                className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-amber-600"
              >
                {string.note}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center -ml-16">
            <div className="w-24 h-24 rounded-full bg-black border-4 border-amber-600 relative">
              <div className="absolute inset-3 rounded-full border-2 border-amber-400"></div>
              <div className="absolute inset-5 rounded-full border border-amber-300"></div>
              <div className="absolute -inset-4 rounded-full border-4 border-amber-500/20 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="w-4/5 relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-xl p-6 shadow-inner">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-ivory rounded-full z-20" />

          {fretPositions.map((position, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-300 opacity-60 z-10"
              style={{ 
                left: `${position * 100}%`,
                transform: 'translateX(-50%)' 
              }}
            />
          ))}

          <div className="relative h-full py-4">
            {strings.map((string, stringIndex) => (
              <motion.div
                key={stringIndex}
                className="absolute left-0 right-0 flex items-center"
                style={{ 
                  top: `${stringIndex * 16 + 12}px`,
                  height: '2px'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stringIndex * 0.1 }}
              >
                <div 
                  className={`absolute left-0 right-0 h-full transition-all duration-200 ${
                    stringIndex < 3 ? 'h-1' : 'h-0.5'
                  }`}
                  style={{ 
                    background: `linear-gradient(to right, ${
                      stringIndex < 3 
                        ? '#8B4513, #A0522D'
                        : '#C0C0C0, #E0E0E0'
                    })`,
                    boxShadow: activeNoteKeysByString.current.has(stringIndex) ? 
                      '0 0 8px rgba(255,215,0,0.8)' : 'none'
                  }}
                />
                
                {string.frets.slice(0, 13).map((fret, fretIndex) => (
                  <button
                    key={fretIndex}
                    className={`absolute w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                      activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}` || 
                      isChordFret(stringIndex, fretIndex)
                        ? 'bg-yellow-400/40 scale-110 shadow-lg'
                        : 'hover:bg-amber-600/20'
                    }`}
                    style={{
                      left: `${fretPositions[fretIndex] * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => playNote(fret.frequency, stringIndex, fretIndex)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {fretIndex === 0 ? (
                      <div className={`w-6 h-6 rounded-full shadow-md border ${
                        isChordFret(stringIndex, fretIndex) 
                          ? 'bg-yellow-400 border-yellow-500' 
                          : 'bg-amber-600 border-amber-500'
                      }`} />
                    ) : (
                      <motion.div
                        className={`w-4 h-4 rounded-full border ${
                          activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}` ||
                          isChordFret(stringIndex, fretIndex)
                            ? 'bg-yellow-400 border-yellow-500' 
                            : 'bg-transparent'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            ))}
          </div>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[3, 5, 7, 9, 12].map(fret => (
              <div 
                key={fret}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${fretPositions[fret] * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="w-3 h-3 bg-amber-200 rounded-full opacity-40 mb-1" />
                {fret === 12 && (
                  <>
                    <div className="w-3 h-3 bg-amber-200 rounded-full opacity-40 mb-1" />
                    <div className="w-3 h-3 bg-amber-200 rounded-full opacity-40" />
                  </>
                )}
              </div>
            ))}
          </div>

          <div 
            className="absolute top-1/2 w-2 h-20 bg-amber-600 rounded-full shadow-lg"
            style={{
              left: `${FRETBOARD_SCALE_LENGTH * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      <div className="flex justify-center mb-4 space-x-2">
        {chords.map((chord, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              heldChord === index 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                : 'bg-amber-700 text-amber-100 hover:bg-amber-600'
            }`}
            onClick={() => applyChord(index)}
          >
            {chord.name}
          </motion.button>
        ))}
      </div>

      {currentChordName && (
        <div className="text-center mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3">
          <span className="text-amber-100 font-medium">Current Chord:</span>
          <span className="ml-2 font-bold text-amber-300 text-xl">{currentChordName}</span>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
        <button
          onClick={playDemo}
          disabled={isMuted}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
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
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${
            isMuted ? 'bg-red-500/20 text-red-300' : ''
          }`}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        
        <button
          onClick={stopAllNotes}
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${showSettings ? 'bg-white/20' : ''}`}
        >
          <Settings className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowKeyguide(!showKeyguide)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${showKeyguide ? 'bg-white/20' : ''}`}
        >
          <Info className="h-5 w-5" />
        </button>

        <button
          onClick={playCurrentChord}
          disabled={currentChordName === "" || isMuted}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
            currentChordName === "" || isMuted 
              ? 'opacity-50 bg-gray-600' 
              : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30'
          }`}
        >
          <Play className="h-4 w-4" />
          Play Chord
        </button>
      </div>

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

      <AnimatePresence>
        {showKeyguide && (
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
                onClick={() => setShowKeyguide(false)}
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
