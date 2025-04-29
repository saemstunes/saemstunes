
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for note detection
export type Note = {
  name: string;
  frequency: number;
  cents: number;
  octave: number;
};

// Define the musical notes in the chromatic scale
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface NoteDialProps {
  currentNote: Note | null;
  isListening: boolean;
}

// Convert cents to a color on a red-to-green gradient with proper opacity
const getCentsAccuracyColor = (cents: number) => {
  // Get absolute value of cents (distance from perfect pitch)
  const absCents = Math.abs(cents);
  
  // Create a logarithmic scale for color mapping (more green for closer matches)
  let opacity = Math.max(0.2, 1 - Math.log10(Math.max(1, absCents) / 5) * 0.4);
  
  // Color gradient from red to green based on accuracy
  if (absCents < 5) return `rgba(0, 255, 0, ${opacity})`; // Perfect - Green
  if (absCents < 10) return `rgba(120, 255, 0, ${opacity})`; // Near perfect - Light green
  if (absCents < 15) return `rgba(180, 255, 0, ${opacity})`; // Very good - Yellow-green
  if (absCents < 20) return `rgba(255, 255, 0, ${opacity})`; // Good - Yellow
  if (absCents < 30) return `rgba(255, 180, 0, ${opacity})`; // OK - Golden
  if (absCents < 40) return `rgba(255, 120, 0, ${opacity})`; // Not great - Orange
  if (absCents < 50) return `rgba(255, 60, 0, ${opacity})`; // Poor - Dark orange
  return `rgba(255, 0, 0, ${opacity})`; // Far off - Red
};

const NoteDial: React.FC<NoteDialProps> = ({ currentNote, isListening }) => {
  return (
    <motion.div 
      className="relative w-64 h-64 md:w-72 md:h-72"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Circular background with wooden texture */}
      <div 
        className="absolute inset-0 rounded-full shadow-xl flex items-center justify-center overflow-hidden"
        style={{
          background: "radial-gradient(circle, #8B4513 0%, #704214 50%, #5D370F 100%)",
          boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Wood grain pattern */}
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
            backgroundSize: "20px 20px",
            transform: "rotate(30deg)"
          }}
        />
        
        {/* Inner circle with notes background */}
        <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-black/80 flex items-center justify-center relative">
          {/* Decorative music note symbols - arranged in circle */}
          {NOTES.map((note, index) => {
            // Calculate position on a circle
            const angle = (index * Math.PI * 2) / NOTES.length;
            const x = Math.sin(angle) * 90; // Radius
            const y = -Math.cos(angle) * 90; // Negative because y increases downward
            
            const isCurrentNote = currentNote?.name === note;
            
            // Dynamic color based on current note and cents difference
            const noteColor = isCurrentNote && currentNote 
              ? getCentsAccuracyColor(currentNote.cents) 
              : 'rgb(147, 124, 80)'; // gold-ish for wooden theme
            
            return (
              <motion.div 
                key={index}
                className={`absolute text-sm md:text-base font-bold transform -translate-x-1/2 -translate-y-1/2 ${
                  isCurrentNote ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x}px, ${y}px)`,
                  color: isCurrentNote ? noteColor : undefined,
                  textShadow: isCurrentNote ? '0 0 10px rgba(255,255,255,0.7)' : 'none'
                }}
                animate={{
                  scale: isCurrentNote ? [1, 1.5, 1] : 1,
                  transition: { 
                    duration: isCurrentNote ? 0.3 : 0,
                    ease: "easeInOut" 
                  }
                }}
              >
                {note}
              </motion.div>
            );
          })}
          
          {/* Center circle with note display */}
          <motion.div 
            className="w-40 h-40 rounded-full bg-black/90 border-2 border-gold/30 shadow-inner flex flex-col items-center justify-center"
            animate={{
              scale: currentNote ? [1, 1.05, 1] : 1,
              transition: { duration: 0.3 }
            }}
          >
            {currentNote ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  className="flex flex-col items-center"
                  key={currentNote.name + currentNote.octave}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold mb-1"
                    style={{ color: getCentsAccuracyColor(currentNote.cents) }}
                    animate={{ 
                      textShadow: [
                        "0 0 8px rgba(255,255,255,0.5)",
                        "0 0 16px rgba(255,255,255,0.7)",
                        "0 0 8px rgba(255,255,255,0.5)"
                      ]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {currentNote.name}
                  </motion.div>
                  <div className="text-sm text-gold">
                    Octave {currentNote.octave}
                  </div>
                  <div className="mt-1 text-xs text-gold/70">
                    {currentNote.frequency.toFixed(1)} Hz
                  </div>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${getCentsAccuracyClass(currentNote.cents)}`}>
                    {currentNote.cents > 0 ? '+' : ''}{currentNote.cents} cents
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-gold text-opacity-70 text-center px-4">
                {isListening ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Listening...
                  </motion.div>
                ) : (
                  "Tap Start to Detect Pitch"
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Get CSS class for accuracy badge
export const getCentsAccuracyClass = (cents: number) => {
  const absCents = Math.abs(cents);
  if (absCents < 5) return 'bg-green-500 text-white';
  if (absCents < 15) return 'bg-green-400 text-white';
  if (absCents < 30) return 'bg-yellow-400 text-black';
  if (absCents < 50) return 'bg-orange-400 text-white';
  return 'bg-red-500 text-white';
};

export default NoteDial;
