
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  linkClassName?: string;
  showText?: boolean;
}

const Logo = ({
  size = 'md',
  variant = 'full',
  className,
  linkClassName,
  showText = true
}: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link 
      to="/" 
      className={cn("flex items-center gap-2 brand-logo", linkClassName)}
    >
      {(variant === 'full' || variant === 'icon') && (
        <img 
          src="/logo.svg" 
          alt="Saem's Tunes Logo" 
          className={cn(sizeClasses[size], className)} 
        />
      )}
      
      {(variant === 'full' || variant === 'text') && showText && (
        <span className={cn("logo-font font-bold", textSizeClasses[size])}>
          Saem's <span className="text-gold">Tunes</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
