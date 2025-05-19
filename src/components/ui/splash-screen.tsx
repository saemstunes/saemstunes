
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATIONS, EASINGS } from "@/lib/animation-utils";

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

  useEffect(() => {
    if (!loading) {
      // Allow time for fade-out before unmounting
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 1000); // match hidden variant duration

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Simulate loading progress
  useEffect(() => {
    if (loading && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 100);
          // Make it slower towards the end to sync with actual loading
          return newProgress > 80 ? Math.min(newProgress, 95) : newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
    
    if (!loading) {
      setProgress(100);
    }
  }, [loading, progress]);

  const containerVariants = {
    visible: { opacity: 1 },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: EASINGS.decelerate,
      },
    },
  };

  const logoVariants = {
    initial: {
      scale: 0.8,
      y: 20,
      opacity: 0,
      rotate: -10,
    },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: EASINGS.standard,
      },
    },
  };

  const titleVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: EASINGS.standard,
      },
    },
  };

  const progressVariants = {
    initial: {
      width: "0%",
    },
    animate: (custom: number) => ({
      width: `${custom}%`,
      transition: {
        duration: 0.3,
        ease: EASINGS.accelerate,
      },
    }),
  };

  const circleVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: [0, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: EASINGS.standard,
        times: [0, 0.6, 1],
      },
    },
  };

  const noteVariants = {
    initial: { opacity: 0, y: 20, rotate: -10 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: custom * 0.1 + 0.5,
        duration: 0.5,
        ease: EASINGS.standard,
      },
    }),
  };

  const notes = [
    { top: "15%", left: "15%", size: "w-6 h-6", rotate: "rotate-12" },
    { top: "25%", right: "20%", size: "w-5 h-5", rotate: "-rotate-15" },
    { top: "60%", left: "20%", size: "w-4 h-4", rotate: "rotate-25" },
    { top: "70%", right: "25%", size: "w-7 h-7", rotate: "-rotate-10" },
    { top: "40%", left: "10%", size: "w-5 h-5", rotate: "rotate-5" },
  ];

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
          initial="visible"
          animate={loading ? "visible" : "hidden"}
          exit="hidden"
          variants={containerVariants}
          style={{ pointerEvents: loading ? "auto" : "none" }}
        >
          {/* Animated music notes */}
          {notes.map((note, index) => (
            <motion.div
              key={index}
              className={cn("absolute text-gold/20", note.size, note.rotate)}
              style={{ top: note.top, left: note.left, right: note.right }}
              variants={noteVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              <Music />
            </motion.div>
          ))}
          
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-gold to-brown flex items-center justify-center mb-6 relative"
            variants={circleVariants}
            initial="initial"
            animate="animate"
          >
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-lg transform scale-110"></div>
            <img
              src="/lovable-uploads/logo-icon-lg.webp"
              alt="Saem's Tunes"
              className="w-24 h-24 relative z-10"
            />
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-3xl font-serif font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Saem's <span className="text-gold">Tunes</span>
            </motion.h1>

            <div className="flex flex-col items-center">
              <div className="w-48 h-1 bg-muted/50 rounded-full overflow-hidden mb-2 mt-4">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{message}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
