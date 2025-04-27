
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  loading?: boolean;
  message?: string;
}

const SplashScreen = ({ loading = true, message = "Loading..." }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      setFadeOut(true);
    }
  }, [loading]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center mb-8 animate-pulse">
        <img 
          src="/lovable-uploads/logo-icon-lg.webp"
          alt="Saem's Tunes" 
          className="w-24 h-24 animate-bounce"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Saem's <span className="text-gold">Tunes</span>
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
