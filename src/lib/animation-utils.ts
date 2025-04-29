
import { RefObject } from 'react';

// Animation durations in ms
export const DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Easing functions - using string names that Framer Motion supports
export const EASINGS = {
  standard: "easeInOut", // Changed from cubic-bezier
  decelerate: "easeOut", // Changed from cubic-bezier
  accelerate: "easeIn", // Changed from cubic-bezier
  sharp: "easeInOut", // Changed from cubic-bezier
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
