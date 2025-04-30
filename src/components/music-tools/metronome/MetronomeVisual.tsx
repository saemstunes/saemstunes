import React from 'react';
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

  const getBeatPosition = (index: number) => {
    // Calculate position on a circle for each beat
    const angle = (2 * Math.PI * index) / beatsPerMeasure;
    const radius = 40; // Circle radius percentage
    
    return {
      top: `${50 - radius * Math.cos(angle)}%`,
      left: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-64 h-72 md:w-80 md:h-80">
        {/* Wooden base */}
        <div 
          className="absolute bottom-0 left-1/2 w-40 h-12 rounded-b-xl transform -translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, #8B4513, #5D370F)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
          }}
        >
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 10px)",
              backgroundSize: "20px 20px"
            }}
          />
        </div>
        
        {/* Wooden pyramid body */}
        <div 
          className="absolute bottom-12 left-1/2 w-56 h-44 transform -translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, #704214, #8B4513)",
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
              backgroundSize: "20px 20px"
            }}
          />
          
          {/* Center circle dial */}
          <div 
            className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2" 
            style={{
              background: "radial-gradient(circle, #F5F5DC, #E8E4C9)",
              border: "3px solid #5D370F"
            }}
          >
            <motion.div 
              className="absolute top-1/2 left-1/2 text-3xl font-mono font-bold transform -translate-x-1/2 -translate-y-1/2 text-[#5D370F]"
              key={tempo}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {tempo}
            </motion.div>
          </div>
          
          {/* Beat markers */}
          {visualFeedback && (
            <div className="absolute inset-0">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => {
                const position = getBeatPosition(i);
                const isActive = isPlaying && currentBeat === i;
                
                return (
                  <motion.div 
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      top: position.top,
                      left: position.left,
                      transform: 'translate(-50%, -50%)',
                      background: isActive ? "#FFD700" : "#CD853F",
                      boxShadow: isActive ? "0 0 10px rgba(255, 215, 0, 0.7)" : "none"
                    }}
                    animate={{
                      scale: isActive ? [1, 1.5, 1] : 1,
                      opacity: isActive ? [0.7, 1, 0.7] : 0.7
                    }}
                    transition={{
                      duration: isActive ? 0.2 : 0,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Pendulum rod and weight */}
        {visualFeedback && (
          <motion.div
            className="absolute bottom-12 left-1/2 origin-bottom"
            style={{ bottom: "56px" }}
            animate={pendulumControls}
          >
            <div className="absolute w-0.5 h-48 bg-gray-800 left-0 transform -translate-x-1/2" />
            {/* Pendulum weight */}
            <div 
              className="absolute -top-3 left-0 w-6 h-12 transform -translate-x-1/2"
              style={{
                background: "linear-gradient(to right, #FFD700, #B8860B, #FFD700)",
                borderRadius: "4px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)"
              }}
            />
          </motion.div>
        )}
        
        {/* Tempo text */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-3 text-sm font-semibold text-white/90"
        >
          BPM
        </div>
      </div>
    </div>
  );
};

export default MetronomeVisual;
