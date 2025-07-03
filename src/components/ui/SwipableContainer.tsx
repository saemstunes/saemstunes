import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SwipableContainerProps {
  children: React.ReactNode[];
  indicators?: boolean;
  showControls?: boolean;
  onSlideChange?: (index: number) => void;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const SwipableContainer: React.FC<SwipableContainerProps> = ({
  children,
  indicators = true,
  showControls = true,
  onSlideChange,
  className = "",
  autoPlay = false,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const totalSlides = children.length;

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % totalSlides);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isDragging, totalSlides]);

  const handleSlideChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalSlides) return;
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
    
    // Clear auto-play temporarily
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handlePanStart = () => {
    setIsDragging(true);
  };

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const swipeThreshold = 50;
    const velocity = Math.abs(info.velocity.x);
    
    if (Math.abs(info.offset.x) > swipeThreshold || velocity > 500) {
      if (info.offset.x > 0) {
        // Swipe right - go to previous
        handleSlideChange(currentIndex - 1);
      } else {
        // Swipe left - go to next
        handleSlideChange(currentIndex + 1);
      }
    }
  };

  const nextSlide = () => {
    handleSlideChange((currentIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    handleSlideChange(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    handleSlideChange(index);
  };

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", className)}>
      {/* Main content container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onPanStart={handlePanStart}
          onPanEnd={handlePanEnd}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation controls */}
      {showControls && totalSlides > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {indicators && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-gold scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
        {currentIndex + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default SwipableContainer;