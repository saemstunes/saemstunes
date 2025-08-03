// src/components/music-tools/Metronome.tsx
import React from 'react';
import { motion } from "framer-motion";
import MetronomeVisual from './metronome/MetronomeVisual';
import MetronomeControls from './metronome/MetronomeControls';
import { useMetronome } from './metronome/useMetronome';

const Metronome = () => {
  const {
    isPlaying,
    tempo,
    setTempo,
    beatsPerMeasure,
    setBeatsPerMeasure,
    visualFeedback,
    setVisualFeedback,
    currentBeat,
    pendulumControls,
    startStop,
    tapTempo
  } = useMetronome();

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto p-4 space-y-8 rounded-lg"
      style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255, 215, 0, 0.1)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Metronome visual display */}
      <MetronomeVisual 
        tempo={tempo}
        isPlaying={isPlaying}
        visualFeedback={visualFeedback}
        currentBeat={currentBeat}
        beatsPerMeasure={beatsPerMeasure}
        pendulumControls={pendulumControls}
      />

      {/* Controls */}
      <MetronomeControls 
        tempo={tempo}
        setTempo={setTempo}
        isPlaying={isPlaying}
        startStop={startStop}
        beatsPerMeasure={beatsPerMeasure}
        setBeatsPerMeasure={setBeatsPerMeasure}
        visualFeedback={visualFeedback}
        setVisualFeedback={setVisualFeedback}
        tapTempo={tapTempo}
      />
    </motion.div>
  );
};

export default Metronome;
