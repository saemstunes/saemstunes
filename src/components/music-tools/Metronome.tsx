
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
    startStop
  } = useMetronome();
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wooden metronome visual display */}
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
      />
    </motion.div>
  );
};

export default Metronome;
