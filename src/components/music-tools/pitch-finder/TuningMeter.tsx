import React from 'react';
import { motion } from 'framer-motion';
import { Note } from './NoteDial';

interface TuningMeterProps {
  currentNote: Note | null;
}

// Calculate needle position based on cents
const getNeedleRotation = (cents: number) => {
  // Map cents (-50 to +50) to degrees (-45 to +45)
  return (cents / 50) * 45;
};

// Convert cents to a color
const getCentsAccuracyColor = (cents: number) => {
  // Get absolute value of cents (distance from perfect pitch)
  const absCents = Math.abs(cents);

  // Create a logarithmic scale for color mapping (more green for closer matches)
  let opacity = Math.max(0.5, 1 - Math.log10(Math.max(1, absCents) / 5) * 0.3);

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

// Convert cents value to display text
const getCentsText = (cents: number) => {
  const absCents = Math.abs(cents);
  if (absCents < 5) return "Perfect";
  if (absCents < 15) return cents < 0 ? "Slightly Flat" : "Slightly Sharp";
  if (absCents < 30) return cents < 0 ? "Flat" : "Sharp";
  return cents < 0 ? "Very Flat" : "Very Sharp";
};

const TuningMeter: React.FC<TuningMeterProps> = ({ currentNote }) => {
  if (!currentNote) return null;

  return (
    <motion.div
      className="relative h-36 flex flex-col items-center justify-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Tuning status text */}
      <motion.div 
        className="text-center text-sm font-medium"
        style={{ 
          color: getCentsAccuracyColor(currentNote.cents),
          textShadow: '0 0 8px rgba(0,0,0,0.2)'
        }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {getCentsText(currentNote.cents)}
      </motion.div>
      
      {/* Meter background - styled like the reference with center needle */}
      <div className="h-16 w-full max-w-md bg-black/30 rounded-full overflow-hidden relative">
        {/* Center marker */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16 w-0.5 bg-gold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Gradient background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%)"
          }}
        />

        {/* Markings */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-0">
          {/* Fine-tune markings to provide more visual cues */}
          {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((val, i) => (
            <div 
              key={i} 
              className="h-3 w-0.5 absolute top-0"
              style={{ 
                left: `${((val + 50) / 100) * 100}%`,
                background: val === 0 ? 'rgb(255, 215, 0)' : 'rgba(255, 215, 0, 0.5)',
                height: val === 0 ? '12px' : val % 20 === 0 ? '8px' : '4px'
              }}
            />
          ))}
        </div>

        {/* Tuner needle */}
        <motion.div
          className="absolute top-1 left-1/2 h-14"
          initial={{ rotate: 0 }}
          animate={{ rotate: getNeedleRotation(currentNote.cents) }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <motion.div
            className="h-14 w-1 rounded-full"
            animate={{
              backgroundColor: getCentsAccuracyColor(currentNote.cents)
            }}
          />
          <motion.div
            className="w-4 h-4 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 border border-black/20"
            animate={{
              backgroundColor: getCentsAccuracyColor(currentNote.cents),
              boxShadow: [
                `0 0 5px ${getCentsAccuracyColor(currentNote.cents)}`,
                `0 0 10px ${getCentsAccuracyColor(currentNote.cents)}`,
                `0 0 5px ${getCentsAccuracyColor(currentNote.cents)}`
              ]
            }}
            transition={{
              boxShadow: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>
      </div>

      {/* Cents scale */}
      <div className="flex justify-between w-full max-w-md px-2 text-xs text-gold/70">
        <span>-50</span>
        <span>-25</span>
        <span>0</span>
        <span>+25</span>
        <span>+50</span>
      </div>

      {/* Cents value display */}
      <motion.div 
        className="text-center text-sm mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ color: getCentsAccuracyColor(currentNote.cents) }}
      >
        {currentNote.cents > 0 ? '+' : ''}{currentNote.cents} cents
      </motion.div>
    </motion.div>
  );
};

export default TuningMeter;
