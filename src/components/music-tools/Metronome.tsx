
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [visualFeedback, setVisualFeedback] = useState(true);
  
  const audioContext = useRef<AudioContext | null>(null);
  const timerID = useRef<number | null>(null);
  const nextNoteTime = useRef(0);
  const scheduledNotes = useRef<{time: number, beat: number}[]>([]);
  const pendulumControls = useAnimation();
  
  // Initialize audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Calculate interval between beats in seconds
  const getBeatInterval = () => {
    return 60.0 / tempo;
  };
  
  // Update pendulum animation when tempo changes or play state changes
  useEffect(() => {
    if (isPlaying && visualFeedback) {
      const beatInterval = getBeatInterval();
      
      pendulumControls.start({
        rotate: [30, -30, 30],
        transition: {
          duration: beatInterval * 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    } else {
      pendulumControls.stop();
      pendulumControls.set({ rotate: 0 });
    }
  }, [tempo, isPlaying, visualFeedback, pendulumControls]);
  
  const scheduleNote = (time: number, beat: number) => {
    // Create oscillator
    const osc = audioContext.current!.createOscillator();
    const gainNode = audioContext.current!.createGain();
    
    // First beat of the measure gets a higher pitch
    osc.frequency.value = beat === 0 ? 880 : 440;
    
    gainNode.gain.value = 0.5;
    osc.connect(gainNode);
    gainNode.connect(audioContext.current!.destination);
    
    osc.start(time);
    osc.stop(time + 0.1);
    
    // Update visual beat counter
    if (time <= audioContext.current!.currentTime) {
      setCurrentBeat(beat);
    } else {
      scheduledNotes.current.push({ time, beat });
    }
  };
  
  const scheduler = () => {
    // Schedule notes ahead of time
    while (nextNoteTime.current < audioContext.current!.currentTime + 0.1) {
      const beatNumber = currentBeat % beatsPerMeasure;
      scheduleNote(nextNoteTime.current, beatNumber);
      
      // Calculate time for next note
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTime.current += secondsPerBeat;
      setCurrentBeat((prev) => (prev + 1) % beatsPerMeasure);
    }
    timerID.current = window.setTimeout(scheduler, 25);
  };
  
  // Check scheduled notes and update the visual beat
  useEffect(() => {
    if (!isPlaying || !visualFeedback) return;
    
    const checkScheduledNotes = () => {
      const now = audioContext.current?.currentTime || 0;
      
      // Find notes that should be played now
      const dueNotes = scheduledNotes.current.filter(note => note.time <= now);
      
      if (dueNotes.length > 0) {
        // Get the most recent note
        const latestNote = dueNotes[dueNotes.length - 1];
        setCurrentBeat(latestNote.beat);
        
        // Remove processed notes
        scheduledNotes.current = scheduledNotes.current.filter(note => note.time > now);
      }
      
      requestAnimationFrame(checkScheduledNotes);
    };
    
    const animationFrame = requestAnimationFrame(checkScheduledNotes);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, visualFeedback]);
  
  const startStop = () => {
    if (isPlaying) {
      // Stop the metronome
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start the metronome
      if (audioContext.current!.state === 'suspended') {
        audioContext.current!.resume();
      }
      
      setCurrentBeat(0);
      nextNoteTime.current = audioContext.current!.currentTime;
      scheduler();
      setIsPlaying(true);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
      }
    };
  }, []);
  
  const getBeatPosition = (index: number) => {
    // Calculate position on a circle for each beat
    const angle = (2 * Math.PI * index) / beatsPerMeasure;
    const radius = 40; // Circle radius percentage
    
    return {
      top: `${50 - radius * Math.cos(angle)}%`,
      left: `${50 + radius * Math.sin(angle)}%`,
    };
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wooden metronome visual display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-72 md:w-80 md:h-80">
          {/* Wooden base */}
          <div 
            className="absolute bottom-0 left-1/2 w-40 h-12 rounded-b-xl transform -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, #8B4513, #5D370F)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}
          >
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 10px)",
                backgroundSize: "20px 20px"
              }}
            />
          </div>
          
          {/* Wooden pyramid body */}
          <div 
            className="absolute bottom-12 left-1/2 w-56 h-44 transform -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, #704214, #8B4513)",
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
                backgroundSize: "20px 20px"
              }}
            />
            
            {/* Center circle dial */}
            <div 
              className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2" 
              style={{
                background: "radial-gradient(circle, #F5F5DC, #E8E4C9)",
                border: "3px solid #5D370F"
              }}
            >
              <motion.div 
                className="absolute top-1/2 left-1/2 text-3xl font-mono font-bold transform -translate-x-1/2 -translate-y-1/2 text-[#5D370F]"
                key={tempo}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                {tempo}
              </motion.div>
            </div>
            
            {/* Beat markers */}
            {visualFeedback && (
              <div className="absolute inset-0">
                {Array.from({ length: beatsPerMeasure }).map((_, i) => {
                  const position = getBeatPosition(i);
                  const isActive = isPlaying && currentBeat === i;
                  
                  return (
                    <motion.div 
                      key={i}
                      className="absolute w-4 h-4 rounded-full"
                      style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translate(-50%, -50%)',
                        background: isActive ? "#FFD700" : "#CD853F",
                        boxShadow: isActive ? "0 0 10px rgba(255, 215, 0, 0.7)" : "none"
                      }}
                      animate={{
                        scale: isActive ? [1, 1.5, 1] : 1,
                        opacity: isActive ? [0.7, 1, 0.7] : 0.7
                      }}
                      transition={{
                        duration: isActive ? 0.2 : 0,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Pendulum rod and weight */}
          {visualFeedback && (
            <motion.div
              className="absolute bottom-12 left-1/2 origin-bottom"
              style={{ bottom: "56px" }}
              animate={pendulumControls}
            >
              <div className="absolute w-0.5 h-48 bg-gray-800 left-0 transform -translate-x-1/2" />
              {/* Pendulum weight */}
              <div 
                className="absolute -top-3 left-0 w-6 h-12 transform -translate-x-1/2"
                style={{
                  background: "linear-gradient(to right, #FFD700, #B8860B, #FFD700)",
                  borderRadius: "4px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)"
                }}
              />
            </motion.div>
          )}
          
          {/* Tempo text */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-3 text-sm font-semibold text-white/90"
          >
            BPM
          </div>
        </div>
      </div>
      
      {/* Controls */}
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
                onClick={() => setTempo(prev => Math.max(prev - 5, 40))}
                className="border-gold hover:bg-gold/10 hover:text-gold"
              >
                -
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTempo(prev => Math.min(prev + 5, 220))}
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
    </motion.div>
  );
};

export default Metronome;
