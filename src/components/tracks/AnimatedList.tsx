
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
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

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
      <div 
        className={`animated-list ${displayScrollbar ? 'show-scrollbar' : ''}`}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={index}
              className={`animated-list-item ${
                selectedIndex === index ? 'selected' : ''
              } ${
                hoveredIndex === index ? 'hovered' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut" 
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <div className="item-content">
                <span className="item-text">{item}</span>
                {showGradients && (
                  <div className="item-gradient" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {showGradients && (
        <>
          <div
            className="scroll-gradient scroll-gradient-top"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="scroll-gradient scroll-gradient-bottom"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
