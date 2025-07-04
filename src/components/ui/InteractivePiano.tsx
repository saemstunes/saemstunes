
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// Piano key configuration
const whiteKeysLayout = [
  { note: 'C', key: 'a', octave: 4 },
  { note: 'D', key: 's', octave: 4 },
  { note: 'E', key: 'd', octave: 4 },
  { note: 'F', key: 'f', octave: 4 },
  { note: 'G', key: 'g', octave: 4 },
  { note: 'A', key: 'h', octave: 4 },
  { note: 'B', key: 'j', octave: 4 },
  { note: 'C', key: 'k', octave: 5 },
];

const blackKeysLayout = [
  { note: 'C#', key: 'w', octave: 4, position: 1 },
  { note: 'D#', key: 'e', octave: 4, position: 2 },
  { note: 'F#', key: 't', octave: 4, position: 4 },
  { note: 'G#', key: 'y', octave: 4, position: 5 },
  { note: 'A#', key: 'u', octave: 4, position: 6 },
];

const InteractivePiano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useIsMobile();

  // Audio context and oscillator management
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<Map<string, OscillatorNode>>(new Map());

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }

    return () => {
      // Cleanup oscillators
      activeOscillators.forEach(osc => {
        osc.stop();
        osc.disconnect();
      });
    };
  }, []);

  // Convert note to frequency
  const noteToFrequency = (note: string, octave: number): number => {
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    
    return noteFrequencies[note] * Math.pow(2, octave - 4);
  };

  // Play note
  const playNote = useCallback((note: string, octave: number) => {
    if (!audioContext || isMuted) return;

    const frequency = noteToFrequency(note, octave);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    const keyId = `${note}${octave}`;
    setActiveOscillators(prev => {
      const newMap = new Map(prev);
      newMap.set(keyId, oscillator);
      return newMap;
    });

    // Clean up after note ends
    setTimeout(() => {
      setActiveOscillators(prev => {
        const newMap = new Map(prev);
        newMap.delete(keyId);
        return newMap;
      });
    }, 500);
  }, [audioContext, volume, isMuted]);

  // Handle key press
  const handleKeyPress = (note: string, octave: number) => {
    const keyId = `${note}${octave}`;
    setActiveKeys(prev => new Set(prev).add(keyId));
    playNote(note, octave);

    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }, 150);
  };

  // Keyboard event handlers
  useEffect(() => {
    if (isMobile) return; // Don't show keyboard shortcuts on mobile

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Find white key
      const whiteKey = whiteKeysLayout.find(k => k.key === key);
      if (whiteKey) {
        event.preventDefault();
        handleKeyPress(whiteKey.note, whiteKey.octave);
        return;
      }

      // Find black key
      const blackKey = blackKeysLayout.find(k => k.key === key);
      if (blackKey) {
        event.preventDefault();
        handleKeyPress(blackKey.note, blackKey.octave);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-muted/20 to-card/50 rounded-xl p-4 border border-border/50">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Interactive Piano</h3>
          <Badge className="bg-gold/20 text-gold text-xs">Web Audio</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-gold"
            />
            <span className="text-sm text-muted-foreground w-8">{Math.round(volume * 100)}%</span>
          </div>
        </motion.div>
      )}

      {/* Piano Keys */}
      <div className="relative">
        {/* White Keys */}
        <div className="flex gap-1 mb-2">
          {whiteKeysLayout.map((key, index) => {
            const keyId = `${key.note}${key.octave}`;
            const isActive = activeKeys.has(keyId);
            
            return (
              <motion.button
                key={keyId}
                className={`flex-1 h-32 sm:h-40 rounded-b-lg border-2 transition-all duration-100 ${
                  isActive 
                    ? 'bg-gold/30 border-gold scale-95 shadow-inner' 
                    : 'bg-white hover:bg-gray-50 border-gray-300 shadow-lg'
                } ${isMobile ? 'touch-manipulation' : ''}`}
                onMouseDown={() => handleKeyPress(key.note, key.octave)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key.note, key.octave);
                }}
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col justify-end items-center h-full p-2">
                  <span className="text-gray-800 font-medium text-sm">{key.note}</span>
                  {!isMobile && (
                    <span className="text-xs text-gray-500 mt-1 bg-gray-100 px-1 rounded">
                      {key.key.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full flex">
          {blackKeysLayout.map((key) => {
            const keyId = `${key.note}${key.octave}`;
            const isActive = activeKeys.has(keyId);
            const leftPosition = `${(key.position - 0.5) * (100 / whiteKeysLayout.length)}%`;
            
            return (
              <motion.button
                key={keyId}
                className={`absolute h-20 sm:h-24 w-8 sm:w-10 rounded-b-lg transition-all duration-100 ${
                  isActive 
                    ? 'bg-gold scale-95 shadow-inner' 
                    : 'bg-gray-900 hover:bg-gray-800 shadow-lg'
                } ${isMobile ? 'touch-manipulation' : ''}`}
                style={{ left: leftPosition, transform: 'translateX(-50%)' }}
                onMouseDown={() => handleKeyPress(key.note, key.octave)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key.note, key.octave);
                }}
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col justify-end items-center h-full p-1">
                  <span className="text-white font-medium text-xs">{key.note}</span>
                  {!isMobile && (
                    <span className="text-xs text-gray-300 mt-1 bg-gray-800 px-1 rounded">
                      {key.key.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Instructions - Only show on desktop */}
      {!isMobile && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Use keyboard keys or click/tap piano keys to play notes</p>
          <p className="text-xs mt-1">White keys: A-S-D-F-G-H-J-K | Black keys: W-E-T-Y-U</p>
        </div>
      )}

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Tap piano keys to play notes</p>
        </div>
      )}
    </div>
  );
};

export default InteractivePiano;
