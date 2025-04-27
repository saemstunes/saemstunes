
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  
  // Initialize audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
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
      clearTimeout(timerID.current!);
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
      if (timerID.current) {
        clearTimeout(timerID.current);
      }
    };
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Metronome visual display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
            <div className="text-4xl font-mono font-bold">
              {tempo}
            </div>
          </div>
          
          {visualFeedback && isPlaying && (
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div 
                  key={i}
                  className={`absolute w-3 h-3 rounded-full transition-all duration-100 ${
                    currentBeat === i 
                      ? 'bg-gold scale-150' 
                      : 'bg-muted-foreground'
                  }`}
                  style={{
                    top: `${50 - 40 * Math.cos(2 * Math.PI * i / beatsPerMeasure)}%`,
                    left: `${50 + 40 * Math.sin(2 * Math.PI * i / beatsPerMeasure)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label>Tempo: {tempo} BPM</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTempo(prev => Math.max(prev - 5, 40))}
              >
                -
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTempo(prev => Math.min(prev + 5, 220))}
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
          />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1 flex-1 min-w-[120px]">
            <Label htmlFor="beats">Beats per measure</Label>
            <Select 
              value={beatsPerMeasure.toString()} 
              onValueChange={(value) => setBeatsPerMeasure(Number(value))}
            >
              <SelectTrigger id="beats">
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
              />
              <Label htmlFor="visual-feedback">Visual feedback</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <Button 
            size="lg"
            onClick={startStop}
            className={isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-gold hover:bg-gold-dark"}
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
      </div>
    </div>
  );
};

export default Metronome;
