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
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 360, scale: 1 }}
            exit={{ opacity: 0, rotate: -360, scale: 0.8 }}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              type: "spring",
              stiffness: 50,
              damping: 70,
            }}
            className="flex items-center justify-center"
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 360, scale: 1 }}
            exit={{ opacity: 0, rotate: -360, scale: 0.8 }}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              type: "spring",
              stiffness: 50,
              damping: 70,
            }}
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
