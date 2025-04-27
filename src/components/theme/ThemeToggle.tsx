
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      }, 500);
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
    }, 500);
  };

  const sunVariants = {
    initial: { scale: 0.6, rotate: 0 },
    animate: { scale: 1, rotate: 180, transition: { duration: 0.5 } },
    exit: { scale: 0.6, rotate: 360, transition: { duration: 0.5 } }
  };

  const moonVariants = {
    initial: { scale: 0.6, rotate: 0 },
    animate: { scale: 1, rotate: -180, transition: { duration: 0.5 } },
    exit: { scale: 0.6, rotate: -360, transition: { duration: 0.5 } }
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} disabled={isAnimating}>
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="moon"
            variants={moonVariants}
            initial={hasAnimatedRef.current ? "animate" : "initial"}
            animate="animate"
            exit="exit"
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            variants={sunVariants}
            initial={hasAnimatedRef.current ? "animate" : "initial"}
            animate="animate"
            exit="exit"
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
