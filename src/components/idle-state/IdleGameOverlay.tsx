
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface IdleGameOverlayProps {
  onInteraction: () => void;
}

const IdleGameOverlay: React.FC<IdleGameOverlayProps> = ({ onInteraction }) => {
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<{ id: number; x: number; y: number; color: string; captured: boolean }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Exit the game if user navigates or changes focus to app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden' && gameStarted) {
        onInteraction();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameStarted, onInteraction]);
  
  useEffect(() => {
    if (!gameStarted) return;
    
    // Generate a new note every 2 seconds
    const interval = setInterval(() => {
      if (notes.length < 10) { // Limit to 10 notes on screen at once
        const newNote = {
          id: Date.now(),
          x: Math.random() * 80 + 10, // 10-90% of screen width
          y: Math.random() * 80 + 10, // 10-90% of screen height
          color: getRandomColor(),
          captured: false,
        };
        setNotes(prev => [...prev.filter(n => !n.captured), newNote]);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameStarted, notes]);
  
  // Slowly fade out notes that aren't captured
  useEffect(() => {
    if (!gameStarted) return;
    
    const timeout = setTimeout(() => {
      setNotes(prev => prev.filter(note => 
        note.captured || Date.now() - note.id < 10000 // Keep only if captured or less than 10s old
      ));
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [notes, gameStarted]);
  
  const getRandomColor = () => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9D65C9', '#FF8C42'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const captureNote = (id: number) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, captured: true } : note
      )
    );
    setScore(prev => prev + 1);
    
    // Show achievements based on score
    if (score === 4) {
      toast({
        title: "Achievement Unlocked!",
        description: "Musical Newcomer: Caught 5 notes",
      });
    } else if (score === 9) {
      toast({
        title: "Achievement Unlocked!",
        description: "Melody Master: Caught 10 notes",
      });
    } else if (score === 24) {
      toast({
        title: "Achievement Unlocked!",
        description: "Symphony Conductor: Caught 25 notes",
      });
    }
  };
  
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setNotes([]);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only dismiss if the game hasn't started or if clicking directly on the background
    if (!gameStarted && e.currentTarget === e.target) {
      onInteraction();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-10 pointer-events-none bg-black/40 backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <div className="pointer-events-auto">
        {gameStarted ? (
          <>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-gold/20">
              <Music className="h-4 w-4 text-gold" />
              <span className="font-medium">Score: {score}</span>
            </div>
            
            {/* Exit button in game mode */}
            <Button
              className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gold/20"
              variant="ghost"
              size="sm"
              onClick={() => onInteraction()}
            >
              Exit Game
            </Button>
            
            {notes.map(note => (
              <AnimatePresence key={note.id}>
                {!note.captured && (
                  <motion.div
                    className="absolute flex items-center justify-center cursor-pointer"
                    style={{ 
                      left: `${note.x}%`, 
                      top: `${note.y}%`,
                      color: note.color,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      captureNote(note.id);
                    }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="text-4xl"
                    >
                      ♪
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">Note Catcher</h2>
              <p className="text-white/80 max-w-md mx-auto">
                Tap on musical notes as they appear. How many can you catch?
              </p>
            </motion.div>
            
            <div className="flex gap-4">
              <Button 
                onClick={startGame}
                size="lg"
                className="bg-gold hover:bg-gold/90 text-primary"
              >
                <Star className="mr-2 h-5 w-5" />
                Start Game
              </Button>
              
              <Button 
                onClick={() => onInteraction()}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Return to App
              </Button>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/60 mt-4 flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Unlock achievements by catching more notes!</span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IdleGameOverlay;
