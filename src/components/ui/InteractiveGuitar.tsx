import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X, RotateCcw } from 'lucide-react';

interface GuitarString {
  note: string;
  openFreq: number;
  frets: { note: string; frequency: number }[];
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
  const [showDemo, setShowDemo] = useState(true);
  const [tempo, setTempo] = useState(80);
  const [waveform, setWaveform] = useState<OscillatorType>('sawtooth');
  const [isTouch, setIsTouch] = useState(false);
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null,
    compressor: null,
    reverb: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const demoTimeouts = useRef<NodeJS.Timeout[]>([]);
  const activeNoteKeysByString = useRef<Map<number, string>>(new Map());

  // Generate frets dynamically
  const generateFrets = (baseFreq: number, count: number = 13) => {
    return Array.from({ length: count }, (_, i) => {
      const freq = baseFreq * Math.pow(2, i / 12);
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteIndex = (i + notes.indexOf('C')) % 12;
      return { note: notes[noteIndex], frequency: freq };
    });
  };

  // Guitar strings with standard tuning
  const strings: GuitarString[] = [
    { note: 'E', openFreq: 82.41, frets: generateFrets(82.41) },
    { note: 'A', openFreq: 110.00, frets: generateFrets(110.00) },
    { note: 'D', openFreq: 146.83, frets: generateFrets(146.83) },
    { note: 'G', openFreq: 196.00, frets: generateFrets(196.00) },
    { note: 'B', openFreq: 246.94, frets: generateFrets(246.94) },
    { note: 'E', openFreq: 329.63, frets: generateFrets(329.63) }
  ];

  // Enhanced audio initialization
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

  // Reset handler for guitar
  useEffect(() => {
    const resetHandler = () => {
      stopAllNotes();
      setIsPlayingDemo(false);
      setActiveNotes(new Set());
    };
    
    window.addEventListener('reset-guitar', resetHandler);
    return () => {
      window.removeEventListener('reset-guitar', resetHandler);
    };
  }, [stopAllNotes]);

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
      
      // Guitar-like waveform
      oscillator.type = waveform;
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
  }, [volume, isMuted, waveform]);

  // Play chord progressions with cancellation support
  const playDemo = useCallback(async () => {
    if (isPlayingDemo) {
      setIsPlayingDemo(false);
      demoTimeouts.current.forEach(timeout => clearTimeout(timeout));
      demoTimeouts.current = [];
      stopAllNotes();
      return;
    }

    setIsPlayingDemo(true);
    setShowDemo(false);
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
      
      // Strum the chord
      for (let i = 0; i < chord.length; i++) {
        demoTimeouts.current.push(setTimeout(() => {
          if (!isPlayingDemo) return;
          const { string, fret } = chord[i];
          const freq = strings[string].frets[fret].frequency;
          playNote(freq, string, fret);
        }, i * 80));
      }
      
      demoTimeouts.current.push(setTimeout(() => {
        playChord((chordIndex + 1) % chords.length);
      }, (chord.length * 80) + (60000 / tempo)));
    };

    playChord(0);
  }, [playNote, isPlayingDemo, stopAllNotes, strings, tempo]);

  // Check if a string has active notes
  const isStringActive = (stringIndex: number) => {
    return Array.from(activeNotes).some(key => key.startsWith(`${stringIndex}-`));
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-3 sm:p-6 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
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
            {isTouch ? 'Tap frets to play!' : 'Click frets to play!'}
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
            disabled={isMuted}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-white border border-amber-500/30 backdrop-blur-sm transition-all duration-300 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isPlayingDemo ? (
              <>
                <Pause className="h-3 w-3" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Play Demo
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
            onClick={stopAllNotes}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
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
                    <div>• Demo plays G-C-D-Em progression</div>
                    <div>• Multiple strings can play simultaneously</div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-purple-400 font-medium mb-2">Features</h4>
                  <div className="space-y-1 text-white/80">
                    <div>• Realistic guitar sound modeling</div>
                    <div>• Adjustable volume and tempo</div>
                    <div>• String vibration visualization</div>
                    <div>• Glowing fret indicators</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guitar Neck */}
        <div className="relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 rounded-xl p-4 shadow-inner">
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
                  <motion.div 
                    className={`absolute w-full h-0.5 transition-all duration-300 ${
                      isStringActive(stringIndex) 
                        ? 'from-yellow-300 to-amber-300 shadow-[0_0_8px_rgba(255,215,0,0.8)]' 
                        : 'from-gray-400 to-gray-300'
                    } ${stringIndex < 3 ? 'h-1' : 'h-0.5'}`}
                    style={{ 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      background: `linear-gradient(to right, ${
                        isStringActive(stringIndex) 
                          ? '#fcd34d, #f59e0b' 
                          : '#d1d5db, #9ca3af'
                      })`
                    }}
                    animate={{
                      background: isStringActive(stringIndex) 
                        ? [
                            'linear-gradient(to right, #fcd34d, #f59e0b)',
                            'linear-gradient(to right, #fde68a, #fcd34d)',
                            'linear-gradient(to right, #fcd34d, #f59e0b)'
                          ]
                        : 'linear-gradient(to right, #d1d5db, #9ca3af)'
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: isStringActive(stringIndex) ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  />
                  
                  {/* String label */}
                  <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2 relative z-10 shadow-md">
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
        </div>

        {/* Status indicators */}
        <motion.div 
          className="text-center mt-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-white/80">Interactive Guitar</span>
            {isMuted && (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Muted
              </span>
            )}
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              Tempo: {tempo} BPM
            </span>
            <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
              Standard Tuning
            </span>
          </div>
          
          <AnimatePresence>
            {activeNotes.size > 0 && !isMuted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm border border-amber-500/30"
              >
                <span>🎸 Playing</span>
                <span className="font-medium">
                  {Array.from(activeNotes).length} notes
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveGuitar;
