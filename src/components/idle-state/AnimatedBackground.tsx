
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/branding/Logo';

const AnimatedBackground: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden pointer-events-none"
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br dark:from-gray-900/50 dark:to-gray-800/50 from-gray-100/50 to-gray-200/50"
        style={{ 
          backdropFilter: 'blur(8px)',
        }}
      />
      
      {/* Animated logo */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.6, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Logo size="md" className="opacity-10" />
      </motion.div>
      
      {/* Floating music notes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <FloatingNote key={i} index={i} />
      ))}
    </motion.div>
  );
};

// Individual floating music note
const FloatingNote: React.FC<{ index: number }> = ({ index }) => {
  // Randomize position and animation parameters
  const size = Math.random() * 20 + 10;
  const startX = Math.random() * 100;
  const duration = Math.random() * 10 + 15;
  const delay = Math.random() * 10;
  
  // Select a random music note symbol
  const notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
  const note = notes[Math.floor(Math.random() * notes.length)];
  
  return (
    <motion.div
      className="absolute text-gold/20 font-serif pointer-events-none"
      style={{
        left: `${startX}%`,
        top: '100%',
        fontSize: `${size}px`,
      }}
      initial={{ y: 0 }}
      animate={{
        y: [0, -window.innerHeight * 1.2],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {note}
    </motion.div>
  );
};

export default AnimatedBackground;
