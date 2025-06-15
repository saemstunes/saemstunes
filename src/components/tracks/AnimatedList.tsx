
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedList.css';

interface AnimatedListProps {
  items: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
  className?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = false,
  enableArrowNavigation = false,
  displayScrollbar = false,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : items.length - 1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => prev < items.length - 1 ? prev + 1 : 0);
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault();
        onItemSelect?.(items[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableArrowNavigation, selectedIndex, items, onItemSelect]);

  const handleItemClick = (item: string, index: number) => {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  };

  return (
    <div className={`animated-list-container ${className}`} ref={containerRef}>
      <div className={`animated-list ${displayScrollbar ? 'show-scrollbar' : ''}`}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              className={`animated-list-item ${
                selectedIndex === index ? 'selected' : ''
              } ${
                hoveredIndex === index ? 'hovered' : ''
              }`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                transition: {
                  duration: 0.2
                }
              }}
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              onClick={() => handleItemClick(item, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              layout
            >
              <div className="item-content">
                <span className="item-text">{item}</span>
                {showGradients && (
                  <motion.div 
                    className="item-gradient"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: hoveredIndex === index ? 1 : 0,
                      scale: hoveredIndex === index ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              
              {/* Enhanced selection indicator */}
              {selectedIndex === index && (
                <motion.div
                  className="selection-indicator"
                  layoutId="selection"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedList;
