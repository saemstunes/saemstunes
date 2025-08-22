// components/ui/AnimatedPlayButton.tsx
'use client';
import { motion } from "framer-motion";

const AnimatedPlayButton = () => {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
      initial={false}
    >
      {/* Circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        variants={{
          rest: {
            rotate: 0,
            scale: 1,
          },
          hover: {
            rotate: 180,
            scale: 1.1,
            transition: {
              rotate: {
                duration: 0.8,
                ease: "easeInOut"
              },
              scale: {
                duration: 0.3,
                ease: "easeOut"
              }
            }
          },
          tap: {
            scale: 0.9,
            transition: {
              duration: 0.1
            }
          }
        }}
      />
      
      {/* Play triangle */}
      <motion.path
        d="M10 8L16 12L10 16V8Z"
        fill="currentColor"
        variants={{
          rest: {
            rotate: 0,
            scale: 1,
          },
          hover: {
            rotate: -180,
            scale: 1.1,
            transition: {
              rotate: {
                duration: 0.8,
                ease: "easeInOut"
              },
              scale: {
                duration: 0.3,
                ease: "easeOut"
              }
            }
          },
          tap: {
            scale: 0.9,
            transition: {
              duration: 0.1
            }
          }
        }}
      />
    </motion.svg>
  );
};

export default AnimatedPlayButton;
