import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle } from "lucide-react";
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
}

const MetronomeControls: React.FC<MetronomeControlsProps> = ({
  tempo,
  setTempo,
  isPlaying,
  startStop,
  beatsPerMeasure,
  setBeatsPerMeasure,
  visualFeedback,
  setVisualFeedback
}) => {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-lg font-semibold">Tempo: {tempo} BPM</Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTempo(Math.max(tempo - 5, 40))}
              className="border-gold hover:bg-gold/10 hover:text-gold"
            >
              -
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTempo(Math.min(tempo + 5, 220))}
              className="border-gold hover:bg-gold/10 hover:text-gold"
            >
              +
            </Button>
          </div>
        </div>
        <Slider
          value={[tempo]}
          min={40}
          max={220}
          step={1}
          onValueChange={(value) => setTempo(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Medium</span>
          <span>Fast</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="space-y-1 flex-1 min-w-[120px]">
          <Label htmlFor="beats">Beats per measure</Label>
          <Select 
            value={beatsPerMeasure.toString()} 
            onValueChange={(value) => setBeatsPerMeasure(Number(value))}
          >
            <SelectTrigger id="beats" className="border-gold/30">
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
            <Label htmlFor="visual-feedback">Visual feedback</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-2">
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
