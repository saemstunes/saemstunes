import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { DURATIONS, EASINGS } from "@/lib/animation-utils";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimatedRef = useRef(false); // Track if animation has run in this session
  
  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    
    // Run initial animation only once per session
    if (!hasAnimatedRef.current) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        hasAnimatedRef.current = true;
      }, DURATIONS.normal);
    }
  }, []);

  const toggleTheme = () => {
    // Only animate when user explicitly toggles
    setIsAnimating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, DURATIONS.normal);
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotate: theme === "light" ? -180 : 180,
      transition: { 
        duration: DURATIONS.normal / 1000,
        ease: EASINGS.standard
      } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      rotate: theme === "light" ? -360 : 360,
      transition: { 
        duration: DURATIONS.normal / 1000,
        ease: EASINGS.standard
      } 
    },
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme} 
      disabled={isAnimating}
      className="overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="moon"
            variants={iconVariants}
            initial={hasAnimatedRef.current ? "animate" : "initial"}
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="flex items-center justify-center"
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            variants={iconVariants}
            initial={hasAnimatedRef.current ? "animate" : "initial"}
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="flex items-center justify-center"
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
