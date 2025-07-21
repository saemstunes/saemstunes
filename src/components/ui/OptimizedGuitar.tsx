import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Settings, RotateCcw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

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
}

const OptimizedGuitar: React.FC = () => {
  // State management
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [waveform, setWaveform] = useState<OscillatorType>('sawtooth');
  const [strumDirection, setStrumDirection] = useState<'down' | 'up' | null>(null);
  const [showPick, setShowPick] = useState(false);
  const [heldChord, setHeldChord] = useState<number | null>(null);
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null,
    compressor: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const activeNoteKeysByString = useRef<Map<number, string>>(new Map());
  const guitarRef = useRef<HTMLDivElement>(null);

  // Chord definitions
  const chords: Chord[] = [
    {
      name: "G Major",
      positions: [
        { string: 0, fret: 3 },
        { string: 1, fret: 2 },
        { string: 5, fret: 3 }
      ]
    },
    {
      name: "C Major",
      positions: [
        { string: 1, fret: 3 },
        { string: 2, fret: 2 },
        { string: 4, fret: 1 }
      ]
    },
    {
      name: "D Major",
      positions: [
        { string: 0, fret: 2 },
        { string: 1, fret: 3 },
        { string: 2, fret: 2 }
      ]
    },
    {
      name: "Em",
      positions: [
        { string: 1, fret: 2 },
        { string: 2, fret: 2 }
      ]
    }
  ];

  // Calculate accurate fret positions using 12th root of 2 (logarithmic scale)
  const calculateFretPositions = (numFrets: number = 13) => {
    const positions: number[] = [0];
    for (let i = 1; i <= numFrets; i++) {
      // Standard guitar scale length ratio: position = 1 - (1 / 2^(fret/12))
      positions.push(1 - (1 / Math.pow(2, i / 12)));
    }
    return positions;
  };

  const fretPositions = calculateFretPositions(13);

  // Generate frets for each string
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

  // Guitar strings with standard tuning (E-A-D-G-B-E)
  const strings: GuitarString[] = [
    { note: 'E', openFreq: 82.41, frets: generateFrets(82.41) },
    { note: 'A', openFreq: 110.00, frets: generateFrets(110.00) },
    { note: 'D', openFreq: 146.83, frets: generateFrets(146.83) },
    { note: 'G', openFreq: 196.00, frets: generateFrets(196.00) },
    { note: 'B', openFreq: 246.94, frets: generateFrets(246.94) },
    { note: 'E', openFreq: 329.63, frets: generateFrets(329.63) }
  ];

  // Swipe handlers for strumming
  const swipeHandlers = useSwipeable({
    onSwipedDown: (eventData) => handleStrum('down', eventData),
    onSwipedUp: (eventData) => handleStrum('up', eventData),
    delta: 20,
    trackTouch: true,
    trackMouse: true,
  });

  // Audio initialization
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        const compressor = context.createDynamicsCompressor();
        
        gainNode.connect(compressor);
        compressor.connect(context.destination);
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        
        audioState.current = { context, gainNode, compressor };
        
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
    
    return () => {
      if (audioState.current.context) {
        audioState.current.context.close();
      }
    };
  }, []);

  // Volume control
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
  }, []);

  // Enhanced strum function
  const handleStrum = async (direction: 'up' | 'down', eventData?: any) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    setStrumDirection(direction);
    setShowPick(true);

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

    // Hide pick animation after strum
    setTimeout(() => {
      setShowPick(false);
      setStrumDirection(null);
    }, 300);
  };

  // Play strummed note
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
      
      // Stop existing note on this string
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

  // Apply chord to the guitar
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

  // Check if a fret is part of a chord
  const isChordFret = (stringIndex: number, fretIndex: number) => {
    if (heldChord === null) return false;
    return chords[heldChord].positions.some(pos => 
      pos.string === stringIndex && pos.fret === fretIndex
    );
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-none mx-auto p-4 sm:p-6"
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
      
      {/* Guitar body container - proper aspect ratio */}
      <div className="relative w-full aspect-[3/1] max-h-80">
        {/* Sound hole - positioned correctly on guitar body (right side) */}
        <div className="absolute top-1/2 right-[15%] transform -translate-y-1/2 z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black border-2 sm:border-4 border-amber-600 relative">
            <div className="absolute inset-1 sm:inset-2 rounded-full border border-amber-400"></div>
            <div className="absolute inset-2 sm:inset-3 rounded-full border border-amber-300"></div>
          </div>
        </div>

        {/* Pick animation */}
        <AnimatePresence>
          {showPick && (
            <motion.div
              className="absolute z-20 w-3 h-4 sm:w-4 sm:h-6 bg-amber-200 rounded-sm shadow-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: strumDirection === 'down' ? 15 : -15,
                y: '50%'
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{
                left: '70%',
                top: '50%',
                transform: `translateY(-50%) rotate(${strumDirection === 'down' ? 15 : -15}deg)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Chord selection */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 sm:gap-2 z-30">
          {chords.map((chord, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
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

        {/* Fretboard with accurate positioning - 60% width, centered */}
        <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2 w-[60%] h-[70%] bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-lg shadow-inner">
          {/* Nut */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-ivory rounded-l-lg z-20" />
          
          {/* Fret wires - positioned using logarithmic scale */}
          {fretPositions.slice(1).map((position, i) => (
            <div
              key={i + 1}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-300 opacity-60 z-10"
              style={{ left: `${position * 100}%` }}
            />
          ))}

          {/* Fret markers */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2 z-10">
            {[3, 5, 7, 9, 12].map(fret => {
              const position = fretPositions[fret];
              return (
                <div 
                  key={fret} 
                  className="absolute flex flex-col items-center"
                  style={{ left: `${position * 100}%` }}
                >
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-200 rounded-full opacity-40 mb-1" />
                  {fret === 12 && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-200 rounded-full opacity-40" />}
                </div>
              );
            })}
          </div>

          {/* Strings */}
          <div className="relative w-full h-full flex flex-col justify-evenly py-2">
            {strings.map((string, stringIndex) => (
              <motion.div
                key={stringIndex}
                className="relative flex items-center h-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stringIndex * 0.1 }}
              >
                {/* String line with realistic appearance */}
                <div 
                  className={`absolute w-full transition-all duration-200 ${
                    stringIndex < 3 ? 'h-1' : 'h-0.5'
                  }`}
                  style={{ 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(to right, ${
                      stringIndex < 3 
                        ? '#8B4513, #A0522D' // Wound strings (darker)
                        : '#C0C0C0, #E0E0E0'  // Plain strings (lighter)
                    })`,
                    boxShadow: activeNoteKeysByString.current.has(stringIndex) ? 
                      '0 0 8px rgba(255,215,0,0.8)' : 'none'
                  }}
                />
                
                {/* Tuning peg */}
                <div className="absolute -left-6 sm:-left-8 w-4 h-4 sm:w-6 sm:h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold z-30 shadow-md border border-amber-600">
                  {string.note}
                </div>
                
                {/* Frets positioned within logarithmic positions */}
                <div className="relative w-full h-full flex">
                  {string.frets.slice(0, 13).map((fret, fretIndex) => {
                    const isActive = activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}` || 
                                   isChordFret(stringIndex, fretIndex);
                    const leftPosition = fretIndex === 0 ? '0%' : `${fretPositions[fretIndex] * 100}%`;
                    const width = fretIndex === 0 ? `${fretPositions[1] * 100}%` : 
                                 fretIndex < 12 ? `${(fretPositions[fretIndex + 1] - fretPositions[fretIndex]) * 100}%` : 
                                 `${(1 - fretPositions[fretIndex]) * 100}%`;
                    
                    return (
                      <button
                        key={fretIndex}
                        className={`absolute h-full border-r border-amber-600/30 flex items-center justify-center transition-all duration-200 z-20 ${
                          isActive
                            ? 'bg-yellow-400/40 scale-110 shadow-lg'
                            : 'hover:bg-amber-600/20'
                        }`}
                        style={{ 
                          left: leftPosition,
                          width: width
                        }}
                        onClick={() => playNote(fret.frequency, stringIndex, fretIndex)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {fretIndex === 0 && (
                          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md border ${
                            isChordFret(stringIndex, fretIndex) 
                              ? 'bg-yellow-400 border-yellow-500' 
                              : 'bg-amber-600 border-amber-500'
                          }`} />
                        )}
                        {fretIndex > 0 && (
                          <motion.div
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border ${
                              isActive
                                ? 'bg-yellow-400 border-yellow-500' 
                                : 'bg-transparent'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bridge - positioned at bottom center */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-3 sm:w-10 sm:h-4 bg-amber-600 rounded shadow-lg z-10" />
      </div>

      {/* Control buttons */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 mt-4 flex-wrap">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${
            isMuted ? 'bg-red-500/20 text-red-300' : ''
          }`}
        >
          {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
        
        <button
          onClick={stopAllNotes}
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${showSettings ? 'bg-white/20' : ''}`}
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-4 mt-4 border border-white/10 shadow-2xl"
          >
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium text-sm">Volume</label>
                  <span className="text-amber-400 font-mono text-xs">
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
              
              <div className="bg-white/5 rounded-lg p-3">
                <label className="text-white font-medium block mb-2 text-sm">Waveform</label>
                <select
                  value={waveform}
                  onChange={(e) => setWaveform(e.target.value as OscillatorType)}
                  className="w-full bg-black/50 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-blue-400 focus:outline-none text-sm"
                >
                  <option value="sawtooth">Sawtooth (Guitar-like)</option>
                  <option value="sine">Sine</option>
                  <option value="square">Square</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OptimizedGuitar;
