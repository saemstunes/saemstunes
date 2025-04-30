// src/components/music-tools/metronome/MetronomeControls.tsx
import React from 'react';
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
  // Tempo text labels based on BPM
  const getTempoLabel = () => {
    if (tempo < 60) return "Largo";
    if (tempo < 76) return "Adagio";
    if (tempo < 108) return "Andante";
    if (tempo < 120) return "Moderato";
    if (tempo < 168) return "Allegro";
    return "Presto";
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
          <Label className="text-lg font-semibold">
            <span className="text-gold">{tempo} BPM</span>
            <span className="text-sm ml-2 text-muted-foreground">({getTempoLabel()})</span>
          </Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTempo(Math.max(tempo - 5, 40))}
              className="border-gold hover:bg-gold/10 hover:text-gold"
            >
              <Minus size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTempo(Math.min(tempo + 5, 220))}
              className="border-gold hover:bg-gold/10 hover:text-gold"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
        
        {/* Tempo slider */}
        <Slider
          value={[tempo]}
          min={40}
          max={220}
          step={1}
          onValueChange={(value) => setTempo(value[0])}
          className="py-4"
        />
        
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
          <Select 
            value={beatsPerMeasure.toString()} 
            onValueChange={(value) => setBeatsPerMeasure(Number(value))}
          >
            <SelectTrigger id="beats" className="border-gold/30 bg-black/20">
              <SelectValue placeholder="Beats" />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            "shadow-lg",
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
