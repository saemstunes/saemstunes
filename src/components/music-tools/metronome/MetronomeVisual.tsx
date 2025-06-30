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
  // Determine if this is a compound time signature
  const timeSignatureInfo = useMemo(() => {
    const isCompound = beatsPerMeasure === 6 || beatsPerMeasure === 9 || beatsPerMeasure === 12;
    
    let actualBeats: number;
    let subdivisions: number;
    let accentPattern: boolean[];
    
    if (isCompound) {
      // Compound time: group subdivisions
      switch (beatsPerMeasure) {
        case 6: // 6/8 = 2 main beats, each with 3 subdivisions
          actualBeats = 2;
          subdivisions = 3;
          accentPattern = [true, false, false, true, false, false];
          break;
        case 9: // 9/8 = 3 main beats, each with 3 subdivisions
          actualBeats = 3;
          subdivisions = 3;
          accentPattern = [true, false, false, true, false, false, true, false, false];
          break;
        case 12: // 12/8 = 4 main beats, each with 3 subdivisions
          actualBeats = 4;
          subdivisions = 3;
          accentPattern = [true, false, false, true, false, false, true, false, false, true, false, false];
          break;
        default:
          actualBeats = beatsPerMeasure;
          subdivisions = 1;
          accentPattern = Array(beatsPerMeasure).fill(false).map((_, i) => i === 0);
      }
    } else {
      // Simple time: direct beats
      actualBeats = beatsPerMeasure;
      subdivisions = 1;
      accentPattern = Array(beatsPerMeasure).fill(false).map((_, i) => i === 0);
    }
    
    return {
      isCompound,
      actualBeats,
      subdivisions,
      accentPattern,
      totalMarkers: beatsPerMeasure
    };
  }, [beatsPerMeasure]);

  // Calculate the beat marker positions on a circle
  const beatMarkers = useMemo(() => {
    return Array.from({ length: timeSignatureInfo.totalMarkers }).map((_, i) => {
      // Calculate position on a circle, starting from top (12 o'clock) and going clockwise
      const angle = (Math.PI * 1.5) + (2 * Math.PI * i / timeSignatureInfo.totalMarkers);
      const radius = 42; // Circle radius percentage
      
      return {
        top: `${50 - radius * Math.sin(angle)}%`,
        left: `${50 + radius * Math.cos(angle)}%`,
        beat: i,
        isAccent: timeSignatureInfo.accentPattern[i],
        isMainBeat: timeSignatureInfo.isCompound ? 
          i % timeSignatureInfo.subdivisions === 0 : true
      };
    });
  }, [timeSignatureInfo]);

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
            {beatMarkers.map(({ top, left, beat, isAccent, isMainBeat }) => {
              const isActive = isPlaying && currentBeat === beat;
              
              // Different sizes and colors based on beat type
              const markerSize = isAccent ? 'w-5 h-5' : isMainBeat ? 'w-4 h-4' : 'w-3 h-3';
              const baseColor = isAccent ? '#FFD700' : isMainBeat ? '#FFA500' : '#FFD700';
              const activeColor = isAccent ? '#FFFF00' : '#FFD700';
              const inactiveOpacity = isAccent ? 0.6 : isMainBeat ? 0.4 : 0.3;
              
              return (
                <motion.div 
                  key={beat}
                  className={`absolute ${markerSize} rounded-full`}
                  style={{
                    top,
                    left,
                    transform: 'translate(-50%, -50%)',
                    background: isActive ? activeColor : baseColor,
                    boxShadow: isActive ? 
                      (isAccent ? "0 0 20px rgba(255, 255, 0, 1)" : "0 0 15px rgba(255, 215, 0, 0.9)") : 
                      "none",
                    border: isAccent ? "2px solid rgba(255, 255, 255, 0.3)" : 
                           isMainBeat ? "1px solid rgba(255, 255, 255, 0.2)" : "none"
                  }}
                  animate={{
                    scale: isActive ? 
                      (isAccent ? [1, 1.6, 1] : [1, 1.4, 1]) : 1,
                    opacity: isActive ? [0.8, 1, 0.8] : inactiveOpacity
                  }}
                  transition={{
                    duration: isActive ? 0.15 : 0,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Connection lines for compound time groupings */}
        {visualFeedback && timeSignatureInfo.isCompound && (
          <div className="absolute inset-0">
            {Array.from({ length: timeSignatureInfo.actualBeats }).map((_, groupIndex) => {
              const startBeat = groupIndex * timeSignatureInfo.subdivisions;
              const groupActive = isPlaying && 
                currentBeat >= startBeat && 
                currentBeat < startBeat + timeSignatureInfo.subdivisions;
              
              return (
                <motion.div
                  key={`group-${groupIndex}`}
                  className="absolute inset-0"
                  animate={{
                    opacity: groupActive ? 0.3 : 0.1
                  }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Create subtle arc connecting beats in the same group */}
                  <svg className="w-full h-full" style={{ pointerEvents: 'none' }}>
                    <defs>
                      <linearGradient id={`groupGradient-${groupIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255, 215, 0, 0.1)" />
                        <stop offset="50%" stopColor="rgba(255, 215, 0, 0.3)" />
                        <stop offset="100%" stopColor="rgba(255, 215, 0, 0.1)" />
                      </linearGradient>
                    </defs>
                    {/* Draw subtle connecting arcs for compound time groupings */}
                    {Array.from({ length: timeSignatureInfo.subdivisions - 1 }).map((_, connectionIndex) => {
                      const beatIndex1 = startBeat + connectionIndex;
                      const beatIndex2 = startBeat + connectionIndex + 1;
                      
                      if (beatIndex1 < beatMarkers.length && beatIndex2 < beatMarkers.length) {
                        const marker1 = beatMarkers[beatIndex1];
                        const marker2 = beatMarkers[beatIndex2];
                        
                        return (
                          <line
                            key={`connection-${beatIndex1}-${beatIndex2}`}
                            x1={marker1.left}
                            y1={marker1.top}
                            x2={marker2.left}
                            y2={marker2.top}
                            stroke={`url(#groupGradient-${groupIndex})`}
                            strokeWidth="1"
                            opacity={groupActive ? 0.4 : 0.2}
                          />
                        );
                      }
                      return null;
                    })}
                  </svg>
                </motion.div>
              );
            })}
          </div>
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
      </div>
    </div>
  );
};

export default MetronomeVisual;
