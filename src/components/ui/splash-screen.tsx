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

// Theme colors - centralized for maintainability
const THEME_COLORS = {
  primary: "#d4af37", // Gold
  primaryRgb: "212, 175, 55",
  secondary: "#f59e0b", // Yellow-500
  background: {
    light: "white",
    dark: "rgb(15, 23, 42)", // slate-900
  },
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
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      Icon: musicIcons[i % musicIcons.length],
      x: (Math.random() - 0.5) * 100,
      y: -60 - Math.random() * 40,
      rotate: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.6,
      duration: 4 + Math.random() * 3,
      delay: i * 0.3,
      opacity: 0.3 + Math.random() * 0.4,
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900"
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
                className="absolute -inset-8 rounded-full border border-yellow-500/20"
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
              <div className="relative z-10 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-6 border border-yellow-500/30">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Music className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Multiple pulsing circles */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute inset-0 rounded-full border border-yellow-500/20"
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
            <AnimatePresence>
              {showMusicNotes &&
                musicNotes.map((note) => {
                  const IconComponent = note.Icon;
                  return (
                    <motion.div
                      key={note.id}
                      className="absolute text-yellow-500"
                      style={{
                        filter: `drop-shadow(0 0 8px rgba(${THEME_COLORS.primaryRgb}, 0.5))`,
                      }}
                      initial={{
                        x: `${note.x}%`,
                        y: `${note.y}%`,
                        rotate: note.rotate,
                        scale: 0,
                        opacity: 0,
                      }}
                      animate={{
                        y: "-150%",
                        x: `${note.x + (Math.random() - 0.5) * 40}%`,
                        scale: [0, note.scale, note.scale * 0.8, 0],
                        opacity: [0, note.opacity, note.opacity * 0.5, 0],
                        rotate: note.rotate + 180,
                      }}
                      transition={{
                        duration: note.duration,
                        delay: note.delay,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatDelay: 4 + Math.random() * 3,
                      }}
                    >
                      <IconComponent size={20} />
                    </motion.div>
                  );
                })}
            </AnimatePresence>

            {/* Enhanced app title */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Saem's{" "}
                <motion.span
                  className="text-yellow-600 dark:text-yellow-400"
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
                className="text-slate-600 dark:text-slate-300 text-lg font-light italic"
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
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 rounded-full relative"
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
                className="flex items-center justify-center text-slate-600 dark:text-slate-300 min-h-[24px]"
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                role="status"
                aria-live="polite"
              >
                <Loader2 className="h-4 w-4 animate-spin mr-3 text-yellow-600 dark:text-yellow-400" />
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
                  className="text-yellow-600 dark:text-yellow-400 text-6xl"
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
            <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white">
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
