
import React from 'react';
import { motion } from 'framer-motion';

interface MetronomeVisualProps {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
}

const MetronomeVisual: React.FC<MetronomeVisualProps> = ({
  bpm,
  isPlaying,
  currentBeat,
  beatsPerMeasure
}) => {
  return (
    <div className="metronome-visual">
      <motion.div
        className="metronome-pendulum"
        animate={{
          rotate: isPlaying ? [0, 30, -30, 0] : 0
        }}
        transition={{
          duration: 60 / bpm,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear"
        }}
      >
        <div className="pendulum-arm" />
      </motion.div>
      
      <div className="beat-indicators">
        {Array.from({ length: beatsPerMeasure }, (_, i) => (
          <div
            key={i}
            className={`beat-dot ${i === currentBeat ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MetronomeVisual;
