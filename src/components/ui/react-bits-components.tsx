
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Floating Card Component
interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  glowEffect?: boolean;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  glowEffect = false 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ 
      y: -8, 
      transition: { duration: 0.3, ease: "easeOut" },
      ...(glowEffect && { 
        boxShadow: "0 20px 25px -5px rgba(201, 166, 107, 0.3), 0 10px 10px -5px rgba(201, 166, 107, 0.2)" 
      })
    }}
    className={cn(
      "bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg transition-all duration-300",
      glowEffect && "hover:border-gold/30",
      className
    )}
  >
    {children}
  </motion.div>
);

// Glowing Button Component
interface GlowingButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  children, 
  className = "", 
  variant = 'primary',
  size = 'md',
  glow = true,
  onClick,
  disabled = false
}) => {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 transform-gpu";
  const variantClasses = {
    primary: "bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white",
    secondary: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
    outline: "border-2 border-gold text-gold hover:bg-gold hover:text-white"
  };
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-xl"
  };
  const glowClasses = glow ? "shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:scale-105" : "";

  return (
    <motion.button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], glowClasses, className)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: glow ? 1.05 : 1.02 }}
      style={{ willChange: 'transform' }}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      {children}
    </motion.button>
  );
};

// Progress Ring Component
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = "#C9A66B",
  backgroundColor = "#E5E7EB",
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Content Card Component
interface ContentCardProps {
  title: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: string;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  instructor, 
  duration, 
  difficulty, 
  image,
  onClick 
}) => {
  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <FloatingCard className="p-0 overflow-hidden cursor-pointer group" glowEffect>
      <div 
        className="h-40 bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden"
        onClick={onClick}
      >
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl opacity-20">🎵</div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <motion.div 
          className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {duration}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 dark:bg-black/90 rounded-full p-3">
            <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gold/20 rounded-full flex items-center justify-center">
              <span className="text-xs">👨‍🏫</span>
            </div>
            {instructor}
          </div>
        </div>
        <div className="flex justify-end">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", difficultyColors[difficulty])}>
            {difficulty}
          </span>
        </div>
      </div>
    </FloatingCard>
  );
};

// Animated Background Component
export const AnimatedBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5" />
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gold/10 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);
