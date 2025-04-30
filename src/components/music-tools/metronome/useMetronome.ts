import { useState, useEffect, useRef } from 'react';
import { useAnimation } from "framer-motion";
import { userPreferences } from '@/lib/animation-utils';

export const useMetronome = () => {
  // Load saved preferences or use defaults
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(() => 
    userPreferences.load<number>('metronome-tempo', 100));
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(() => 
    userPreferences.load<number>('metronome-beats', 4));
  const [visualFeedback, setVisualFeedback] = useState(() => 
    userPreferences.load<boolean>('metronome-visual', true));
  const [currentBeat, setCurrentBeat] = useState(0);
  
  const audioContext = useRef<AudioContext | null>(null);
  const timerID = useRef<number | null>(null);
  const nextNoteTime = useRef(0);
  const scheduledNotes = useRef<{time: number, beat: number}[]>([]);
  const pendulumControls = useAnimation();
  
  // Save preferences when they change
  useEffect(() => {
    userPreferences.save('metronome-tempo', tempo);
  }, [tempo]);
  
  useEffect(() => {
    userPreferences.save('metronome-beats', beatsPerMeasure);
  }, [beatsPerMeasure]);
  
  useEffect(() => {
    userPreferences.save('metronome-visual', visualFeedback);
  }, [visualFeedback]);
  
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
    if (!audioContext.current) return;
    
    const osc = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    // First beat of the measure gets a higher pitch
    osc.frequency.value = beat === 0 ? 880 : 440;
    
    gainNode.gain.value = 0.5;
    osc.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    osc.start(time);
    osc.stop(time + 0.1);
    
    // Update visual beat counter
    if (time <= audioContext.current.currentTime) {
      setCurrentBeat(beat);
    } else {
      scheduledNotes.current.push({ time, beat });
    }
  };
  
  const scheduler = () => {
    if (!audioContext.current) return;
    
    // Schedule notes ahead of time
    while (nextNoteTime.current < audioContext.current.currentTime + 0.1) {
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

  return {
    isPlaying,
    tempo,
    setTempo,
    beatsPerMeasure,
    setBeatsPerMeasure,
    visualFeedback,
    setVisualFeedback,
    currentBeat,
    pendulumControls,
    startStop
  };
};
