
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PianoKey {
  note: string;
  frequency: number;
  type: 'white' | 'black';
  position?: number;
}

const InteractivePiano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  // Memoized piano keys for performance
  const pianoKeys = useMemo<PianoKey[]>(() => [
    { note: 'C', frequency: 261.63, type: 'white' },
    { note: 'C#', frequency: 277.18, type: 'black', position: 1 },
    { note: 'D', frequency: 293.66, type: 'white' },
    { note: 'D#', frequency: 311.13, type: 'black', position: 2 },
    { note: 'E', frequency: 329.63, type: 'white' },
    { note: 'F', frequency: 349.23, type: 'white' },
    { note: 'F#', frequency: 369.99, type: 'black', position: 4 },
    { note: 'G', frequency: 392.00, type: 'white' },
    { note: 'G#', frequency: 415.30, type: 'black', position: 5 },
    { note: 'A', frequency: 440.00, type: 'white' },
    { note: 'A#', frequency: 466.16, type: 'black', position: 6 },
    { note: 'B', frequency: 493.88, type: 'white' }
  ], []);

  const whiteKeys = useMemo(() => pianoKeys.filter(key => key.type === 'white'), [pianoKeys]);
  const blackKeys = useMemo(() => pianoKeys.filter(key => key.type === 'black'), [pianoKeys]);

  // Initialize audio context on first interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play note with Web Audio API
  const playNote = useCallback((note: string, frequency: number) => {
    const audioContext = getAudioContext();
    
    // Resume context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Stop existing oscillator for this note
    const existingOsc = oscillatorsRef.current.get(note);
    if (existingOsc) {
      existingOsc.stop();
      oscillatorsRef.current.delete(note);
    }

    // Create new oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    // Envelope for natural sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    oscillatorsRef.current.set(note, oscillator);

    // Visual feedback
    setActiveKeys(prev => new Set(prev).add(note));
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 200);
  }, [getAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        <div className="relative flex justify-center">
          {/* White keys */}
          <div className="flex">
            {whiteKeys.map((key) => (
              <motion.button
                key={key.note}
                className={`w-10 h-32 mx-0.5 rounded-b-lg border border-gray-300 transition-all duration-150 transform-gpu ${
                  activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark scale-95 shadow-lg shadow-gold/40' 
                    : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 shadow-md hover:shadow-lg'
                }`}
                onClick={() => playNote(key.note, key.frequency)}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: 'transform' }}
              >
                <span className="text-xs font-medium text-slate-700 mt-24 block select-none">
                  {key.note}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Black keys */}
          <div className="absolute top-0 flex pointer-events-none">
            {blackKeys.map((key) => (
              <motion.button
                key={key.note}
                className={`w-6 h-20 rounded-b-lg transition-all duration-150 transform-gpu pointer-events-auto ${
                  activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-gold to-gold-dark shadow-lg shadow-gold/40 scale-95' 
                    : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg'
                }`}
                style={{ 
                  marginLeft: key.position === 1 ? '32px' : 
                            key.position === 2 ? '32px' :
                            key.position === 4 ? '64px' :
                            key.position === 5 ? '32px' :
                            key.position === 6 ? '32px' : '32px',
                  willChange: 'transform'
                }}
                onClick={() => playNote(key.note, key.frequency)}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/80 text-sm font-medium">
            🎹 Click the keys to play notes!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractivePiano;
