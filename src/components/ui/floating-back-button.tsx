
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingBackButton() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Common breakpoint for mobile
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    const timer = setInterval(() => {
      if (Date.now() - lastInteraction > 5000) {
        setIsVisible(false);
      }
    }, 1000);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [lastInteraction]);

  const handleInteraction = () => {
    setIsVisible(true);
    setLastInteraction(Date.now());
  };

  const handleClick = () => {
    navigate(-1);
  };

  // Only render on mobile devices
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      <motion.button
        className={cn(
          "fixed bottom-24 left-4 z-40 p-3 rounded-full bg-primary/90 shadow-lg",
          "hover:bg-primary/100 transition-colors duration-200",
          "touch-none cursor-pointer"
        )}
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0.1 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={handleInteraction}
        onMouseMove={handleInteraction}
        onTouchStart={handleInteraction}
        onClick={handleClick}
        drag
        dragConstraints={{
          top: 0,
          right: 20,
          bottom: 20,
          left: 0
        }}
      >
        <ArrowLeft className="w-6 h-6 text-primary-foreground" />
      </motion.button>
    </AnimatePresence>
  );
}
