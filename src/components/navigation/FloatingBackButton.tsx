
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);

  // Hide button on homepage
  useEffect(() => {
    setIsVisible(location.pathname !== '/');
  }, [location]);

  // Handle fading after inactivity
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setOpacity(0.1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isVisible, isDragging]);

  const handleClick = () => {
    navigate(-1);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };
  
  const handleTouchStart = () => {
    setOpacity(1);
  };

  // Constrain movement to bottom half of screen
  const constrainPosition = (pos) => {
    const minY = window.innerHeight / 2;
    const maxY = window.innerHeight - 80;
    const minX = 20;
    const maxX = window.innerWidth - 80;
    
    return {
      x: Math.min(Math.max(pos.x, minX), maxX),
      y: Math.min(Math.max(pos.y, minY), maxY)
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50"
          style={{ left: position.x, top: position.y }}
          drag
          dragConstraints={{ left: 0, right: window.innerWidth - 60, top: window.innerHeight / 2, bottom: window.innerHeight - 60 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            setPosition(constrainPosition({ 
              x: position.x + info.offset.x,
              y: position.y + info.offset.y
            }));
            setTimeout(() => setOpacity(0.1), 5000);
          }}
          whileDrag={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full shadow-md transition-all duration-300 h-12 w-12 bg-background/80 backdrop-blur-sm border border-border",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBackButton;
