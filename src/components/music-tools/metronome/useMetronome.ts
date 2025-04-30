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
  
  const scheduleNote = useCallback((time: number, beat: number) => {
    // Create sound
    if (!audioContext.current) return;
    
    // First beat gets accent
    const isAccent = beat === 0;
    
    createOscillatorSound(audioContext.current, time, isAccent);
    
    // Update visual beat counter
    if (time <= audioContext.current.currentTime) {
      setCurrentBeat(beat);
    } else {
      scheduledNotes.current.push({ time, beat });
    }
  }, [soundType, volume]);
  
  const scheduler = useCallback(() => {
    if (!audioContext.current) return;
    
    // Look ahead 0.1 seconds to schedule notes
    while (nextNoteTime.current < audioContext.current.currentTime + 0.1) {
      const beatNumber = currentBeat % beatsPerMeasure;
      scheduleNote(nextNoteTime.current, beatNumber);
      
      // Calculate time for next note
      const secondsPerBeat = getBeatInterval();
      nextNoteTime.current += secondsPerBeat;
      setCurrentBeat((prev) => (prev + 1) % beatsPerMeasure);
    }
    
    // Schedule next check in 25ms
    timerID.current = window.setTimeout(scheduler, 25);
  }, [beatsPerMeasure, currentBeat, getBeatInterval, scheduleNote]);
  
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
      
      if (isPlaying) {
        requestAnimationFrame(checkScheduledNotes);
      }
    };
    
    const animationFrame = requestAnimationFrame(checkScheduledNotes);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, visualFeedback]);
  
  const startStop = useCallback(() => {
    if (isPlaying) {
      // Stop the metronome
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
      setIsPlaying(false);
      scheduledNotes.current = []; // Clear pending notes
    } else {
      // Initialize audio context if needed
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Resume context on iOS/Safari which might be suspended
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      
      // Start the metronome
      setCurrentBeat(0);
      nextNoteTime.current = audioContext.current.currentTime;
      scheduler();
      setIsPlaying(true);
    }
  }, [isPlaying, scheduler]);
  
  // Immediately stop on unmount
  useEffect(() => {
    return () => {
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
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
    startStop,
    soundType,
    setSoundType,
    volume,
    setVolume
  };
