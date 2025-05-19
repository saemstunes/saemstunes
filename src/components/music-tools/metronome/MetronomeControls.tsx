// src/components/music-tools/metronome/MetronomeControls.tsx
import React, { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Music, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetronomeControlsProps {
  tempo: number;
  setTempo: (tempo: number) => void;
  isPlaying: boolean;
  startStop: () => void;
  beatsPerMeasure: number;
  setBeatsPerMeasure: (beats: number) => void;
  visualFeedback: boolean;
  setVisualFeedback: (visualFeedback: boolean) => void;
  tapTempo: () => void;
}

const MetronomeControls: React.FC<MetronomeControlsProps> = ({
  tempo,
  setTempo,
  isPlaying,
  startStop,
  beatsPerMeasure,
  setBeatsPerMeasure,
  visualFeedback,
  setVisualFeedback,
  tapTempo
}) => {
  // State to track tempo changes for animations
  const [prevTempo, setPrevTempo] = useState(tempo);
  const [tempoChangeDirection, setTempoChangeDirection] = useState<'up' | 'down' | null>(null);

  // Track previous beats per measure for animation
  const [prevBeats, setPrevBeats] = useState(beatsPerMeasure);
  
  // Tempo text labels based on BPM
  const getTempoLabel = () => {
    if (tempo < 60) return "Largo";
    if (tempo < 76) return "Adagio";
    if (tempo < 108) return "Andante";
    if (tempo < 120) return "Moderato";
    if (tempo < 168) return "Allegro";
    return "Presto";
  };

  // Handle tempo changes
  useEffect(() => {
    if (tempo !== prevTempo) {
      setTempoChangeDirection(tempo > prevTempo ? 'up' : 'down');
      setPrevTempo(tempo);
      
      // Reset direction after animation
      const timer = setTimeout(() => {
        setTempoChangeDirection(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [tempo, prevTempo]);

  // Handle beats changes
  useEffect(() => {
    if (beatsPerMeasure !== prevBeats) {
      setPrevBeats(beatsPerMeasure);
    }
  }, [beatsPerMeasure, prevBeats]);

  // Handle tempo changes with increment/decrement
  const handleTempoChange = (amount: number) => {
    const newTempo = Math.max(40, Math.min(220, tempo + amount));
    setTempo(newTempo);
  };
  
  // Handle beats per measure change with animation
  const handleBeatsChange = (newValue: string) => {
    const newBeats = Number(newValue);
    setBeatsPerMeasure(newBeats);
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Tempo control section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <motion.div
            key={`tempo-label-${tempo}`}
            initial={{ opacity: 0.7, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Label className="text-lg font-semibold">
              <span className="text-gold">{tempo} BPM</span>
              <span className="text-sm ml-2 text-muted-foreground">({getTempoLabel()})</span>
            </Label>
          </motion.div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTempoChange(-5)}
              className="border-gold hover:bg-gold/10 hover:text-gold relative"
            >
              <Minus size={16} />
              {tempoChangeDirection === 'down' && (
                <motion.span 
                  className="absolute -top-2 -right-2 rounded-full bg-gold text-black text-xs w-5 h-5 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
                  transition={{ duration: 0.5 }}
                >
                  -5
                </motion.span>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTempoChange(5)}
              className="border-gold hover:bg-gold/10 hover:text-gold relative"
            >
              <Plus size={16} />
              {tempoChangeDirection === 'up' && (
                <motion.span 
                  className="absolute -top-2 -right-2 rounded-full bg-gold text-black text-xs w-5 h-5 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
                  transition={{ duration: 0.5 }}
                >
                  +5
                </motion.span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Tempo slider */}
        <div className="relative">
          <Slider
            value={[tempo]}
            min={40}
            max={220}
            step={1}
            onValueChange={(value) => setTempo(value[0])}
            className="py-4"
          />
          
          {/* Tempo change indicator */}
          {tempoChangeDirection && (
            <motion.div 
              className={cn(
                "absolute h-1 rounded-full",
                tempoChangeDirection === 'up' ? "bg-green-500" : "bg-amber-500"
              )}
              style={{ 
                bottom: "20px", 
                left: `${((prevTempo - 40) / 180) * 100}%`,
                width: `${Math.abs(tempo - prevTempo) / 180 * 100}%`,
                transformOrigin: tempoChangeDirection === 'up' ? 'left' : 'right'
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>
        
        {/* Tempo guide */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Medium</span>
          <span>Fast</span>
        </div>
      </div>
      
      {/* Options section */}
      <div className="flex flex-wrap gap-6 items-center">
        <div className="space-y-1 flex-1 min-w-[120px]">
          <Label htmlFor="beats" className="text-sm">Beats per measure</Label>
          <motion.div
            key={`beats-select-${beatsPerMeasure}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Select 
              value={beatsPerMeasure.toString()} 
              onValueChange={handleBeatsChange}
            >
              <SelectTrigger id="beats" className="border-gold/30 bg-black/20">
                <SelectValue placeholder="Beats" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 4 ? '(4/4)' : num === 3 ? '(3/4)' : num === 2 ? '(2/4)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        
        <div className="space-y-1 flex-1 min-w-[120px]">
          <div className="flex items-center space-x-2">
            <Switch 
              id="visual-feedback" 
              checked={visualFeedback}
              onCheckedChange={setVisualFeedback}
              className="data-[state=checked]:bg-gold"
            />
            <Label htmlFor="visual-feedback" className="text-sm">Visual feedback</Label>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={tapTempo}
          variant="outline"
          className="border-gold hover:bg-gold/10 hover:text-gold"
        >
          <Music className="w-4 h-4 mr-2" />
          Tap Tempo
        </Button>
        
        <Button 
          size="lg"
          onClick={startStop}
          className={cn(
            "shadow-lg transition-colors duration-200",
            isPlaying 
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
              : "bg-gold hover:bg-gold/90 shadow-gold/20"
          )}
        >
          {isPlaying ? (
            <>
              <PauseCircle className="mr-2 h-5 w-5" />
              Stop
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-5 w-5" />
              Start
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default MetronomeControls;
