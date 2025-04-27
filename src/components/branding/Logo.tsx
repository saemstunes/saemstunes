
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

  // Use optimized logo files based on size and device type
  const getLogoSrc = () => {
    // Select WebP for modern browsers or SVG for maximum compatibility
    if (variant === 'icon') {
      return isMobile
        ? `/lovable-uploads/logo-icon-sm.webp`
        : size === 'lg'
          ? `/lovable-uploads/logo-icon-lg.webp`
          : `/lovable-uploads/logo-icon-md.webp`;
    } else {
      return isMobile
        ? `/lovable-uploads/logo-full-md.webp`
        : size === 'lg'
          ? `/lovable-uploads/logo-full-lg.webp`
          : `/lovable-uploads/logo-full-md.webp`;
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
          {/* WebP version (optimized) */}
          <source 
            srcSet={getLogoSrc()} 
            type="image/webp" 
          />
          
          {/* SVG version (vector quality) */}
          <source 
            srcSet={getLogoSrc().replace('.webp', '.svg')} 
            type="image/svg+xml" 
          />
          
          {/* Fallback PNG version */}
          <img 
            src={getLogoSrc().replace('.webp', '.png')}
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
          inMobileMenu && "self-center translate-y-0" // Adjust vertical alignment in mobile menu
        )}>
          Saem's <span className="text-gold">Tunes</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
