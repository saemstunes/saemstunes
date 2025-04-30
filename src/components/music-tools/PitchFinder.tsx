
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Mic, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NoteDial from './pitch-finder/NoteDial';
import TuningMeter from './pitch-finder/TuningMeter';
import { usePitchDetection } from './pitch-finder/usePitchDetection';
import { ANIMATION_PRESETS } from '@/lib/animation-utils';

const PitchFinder = () => {
  const { isListening, error, currentNote, toggleListening } = usePitchDetection();

  return (
    <motion.div 
      {...ANIMATION_PRESETS.fadeIn}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="bg-gradient-to-b from-background to-background/80 border-gold/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/10 pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
            <Music className="h-6 w-6 text-gold" />
            <span>Ultra Pitch Finder</span>
          </CardTitle>
          <CardDescription>
            Detect musical pitches with precision and accuracy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm p-3 bg-destructive/10 rounded-md flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {/* Musical note circular display */}
          <div className="flex justify-center">
            <NoteDial currentNote={currentNote} isListening={isListening} />
          </div>
          
          {/* Tuning meter */}
          {currentNote && <TuningMeter currentNote={currentNote} />}
          
          {/* Control button */}
          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              onClick={toggleListening}
              size="lg"
              className={cn(
                "rounded-full transition-all shadow-lg",
                isListening 
                  ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                  : "bg-gold hover:bg-gold/90 shadow-gold/20"
              )}
            >
              {isListening ? (
                <>
                  <XCircle className="mr-2 h-5 w-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Listening
                </>
              )}
            </Button>
          </motion.div>
          
          <div className="text-center text-xs text-muted-foreground">
            {isListening ? "Sing or play a note to detect pitch" : "Ready to analyze your musical pitch"}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PitchFinder;
