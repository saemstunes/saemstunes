
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X, RotateCcw, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  compressor: DynamicsCompressorNode | null;
  reverb: ConvolverNode | null;
}

interface NoteInfo {
  note: string;
  frequency: number;
  octave: number;
  keyBinding?: string;
}

const InteractivePiano: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [showKeyguide, setShowKeyguide] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [tempo, setTempo] = useState(120);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [isTouch, setIsTouch] = useState(false);
  const [noteBeingHeld, setNoteBeingHeld] = useState<string | null>(null);
  const [noteDuration, setNoteDuration] = useState(0);
  const [rhythmValue, setRhythmValue] = useState<string>('Quarter note');
  const isMobile = useIsMobile();
  
  const audioState = useRef<AudioState>({
    context: null,
    gainNode: null,
    compressor: null,
    reverb: null
  });
  
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());
  const demoTimeouts = useRef<NodeJS.Timeout[]>([]);
  const noteStartTime = useRef<number>(0);
  const durationTimer = useRef<NodeJS.Timeout | null>(null);

  // Note duration values in beats
  const noteDurations = {
    'Whole note': 4,
    'Half note': 2,
    'Quarter note': 1,
    'Eighth note': 0.5,
    'Sixteenth note': 0.25,
    'Thirty-second note': 0.125,
  };

  // Calculate duration based on current tempo
  const getNoteDurationMs = (beats: number) => {
    return (beats * 60000) / tempo; // Convert beats to milliseconds
  };

  // Classify held duration into nearest note value
  const classifyDuration = (durationMs: number) => {
    const beatDuration = 60000 / tempo;
    const beats = durationMs / beatDuration;
    
    const noteTypes = Object.entries(noteDurations);
    let closest = noteTypes[0];
    let minDiff = Math.abs(beats - closest[1]);
    
    for (const [name, value] of noteTypes) {
      const diff = Math.abs(beats - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = [name, value];
      }
    }
    
    return closest[0];
  };

  // Piano layout with 3 octaves
  const notes: NoteInfo[] = [
    // Octave 4
    { note: 'C', frequency: 261.63, octave: 4, keyBinding: 'a' },
    { note: 'C#', frequency: 277.18, octave: 4, keyBinding: 'w' },
    { note: 'D', frequency: 293.66, octave: 4, keyBinding: 's' },
    { note: 'D#', frequency: 311.13, octave: 4, keyBinding: 'e' },
    { note: 'E', frequency: 329.63, octave: 4, keyBinding: 'd' },
    { note: 'F', frequency: 349.23, octave: 4, keyBinding: 'f' },
    { note: 'F#', frequency: 369.99, octave: 4, keyBinding: 't' },
    { note: 'G', frequency: 392.00, octave: 4, keyBinding: 'g' },
    { note: 'G#', frequency: 415.30, octave: 4, keyBinding: 'y' },
    { note: 'A', frequency: 440.00, octave: 4, keyBinding: 'h' },
    { note: 'A#', frequency: 466.16, octave: 4, keyBinding: 'u' },
    { note: 'B', frequency: 493.88, octave: 4, keyBinding: 'j' },
    
    // Octave 5
    { note: 'C', frequency: 523.25, octave: 5, keyBinding: 'k' },
    { note: 'C#', frequency: 554.37, octave: 5, keyBinding: 'o' },
    { note: 'D', frequency: 587.33, octave: 5, keyBinding: 'l' },
    { note: 'D#', frequency: 622.25, octave: 5, keyBinding: 'p' },
    { note: 'E', frequency: 659.25, octave: 5 },
    { note: 'F', frequency: 698.46, octave: 5 },
    { note: 'F#', frequency: 739.99, octave: 5 },
    { note: 'G', frequency: 783.99, octave: 5 },
    { note: 'G#', frequency: 830.61, octave: 5 },
    { note: 'A', frequency: 880.00, octave: 5 },
    { note: 'A#', frequency: 932.33, octave: 5 },
    { note: 'B', frequency: 987.77, octave: 5 },
  ];

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
        reverbGain.gain.setValueAtTime(0.2, context.currentTime);
        
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
      if (durationTimer.current) {
        clearTimeout(durationTimer.current);
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
    setNoteBeingHeld(null);
    setNoteDuration(0);
    if (durationTimer.current) {
      clearTimeout(durationTimer.current);
    }
  }, []);

  // Reset handler for piano
  useEffect(() => {
    const resetHandler = () => {
      stopAllNotes();
      setIsPlayingDemo(false);
      setActiveNotes(new Set());
      setNoteDuration(0);
      setRhythmValue('Quarter note');
    };
    
    window.addEventListener('reset-piano', resetHandler);
    return () => {
      window.removeEventListener('reset-piano', resetHandler);
    };
  }, [stopAllNotes]);

  // Enhanced note press handling with duration tracking
  const handleNotePress = (noteInfo: NoteInfo) => {
    const noteKey = `${noteInfo.note}${noteInfo.octave}`;
    noteStartTime.current = Date.now();
    setNoteBeingHeld(noteKey);
    setNoteDuration(0);
    
    // Start duration tracking
    const updateDuration = () => {
      if (noteBeingHeld === noteKey) {
        const currentDuration = Date.now() - noteStartTime.current;
        setNoteDuration(currentDuration);
        setRhythmValue(`${classifyDuration(currentDuration)} (${(currentDuration / 1000).toFixed(1)}s)`);
        durationTimer.current = setTimeout(updateDuration, 50);
      }
    };
    updateDuration();
    
    playNote(noteInfo);
  };

  // Enhanced note release handling
  const handleNoteRelease = (noteInfo: NoteInfo) => {
    const noteKey = `${noteInfo.note}${noteInfo.octave}`;
    if (noteBeingHeld === noteKey) {
      const finalDuration = Date.now() - noteStartTime.current;
      const finalRhythm = classifyDuration(finalDuration);
      setRhythmValue(`${finalRhythm} (${(finalDuration / 1000).toFixed(1)}s)`);
      setNoteBeingHeld(null);
      if (durationTimer.current) {
        clearTimeout(durationTimer.current);
      }
    }
    
    stopNote(noteInfo);
  };

  // Play piano note with enhanced realism
  const playNote = useCallback(async (noteInfo: NoteInfo) => {
    if (!audioState.current.context || !audioState.current.gainNode || isMuted) return;

    try {
      if (audioState.current.context.state === 'suspended') {
        await audioState.current.context.resume();
        setAudioReady(true);
      }

      const { context, gainNode } = audioState.current;
      const noteKey = `${noteInfo.note}${noteInfo.octave}`;
      
      // Stop existing note if playing
      const existingOsc = oscillators.current.get(noteKey);
      if (existingOsc) {
        existingOsc.stop();
        oscillators.current.delete(noteKey);
      }

      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);
      
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(noteInfo.frequency, context.currentTime);
      
      // Piano-like filtering
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(noteInfo.frequency * 4, context.currentTime);
      
      // Piano envelope
      const now = context.currentTime;
      const attackTime = 0.01;
      const sustainLevel = 0.3;
      
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volume, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(volume * sustainLevel, now + attackTime + 0.1);
      
      oscillator.start(now);
      
      oscillators.current.set(noteKey, oscillator);
      setActiveNotes(prev => new Set(prev).add(noteKey));
      
    } catch (error) {
      console.error('Note playback failed:', error);
    }
  }, [volume, isMuted, waveform]);

  // Stop individual note
  const stopNote = useCallback((noteInfo: NoteInfo) => {
    const noteKey = `${noteInfo.note}${noteInfo.octave}`;
    const oscillator = oscillators.current.get(noteKey);
    
    if (oscillator && audioState.current.context) {
      const now = audioState.current.context.currentTime;
      const noteGain = oscillator.context.createGain();
      
      // Quick fade out
      try {
        oscillator.stop(now + 0.1);
      } catch (e) {
        console.warn('Error stopping oscillator:', e);
      }
      
      oscillators.current.delete(noteKey);
      setActiveNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteKey);
        return newSet;
      });
    }
  }, []);

  // Keyboard event handling (hidden on mobile)
  useEffect(() => {
    if (isMobile) return; // Don't add keyboard listeners on mobile
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const noteInfo = notes.find(n => n.keyBinding === key);
      if (noteInfo && !activeNotes.has(`${noteInfo.note}${noteInfo.octave}`)) {
        event.preventDefault();
        handleNotePress(noteInfo);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const noteInfo = notes.find(n => n.keyBinding === key);
      if (noteInfo) {
        event.preventDefault();
        handleNoteRelease(noteInfo);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes, isMobile, handleNotePress, handleNoteRelease]);

  const isBlackKey = (note: string) => note.includes('#');

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-3 sm:p-6 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />
      
      {/* Rhythm Display */}
      {noteBeingHeld && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 text-blue-100 text-sm font-medium z-20 shadow-lg"
        >
          <Clock className="inline w-4 h-4 mr-2" />
          Playing: {rhythmValue} • Tempo: {tempo} BPM
        </motion.div>
      )}
      
      <div className="relative z-10">
        {/* Control buttons */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
          
          {!isMobile && (
            <button
              onClick={() => setShowKeyguide(!showKeyguide)}
              className={`text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 ${showKeyguide ? 'bg-white/20' : ''}`}
            >
              <Info className="h-4 w-4" />
            </button>
          )}
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
                  Piano Settings
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
                      <span className="text-blue-400 font-mono text-sm">
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
                      className="w-full accent-blue-500 bg-white/10 rounded-lg"
                    />
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-white font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Tempo
                      </label>
                      <span className="text-purple-400 font-mono text-sm">
                        {tempo} BPM
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="200"
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
                      <option value="sine">Sine (Piano-like)</option>
                      <option value="sawtooth">Sawtooth</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                    </select>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <label className="text-white font-medium block mb-3">Rhythm Feedback</label>
                    <div className="bg-black/50 text-white rounded-lg px-3 py-2 border border-white/20 text-center">
                      <span className="text-blue-400">
                        {rhythmValue || 'Press and hold keys'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard shortcuts guide - Hidden on mobile */}
        {!isMobile && (
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
                    Keyboard Shortcuts
                  </h3>
                  <button
                    onClick={() => setShowKeyguide(false)}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {notes.filter(n => n.keyBinding).map((noteInfo) => (
                    <div key={`${noteInfo.note}${noteInfo.octave}`} className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
                      <span className="text-white/80">{noteInfo.note}{noteInfo.octave}</span>
                      <kbd className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
                        {noteInfo.keyBinding?.toUpperCase()}
                      </kbd>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Piano Keys */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 shadow-inner">
          <div className="flex relative">
            {notes.map((noteInfo, index) => {
              const noteKey = `${noteInfo.note}${noteInfo.octave}`;
              const isActive = activeNotes.has(noteKey);
              const isHeld = noteBeingHeld === noteKey;
              
              if (isBlackKey(noteInfo.note)) {
                return (
                  <motion.button
                    key={noteKey}
                    className={`absolute w-8 h-32 bg-gradient-to-b from-gray-900 to-black rounded-b-lg border border-gray-700 shadow-lg z-10 transition-all duration-75 ${
                      isActive || isHeld
                        ? 'from-blue-400 to-blue-600 shadow-blue-400/50 scale-95'
                        : 'hover:from-gray-800 hover:to-gray-900'
                    }`}
                    style={{
                      left: `${(index - notes.filter((n, i) => i < index && isBlackKey(n.note)).length) * 40 - 16}px`,
                    }}
                    onMouseDown={() => handleNotePress(noteInfo)}
                    onMouseUp={() => handleNoteRelease(noteInfo)}
                    onMouseLeave={() => handleNoteRelease(noteInfo)}
                    onTouchStart={() => handleNotePress(noteInfo)}
                    onTouchEnd={() => handleNoteRelease(noteInfo)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {!isMobile && noteInfo.keyBinding && (
                      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-mono">
                        {noteInfo.keyBinding.toUpperCase()}
                      </span>
                    )}
                  </motion.button>
                );
              }
              
              return (
                <motion.button
                  key={noteKey}
                  className={`w-10 h-48 bg-gradient-to-b from-white to-gray-100 border border-gray-300 shadow-lg transition-all duration-75 ${
                    isActive || isHeld
                      ? 'from-blue-200 to-blue-300 shadow-blue-400/50 scale-95'
                      : 'hover:from-gray-50 hover:to-gray-200'
                  } ${index === 0 ? 'rounded-l' : ''} ${index === notes.filter(n => !isBlackKey(n.note)).length - 1 ? 'rounded-r' : ''}`}
                  onMouseDown={() => handleNotePress(noteInfo)}
                  onMouseUp={() => handleNoteRelease(noteInfo)}
                  onMouseLeave={() => handleNoteRelease(noteInfo)}
                  onTouchStart={() => handleNotePress(noteInfo)}
                  onTouchEnd={() => handleNoteRelease(noteInfo)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-gray-600 text-xs font-semibold">
                      {noteInfo.note}{noteInfo.octave}
                    </div>
                    {!isMobile && noteInfo.keyBinding && (
                      <div className="text-gray-400 text-xs font-mono mt-1">
                        {noteInfo.keyBinding.toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
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
            {isMuted && (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Muted
              </span>
            )}
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              Tempo: {tempo} BPM
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              {waveform} Wave
            </span>
            {!isMobile && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Keyboard Ready
              </span>
            )}
          </div>
          
          <AnimatePresence>
            {activeNotes.size > 0 && !isMuted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm border border-blue-500/30"
              >
                <span>🎹 Playing</span>
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

export default InteractivePiano;
