
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  inMobileMenu?: boolean;
}

const Logo = ({
  size = 'md',
  variant = 'full',
  className,
  linkClassName,
  showText = true,
  inMobileMenu = false
}: LogoProps) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: isMobile ? 'text-xs' : 'text-xl', // Reduced text size for mobile
    lg: isMobile ? 'text-sm' : 'text-2xl'  // Reduced text size for mobile
  };

  // Use icon files based on size and device type
  const getLogoSrc = () => {
    // Prefer png over svg over webp for standard logo
    if (variant === 'icon') {
      return isMobile
        ? `/lovable-uploads/logo-icon-sm.png`
        : size === 'lg'
          ? `/lovable-uploads/logo-icon-lg.png`
          : `/lovable-uploads/logo-icon-md.png`;
    } else {
      return isMobile
        ? `/lovable-uploads/logo-full-md.png`
        : size === 'lg'
          ? `/lovable-uploads/logo-full-lg.png`
          : `/lovable-uploads/logo-full-md.png`;
    }
  };

  return (
    <Link 
      to="/" 
      className={cn("flex items-center gap-2 brand-logo", linkClassName)}
      onClick={(e) => {
        // If clicking while already on home page, scroll to top
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {(variant === 'full' || variant === 'icon') && (
        <picture>
          {/* PNG version (primary) */}
          <source 
            srcSet={getLogoSrc()} 
            type="image/png" 
          />
          
          {/* SVG version (secondary) */}
          <source 
            srcSet={getLogoSrc().replace('.png', '.svg')} 
            type="image/svg+xml" 
          />
          
          {/* Fallback WebP version */}
          <img 
            src={getLogoSrc().replace('.png', '.webp')}
            alt="Saem's Tunes Logo" 
            className={cn(sizeClasses[size], className)} 
            onLoad={() => setImageLoaded(true)}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      )}
      
      {(variant === 'full' || variant === 'text') && showText && (
        <span className={cn(
          "logo-font font-bold", 
          textSizeClasses[size],
          inMobileMenu && "self-center translate-y-0",
          "flex items-center" // Add this to vertically center
        )}>
          Saem's <span className="text-gold">Tunes</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
