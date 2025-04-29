
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Note } from './NoteDial';
import { cn } from '@/lib/utils';

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

const TuningMeter: React.FC<TuningMeterProps> = ({ currentNote }) => {
  const tuningMeterRef = useRef<HTMLDivElement>(null);

  if (!currentNote) return null;

  return (
    <motion.div 
      className="relative h-24 flex flex-col items-center justify-center"
      ref={tuningMeterRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Meter background */}
      <div className="h-3 w-full max-w-md bg-black/20 rounded-full overflow-hidden relative">
        {/* Center line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-10 w-0.5 bg-gold"></div>
        
        {/* Markings */}
        <div className="absolute top-3 left-0 w-full flex justify-between px-0">
          <div className="h-3 w-0.5 bg-gold/50"></div>
          <div className="h-2 w-0.5 bg-gold/40"></div>
          <div className="h-2 w-0.5 bg-gold/40"></div>
          <div className="h-3 w-0.5 bg-gold/50"></div>
          <div className="h-2 w-0.5 bg-gold/40"></div>
          <div className="h-2 w-0.5 bg-gold/40"></div>
          <div className="h-3 w-0.5 bg-gold/50"></div>
        </div>
        
        {/* Tuner needle */}
        <motion.div 
          className="absolute top-0 left-1/2 -mt-1"
          initial={{ rotate: 0 }}
          animate={{ rotate: getNeedleRotation(currentNote.cents) }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <motion.div 
            className="h-10 w-1 bg-primary rounded-t-full"
            animate={{
              backgroundColor: getCentsAccuracyColor(currentNote.cents)
            }}
          ></motion.div>
          <motion.div 
            className="w-3 h-3 rounded-full bg-primary absolute -top-1 left-1/2 transform -translate-x-1/2"
            animate={{
              backgroundColor: getCentsAccuracyColor(currentNote.cents)
            }}
          ></motion.div>
        </motion.div>
        
        {/* Scale labels */}
        <div className="flex justify-between px-1 mt-12 text-xs text-muted-foreground">
          <span>-50</span>
          <span>-25</span>
          <span>0</span>
          <span>+25</span>
          <span>+50</span>
        </div>
      </div>
      
      {/* Cents gradient bar */}
      <div className="w-full max-w-md h-3 mt-2 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-70"></div>
      </div>
    </motion.div>
  );
};

export default TuningMeter;
