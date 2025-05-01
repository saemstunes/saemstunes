import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (!loading) {
      // Allow time for fade-out before unmounting
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 500); // match hidden variant duration

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const containerVariants = {
    visible: { opacity: 1 },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: EASINGS.decelerate,
      },
    },
  };

  const logoVariants = {
    initial: {
      scale: 0.8,
      y: 20,
      opacity: 0,
    },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
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
        delay: 0.2,
        duration: 0.5,
        ease: EASINGS.standard,
      },
    },
  };

  const loaderVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.3,
        ease: EASINGS.standard,
      },
    },
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial="visible"
          animate={loading ? "visible" : "hidden"}
          exit="hidden"
          variants={containerVariants}
          style={{ pointerEvents: loading ? "auto" : "none" }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center mb-8"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <img
              src="/lovable-uploads/logo-icon-lg.webp"
              alt="Saem's Tunes"
              className="w-24 h-24"
            />
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Saem's <span className="text-gold">Tunes</span>
            </h1>

            <motion.div
              className="flex items-center gap-2 text-muted-foreground"
              variants={loaderVariants}
              initial="initial"
              animate="animate"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{message}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
