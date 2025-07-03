import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X } from 'lucide-react';

interface PianoKey {
  note: string;
  type: 'white' | 'black';
  frequency: number;
  keyboardKey?: string;
  position: number; // Position as percentage from left
  width: number; // Width as percentage
}

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  compressor: DynamicsCompressorNode | null;
  reverb: ConvolverNode | null;
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
  const [tempo, setTempo] = useState(120);
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

  // Percentage-based key positioning system
  const keys = useMemo<PianoKey[]>(() => {
    const whiteKeyWidth = 100 / 10; // 10 white keys total
    const blackKeyWidth = whiteKeyWidth * 0.6;
    
    return [
      // White keys positioned evenly
      { note: 'C', type: 'white', frequency: 261.63, keyboardKey: 'a', position: 0, width: whiteKeyWidth },
      { note: 'D', type: 'white', frequency: 293.66, keyboardKey: 's', position: whiteKeyWidth, width: whiteKeyWidth },
      { note: 'E', type: 'white', frequency: 329.63, keyboardKey: 'd', position: whiteKeyWidth * 2, width: whiteKeyWidth },
      { note: 'F', type: 'white', frequency: 349.23, keyboardKey: 'f', position: whiteKeyWidth * 3, width: whiteKeyWidth },
      { note: 'G', type: 'white', frequency: 392.00, keyboardKey: 'g', position: whiteKeyWidth * 4, width: whiteKeyWidth },
      { note: 'A', type: 'white', frequency: 440.00, keyboardKey: 'h', position: whiteKeyWidth * 5, width: whiteKeyWidth },
      { note: 'B', type: 'white', frequency: 493.88, keyboardKey: 'j', position: whiteKeyWidth * 6, width: whiteKeyWidth },
      { note: "C'", type: 'white', frequency: 523.25, keyboardKey: 'k', position: whiteKeyWidth * 7, width: whiteKeyWidth },
      { note: "D'", type: 'white', frequency: 587.33, keyboardKey: 'l', position: whiteKeyWidth * 8, width: whiteKeyWidth },
      { note: "E'", type: 'white', frequency: 659.25, keyboardKey: ';', position: whiteKeyWidth * 9, width: whiteKeyWidth },
      
      // Black keys positioned between white keys
      { note: 'C#', type: 'black', frequency: 277.18, keyboardKey: 'w', position: whiteKeyWidth * 0.7, width: blackKeyWidth },
      { note: 'D#', type: 'black', frequency: 311.13, keyboardKey: 'e', position: whiteKeyWidth * 1.7, width: blackKeyWidth },
      { note: 'F#', type: 'black', frequency: 369.99, keyboardKey: 't', position: whiteKeyWidth * 3.7, width: blackKeyWidth },
      { note: 'G#', type: 'black', frequency: 415.30, keyboardKey: 'y', position: whiteKeyWidth * 4.7, width: blackKeyWidth },
      { note: 'A#', type: 'black', frequency: 466.16, keyboardKey: 'u', position: whiteKeyWidth * 5.7, width: blackKeyWidth },
      { note: "C#'", type: 'black', frequency: 554.37, keyboardKey: 'p', position: whiteKeyWidth * 7.7, width: blackKeyWidth },
      { note: "D#'", type: 'black', frequency: 622.25, keyboardKey: '[', position: whiteKeyWidth * 8.7, width: blackKeyWidth },
    ];
  }, []);

  // Enhanced audio initialization with compressor and reverb
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

  // Enhanced audio playback with envelope, harmonics, and filter
  const playAudioNote = useCallback(async (frequency: number, note: string, velocity = 0.5) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    try {
      if (audioState.current.context.state === 'suspended') {
        await audioState.current.context.resume();
        setAudioReady(true);
      }

      const { context, gainNode } = audioState.current;
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
      
      // Enhanced envelope with velocity sensitivity
      const attackTime = 0.01;
      const decayTime = 0.1;
      const sustainLevel = sustainPedal ? 0.6 : 0.4;
      const releaseTime = sustainPedal ? 2.0 : 0.8;
      const velocityMultiplier = Math.max(0.1, Math.min(1.0, velocity));
      
      noteGain.gain.setValueAtTime(0, context.currentTime);
      noteGain.gain.linearRampToValueAtTime(volume * velocityMultiplier * 0.8, context.currentTime + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(volume * velocityMultiplier * sustainLevel, context.currentTime + attackTime + decayTime);
      
      if (!sustainPedal) {
        noteGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + releaseTime);
      }
      
      oscillator.start(context.currentTime);
      
      if (sustainPedal) {
        oscillators.current.set(note, oscillator);
        sustainedNotes.current.add(note);
      } else {
        oscillator.stop(context.currentTime + releaseTime);
      }
      
    } catch (error) {
      console.error('Note playback failed:', error);
    }
  }, [volume, isMuted, waveform, octaveShift, sustainPedal]);

  const stopNote = useCallback((note: string) => {
    const oscillator = oscillators.current.get(note);
    if (oscillator && audioState.current.context) {
      const { context } = audioState.current;
      const noteGain = context.createGain();
      noteGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
      oscillator.stop(context.currentTime + 0.3);
      oscillators.current.delete(note);
      sustainedNotes.current.delete(note);
    }
  }, []);

  const playNote = useCallback((note: string, velocity = 0.5) => {
    const key = keys.find(k => k.note === note);
    if (!key) return;

    setActiveKeys(prev => new Set(prev).add(note));
    playAudioNote(key.frequency * Math.pow(2, octaveShift), note, velocity);
  }, [keys, playAudioNote, octaveShift]);

  const releaseNote = useCallback((note: string) => {
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
  }, [sustainPedal, stopNote]);

  // Tempo-based demo timing
  const playDemo = useCallback(async () => {
    if (isPlaying || isMuted) return;
    
    setIsPlaying(true);
    setShowDemo(false);
    demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
    demoTimeouts.current = [];
    
    try {
      if (audioState.current.context?.state === 'suspended') {
        await audioState.current.context.resume();
        setAudioReady(true);
      }
      
      const melodies = [
        // 🎶 Melody 1: Twinkle Twinkle Little Star (within C to E')
        ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C', 'G', 'G', 'F', 'F', 'E', 'E', 'D', 'G', 'G', 'F', 'F', 'E', 'E', 'D', 'C', 'C', 'G', 'G', 'A', 'A', 'G'],
        // 🎸 Melody 2: Beat It – Michael Jackson riff simplified within C to E'
        ['E', 'D', 'E', 'G', 'A', 'G', 'E', 'D', 'E', 'G', 'A', 'G', 'E', 'D', 'C'],
        // 🎼 Melody 3: Mary Had a Little Lamb (within C to E')
        ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G', 'E', 'D', 'C', 'D', 'E', 'E', 'E', 'E', 'D', 'D', 'E', 'D', 'C'],
        // 🎶 Melody 4: Happy Birthday (first phrase) adjusted within C to E'
        ['C', 'C', 'D', 'C', 'E', 'D', 'C', 'C', 'D', 'C', 'E', 'D'],
        // 🎹 Melody 5: Ode to Joy – Beethoven (first theme) within C to E'
        ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'E', 'D', 'D', 'E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'D', 'C', 'C']
      ];
      
      const melody = melodies[Math.floor(Math.random() * melodies.length)];
      const noteDuration = 60000 / tempo / 2; // Use tempo for note duration
      
      melody.forEach((note, index) => {
        demoTimeouts.current.push(setTimeout(() => {
          playNote(note);
        }, index * noteDuration));
        
        demoTimeouts.current.push(setTimeout(() => {
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note);
            return newSet;
          });
        }, index * noteDuration + noteDuration * 0.8));
      });
      
      demoTimeouts.current.push(setTimeout(() => {
        setIsPlaying(false);
      }, melody.length * noteDuration + 500));
      
    } catch (error) {
      console.error('Demo playback failed:', error);
      setIsPlaying(false);
    }
  }, [isPlaying, playNote, tempo, isMuted]);

  useEffect(() => {
    const keyMap: Record<string, string> = {};
    keys.forEach(key => {
      if (key.keyboardKey) {
        keyMap[key.keyboardKey] = key.note;
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = keyMap[key];
      
      if (note && !pressedKeys.has(key)) {
        setPressedKeys(prev => new Set(prev).add(key));
        playNote(note);
      }
      
      if (key === ' ') {
        e.preventDefault();
        playDemo();
      }
      if (e.key === 'Shift') setSustainPedal(true);
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setOctaveShift(prev => Math.min(prev + 1, 2));
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOctaveShift(prev => Math.max(prev - 1, -2));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = keyMap[key];
      
      if (note && pressedKeys.has(key)) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
        releaseNote(note);
      }
      
      if (e.key === 'Shift') {
        setSustainPedal(false);
        // Release all sustained notes
        sustainedNotes.current.forEach(note => {
          stopNote(note);
          setTimeout(() => {
            setActiveKeys(prev => {
              const newSet = new Set(prev);
              newSet.delete(note);
              return newSet;
            });
          }, 300);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys, playNote, releaseNote, pressedKeys, playDemo, stopNote]);

  const whiteKeys = keys.filter(k => k.type === 'white');
  const blackKeys = keys.filter(k => k.type === 'black');

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-3 sm:p-6 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      onClick={() => {
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
      
      {/* Demo tooltip */}
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
        {/* Control buttons */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={playDemo}
            disabled={isPlaying || isMuted}
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
            className={`text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 ${
              isMuted ? 'bg-red-500/20 text-red-300' : ''
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 ${showSettings ? 'bg-white/20' : ''}`}
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowKeyguide(!showKeyguide)}
            className={`text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 ${showKeyguide ? 'bg-white/20' : ''}`}
          >
            <Info className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
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
                      <option value="triangle">Triangle</option>
                      <option value="sine">Sine</option>
                      <option value="square">Square</option>
                      <option value="sawtooth">Sawtooth</option>
                    </select>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-white font-medium">Octave</label>
                      <span className="text-blue-400 font-mono text-sm">
                        {octaveShift > 0 ? '+' : ''}{octaveShift}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOctaveShift(prev => Math.max(prev - 1, -2))}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-colors font-medium"
                        disabled={octaveShift <= -2}
                      >
                        ↓ Lower
                      </button>
                      <button
                        onClick={() => setOctaveShift(0)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-3 rounded-lg transition-colors font-medium"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setOctaveShift(prev => Math.min(prev + 1, 2))}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-colors font-medium"
                        disabled={octaveShift >= 2}
                      >
                        ↑ Higher
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-medium">Sustain Pedal</label>
                      <button
                        onClick={() => setSustainPedal(!sustainPedal)}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                          sustainPedal ? 'bg-amber-500' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                          sustainPedal ? 'translate-x-7' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Hold Shift key or toggle here
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyguide Panel */}
        <AnimatePresence>
          {showKeyguide && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Keyboard Controls
                </h3>
                <button
                  onClick={() => setShowKeyguide(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-amber-400 font-medium mb-2">Piano Keys</h4>
                  <div className="space-y-1 text-white/80">
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">A S D F G H J</kbd> White keys (C-B)</div>
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">K L ;</kbd> High octave (C'-E')</div>
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">W E T Y U P [</kbd> Black keys (sharps)</div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-purple-400 font-medium mb-2">Controls</h4>
                  <div className="space-y-1 text-white/80">
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Space</kbd> Play demo</div>
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Shift</kbd> Sustain pedal</div>
                    <div><kbd className="bg-white/10 px-2 py-1 rounded text-xs">↑ ↓</kbd> Change octave</div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-blue-400 font-medium mb-2">Features</h4>
                  <div className="space-y-1 text-white/80">
                    <div>• Multiple waveforms</div>
                    <div>• Volume & tempo control</div>
                    <div>• Touch device support</div>
                    <div>• Visual feedback</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Piano Keyboard - Responsive to container size */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 shadow-inner">
          {/* Responsive container that maintains aspect ratio */}
          <div className="relative w-full pb-[25%] min-h-[150px] sm:min-h-[180px] md:min-h-[200px]">
            <div className="absolute inset-0">
              {/* White keys */}
              {whiteKeys.map((key) => (
                <motion.button
                  key={key.note}
                  className={`
                    absolute rounded-b-lg transition-all duration-150 select-none
                    ${activeKeys.has(key.note)
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-xl shadow-amber-500/50 scale-95' 
                      : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 shadow-lg hover:shadow-xl'
                    }
                    active:scale-90 border border-gray-300
                  `}
                  style={{
                    left: `${key.position}%`,
                    width: `${key.width}%`,
                    height: '100%',
                  }}
                  onMouseDown={() => playNote(key.note)}
                  onMouseUp={() => releaseNote(key.note)}
                  onMouseLeave={() => releaseNote(key.note)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    playNote(key.note);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    releaseNote(key.note);
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`text-xs font-medium block ${
                      activeKeys.has(key.note) ? 'text-amber-900' : 'text-slate-700'
                    }`}>
                      {key.note}
                    </span>
                    {key.keyboardKey && (
                      <span className={`text-xs block ${
                        activeKeys.has(key.note) ? 'text-amber-800' : 'text-slate-500'
                      }`}>
                        {key.keyboardKey.toUpperCase()}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}

              {/* Black keys */}
              {blackKeys.map((key) => (
                <motion.button
                  key={key.note}
                  className={`
                    absolute rounded-b-md transition-all duration-150 select-none
                    ${activeKeys.has(key.note)
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-xl shadow-amber-500/50 scale-95' 
                      : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg'
                    }
                    active:scale-90 border border-gray-700
                  `}
                  style={{ 
                    left: `${key.position}%`,
                    width: `${key.width}%`,
                    height: '65%',
                    zIndex: 10
                  }}
                  onMouseDown={() => playNote(key.note)}
                  onMouseUp={() => releaseNote(key.note)}
                  onMouseLeave={() => releaseNote(key.note)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    playNote(key.note);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    releaseNote(key.note);
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`text-xs font-medium block ${
                      activeKeys.has(key.note) ? 'text-amber-200' : 'text-white'
                    }`}>
                      {key.note}
                    </span>
                    {key.keyboardKey && (
                      <span className={`text-xs block ${
                        activeKeys.has(key.note) ? 'text-amber-300' : 'text-white/60'
                      }`}>
                        {key.keyboardKey.toUpperCase()}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Status indicators */}
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
            {isMuted && (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Muted
              </span>
            )}
          </div>
          
          <AnimatePresence>
            {activeKeys.size > 0 && !isMuted && (
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
