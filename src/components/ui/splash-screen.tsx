
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "@/lib/animation-utils";

interface SplashScreenProps {
  loading?: boolean;
  message?: string;
}

const SplashScreen = ({
  loading = true,
  message = "Loading...",
}: SplashScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMusicNotes, setShowMusicNotes] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Allow time for fade-out before unmounting
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      // Show music notes after a brief delay
      const notesTimeout = setTimeout(() => {
        setShowMusicNotes(true);
      }, 600);
      
      return () => clearTimeout(notesTimeout);
    }
  }, [loading]);

  // Simulate loading progress
  useEffect(() => {
    if (loading && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 100);
          return newProgress > 80 ? Math.min(newProgress, 95) : newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }

    if (!loading) {
      setProgress(100);
    }
  }, [loading, progress]);

  // Create an array of music notes with random positions for animation - memoized for performance
  const musicNotes = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 - 40, // random position between -40% and 40% from center
      y: -40 - Math.random() * 60, // start above the viewport
      rotate: Math.random() * 360, // random rotation
      scale: 0.5 + Math.random() * 0.5, // random size
      duration: 3 + Math.random() * 2, // random animation duration
      delay: i * 0.2, // stagger the animations
    })), []
  );

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            loading ? "bg-background" : "bg-background/50"
          )}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: EASINGS.decelerate }
          }}
          style={{ pointerEvents: loading ? "auto" : "none" }}
        >
          {/* Background gradient radial effect */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-gold/5 via-background to-background" 
          />
          
          {/* Subtle cross pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          
          <div className="flex flex-col items-center justify-center p-8 max-w-md w-full relative z-10">
            {/* Animated logo container */}
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 1, ease: EASINGS.standard }
              }}
            >
              {/* Inner circular glow */}
              <motion.div 
                className="absolute -inset-4 rounded-full"
                animate={{ 
                  boxShadow: [
                    "0 0 20px 0px rgba(212, 175, 55, 0.2)",
                    "0 0 40px 10px rgba(212, 175, 55, 0.3)",
                    "0 0 20px 0px rgba(212, 175, 55, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }}
              />
              
              {/* Logo with custom shadow */}
              <div className="relative z-10 flex items-center justify-center">
                <img
                  src="/lovable-uploads/logo-icon-lg.webp"
                  alt="Saem's Tunes"
                  className="w-24 h-24 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                />
              </div>
              
              {/* Pulsing circles */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute inset-0 rounded-full border border-gold/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.6, 1.8],
                    opacity: [0.7, 0.3, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Floating music notes animations */}
            <AnimatePresence>
              {showMusicNotes && musicNotes.map((note) => (
                <motion.div
                  key={note.id}
                  className="absolute text-gold/70"
                  initial={{ 
                    x: `${note.x}%`, 
                    y: `${note.y}%`, 
                    rotate: note.rotate, 
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: "-120%",
                    scale: note.scale,
                    opacity: [0, 0.7, 0] 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: note.duration,
                    delay: note.delay,
                    ease: EASINGS.decelerate,
                    repeat: Infinity,
                    repeatDelay: 3 + Math.random() * 5
                  }}
                >
                  <Music size={24} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* App Title with animation - Changed to Poppins font */}
            <motion.h1 
              className="text-3xl font-sans font-bold text-foreground mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: EASINGS.standard }}
            >
              Saem's <motion.span 
                className="text-gold"
                animate={{ 
                  textShadow: [
                    "0 0 5px rgba(212, 175, 55, 0.5)",
                    "0 0 15px rgba(212, 175, 55, 0.8)",
                    "0 0 5px rgba(212, 175, 55, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                Tunes
              </motion.span>
            </motion.h1>

            {/* Short inspirational tagline - Changed to Poppins font */}
            <motion.p
              className="text-muted-foreground mt-2 font-sans italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASINGS.standard }}
            >
              Making music, representing Christ
            </motion.p>

            {/* Progress bar */}
            <motion.div 
              className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden mt-6"
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: "12rem", 
                opacity: 1,
                transition: { delay: 0.4, duration: 0.6 }
              }}
            >
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  progress > 75 ? "bg-gradient-to-r from-gold via-gold-light to-gold" : "bg-gradient-to-r from-gold/60 via-gold to-gold/60"
                )}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: EASINGS.accelerate }}
              />
            </motion.div>
            
            {/* Loading message */}
            <motion.div 
              className="flex items-center mt-4 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.5, duration: 0.5 }
              }}
            >
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>{message}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
