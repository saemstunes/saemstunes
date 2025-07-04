
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info, Settings, Zap, X, RotateCcw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

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

const RealisticGuitar: React.FC = () => {
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
  const [strumDirection, setStrumDirection] = useState<'down' | 'up' | null>(null);
  const [showPick, setShowPick] = useState(false);
  const [pickPosition, setPickPosition] = useState(0);
  
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
    const strumDelay = direction === 'down' ? 30 : 25; // Down strokes slightly slower
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
      
      {/* Guitar body and sound hole */}
      <div className="relative">
        {/* Sound hole with rosette */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-10">
          <div className="w-16 h-16 rounded-full bg-black border-4 border-amber-600 relative">
            <div className="absolute inset-2 rounded-full border-2 border-amber-400"></div>
            <div className="absolute inset-4 rounded-full border border-amber-300"></div>
          </div>
        </div>

        {/* Pick animation */}
        <AnimatePresence>
          {showPick && (
            <motion.div
              className="absolute z-20 w-4 h-6 bg-amber-200 rounded-sm shadow-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: strumDirection === 'down' ? 20 : -20,
                y: pickPosition * 100 + '%'
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{
                left: '60%',
                top: '20%',
                transform: `rotate(${strumDirection === 'down' ? 15 : -15}deg)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Fretboard */}
        <div className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-xl p-6 shadow-inner">
          {/* Fret markers */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-6">
            {[3, 5, 7, 9, 12].map(fret => (
              <div key={fret} className="flex flex-col items-center">
                <div className="w-3 h-3 bg-amber-200 rounded-full opacity-40 mb-1" />
                {fret === 12 && <div className="w-3 h-3 bg-amber-200 rounded-full opacity-40" />}
              </div>
            ))}
          </div>

          {/* Nut */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-ivory rounded-full" />
          
          {/* Fret wires */}
          {Array.from({ length: 13 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"
              style={{ left: `${(i + 1) * (100 / 14)}%` }}
            />
          ))}

          {/* Strings */}
          <div className="space-y-4 py-4">
            {strings.map((string, stringIndex) => (
              <motion.div
                key={stringIndex}
                className="relative flex items-center"
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
                    boxShadow: activeNotes.has(`${stringIndex}-0`) ? 
                      '0 0 8px rgba(255,215,0,0.8)' : 'none'
                  }}
                />
                
                {/* Tuning peg */}
                <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 relative z-10 shadow-md border-2 border-amber-600">
                  {string.note}
                </div>
                
                {/* Frets */}
                <div className="flex-1 flex relative z-10">
                  {string.frets.slice(0, 13).map((fret, fretIndex) => (
                    <button
                      key={fretIndex}
                      className={`flex-1 h-12 border-r border-amber-600/30 flex items-center justify-center transition-all duration-200 ${
                        activeNotes.has(`${stringIndex}-${fretIndex}`) || 
                        activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}`
                          ? 'bg-yellow-400/40 scale-110 shadow-lg'
                          : 'hover:bg-amber-600/20'
                      }`}
                      onClick={() => playNote(fret.frequency, stringIndex, fretIndex)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {fretIndex === 0 && (
                        <div className="w-6 h-6 bg-amber-600 rounded-full shadow-md border border-amber-500" />
                      )}
                      {fretIndex > 0 && (activeNotes.has(`${stringIndex}-${fretIndex}`) ||
                        activeNoteKeysByString.current.get(stringIndex) === `${stringIndex}-${fretIndex}`) && (
                        <motion.div
                          className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500"
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

        {/* Bridge */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-20 bg-amber-600 rounded-full shadow-lg" />
      </div>

      {/* Control buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
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
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 space-y-2">
        <p className="text-amber-100 text-sm">
          {isTouch ? 'Tap frets • Swipe across strings to strum' : 'Click frets • Drag across strings to strum'}
        </p>
        <div className="flex justify-center gap-4 text-xs text-amber-200">
          <span>⬇️ Down strum</span>
          <span>⬆️ Up strum</span>
          <span>🎵 Hold frets while strumming for chords</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RealisticGuitar;
