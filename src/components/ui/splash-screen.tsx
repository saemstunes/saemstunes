
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (!loading) {
      // Allow time for fade-out before unmounting
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 800);

      return () => clearTimeout(timeout);
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

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: EASINGS.decelerate }
          }}
          style={{ pointerEvents: loading ? "auto" : "none" }}
        >
          <div className="flex flex-col items-center justify-center p-8 max-w-md w-full">
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 0.8, ease: EASINGS.standard }
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-lg"></div>
              <img
                src="/lovable-uploads/logo-icon-lg.webp"
                alt="Saem's Tunes"
                className="w-24 h-24 relative z-10"
              />
              
              <motion.div 
                className="absolute -z-10 inset-0 rounded-full"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(212, 175, 55, 0)", "0 0 0 20px rgba(212, 175, 55, 0)"],
                  scale: [1, 1.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>

            <motion.h1 
              className="text-3xl font-serif font-bold text-foreground mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Saem's <span className="text-gold">Tunes</span>
            </motion.h1>

            <motion.div 
              className="w-48 h-1 bg-muted/50 rounded-full overflow-hidden mt-6"
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: "12rem", 
                opacity: 1,
                transition: { delay: 0.4, duration: 0.6 }
              }}
            >
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
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
