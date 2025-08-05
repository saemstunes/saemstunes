import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, Music, Play, Headphones, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animation configurations
const EASINGS = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  decelerate: [0.0, 0.0, 0.2, 1] as const,
};

// Theme colors - refined gold palette
const THEME_COLORS = {
  primary: "#A67C00", // Original brand gold
  primaryLight: "#D4A936", // Light gold
  primaryDark: "#7A5A00", // Dark gold
  primaryRgb: "166, 124, 0",
};

interface SplashScreenProps {
  loading?: boolean;
  onFinish?: () => void;
  logoUrl?: string; // Add prop for custom logo
}

const SplashScreen = ({
  loading = true,
  onFinish,
  logoUrl, // Custom logo image URL
}: SplashScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Tuning instruments...",
    "Setting up stage...",
    "Loading your music...",
    "Almost ready...",
  ];

  // Music notes - refined movement
  const musicNotes = useMemo(() => {
    const musicIcons = [Music, Play, Headphones, Volume2];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      Icon: musicIcons[i % musicIcons.length],
      x: (Math.random() - 0.5) * 70,
      y: 20 + Math.random() * 40,
      rotate: Math.random() * 360,
      scale: 0.7 + Math.random() * 0.3,
      duration: 3 + Math.random() * 1.5,
      delay: i * 0.4,
      opacity: 0.5 + Math.random() * 0.3,
    }));
  }, []);

  // Handle splash screen exit
  const handleSplashExit = useCallback(() => {
    setShowSplash(false);
    onFinish?.();
  }, [onFinish]);

  // Splash screen lifecycle
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(handleSplashExit, 1000);
      return () => clearTimeout(timeout);
    }
  }, [loading, handleSplashExit]);

  // Message cycling
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1800);
    
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  // Progress simulation
  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + (5 + Math.random() * 8), 92));
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: EASINGS.decelerate }
          }}
        >
          {/* Subtle background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            {/* Gold gradient overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at center, rgba(${THEME_COLORS.primaryRgb}, 0.4) 0%, transparent 70%)`
              }}
            />
            
            {/* Subtle shimmer particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`shimmer-${i}`}
                className="absolute rounded-full"
                style={{
                  background: `rgba(${THEME_COLORS.primaryRgb}, ${0.1 + Math.random() * 0.1})`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center p-8 max-w-lg w-full relative z-10">
            {/* Logo container */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.8, ease: EASINGS.standard }
              }}
              aria-label="Saem's Tunes Logo"
            >
              {/* Animated border */}
              <motion.div
                className="absolute -inset-5 rounded-full"
                style={{
                  background: `conic-gradient(
                    transparent, 
                    ${THEME_COLORS.primary}, 
                    transparent, 
                    ${THEME_COLORS.primary}, 
                    transparent
                  )`,
                  mask: "radial-gradient(circle, transparent 70%, black 71%, black 100%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />

              {/* Main logo */}
              <div className="relative z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-full p-5 border border-primary/20">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: logoUrl 
                      ? 'transparent' 
                      : `linear-gradient(135deg, ${THEME_COLORS.primaryLight}, ${THEME_COLORS.primary})`,
                    boxShadow: `0 0 20px rgba(${THEME_COLORS.primaryRgb}, 0.3)`
                  }}
                >
                  {logoUrl ? (
                    // Custom image logo
                    <motion.img
                      src={logoUrl}
                      alt="App Logo"
                      className="w-full h-full object-contain p-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        rotate: {
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }
                      }}
                    />
                  ) : (
                    // Fallback music icon
                    <Music className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>

              {/* Single pulsing ring */}
              <motion.div
                className="absolute -inset-5 rounded-full border border-primary/20"
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>

            {/* Floating music notes */}
            <div className="absolute inset-0 pointer-events-none">
              {musicNotes.map((note) => {
                const IconComponent = note.Icon;
                return (
                  <motion.div
                    key={note.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      color: THEME_COLORS.primary,
                      filter: `drop-shadow(0 0 6px rgba(${THEME_COLORS.primaryRgb}, 0.4))`,
                    }}
                    initial={{
                      x: `${note.x}px`,
                      y: `${note.y}px`,
                      rotate: note.rotate,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      y: [`${note.y}px`, `${note.y - 100}px`],
                      x: [
                        `${note.x}px`,
                        `${note.x + (Math.random() - 0.5) * 40}px`,
                      ],
                      scale: [0, note.scale, 0],
                      opacity: [0, note.opacity, 0],
                      rotate: [note.rotate, note.rotate + 45],
                    }}
                    transition={{
                      duration: note.duration,
                      delay: note.delay,
                      ease: EASINGS.standard,
                      repeat: Infinity,
                      repeatDelay: 3 + Math.random() * 2,
                    }}
                  >
                    <IconComponent size={20} />
                  </motion.div>
                );
              })}
            </div>

            {/* Title section */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Saem's{" "}
                <motion.span
                  style={{ color: THEME_COLORS.primary }}
                  animate={{
                    textShadow: [
                      `0 0 8px rgba(${THEME_COLORS.primaryRgb}, 0.4)`,
                      `0 0 16px rgba(${THEME_COLORS.primaryRgb}, 0.6)`,
                      `0 0 8px rgba(${THEME_COLORS.primaryRgb}, 0.4)`,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  Tunes
                </motion.span>
              </h1>

              <motion.p
                className="text-muted-foreground text-lg font-light italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Making music, representing Christ
              </motion.p>
            </motion.div>

            {/* Progress section */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="relative mb-4" role="progressbar" 
                   aria-valuenow={Math.round(progress)} 
                   aria-valuemax={100}>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${THEME_COLORS.primaryLight}, ${THEME_COLORS.primary})`,
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: EASINGS.standard }}
                  >
                    {/* Subtle shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
                      animate={{ x: ["-100%", "150%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Loading message */}
              <motion.div
                className="flex items-center justify-center text-muted-foreground min-h-[24px]"
                key={currentMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Loader2 
                  className="h-4 w-4 animate-spin mr-3"
                  style={{ color: THEME_COLORS.primary }}
                />
                <span className="text-sm">
                  {loading ? loadingMessages[currentMessage] : "Ready to play!"}
                </span>
              </motion.div>
            </motion.div>

            {/* Completion indicator */}
            {!loading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="text-5xl"
                  style={{ color: THEME_COLORS.primary }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 0.6 }}
                >
                  ♪
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
