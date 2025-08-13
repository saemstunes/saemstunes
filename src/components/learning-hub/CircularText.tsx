import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Progress: ${value}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-medium"
            style={{ 
              fontSize: size * 0.25, 
              color: textColor 
            }}
          >
            {value}%
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularText;
