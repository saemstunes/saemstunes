"use client";
import { motion } from "framer-motion";
import React from "react";

export const LoaderOne = () => {
  const transition = (x: number) => {
    return {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: x * 0.2,
    };
  };
  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={transition(0)}
        className="h-4 w-4 rounded-full border border-brown-dark bg-gradient-to-b from-brown-light to-brown-dark dark:border-gold dark:bg-gradient-to-b dark:from-gold-light dark:to-gold"
      />
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={transition(1)}
        className="h-4 w-4 rounded-full border border-brown-dark bg-gradient-to-b from-brown-light to-brown-dark dark:border-gold dark:bg-gradient-to-b dark:from-gold-light dark:to-gold"
      />
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={transition(2)}
        className="h-4 w-4 rounded-full border border-brown-dark bg-gradient-to-b from-brown-light to-brown-dark dark:border-gold dark:bg-gradient-to-b dark:from-gold-light dark:to-gold"
      />
    </div>
  );
};

export const LoaderTwo = () => {
  const transition = (x: number) => {
    return {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: x * 0.2,
    };
  };
  return (
    <div className="flex items-center">
      <motion.div
        transition={transition(0)}
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        className="h-4 w-4 rounded-full bg-brown-dark shadow-md dark:bg-gold"
      />
      <motion.div
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        transition={transition(0.4)}
        className="h-4 w-4 -translate-x-2 rounded-full bg-brown-dark shadow-md dark:bg-gold"
      />
      <motion.div
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        transition={transition(0.8)}
        className="h-4 w-4 -translate-x-4 rounded-full bg-brown-dark shadow-md dark:bg-gold"
      />
    </div>
  );
};

export const LoaderThree = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-20 w-20 stroke-brown-dark [--fill-final:theme(colors.gold.DEFAULT)] [--fill-initial:theme(colors.brown.light)] dark:stroke-gold-light dark:[--fill-final:theme(colors.gold.dark)] dark:[--fill-initial:theme(colors.brown.dark)]"
    >
      {/* Base invisible reset */}
      <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />

      {/* Globe circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        initial={{ pathLength: 0, fill: "var(--fill-initial)" }}
        animate={{ pathLength: 1, fill: "var(--fill-final)" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Globe meridians */}
      <motion.path
        d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Musical note on top of globe */}
      <motion.path
        d="M16 6v6a2 2 0 11-2-2h2m0-4h3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.svg>
  );
};

export const LoaderFour = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="relative font-bold text-black [perspective:1000px] dark:text-white">
      <motion.span
        animate={{
          scale: [1, 2, 1],
        }}
        transition={{
          duration: 0.05,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        className="relative z-20 inline-block"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-brown-light/50 blur-[0.5px] dark:text-gold-light"
        animate={{
          x: [-2, 4, -3, 1.5, -2],
          y: [-2, 4, -3, 1.5, -2],
          opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-brown-dark/50 dark:text-gold"
        animate={{
          x: [0, 1, -1.5, 1.5, -1, 0],
          y: [0, -1, 1.5, -0.5, 0],
          opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.3, 0.6, 0.8, 1],
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export const LoaderFive = ({ text }: { text: string }) => {
  return (
    <div className="font-sans font-bold [--shadow-color:theme(colors.brown.DEFAULT)] dark:[--shadow-color:theme(colors.gold.light)]">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ scale: 1, opacity: 0.5 }}
        animate={{
          scale: [1, 1.1, 1],
          textShadow: [
            "0 0 0 var(--shadow-color)",
            "0 0 1px var(--shadow-color)",
            "0 0 0 var(--shadow-color)",
          ],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: i * 0.05,
          repeatDelay: 2,
        }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};
