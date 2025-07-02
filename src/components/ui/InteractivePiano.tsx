import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PianoKey {
  note: string;
  type: 'white' | 'black';
  frequency: number;
  offset?: number;
}

const InteractivePiano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
        gainNode.current.gain.setValueAtTime(volume, audioContext.current.currentTime);
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [volume]);

  const keys = useMemo<PianoKey[]>(() => [
    { note: 'C', type: 'white', frequency: 261.63 },
    { note: 'C#', type: 'black', frequency: 277.18, offset: 30 },
    { note: 'D', type: 'white', frequency: 293.66 },
    { note: 'D#', type: 'black', frequency: 311.13, offset: 78 },
    { note: 'E', type: 'white', frequency: 329.63 },
    { note: 'F', type: 'white', frequency: 349.23 },
    { note: 'F#', type: 'black', frequency: 369.99, offset: 174 },
    { note: 'G', type: 'white', frequency: 392.00 },
    { note: 'G#', type: 'black', frequency: 415.30, offset: 222 },
    { note: 'A', type: 'white', frequency: 440.00 },
    { note: 'A#', type: 'black', frequency: 466.16, offset: 270 },
    { note: 'B', type: 'white', frequency: 493.88 }
  ], []);

  const playAudioNote = useCallback((frequency: number) => {
    if (!audioContext.current || !gainNode.current || isMuted) return;

    try {
      const oscillator = audioContext.current.createOscillator();
      const noteGain = audioContext.current.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(gainNode.current);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      oscillator.type = 'triangle'; // More pleasant piano-like sound
      
      noteGain.gain.setValueAtTime(0, audioContext.current.currentTime);
      noteGain.gain.linearRampToValueAtTime(volume * 0.3, audioContext.current.currentTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + 0.3);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [volume, isMuted]);

  const playNote = useCallback((note: string) => {
    const key = keys.find(k => k.note === note);
    if (!key) return;

    setActiveKeys(prev => new Set(prev).add(note));
    playAudioNote(key.frequency);
    
    // Visual feedback duration
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 300);
  }, [keys, playAudioNote]);

  const playDemo = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setShowDemo(false);
    
    const melody = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    
    melody.forEach((note, index) => {
      setTimeout(() => {
        playNote(note);
        if (index === melody.length - 1) {
          setTimeout(() => setIsPlaying(false), 300);
        }
      }, index * 250);
    });
  }, [isPlaying, playNote]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (gainNode.current && audioContext.current) {
      gainNode.current.gain.setValueAtTime(
        isMuted ? volume : 0, 
        audioContext.current.currentTime
      );
    }
  }, [isMuted, volume]);

  const whiteKeys = keys.filter(k => k.type === 'white');
  const blackKeys = keys.filter(k => k.type === 'black');

  // Keyboard controls
  useEffect(() => {
    const keyMap: Record<string, string> = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
      'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B'
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && !activeKeys.has(note)) {
        playNote(note);
      }
      if (event.key === ' ') {
        event.preventDefault();
        playDemo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, playDemo, activeKeys]);

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-purple-500/10 opacity-50" />
      
      {/* Interactive tutorial overlay */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-3 py-1.5 text-white text-xs font-medium z-20"
          >
            ✨ Click keys or press space!
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        {/* Demo Control and Volume */}
        <motion.div 
          className="flex justify-center items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={playDemo}
            disabled={isPlaying}
            className="bg-gold/20 hover:bg-gold/30 text-white border border-gold/30 backdrop-blur-sm transition-all duration-300"
            size="sm"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Playing...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Demo
              </>
            )}
          </Button>
          
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white h-8 w-8 p-0"
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>
        </motion.div>

        {/* Piano Keys Container */}
        <div className="relative flex justify-center">
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
                  w-8 h-24 sm:w-10 sm:h-28 md:w-12 md:h-32 rounded-b-lg transition-all duration-200 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark scale-95 shadow-xl shadow-gold/50' 
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 shadow-lg hover:shadow-xl'
                  }
                  active:scale-90 border border-gray-300 touch-manipulation
                `}
                onClick={() => playNote(key.note)}
                onMouseEnter={() => !activeKeys.has(key.note) && setShowDemo(false)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <span className="text-xs font-medium text-slate-700 mt-16 sm:mt-20 md:mt-24 block">
                  {key.note}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Black Keys Overlay */}
          <div className="absolute top-0 flex pointer-events-none">
            {blackKeys.map((key, index) => (
              <motion.button
                key={key.note}
                className={`
                  pointer-events-auto w-5 h-16 sm:w-6 sm:h-18 md:w-7 md:h-20 rounded-b-md transition-all duration-200 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark shadow-xl shadow-gold/50 scale-95' 
                    : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg'
                  }
                  active:scale-90 border border-gray-700 touch-manipulation
                `}
                style={{ 
                  marginLeft: `${(key.offset || 0) * 0.8}px`,
                  zIndex: 10 
                }}
                onClick={() => playNote(key.note)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <span className="text-xs text-white font-medium mt-10 sm:mt-12 md:mt-14 block">
                  {key.note}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <motion.div 
          className="text-center mt-4 space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/80 text-xs sm:text-sm">
            Interactive Piano Experience
          </p>
          <div className="flex items-center justify-center gap-1 text-gold/60 text-xs">
            <Volume2 className="h-3 w-3" />
            <span className="hidden sm:inline">Click keys • Space for demo • AWSEDFTGYUHJ keys</span>
            <span className="sm:hidden">Tap keys • Space for demo</span>
          </div>
          
          {/* Key indicator */}
          <AnimatePresence>
            {activeKeys.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs"
              >
                ♪ {Array.from(activeKeys).join(', ')}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notifications */}
          <AnimatePresence>
            {!isMuted && activeKeys.size === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold/90 to-yellow-500/90 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg"
                style={{ pointerEvents: 'none' }}
              >
                🎹 Ready to play! Try clicking a key
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-gold/30 rounded-full animate-pulse" />
      <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-6 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </motion.div>
  );
};

export default InteractivePiano;