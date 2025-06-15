
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, Music, Play, Headphones, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animation easings - centralized configuration
const EASINGS = {
  standard: [0.4, 0.0, 0.2, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
};

// Animation configurations - extracted for reusability
const ANIMATION_CONFIGS = {
  pulseRing: {
    duration: 3,
    ease: "easeOut",
    repeat: Infinity,
  },
  glowEffect: {
    duration: 2.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
  logoRotation: {
    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
    boxShadow: { duration: 3, repeat: Infinity, repeatType: "reverse" as const },
  },
  progressShine: {
    duration: 1.5,
    repeat: Infinity,
    repeatDelay: 2,
    ease: "easeInOut",
  },
};

// Theme colors - updated to match brand colors
const THEME_COLORS = {
  primary: "#A67C00", // Brand gold
  primaryLight: "#D4A936", // Light gold
  primaryDark: "#7A5A00", // Dark gold
  primaryRgb: "166, 124, 0", // RGB values for transparency effects
  primaryLightRgb: "212, 169, 54", // Light gold RGB
};

interface SplashScreenProps {
  loading?: boolean;
  message?: string;
  onFinish?: () => void;
}

const SplashScreen = ({
  loading = true,
  message = "Loading your music...",
  onFinish,
}: SplashScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMusicNotes, setShowMusicNotes] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Tuning the instruments...",
    "Setting up the stage...",
    "Loading your music...",
    "Almost ready to play...",
  ];

  // Memoized music notes - prevents recreation on every render
  const musicNotes = useMemo(() => {
    const musicIcons = [Music, Play, Headphones, Volume2];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      Icon: musicIcons[i % musicIcons.length],
      x: (Math.random() - 0.5) * 80, // Reduced spread
      y: 20 + Math.random() * 30, // Start closer to center
      rotate: Math.random() * 360,
      scale: 0.6 + Math.random() * 0.4,
      duration: 3 + Math.random() * 2,
      delay: i * 0.5,
      opacity: 0.4 + Math.random() * 0.3,
    }));
  }, []);

  // Memoized glow orbs configuration
  const glowOrbs = useMemo(() => [
    {
      size: "w-32 h-32",
      position: "translate(-80px, -60px)",
      animation: { scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] },
      duration: 4,
      delay: 0,
    },
    {
      size: "w-24 h-24",
      position: "translate(70px, 50px)",
      animation: { scale: [1.2, 1, 1.2], opacity: [0.15, 0.05, 0.15] },
      duration: 5,
      delay: 1,
    },
    {
      size: "w-20 h-20",
      position: "translate(0px, -90px)",
      animation: { scale: [1, 1.4, 1], opacity: [0.08, 0.25, 0.08] },
      duration: 6,
      delay: 2,
    },
  ], []);

  // Handle splash screen exit
  const handleSplashExit = useCallback(() => {
    setShowSplash(false);
    onFinish?.();
  }, [onFinish]);

  // Splash screen lifecycle
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(handleSplashExit, 1200);
      return () => clearTimeout(timeout);
    } else {
      const notesTimeout = setTimeout(() => {
        setShowMusicNotes(true);
      }, 800);
      return () => clearTimeout(notesTimeout);
    }
  }, [loading, handleSplashExit]);

  // Message cycling
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  // Simplified progress simulation
  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 12 + 3;
        // Cap at 90% while loading, allow 100% when complete
        return Math.min(prev + increment, 90);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  // Optimized glow orb component
  const GlowOrb = ({ orb, index }: { orb: typeof glowOrbs[0]; index: number }) => (
    <motion.div
      className={`absolute top-1/2 left-1/2 ${orb.size} rounded-full -translate-x-1/2 -translate-y-1/2`}
      style={{
        background: `radial-gradient(circle, ${THEME_COLORS.primary} 0%, transparent 70%)`,
        transform: `translate(-50%, -50%) ${orb.position}`,
      }}
      animate={orb.animation}
      transition={{
        duration: orb.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: orb.delay,
      }}
    />
  );

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 1, ease: EASINGS.decelerate },
          }}
          style={{
            pointerEvents: loading ? "auto" : "none",
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            {glowOrbs.map((orb, index) => (
              <GlowOrb key={index} orb={orb} index={index} />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center p-8 max-w-lg w-full relative z-10">
            {/* Enhanced logo container */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { duration: 1.2, ease: EASINGS.standard },
              }}
              aria-label="Saem's Tunes Logo"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-8 rounded-full border border-primary/20"
                animate={{
                  rotate: 360,
                  boxShadow: [
                    `0 0 30px 5px rgba(${THEME_COLORS.primaryRgb}, 0.1)`,
                    `0 0 60px 15px rgba(${THEME_COLORS.primaryRgb}, 0.2)`,
                    `0 0 30px 5px rgba(${THEME_COLORS.primaryRgb}, 0.1)`,
                  ],
                }}
                transition={ANIMATION_CONFIGS.logoRotation}
              />

              {/* Inner rotating border */}
              <motion.div
                className="absolute -inset-6 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${THEME_COLORS.primary}, transparent, ${THEME_COLORS.primary}, transparent)`,
                  mask: "radial-gradient(circle, transparent 70%, black 71%, black 100%)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo container */}
              <div className="relative z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-full p-6 border border-primary/30">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${THEME_COLORS.primaryLight}, ${THEME_COLORS.primary})`
                  }}
                >
                  <Music className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Multiple pulsing circles */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute inset-0 rounded-full border border-primary/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: [0.9, 1.8, 2.2],
                    opacity: [0.6, 0.2, 0],
                  }}
                  transition={{
                    ...ANIMATION_CONFIGS.pulseRing,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </motion.div>

            {/* Enhanced floating music elements */}
            {showMusicNotes && (
              <div className="absolute inset-0 pointer-events-none">
                {musicNotes.map((note) => {
                  const IconComponent = note.Icon;
                  return (
                    <motion.div
                      key={note.id}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        color: THEME_COLORS.primary,
                        filter: `drop-shadow(0 0 8px rgba(${THEME_COLORS.primaryRgb}, 0.6))`,
                      }}
                      initial={{
                        x: `${note.x}px`,
                        y: `${note.y}px`,
                        rotate: note.rotate,
                        scale: 0,
                        opacity: 0,
                      }}
                      animate={{
                        y: [`${note.y}px`, `${note.y - 120}px`, `${note.y - 200}px`],
                        x: [
                          `${note.x}px`,
                          `${note.x + (Math.random() - 0.5) * 60}px`,
                          `${note.x + (Math.random() - 0.5) * 80}px`,
                        ],
                        scale: [0, note.scale, note.scale * 1.2, 0],
                        opacity: [0, note.opacity, note.opacity * 0.8, 0],
                        rotate: [note.rotate, note.rotate + 180, note.rotate + 360],
                      }}
                      transition={{
                        duration: note.duration,
                        delay: note.delay,
                        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
                        repeat: Infinity,
                        repeatDelay: 2 + Math.random() * 2,
                      }}
                    >
                      <IconComponent size={24} />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Enhanced app title */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Saem's{" "}
                <motion.span
                  style={{ color: THEME_COLORS.primary }}
                  animate={{
                    filter: [
                      `drop-shadow(0 0 5px rgba(${THEME_COLORS.primaryRgb}, 0.5))`,
                      `drop-shadow(0 0 15px rgba(${THEME_COLORS.primaryRgb}, 0.8))`,
                      `drop-shadow(0 0 5px rgba(${THEME_COLORS.primaryRgb}, 0.5))`,
                    ],
                  }}
                  transition={ANIMATION_CONFIGS.glowEffect}
                >
                  Tunes
                </motion.span>
              </h1>

              <motion.p
                className="text-muted-foreground text-lg font-light italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Making music, representing Christ
              </motion.p>
            </motion.div>

            {/* Enhanced progress section */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* Progress bar container */}
              <div className="relative mb-4" role="progressbar" aria-valuenow={progress} aria-valuemax={100}>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${THEME_COLORS.primaryLight}, ${THEME_COLORS.primary}, ${THEME_COLORS.primaryLight})`
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: EASINGS.standard }}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={ANIMATION_CONFIGS.progressShine}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Dynamic loading message */}
              <motion.div
                className="flex items-center justify-center text-muted-foreground min-h-[24px]"
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                role="status"
                aria-live="polite"
              >
                <Loader2 
                  className="h-4 w-4 animate-spin mr-3"
                  style={{ color: THEME_COLORS.primary }}
                />
                <span className="text-sm">
                  {loading ? loadingMessages[currentMessage] : "Ready!"}
                </span>
              </motion.div>
            </motion.div>

            {/* Completion celebration */}
            {!loading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.div
                  className="text-6xl"
                  style={{ color: THEME_COLORS.primary }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.6 }}
                >
                  ♪
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Accessibility fallback */}
          <noscript>
            <div className="fixed inset-0 bg-background flex items-center justify-center text-foreground">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Saem's Tunes</h1>
                <p>Loading your music...</p>
              </div>
            </div>
          </noscript>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
