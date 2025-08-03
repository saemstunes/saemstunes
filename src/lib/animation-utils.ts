
import { RefObject } from 'react';

// Animation durations in ms
export const DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  extraSlow: 800
};

// Easing functions - Fixed format for Framer Motion
export const EASINGS = {
  standard: [0.4, 0.0, 0.2, 1] as [number, number, number, number],       // Standard - For most animations
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],    // Deceleration - Ending animations
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],      // Acceleration - Starting animations
  sharp: [0.4, 0.0, 0.6, 1] as [number, number, number, number],         // Sharp - Emphasis animations
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],      // Smooth - For gentle transitions
  bouncy: [0.2, -0.3, 0.2, 1.5] as [number, number, number, number]      // Bouncy - For playful animations
};

// Common animation presets for framer-motion
export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATIONS.normal / 1000, ease: EASINGS.standard }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: DURATIONS.normal / 1000, ease: EASINGS.smooth }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: DURATIONS.fast / 1000, ease: EASINGS.decelerate }
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: DURATIONS.normal / 1000, ease: EASINGS.smooth }
  }
};

// Apply smooth page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: DURATIONS.normal / 1000,
    ease: EASINGS.decelerate,
  },
};

// Apply smooth fade-in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: DURATIONS.normal / 1000,
    ease: EASINGS.standard,
  },
};

// Apply scale animation for buttons and interactive elements
export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: {
    duration: DURATIONS.fast / 1000,
    ease: EASINGS.standard,
  },
};

// Scroll to element smoothly
export const scrollToElement = (ref: RefObject<HTMLElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// Helper to ensure animations complete before dismissing
export const waitForAnimationComplete = (duration: number = DURATIONS.normal): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

// Store and retrieve user preferences
export const userPreferences = {
  save: (key: string, value: any): void => {
    try {
      localStorage.setItem(`rhythm-verse-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving preference:", error);
    }
  },
  
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`rhythm-verse-${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error("Error loading preference:", error);
      return defaultValue;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(`rhythm-verse-${key}`);
    } catch (error) {
      console.error("Error removing preference:", error);
    }
  }
};
