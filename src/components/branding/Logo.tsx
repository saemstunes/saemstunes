
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  inMobileMenu?: boolean;
  animated?: boolean;
}

const Logo = ({
  size = 'md',
  variant = 'full',
  className,
  linkClassName,
  showText = true,
  inMobileMenu = false,
  animated = false
}: LogoProps) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Define consistent dimensions for the logo icon
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: isMobile ? 'text-sm' : 'text-xl',
    lg: isMobile ? 'text-base' : 'text-2xl'
  };

  // Determine the appropriate logo base name
  const getLogoBaseName = () => {
    if (variant === 'icon') {
      return isMobile
        ? 'logo-icon-sm'
        : size === 'lg'
          ? 'logo-icon-lg'
          : 'logo-icon-md';
    } else {
      return isMobile
        ? 'logo-full-md'
        : size === 'lg'
          ? 'logo-full-lg'
          : 'logo-full-md';
    }
  };

  // Get base path for logo
  const logoBasePath = `/lovable-uploads/${getLogoBaseName()}`;

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  const iconVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const textVariants = {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } }
  };

  const LogoComponent = (
    <Link 
      to="/" 
      className={cn("flex items-center gap-2", linkClassName)} // Reduced gap for better spacing
      onClick={(e) => {
        // If clicking while already on home page, scroll to top
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {(variant === 'full' || variant === 'icon') && (
        <div className={cn(sizeClasses[size], "flex-shrink-0", !imageLoaded && "bg-muted/30 animate-pulse rounded-full")}>
          <picture>
            {/* WebP version (most efficient) */}
            <source 
              srcSet={`${logoBasePath}.webp`} 
              type="image/webp" 
            />
            
            {/* SVG version (best quality) */}
            <source 
              srcSet={`${logoBasePath}.svg`} 
              type="image/svg+xml" 
            />
            
            {/* Fallback PNG version */}
            <img 
              src={`/lovable-uploads/logo-desktop.png`}
              alt="Saem's Tunes Logo" 
              width={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
              height={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
              className="w-full h-full object-contain"
              onLoad={() => setImageLoaded(true)}
              fetchPriority="high"
              decoding="async"
              loading={variant === 'icon' && !isMobile ? "lazy" : "eager"}
            />
          </picture>
        </div>
      )}
      
      {(variant === 'full' || variant === 'text') && showText && (
        <span className={cn(
          "logo-font font-bold leading-tight", // Improved vertical alignment with leading-tight
          textSizeClasses[size],
          inMobileMenu ? "translate-y-0" : "",
          "flex items-center"
        )}>
          Saem's <span className="text-gold">Tunes</span>
        </span>
      )}
    </Link>
  );

  if (animated) {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex items-center"
      >
        {(variant === 'full' || variant === 'icon') && (
          <motion.div 
            variants={iconVariants} 
            className="flex-shrink-0"
          >
            {LogoComponent}
          </motion.div>
        )}
        
        {(variant === 'full' || variant === 'text') && showText && (
          <motion.div variants={textVariants}>
            {LogoComponent}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return LogoComponent;
};

export default Logo;
