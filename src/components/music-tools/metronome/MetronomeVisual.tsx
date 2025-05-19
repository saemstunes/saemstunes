// src/components/music-tools/metronome/MetronomeVisual.tsx
import React, { useMemo } from 'react';
import { motion } from "framer-motion";

interface MetronomeVisualProps {
  tempo: number;
  isPlaying: boolean;
  visualFeedback: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
  pendulumControls: any;
}

const MetronomeVisual: React.FC<MetronomeVisualProps> = ({
  tempo,
  isPlaying,
  visualFeedback,
  currentBeat,
  beatsPerMeasure,
  pendulumControls
}) => {
  // Calculate the beat marker positions on a circle
  const beatMarkers = useMemo(() => {
    return Array.from({ length: beatsPerMeasure }).map((_, i) => {
      // Calculate position on a circle - starting at the top (12 o'clock position)
      // and moving clockwise
      const angle = (Math.PI * 1.5) + (2 * Math.PI * i / beatsPerMeasure);
      const radius = 42; // Circle radius percentage
      
      return {
        top: `${50 - radius * Math.sin(angle)}%`,
        left: `${50 + radius * Math.cos(angle)}%`,
        beat: i
      };
    });
  }, [beatsPerMeasure]);

  // Dynamic styles for the tempo display
  const tempoTextStyle = {
    color: '#FFD700',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
    fontFamily: 'monospace',
    fontSize: tempo > 99 ? '5rem' : '6rem',
  };

  return (
    <div className="flex justify-center items-center mb-8">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Circular base with wooden texture */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, #704214 20%, #5D370F 100%)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)",
          }}
        >
          {/* Wood grain effect */}
          <div className="absolute inset-0 rounded-full opacity-20" 
            style={{
              backgroundImage: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.2) 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
            }}
          />
        </div>
        
        {/* Tempo Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-40 h-40 flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.7), 0 0 15px rgba(0,0,0,0.5)",
          }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(255, 215, 0, 0.3)",
              boxShadow: isPlaying ? "0 0 15px rgba(255, 215, 0, 0.3)" : "none"
            }}
            animate={{ opacity: isPlaying ? [0.3, 0.8, 0.3] : 0.3 }}
            transition={{ 
              duration: isPlaying ? 60/tempo : 0, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          />
          
          {/* Tempo value display */}
          <motion.div 
            className="text-center z-10"
            key={tempo}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div style={tempoTextStyle}>{tempo}</div>
            <div className="text-xs text-gold opacity-70 uppercase tracking-wider mt-1">BPM</div>
          </motion.div>
        </div>
        
        {/* Beat Markers Circle */}
        {visualFeedback && (
          <div className="absolute inset-0">
            {beatMarkers.map(({ top, left, beat }) => {
              const isActive = isPlaying && currentBeat === beat;
              const isFirstBeat = beat === 0;
              
              return (
                <motion.div 
                  key={beat}
                  className="absolute rounded-full"
                  style={{
                    top,
                    left,
                    width: isFirstBeat ? '20px' : '16px',
                    height: isFirstBeat ? '20px' : '16px',
                    transform: 'translate(-50%, -50%)',
                    background: isActive 
                      ? isFirstBeat ? "#FFD700" : "rgba(255, 215, 0, 0.8)" 
                      : isFirstBeat ? "rgba(255, 215, 0, 0.5)" : "rgba(255, 215, 0, 0.3)",
                    boxShadow: isActive 
                      ? isFirstBeat ? "0 0 16px rgba(255, 215, 0, 1)" : "0 0 12px rgba(255, 215, 0, 0.9)" 
                      : isFirstBeat ? "0 0 8px rgba(255, 215, 0, 0.3)" : "none"
                  }}
                  animate={{
                    scale: isActive ? [1, 1.4, 1] : 1,
                    opacity: isActive ? [0.7, 1, 0.7] : isFirstBeat ? 0.9 : 0.7
                  }}
                  transition={{
                    duration: isActive ? 0.2 : 0,
                    ease: "easeOut"
                  }}
                />
              );
            })}
            
            {/* Sequential beat highlight indicator - separate from the markers */}
            {isPlaying && (
              <motion.div
                className="absolute rounded-full z-10"
                style={{
                  top: beatMarkers[currentBeat].top,
                  left: beatMarkers[currentBeat].left,
                  width: currentBeat === 0 ? '24px' : '20px',
                  height: currentBeat === 0 ? '24px' : '20px',
                  transform: 'translate(-50%, -50%)',
                  background: "transparent",
                  border: `2px solid ${currentBeat === 0 ? "#FFD700" : "rgba(255, 215, 0, 0.8)"}`,
                  boxShadow: `0 0 ${currentBeat === 0 ? '20px' : '15px'} ${currentBeat === 0 ? 'rgba(255, 215, 0, 1)' : 'rgba(255, 215, 0, 0.9)'}`
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 60/tempo * 0.8, 
                  ease: "easeOut",
                  times: [0, 0.3, 1]
                }}
                key={`beat-${currentBeat}-${Date.now()}`} // Force re-render on beat change
              />
            )}
          </div>
        )}
        
        {/* Beat connection line */}
        {visualFeedback && isPlaying && beatsPerMeasure > 2 && (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <motion.circle
              cx="50%"
              cy="50%"
              r="42%"
              fill="none"
              stroke="rgba(255, 215, 0, 0.15)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </svg>
        )}
        
        {/* Pendulum for visual feedback */}
        {visualFeedback && isPlaying && (
          <motion.div
            className="absolute top-1/2 left-1/2 origin-center"
            style={{ 
              width: "2px", 
              height: "50%", 
              background: "linear-gradient(to bottom, transparent 0%, rgba(255, 215, 0, 0.5) 50%, #FFD700 100%)",
              transformOrigin: "50% 0%",
              zIndex: 5
            }}
            animate={pendulumControls}
          >
            {/* Pendulum weight */}
            <div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full"
              style={{
                background: "radial-gradient(circle, #FFD700, #B8860B)",
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.7)"
              }}
            />
          </motion.div>
        )}
        
        {/* Tempo change indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "2px solid rgba(255, 215, 0, 0.4)",
            opacity: 0
          }}
          key={`tempo-change-${tempo}`}
          animate={{ 
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.1, 1]
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut",
            times: [0, 0.4, 1]
          }}
        />
      </div>
    </div>
  );
};

export default MetronomeVisual;
