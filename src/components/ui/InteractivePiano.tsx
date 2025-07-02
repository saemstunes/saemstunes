import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PianoKey {
  note: string;
  type: 'white' | 'black';
  frequency: number;
}

const InteractivePiano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const keys = useMemo<PianoKey[]>(() => [
    { note: 'C', type: 'white', frequency: 261.63 },
    { note: 'C#', type: 'black', frequency: 277.18 },
    { note: 'D', type: 'white', frequency: 293.66 },
    { note: 'D#', type: 'black', frequency: 311.13 },
    { note: 'E', type: 'white', frequency: 329.63 },
    { note: 'F', type: 'white', frequency: 349.23 },
    { note: 'F#', type: 'black', frequency: 369.99 },
    { note: 'G', type: 'white', frequency: 392.00 },
    { note: 'G#', type: 'black', frequency: 415.30 },
    { note: 'A', type: 'white', frequency: 440.00 },
    { note: 'A#', type: 'black', frequency: 466.16 },
    { note: 'B', type: 'white', frequency: 493.88 }
  ], []);

  const playNote = useCallback((note: string) => {
    setActiveKeys(prev => new Set(prev).add(note));
    
    // Visual feedback duration
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 300);
  }, []);

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

  const whiteKeys = keys.filter(k => k.type === 'white');
  const blackKeys = keys.filter(k => k.type === 'black');

  // Calculate black key positions
  const getBlackKeyOffset = (index: number) => {
    const offsets = [35, 95, 205, 265, 325]; // Positions relative to white keys
    return offsets[index] || 0;
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-black p-8 rounded-2xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-purple-500/10 opacity-50" />
      
      {/* Interactive tutorial overlay */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-2 text-white text-sm font-medium z-20"
          >
            ✨ Click keys or try the demo!
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        {/* Demo Control */}
        <motion.div 
          className="flex justify-center mb-6"
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
                <Pause className="h-4 w-4 mr-2" />
                Playing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play Demo
              </>
            )}
          </Button>
        </motion.div>

        {/* Piano Keys Container */}
        <div className="relative flex justify-center">
          {/* White Keys */}
          <motion.div 
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {whiteKeys.map((key, index) => (
              <motion.button
                key={key.note}
                className={`
                  w-12 h-36 rounded-b-lg transition-all duration-200 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark scale-95 shadow-xl shadow-gold/50' 
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 shadow-lg hover:shadow-xl'
                  }
                  active:scale-90 border border-gray-300
                `}
                onClick={() => playNote(key.note)}
                onMouseEnter={() => !activeKeys.has(key.note) && setShowDemo(false)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <span className="text-xs font-medium text-slate-700 mt-28 block">
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
                  pointer-events-auto w-8 h-24 rounded-b-md transition-all duration-200 transform-gpu
                  ${activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark shadow-xl shadow-gold/50 scale-95' 
                    : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg'
                  }
                  active:scale-90 border border-gray-700
                `}
                style={{ 
                  marginLeft: `${getBlackKeyOffset(index)}px`,
                  zIndex: 10 
                }}
                onClick={() => playNote(key.note)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <span className="text-xs text-white font-medium mt-16 block">
                  {key.note}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <motion.div 
          className="text-center mt-6 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/80 text-sm">
            Interactive Piano Experience
          </p>
          <div className="flex items-center justify-center gap-2 text-gold/60 text-xs">
            <Volume2 className="h-3 w-3" />
            <span>Click any key to play • Try the demo melody</span>
          </div>
          
          {/* Key indicator */}
          <AnimatePresence>
            {activeKeys.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs"
              >
                Playing: {Array.from(activeKeys).join(', ')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-gold/30 rounded-full animate-pulse" />
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-6 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </motion.div>
  );
};

export default InteractivePiano;