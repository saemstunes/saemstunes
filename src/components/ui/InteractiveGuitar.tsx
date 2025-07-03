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
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());

  // Guitar strings with standard tuning (E A D G B E)
  const strings: GuitarString[] = [
    { 
      note: 'E', 
      openFreq: 82.41,
      frets: [
        { note: 'E', frequency: 82.41 },
        { note: 'F', frequency: 87.31 },
        { note: 'F#', frequency: 92.50 },
        { note: 'G', frequency: 98.00 },
        { note: 'G#', frequency: 103.83 },
        { note: 'A', frequency: 110.00 },
        { note: 'A#', frequency: 116.54 },
        { note: 'B', frequency: 123.47 },
        { note: 'C', frequency: 130.81 },
        { note: 'C#', frequency: 138.59 },
        { note: 'D', frequency: 146.83 },
        { note: 'D#', frequency: 155.56 },
        { note: 'E', frequency: 164.81 }
      ]
    },
    {
      note: 'A',
      openFreq: 110.00,
      frets: [
        { note: 'A', frequency: 110.00 },
        { note: 'A#', frequency: 116.54 },
        { note: 'B', frequency: 123.47 },
        { note: 'C', frequency: 130.81 },
        { note: 'C#', frequency: 138.59 },
        { note: 'D', frequency: 146.83 },
        { note: 'D#', frequency: 155.56 },
        { note: 'E', frequency: 164.81 },
        { note: 'F', frequency: 174.61 },
        { note: 'F#', frequency: 185.00 },
        { note: 'G', frequency: 196.00 },
        { note: 'G#', frequency: 207.65 },
        { note: 'A', frequency: 220.00 }
      ]
    },
    {
      note: 'D',
      openFreq: 146.83,
      frets: [
        { note: 'D', frequency: 146.83 },
        { note: 'D#', frequency: 155.56 },
        { note: 'E', frequency: 164.81 },
        { note: 'F', frequency: 174.61 },
        { note: 'F#', frequency: 185.00 },
        { note: 'G', frequency: 196.00 },
        { note: 'G#', frequency: 207.65 },
        { note: 'A', frequency: 220.00 },
        { note: 'A#', frequency: 233.08 },
        { note: 'B', frequency: 246.94 },
        { note: 'C', frequency: 261.63 },
        { note: 'C#', frequency: 277.18 },
        { note: 'D', frequency: 293.66 }
      ]
    },
    {
      note: 'G',
      openFreq: 196.00,
      frets: [
        { note: 'G', frequency: 196.00 },
        { note: 'G#', frequency: 207.65 },
        { note: 'A', frequency: 220.00 },
        { note: 'A#', frequency: 233.08 },
        { note: 'B', frequency: 246.94 },
        { note: 'C', frequency: 261.63 },
        { note: 'C#', frequency: 277.18 },
        { note: 'D', frequency: 293.66 },
        { note: 'D#', frequency: 311.13 },
        { note: 'E', frequency: 329.63 },
        { note: 'F', frequency: 349.23 },
        { note: 'F#', frequency: 369.99 },
        { note: 'G', frequency: 392.00 }
      ]
    },
    {
      note: 'B',
      openFreq: 246.94,
      frets: [
        { note: 'B', frequency: 246.94 },
        { note: 'C', frequency: 261.63 },
        { note: 'C#', frequency: 277.18 },
        { note: 'D', frequency: 293.66 },
        { note: 'D#', frequency: 311.13 },
        { note: 'E', frequency: 329.63 },
        { note: 'F', frequency: 349.23 },
        { note: 'F#', frequency: 369.99 },
        { note: 'G', frequency: 392.00 },
        { note: 'G#', frequency: 415.30 },
        { note: 'A', frequency: 440.00 },
        { note: 'A#', frequency: 466.16 },
        { note: 'B', frequency: 493.88 }
      ]
    },
    {
      note: 'E',
      openFreq: 329.63,
      frets: [
        { note: 'E', frequency: 329.63 },
        { note: 'F', frequency: 349.23 },
        { note: 'F#', frequency: 369.99 },
        { note: 'G', frequency: 392.00 },
        { note: 'G#', frequency: 415.30 },
        { note: 'A', frequency: 440.00 },
        { note: 'A#', frequency: 466.16 },
        { note: 'B', frequency: 493.88 },
        { note: 'C', frequency: 523.25 },
        { note: 'C#', frequency: 554.37 },
        { note: 'D', frequency: 587.33 },
        { note: 'D#', frequency: 622.25 },
        { note: 'E', frequency: 659.25 }
      ]
    }
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
    };
  }, []);

  // Volume and mute handling
  useEffect(() => {
    if (audioState.current.gainNode) {
      audioState.current.gainNode.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play guitar note with realistic envelope
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
      const existingOsc = oscillators.current.get(noteKey);
      if (existingOsc) {
        existingOsc.stop();
        oscillators.current.delete(noteKey);
      }

      // Create oscillator for plucked string sound
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      // Guitar-like waveform and filtering
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      // Low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 4, context.currentTime);
      filter.Q.setValueAtTime(1.5, context.currentTime);
      
      // Guitar envelope: quick attack, slow decay
      const attackTime = 0.005;
      const decayTime = 1.5;
      const sustainLevel = 0.2;
      const releaseTime = 2.0;
      
      noteGain.gain.setValueAtTime(0, context.currentTime);
      noteGain.gain.linearRampToValueAtTime(volume * 0.8, context.currentTime + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(volume * sustainLevel, context.currentTime + attackTime + decayTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + releaseTime);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + releaseTime);
      
      oscillators.current.set(noteKey, oscillator);
      
      setActiveNotes(prev => new Set(prev).add(noteKey));
      
      // Remove from active notes after release
      setTimeout(() => {
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
        oscillators.current.delete(noteKey);
      }, releaseTime * 1000);
      
    } catch (error) {
      console.error('Note playback failed:', error);
    }
  }, [volume, isMuted]);

  // Play common chord progressions
  const playDemo = useCallback(async () => {
    const chords = [
      // G Major chord
      [
        { string: 0, fret: 3 }, // G on low E string
        { string: 1, fret: 2 }, // B on A string 
        { string: 2, fret: 0 }, // D open
        { string: 3, fret: 0 }, // G open
        { string: 4, fret: 0 }, // B open
        { string: 5, fret: 3 }  // G on high E string
      ],
      // C Major chord
      [
        { string: 1, fret: 3 }, // C on A string
        { string: 2, fret: 2 }, // E on D string
        { string: 3, fret: 0 }, // G open
        { string: 4, fret: 1 }, // C on B string
        { string: 5, fret: 0 }  // E open
      ]
    ];

    for (const chord of chords) {
      // Strum the chord
      for (let i = 0; i < chord.length; i++) {
        setTimeout(() => {
          const { string, fret } = chord[i];
          const freq = strings[string].frets[fret].frequency;
          playNote(freq, string, fret);
        }, i * 50); // Slight delay between strings for realistic strum
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }, [playNote]);

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
            <Play className="h-4 w-4 mr-2" />
            Play Demo
          </Button>
          
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="sm"
            className={`text-white/80 hover:text-white ${isMuted ? 'bg-red-500/20' : ''}`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </motion.div>

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
                {/* String line */}
                <div 
                  className={`absolute w-full h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 ${
                    stringIndex < 3 ? 'h-1' : 'h-0.5'
                  }`}
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
                          ? 'bg-gold/40 scale-110 shadow-lg'
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
                          className="w-3 h-3 bg-gold rounded-full"
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
            Click on the frets to play notes
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-amber-300/80">
            <span>🎸 Standard Tuning (E-A-D-G-B-E)</span>
            <span>🎵 Try the demo for chord progressions</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveGuitar;