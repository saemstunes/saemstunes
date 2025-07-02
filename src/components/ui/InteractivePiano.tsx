import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap } from 'lucide-react';

interface PianoKey {
  note: string;
  type: 'white' | 'black';
  frequency: number;
  offset?: number;
  keyboardKey?: string;
}

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  compressor: DynamicsCompressorNode | null;
  reverb: ConvolverNode | null;
}

// Musical note types with their duration ratios
type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'thirtysecond';

// Duration ratios relative to a quarter note (crotchet)
const DURATION_RATIOS: Record<NoteDuration, number> = {
  'whole': 4,
  'half': 2,
  'quarter': 1,
  'eighth': 0.5,
  'sixteenth': 0.25,
  'thirtysecond': 0.125
};

interface MusicalNote {
  note: string;
  duration: NoteDuration;
  dotted?: boolean;
}

const InteractivePiano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showSettings, setShowSettings] = useState(false);
  const [waveform, setWaveform] = useState<OscillatorType>('triangle');
  const [showKeyguide, setShowKeyguide] = useState(false);
  const [sustainPedal, setSustainPedal] = useState(false);
  const [octaveShift, setOctaveShift] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [tempo, setTempo] = useState(120); // Beats per minute (BPM)
  const [audioReady, setAudioReady] = useState(false);
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null,
    compressor: null,
    reverb: null
  });
  
  const sustainedNotes = useRef<Set<string>>(new Set());
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const noteStartTimes = useRef<Map<string, number>>(new Map());
  const demoTimeouts = useRef<NodeJS.Timeout[]>([]);
  const keyReleaseTimes = useRef<Map<string, number>>(new Map());

  // Calculate duration in milliseconds based on note type and tempo
  const calculateDuration = useCallback((duration: NoteDuration, dotted = false): number => {
    const quarterNoteMs = 60000 / tempo; // Duration of a quarter note in ms
    let ratio = DURATION_RATIOS[duration];
    
    // Apply dotting (add half the value again)
    if (dotted) ratio *= 1.5;
    
    return quarterNoteMs * ratio;
  }, [tempo]);

  // Corrected key mapping with requested keyboard shortcuts
  const keys = useMemo<PianoKey[]>(() => [
    // First octave (C to B)
    { note: 'C', type: 'white', frequency: 261.63, keyboardKey: 'a' },
    { note: 'C#', type: 'black', frequency: 277.18, keyboardKey: 'w' },
    { note: 'D', type: 'white', frequency: 293.66, keyboardKey: 's' },
    { note: 'D#', type: 'black', frequency: 311.13, keyboardKey: 'e' },
    { note: 'E', type: 'white', frequency: 329.63, keyboardKey: 'd' },
    { note: 'F', type: 'white', frequency: 349.23, keyboardKey: 'f' },
    { note: 'F#', type: 'black', frequency: 369.99, keyboardKey: 't' },
    { note: 'G', type: 'white', frequency: 392.00, keyboardKey: 'g' },
    { note: 'G#', type: 'black', frequency: 415.30, keyboardKey: 'y' },
    { note: 'A', type: 'white', frequency: 440.00, keyboardKey: 'h' },
    { note: 'A#', type: 'black', frequency: 466.16, keyboardKey: 'u' },
    { note: 'B', type: 'white', frequency: 493.88, keyboardKey: 'j' },
    // Second octave (C' to E')
    { note: "C'", type: 'white', frequency: 523.25, keyboardKey: 'k' },
    { note: "C#'", type: 'black', frequency: 554.37, keyboardKey: 'p' },
    { note: "D'", type: 'white', frequency: 587.33, keyboardKey: 'l' },
    { note: "D#'", type: 'black', frequency: 622.25, keyboardKey: '[' },
    { note: "E'", type: 'white', frequency: 659.25, keyboardKey: ';' }
  ], []);

  // Audio initialization with effects
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        const compressor = context.createDynamicsCompressor();
        
        // Create reverb effect
        const reverb = context.createConvolver();
        const reverbGain = context.createGain();
        
        // Simple reverb impulse response
        const impulseLength = context.sampleRate * 2;
        const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
          const channelData = impulse.getChannelData(channel);
          for (let i = 0; i < impulseLength; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
          }
        }
        reverb.buffer = impulse;
        
        // Connect audio graph
        gainNode.connect(compressor);
        compressor.connect(reverbGain);
        reverbGain.connect(reverb);
        reverb.connect(context.destination);
        
        // Direct signal (dry)
        compressor.connect(context.destination);
        
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        reverbGain.gain.setValueAtTime(0.3, context.currentTime);
        
        audioState.current = { context, gainNode, compressor, reverb };
        
        // Set up a resume handler for user interaction
        const resumeAudio = async () => {
          if (context.state === 'suspended') {
            await context.resume();
          }
          setAudioReady(true);
        };

        // Add resume handler for user interactions
        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('touchstart', resumeAudio, { once: true });
        document.addEventListener('keydown', resumeAudio, { once: true });
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    };
    
    initAudio();
    
    // Detect touch device
    setIsTouch('ontouchstart' in window);
    
    return () => {
      if (audioState.current.context) {
        audioState.current.context.close();
      }
      // Clear all demo timeouts on unmount
      demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [volume]);

  // Audio playback with envelope and harmonics
  const playAudioNote = useCallback(async (frequency: number, note: string, duration?: number) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    // Ensure context is resumed
    try {
      if (audioState.current.context.state === 'suspended') {
        await audioState.current.context.resume();
      }
    } catch (error) {
      console.warn('Failed to resume audio context:', error);
      return;
    }

    try {
      const { context, gainNode } = audioState.current;
      
      // Stop existing oscillator for this note
      const existingOsc = oscillators.current.get(note);
      if (existingOsc) {
        existingOsc.stop();
        oscillators.current.delete(note);
      }

      // Create primary oscillator
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      // Apply octave shift
      const adjustedFreq = frequency * Math.pow(2, octaveShift);
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      oscillator.frequency.setValueAtTime(adjustedFreq, context.currentTime);
      oscillator.type = waveform;
      
      // Subtle filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(adjustedFreq * 4, context.currentTime);
      filter.Q.setValueAtTime(0.5, context.currentTime);
      
      // Enhanced envelope with sustain
      const attackTime = 0.01;
      const decayTime = 0.1;
      const sustainLevel = 0.6;
      const releaseTime = sustainPedal ? 2.0 : (duration ? duration / 1000 * 0.8 : 0.8);
      
      noteGain.gain.setValueAtTime(0, context.currentTime);
      noteGain.gain.linearRampToValueAtTime(volume * 0.5, context.currentTime + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(volume * sustainLevel, context.currentTime + attackTime + decayTime);
      
      // Schedule note release
      if (duration && !sustainPedal) {
        const releaseStart = context.currentTime + (duration / 1000) * 0.2;
        noteGain.gain.exponentialRampToValueAtTime(0.001, releaseStart + releaseTime);
        oscillator.stop(releaseStart + releaseTime);
      }
      
      oscillator.start(context.currentTime);
      
      oscillators.current.set(note, oscillator);
      sustainedNotes.current.add(note);
      
      // Record start time for this note
      noteStartTimes.current.set(note, Date.now());
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [volume, isMuted, waveform, octaveShift, sustainPedal]);

  const stopNote = useCallback((note: string) => {
    const oscillator = oscillators.current.get(note);
    if (oscillator && audioState.current.context) {
      const noteGain = audioState.current.context.createGain();
      noteGain.gain.exponentialRampToValueAtTime(0.001, audioState.current.context.currentTime + 0.3);
      oscillator.stop(audioState.current.context.currentTime + 0.3);
      oscillators.current.delete(note);
      sustainedNotes.current.delete(note);
      
      // Record release time for dynamics calculation
      keyReleaseTimes.current.set(note, Date.now());
    }
  }, []);

  const playNote = useCallback((note: string, duration?: number) => {
    const key = keys.find(k => k.note === note);
    if (!key) return;

    setActiveKeys(prev => new Set(prev).add(note));
    playAudioNote(key.frequency, note, duration);
  }, [keys, playAudioNote]);

  const releaseNote = useCallback((note: string) => {
    const key = keys.find(k => k.note === note);
    if (!key) return;

    // Calculate press duration for dynamic release
    const startTime = noteStartTimes.current.get(note);
    if (startTime) {
      const pressDuration = Date.now() - startTime;
      
      // If note was pressed very briefly, treat as staccato
      if (pressDuration < 200 && !sustainPedal) {
        stopNote(note);
        setTimeout(() => {
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note);
            return newSet;
          });
        }, 100);
        return;
      }
    }
    
    if (!sustainPedal) {
      stopNote(note);
      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }, 300);
    }
  }, [keys, stopNote, sustainPedal]);

  // Demo with musical rhythms and adjustable tempo
  const playDemo = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setShowDemo(false);
    
    // Clear any previous timeouts
    demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
    demoTimeouts.current = [];
    
    // Ensure audio is ready before playing
    try {
      if (audioState.current.context?.state === 'suspended') {
        await audioState.current.context.resume();
        setAudioReady(true);
      }
    } catch (error) {
      console.warn('Failed to resume audio context for demo:', error);
      setIsPlaying(false);
      return;
    }
    
    // Define melodies with musical note durations
    const melodies: MusicalNote[][] = [
      // Twinkle Twinkle Little Star
      [
        { note: 'C', duration: 'quarter' },
        { note: 'C', duration: 'quarter' },
        { note: 'G', duration: 'quarter' },
        { note: 'G', duration: 'quarter' },
        { note: 'A', duration: 'quarter' },
        { note: 'A', duration: 'quarter' },
        { note: 'G', duration: 'half' },
        { note: 'F', duration: 'quarter' },
        { note: 'F', duration: 'quarter' },
        { note: 'E', duration: 'quarter' },
        { note: 'E', duration: 'quarter' },
        { note: 'D', duration: 'quarter' },
        { note: 'D', duration: 'quarter' },
        { note: 'C', duration: 'half' },
      ],
      // Simple scale with rhythm
      [
        { note: 'C', duration: 'eighth' },
        { note: 'D', duration: 'eighth' },
        { note: 'E', duration: 'quarter' },
        { note: 'F', duration: 'eighth' },
        { note: 'G', duration: 'eighth' },
        { note: 'A', duration: 'quarter' },
        { note: 'B', duration: 'eighth' },
        { note: "C'", duration: 'eighth' },
        { note: "C'", duration: 'quarter', dotted: true },
        { note: 'A', duration: 'eighth' },
        { note: 'F', duration: 'quarter' },
      ],
      // Chord progression
      [
        { note: 'C', duration: 'quarter' },
        { note: 'E', duration: 'quarter' },
        { note: 'G', duration: 'half' },
        { note: 'F', duration: 'quarter' },
        { note: 'A', duration: 'quarter' },
        { note: "C'", duration: 'half' },
        { note: 'G', duration: 'quarter' },
        { note: 'B', duration: 'quarter' },
        { note: "D'", duration: 'half' },
        { note: 'C', duration: 'quarter' },
        { note: 'E', duration: 'quarter' },
        { note: 'G', duration: 'whole' },
      ]
    ];
    
    const melody = melodies[Math.floor(Math.random() * melodies.length)];
    
    let cumulativeTime = 0;
    melody.forEach(({ note, duration, dotted }) => {
      const noteDuration = calculateDuration(duration, dotted);
      
      // Schedule note start
      demoTimeouts.current.push(setTimeout(() => {
        playNote(note, noteDuration);
      }, cumulativeTime));
      
      // Schedule note release (if not sustained)
      if (!sustainPedal) {
        demoTimeouts.current.push(setTimeout(() => {
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note);
            return newSet;
          });
        }, cumulativeTime + noteDuration));
      }
      
      cumulativeTime += noteDuration;
    });
    
    // End of demo
    demoTimeouts.current.push(setTimeout(() => {
      setIsPlaying(false);
    }, cumulativeTime + 500));
  }, [isPlaying, playNote, sustainPedal, calculateDuration]);

  // Keyboard controls with new mappings
  useEffect(() => {
    const keyMap: Record<string, string> = {};
    keys.forEach(key => {
      if (key.keyboardKey) {
        keyMap[key.keyboardKey] = key.note;
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && !pressedKeys.has(event.key.toLowerCase())) {
        setPressedKeys(prev => new Set(prev).add(event.key.toLowerCase()));
        playNote(note);
      }
      
      // Special keys
      if (event.key === ' ') {
        event.preventDefault();
        playDemo();
      }
      if (event.key === 'Shift') {
        setSustainPedal(true);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setOctaveShift(prev => Math.min(prev + 1, 2));
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOctaveShift(prev => Math.max(prev - 1, -2));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && pressedKeys.has(event.key.toLowerCase())) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.key.toLowerCase());
          return newSet;
        });
        releaseNote(note);
      }
      
      if (event.key === 'Shift') {
        setSustainPedal(false);
        // Release all sustained notes
        sustainedNotes.current.forEach(note => {
          stopNote(note);
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note);
            return newSet;
          });
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys, playNote, releaseNote, pressedKeys, sustainPedal, stopNote, playDemo]);

  const whiteKeys = keys.filter(k => k.type === 'white');
  const blackKeys = keys.filter(k => k.type === 'black');

  // Calculate black key positions relative to white keys
  const getBlackKeyPosition = (blackKey: PianoKey) => {
    const whiteKeyWidthPx = 32; // Base width in pixels for calculations
    
    switch (blackKey.note) {
      case 'C#': return whiteKeyWidthPx * 0.7; 
      case 'D#': return whiteKeyWidthPx * 1.7; 
      case 'F#': return whiteKeyWidthPx * 3.7; 
      case 'G#': return whiteKeyWidthPx * 4.7; 
      case 'A#': return whiteKeyWidthPx * 5.7; 
      case "C#'": return whiteKeyWidthPx * 7.7; 
      case "D#'": return whiteKeyWidthPx * 8.7;
      default: return 0;
    }
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-3 sm:p-6 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      onClick={() => {
        // Try to resume audio on any click if not ready
        if (!audioReady && audioState.current.context?.state === 'suspended') {
          audioState.current.context.resume().then(() => setAudioReady(true));
        }
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_50%)]" />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Tutorial overlay */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 text-white text-sm font-medium z-20 shadow-lg"
          >
            <Zap className="inline w-4 h-4 mr-2" />
            {isTouch ? 'Tap to play!' : 'Click or use keyboard!'}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        {/* Control panel */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={playDemo}
            disabled={isPlaying}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-white border border-amber-500/30 backdrop-blur-sm transition-all duration-300 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                Playing...
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Demo
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowKeyguide(!showKeyguide)}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <Info className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-amber-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">Tempo: {tempo} BPM</label>
                <input
                  type="range"
                  min="40"
                  max="240"
                  step="10"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-24 accent-amber-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">Waveform</label>
                <select
                  value={waveform}
                  onChange={(e) => setWaveform(e.target.value as OscillatorType)}
                  className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
                >
                  <option value="triangle">Triangle</option>
                  <option value="sine">Sine</option>
                  <option value="square">Square</option>
                  <option value="sawtooth">Sawtooth</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">Octave {octaveShift > 0 ? '+' : ''}{octaveShift}</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setOctaveShift(prev => Math.max(prev - 1, -2))}
                    className="bg-white/10 text-white text-sm px-2 py-1 rounded hover:bg-white/20"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => setOctaveShift(prev => Math.min(prev + 1, 2))}
                    className="bg-white/10 text-white text-sm px-2 py-1 rounded hover:bg-white/20"
                  >
                    ↑
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm">Sustain</label>
                <button
                  onClick={() => setSustainPedal(!sustainPedal)}
                  className={`w-12 h-6 rounded-full transition-colors ${sustainPedal ? 'bg-amber-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${sustainPedal ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key guide */}
        <AnimatePresence>
          {showKeyguide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4"
            >
              <h3 className="text-white font-medium mb-2">Keyboard Controls</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                <div>ASDFGHJ: C-B</div>
                <div>KL;: C'-E'</div>
                <div>WETYUP[: Sharps</div>
                <div>Space: Demo</div>
                <div>Shift: Sustain</div>
                <div>↑↓: Change octave</div>
                <div>Settings: Volume/Tempo</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Piano Keys */}
        <div className="relative flex justify-center touch-manipulation overflow-x-auto">
          {/* White Keys */}
          <motion.div 
            className="flex space-x-0.5 sm:space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {whiteKeys.map((key, index) => (
              <motion.button
                key={key.note}
                className={`
                  relative w-8 h-24 sm:w-10 sm:h-28 md:w-12 md:h-32 rounded-b-lg transition-all duration-150 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 scale-95 shadow-xl shadow-amber-500/50' 
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 shadow-lg hover:shadow-xl'
                  }
                  active:scale-90 border border-gray-300 select-none
                  ${isTouch ? 'touch-manipulation' : ''}
                `}
                onMouseDown={() => playNote(key.note)}
                onMouseUp={() => releaseNote(key.note)}
                onMouseLeave={() => releaseNote(key.note)}
                onTouchStart={() => playNote(key.note)}
                onTouchEnd={() => releaseNote(key.note)}
                onMouseEnter={() => setShowDemo(false)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                  <span className="text-xs font-medium text-slate-700 block">
                    {key.note}
                  </span>
                  {key.keyboardKey && (
                    <span className="text-xs text-slate-500 block">
                      {key.keyboardKey.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Black Keys Overlay */}
          <div className="absolute top-0 left-0 flex pointer-events-none">
            {blackKeys.map((key, index) => (
              <motion.button
                key={key.note}
                className={`
                  absolute pointer-events-auto w-5 h-16 sm:w-6 sm:h-18 md:w-7 md:h-20 rounded-b-md transition-all duration-150 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-xl shadow-amber-500/50 scale-95' 
                    : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg'
                  }
                  active:scale-90 border border-gray-700 select-none
                  ${isTouch ? 'touch-manipulation' : ''}
                `}
                style={{ 
                  left: `${getBlackKeyPosition(key)}px`,
                  zIndex: 10,
                  transform: 'translateX(-50%)'
                }}
                onMouseDown={() => playNote(key.note)}
                onMouseUp={() => releaseNote(key.note)}
                onMouseLeave={() => releaseNote(key.note)}
                onTouchStart={() => playNote(key.note)}
                onTouchEnd={() => releaseNote(key.note)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                  <span className="text-xs text-white font-medium block">
                    {key.note}
                  </span>
                  {key.keyboardKey && (
                    <span className="text-xs text-white/60 block">
                      {key.keyboardKey.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status display */}
        <motion.div 
          className="text-center mt-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-white/80">Interactive Piano</span>
            {sustainPedal && (
              <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                Sustain ON
              </span>
            )}
            {octaveShift !== 0 && (
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                Octave {octaveShift > 0 ? '+' : ''}{octaveShift}
              </span>
            )}
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              Tempo: {tempo} BPM
            </span>
          </div>
          
          {/* Active notes display */}
          <AnimatePresence>
            {activeKeys.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm border border-amber-500/30"
              >
                <span>♪</span>
                <span className="font-medium">
                  {Array.from(activeKeys).join(', ')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractivePiano;
