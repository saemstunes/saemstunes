import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuitarString {
  note: string;
  openFreq: number;
  frets: { note: string; frequency: number }[];
}

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
}

const InteractiveGuitar: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const demoTimeout = useRef<NodeJS.Timeout | null>(null);
  const activeNoteKeysByString = useRef<Map<number, string>>(new Map());

  // Generate frets dynamically to reduce code duplication
  const generateFrets = (baseFreq: number, count: number = 13) => {
    return Array.from({ length: count }, (_, i) => {
      const freq = baseFreq * Math.pow(2, i / 12);
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteIndex = (i + notes.indexOf('C')) % 12;
      return { note: notes[noteIndex], frequency: freq };
    });
  };

  // Guitar strings with standard tuning (E A D G B E)
  const strings: GuitarString[] = [
    { note: 'E', openFreq: 82.41, frets: generateFrets(82.41) },
    { note: 'A', openFreq: 110.00, frets: generateFrets(110.00) },
    { note: 'D', openFreq: 146.83, frets: generateFrets(146.83) },
    { note: 'G', openFreq: 196.00, frets: generateFrets(196.00) },
    { note: 'B', openFreq: 246.94, frets: generateFrets(246.94) },
    { note: 'E', openFreq: 329.63, frets: generateFrets(329.63) }
  ];

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        
        audioState.current = { context, gainNode };
        
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
      if (demoTimeout.current) {
        clearTimeout(demoTimeout.current);
      }
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
  }, []);

  // Play guitar note with improved realism
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

      // Create oscillator for plucked string sound
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      // Improved guitar-like waveform
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      // Dynamic filtering for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000 + (frequency * 2), context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500 + frequency, context.currentTime + 1.5);
      
      // Realistic guitar envelope
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
      
      // Remove from active notes after release
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
  }, [volume, isMuted]);

  // Play chord progressions with cancellation support
  const playDemo = useCallback(async () => {
    if (isPlayingDemo) {
      setIsPlayingDemo(false);
      if (demoTimeout.current) {
        clearTimeout(demoTimeout.current);
      }
      stopAllNotes();
      return;
    }

    setIsPlayingDemo(true);
    stopAllNotes();

    const chords = [
      // G Major chord
      [
        { string: 0, fret: 3 }, 
        { string: 1, fret: 2 }, 
        { string: 2, fret: 0 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 3 }
      ],
      // C Major chord
      [
        { string: 1, fret: 3 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 1 },
        { string: 5, fret: 0 }
      ],
      // D Major chord
      [
        { string: 0, fret: 2 },
        { string: 1, fret: 3 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 }
      ],
      // Em chord
      [
        { string: 0, fret: 0 },
        { string: 1, fret: 2 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ]
    ];

    const playChord = async (chordIndex: number) => {
      if (!isPlayingDemo) return;
      
      const chord = chords[chordIndex];
      stopAllNotes();
      
      // Strum the chord
      for (let i = 0; i < chord.length; i++) {
        setTimeout(() => {
          if (!isPlayingDemo) return;
          const { string, fret } = chord[i];
          const freq = strings[string].frets[fret].frequency;
          playNote(freq, string, fret);
        }, i * 60);
      }
      
      demoTimeout.current = setTimeout(() => {
        playChord((chordIndex + 1) % chords.length);
      }, 2500);
    };

    playChord(0);
  }, [playNote, isPlayingDemo, stopAllNotes, strings]);

  // Check if a string has active notes
  const isStringActive = (stringIndex: number) => {
    return Array.from(activeNotes).some(key => key.startsWith(`${stringIndex}-`));
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-6 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Wood grain effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-800/20 opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.1)_50%,transparent_100%)] opacity-30" />
      
      <div className="relative z-10">
        {/* Controls */}
        <motion.div 
          className="flex justify-center items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={playDemo}
            className="bg-amber-600/20 hover:bg-amber-600/30 text-white border border-amber-400/30 backdrop-blur-sm"
            size="sm"
          >
            {isPlayingDemo ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isPlayingDemo ? 'Stop Demo' : 'Play Demo'}
          </Button>
          
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="sm"
            className={`text-white/80 hover:text-white ${isMuted ? 'bg-red-500/20' : ''}`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={stopAllNotes}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-amber-900/90 backdrop-blur-sm z-20 p-4 rounded-2xl flex flex-col justify-center items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-amber-200 text-xl font-bold">Settings</h3>
              <div className="w-64">
                <label className="text-amber-200 mb-2 block">Volume: {Math.round(volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (isMuted && newVolume > 0) {
                      setIsMuted(false);
                    }
                  }}
                  className="w-full accent-amber-500"
                />
              </div>
              <Button 
                onClick={() => setShowSettings(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Close Settings
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guitar Neck */}
        <div className="relative">
          {/* Fret markers */}
          <div className="absolute top-0 left-0 w-full h-full flex">
            {[3, 5, 7, 9, 12].map(fret => (
              <div
                key={fret}
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-amber-200 rounded-full opacity-30"
                style={{ left: `${(fret / 12) * 100}%` }}
              />
            ))}
          </div>

          {/* Strings */}
          <div className="space-y-3">
            {strings.map((string, stringIndex) => (
              <motion.div
                key={stringIndex}
                className="relative flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stringIndex * 0.1 }}
              >
                {/* String line with vibration effect */}
                <div 
                  className={`absolute w-full h-0.5 bg-gradient-to-r transition-all duration-300 ${
                    isStringActive(stringIndex) 
                      ? 'from-yellow-300 to-amber-300 shadow-[0_0_8px_rgba(255,215,0,0.8)]' 
                      : 'from-gray-400 to-gray-300'
                  } ${stringIndex < 3 ? 'h-1' : 'h-0.5'}`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                
                {/* String label */}
                <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2 relative z-10">
                  {string.note}
                </div>
                
                {/* Frets */}
                <div className="flex-1 flex relative z-10">
                  {string.frets.slice(0, 13).map((fret, fretIndex) => (
                    <button
                      key={fretIndex}
                      className={`flex-1 h-8 border-r border-amber-600/30 flex items-center justify-center transition-all duration-200 ${
                        activeNotes.has(`${stringIndex}-${fretIndex}`)
                          ? 'bg-yellow-400/40 scale-110 shadow-lg'
                          : 'hover:bg-amber-600/20'
                      }`}
                      onClick={() => playNote(fret.frequency, stringIndex, fretIndex)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {fretIndex === 0 && (
                        <div className="w-4 h-4 bg-amber-600 rounded-full shadow-md" />
                      )}
                      {fretIndex > 0 && activeNotes.has(`${stringIndex}-${fretIndex}`) && (
                        <motion.div
                          className="w-3 h-3 bg-yellow-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-amber-200 text-sm mb-2">
            Click on frets to play notes • Mute with volume icon • Stop all with reset icon
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-amber-300/80 flex-wrap">
            <span>🎸 Standard Tuning (E-A-D-G-B-E)</span>
            <span>🎵 Demo plays G-C-D-Em progression</span>
            <span>🔊 Adjust volume in settings</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveGuitar;
