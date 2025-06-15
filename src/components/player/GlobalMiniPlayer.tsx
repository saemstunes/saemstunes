
import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const GlobalMiniPlayer: React.FC = () => {
  const { state, pauseTrack, resumeTrack, seek, clearPlayer } = useAudioPlayer();

  if (!state.currentTrack) return null;

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleProgressChange = (values: number[]) => {
    seek(values[0]);
  };

  const handleClose = () => {
    clearPlayer();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed left-4 right-4 z-40 bg-card/95 backdrop-blur-lg border border-border shadow-2xl rounded-2xl",
          "bottom-20 lg:bottom-4 lg:max-w-md lg:mx-auto"
        )}
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            {/* Track Info */}
            <div className="flex items-center flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={state.currentTrack.artwork || '/placeholder.svg'} 
                  alt={state.currentTrack.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{state.currentTrack.name}</p>
                <p className="text-xs text-muted-foreground truncate">{state.currentTrack.artist}</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8" 
                  onClick={handlePlayPause}
                >
                  {state.isPlaying ? 
                    <Pause className="h-4 w-4" /> : 
                    <Play className="h-4 w-4" />
                  }
                </Button>
              </motion.div>
              
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8" 
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 space-y-1">
            <Slider 
              value={[state.currentTime]}
              max={state.duration || 100} 
              step={0.1}
              onValueChange={handleProgressChange}
              className="h-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalMiniPlayer;
