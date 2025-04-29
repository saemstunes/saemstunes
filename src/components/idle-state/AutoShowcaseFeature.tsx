
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AutoShowcaseFeatureProps {
  path: string;
  onInteraction: () => void;
}

const AutoShowcaseFeature: React.FC<AutoShowcaseFeatureProps> = ({ path, onInteraction }) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [features, setFeatures] = useState<{ title: string; description: string; path: string; }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Define features based on current page
    if (path === '/music-tools') {
      setFeatures([
        {
          title: "Pitch Finder",
          description: "Train your ear by identifying musical notes in real-time.",
          path: "/music-tools"
        },
        {
          title: "Metronome",
          description: "Keep perfect time with our wooden-style metronome.",
          path: "/music-tools"
        },
        {
          title: "Coming Soon: Chord Finder",
          description: "Identify complex chord progressions with one click.",
          path: "/music-tools"
        }
      ]);
    } else if (path === '/discover') {
      setFeatures([
        {
          title: "Featured Courses",
          description: "Learn from world-class musicians and educators.",
          path: "/discover"
        },
        {
          title: "Genre Exploration",
          description: "Discover new music styles from around the world.",
          path: "/discover"
        },
        {
          title: "Skills Development",
          description: "Build specific musical abilities with targeted lessons.",
          path: "/discover"
        }
      ]);
    } else if (path === '/library') {
      setFeatures([
        {
          title: "Your Saved Content",
          description: "Access all your bookmarked lessons and courses.",
          path: "/library"
        },
        {
          title: "Master Classes",
          description: "Exclusive advanced training from top professionals.",
          path: "/library"
        },
        {
          title: "Practice Resources",
          description: "Sheet music, backing tracks, and more for daily practice.",
          path: "/library"
        }
      ]);
    }
  }, [path]);

  // Cycle through features every 5 seconds
  useEffect(() => {
    if (features.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHighlight(prev => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [features]);

  if (features.length === 0) return null;

  const currentFeature = features[currentHighlight];

  const handleNavigate = () => {
    onInteraction(); // Dismiss the idle state
    navigate(currentFeature.path);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHighlight}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-x-0 bottom-24 md:bottom-8 flex justify-center z-[-1] px-4 pointer-events-none"
      >
        <motion.div 
          className="bg-card/90 backdrop-blur-md border border-gold/20 rounded-lg shadow-xl p-4 max-w-md w-full pointer-events-auto"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-gold" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg mb-1">{currentFeature.title}</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 rounded-full -mt-1 -mr-1"
                  onClick={() => onInteraction()}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{currentFeature.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {features.map((_, index) => (
                    <motion.div 
                      key={index}
                      className="h-1.5 w-8 rounded-full bg-muted"
                      animate={{
                        backgroundColor: index === currentHighlight ? 'rgb(234 179 8)' : 'rgb(212 212 216 / 0.3)'
                      }}
                    />
                  ))}
                </div>
                
                <Button
                  variant="link"
                  className="text-sm text-gold p-0 flex items-center"
                  onClick={handleNavigate}
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoShowcaseFeature;
