import React from "react";
import { motion } from "framer-motion";
import "./CircularText.css";

interface CircularTextProps {
  value: number;
  size: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  textColor?: string;
  trailColor?: string;
}

const CircularText = ({
  value,
  size,
  strokeWidth = 4,
  className = "",
  showPercentage = false,
  textColor = "#C69B36",
  trailColor = "#F8F6F0"
}: CircularTextProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={`circular-text-container ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Progress: ${value}%`}
    >
      <svg 
        className="circular-text-svg" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="progress-ring__circle"
          stroke={textColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            transition: { duration: 1, ease: "easeInOut" }
          }}
          strokeDasharray={circumference}
        />
      </svg>
      
      {showPercentage && (
        <div className="circular-text-percentage" style={{ color: textColor }}>
          {value}%
        </div>
      )}
    </div>
  );
};

export default CircularText;
