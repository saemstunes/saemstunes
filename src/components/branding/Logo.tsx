import React, { useState, useEffect } from 'react';
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

  // Determine the appropriate logo base name
  const getLogoBaseName = () => {
    if (variant === 'icon') {
      // For icon variant, use size-appropriate icons
      return isMobile
        ? 'logo-icon-sm'
        : size === 'lg'
          ? 'logo-icon-lg'
          : 'logo-icon-md';
    } else {
      // For full variant, use size-appropriate full logos
      return isMobile
        ? 'logo-full-md'
        : size === 'lg'
          ? 'logo-full-lg'
          : 'logo-full-md';
    }
  };

  // Get base path for logo
  const logoBasePath = `/lovable-uploads/${getLogoBaseName()}`;

  useEffect(() => {
    const updateLogoMargin = async () => {
      const sidebarNav = document.querySelector('nav.flex.flex-col.gap-6');
      const logo = sidebarNav?.querySelector('img.h-8.w-8.mb-6');

      if (logo) {
        // Set the margin-bottom style to 0 using !important
        await setElementStyles(logo, { 'margin-bottom': '0 !important' });
      }

      const data = {
        success: !!logo
      };

      console.log(data); // You can use this data as needed
    };

    updateLogoMargin();
  }, []); // Empty dependency array to run this once when the component mounts

  const setElementStyles = (element: HTMLElement, styles: { [key: string]: string }) => {
    Object.entries(styles).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
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
            className={cn(sizeClasses[size], className)} 
            onLoad={() => setImageLoaded(true)}
            fetchPriority="high"
            decoding="async"
            loading={variant === 'icon' && !isMobile ? "lazy" : "eager"}
          />
        </picture>
      )}
      
      {(variant === 'full' || variant === 'text') && showText && (
        <span className={cn(
          "logo-font font-bold", 
          textSizeClasses[size],
          inMobileMenu ? "translate-y-0" : "",
          "flex items-center self-center" // Ensure vertical centering
        )}>
          Saem's <span className="text-gold">Tunes</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
