// src/components/music-tools/metronome/useMetronome.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimation } from "framer-motion";
import { userPreferences } from '@/lib/animation-utils';
import { useAnimationRef } from '@/lib/animation-utils'; // Add this

// Constants for audio scheduling
const LOOKAHEAD = 25.0; // How often to call scheduler (in ms)
const SCHEDULE_AHEAD_TIME = 0.1; // How far ahead to schedule audio (in seconds)

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
  const [tapTempoTimes, setTapTempoTimes] = useState<number[]>([]);
  
  // Audio context and timing references
  const audioContext = useRef<AudioContext | null>(null);
  const timerID = useRef<number | null>(null);
  const nextNoteTime = useRef<number>(0);
  const lastNotePlayed = useRef<number>(-1);
  const pendulumControls = useAnimation();
  const animationFrameRef = useRef<number | null>(null);

  // Use refs for values that need real-time access
  const tempoRef = useAnimationRef(tempo);
  const beatsPerMeasureRef = useAnimationRef(beatsPerMeasure);

  // Audio context and timing references
  const audioContext = useRef<AudioContext | null>(null);
  const timerID = useRef<number | null>(null);
  const nextNoteTime = useRef<number>(0);
  const pendulumControls = useAnimation();
  const currentBeatRef = useRef(0);
  const beatIntervalRef = useRef(60 / tempo);
  
  // Save preferences when they change
  useEffect(() => {
    userPreferences.save('metronome-tempo', tempo);
    tempoRef.current = tempo;
    beatIntervalRef.current = 60 / tempo;
  }, [tempo]);
  
  useEffect(() => {
    userPreferences.save('metronome-beats', beatsPerMeasure);
  }, [beatsPerMeasure]);
  
  useEffect(() => {
    userPreferences.save('metronome-visual', visualFeedback);
  }, [visualFeedback]);
  
  // Initialize audio context - use lazy initialization
  const getAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  };
  
  // Calculate interval between beats in seconds
  const getBeatInterval = useCallback(() => {
    return 60.0 / tempo;
  }, [tempo]);
  
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
  }, [tempo, isPlaying, visualFeedback, pendulumControls, getBeatInterval]);
  
  // Play a single beat
  const playBeat = useCallback((time: number, beatNumber: number) => {
    const context = getAudioContext();
    
    // Create oscillator and gain node
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    
    // First beat of measure (accent)
    if (beatNumber === 0) {
      osc.frequency.value = 880;
      gainNode.gain.value = 0.6;
    } else {
      osc.frequency.value = 440;
      gainNode.gain.value = 0.3;
    }
    
    // Set up envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    
    // Connect and play
    osc.connect(gainNode);
    gainNode.connect(context.destination);
    
    osc.start(time);
    osc.stop(time + 0.1);
    
    lastNotePlayed.current = beatNumber;
  }, []);
  
  // Schedule the next sequence of beats
  const scheduler = useCallback(() => {
    // Get current time and calculate seconds per beat
    const context = getAudioContext();
    const currentTime = context.currentTime;
    
    // Use ref values for real-time access
    const currentTempo = tempoRef.current;
    const currentBeatsPerMeasure = beatsPerMeasureRef.current;
    const secondsPerBeat = 60 / currentTempo;
    
    // Schedule notes ahead of time
    while (nextNoteTime.current < currentTime + SCHEDULE_AHEAD_TIME) {
      const beatNumber = Math.floor(currentBeat) % beatsPerMeasure;
      playBeat(nextNoteTime.current, beatNumber);

      // Update beat counter
      currentBeatRef.current = (currentBeatRef.current + 1) % currentBeatsPerMeasure;
      setCurrentBeat(currentBeatRef.current);
      
      // Advance beat time using current tempo
      nextNoteTime.current += secondsPerBeat;
    }
    
    // Schedule next call
    timerID.current = window.setTimeout(scheduler, LOOKAHEAD);
  }, [playBeat]);
  
  // Visual beat indicator updater
  useEffect(() => {
    if (!isPlaying) return;
    
    const updateVisualBeat = () => {
      // Update visual beat if it's different from the last beat played
      if (lastNotePlayed.current >= 0) {
        setCurrentBeat(lastNotePlayed.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateVisualBeat);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateVisualBeat);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);
  
  // Start or stop the metronome
  const startStop = useCallback(() => {
    const context = getAudioContext();
    
    if (isPlaying) {
      // Stop the metronome
      setIsPlaying(false);
      if (timerID.current !== null) clearTimeout(timerID.current);
      timerID.current = null;
    } else {
      // Start the metronome
      if (context.state === 'suspended') context.resume();
      
      setIsPlaying(true);
      currentBeatRef.current = 0;
      setCurrentBeat(0);
      nextNoteTime.current = context.currentTime + 0.05; // Add small delay
      scheduler();
    }
  }, [isPlaying, scheduler]);
  
  // Handle tap tempo
  const tapTempo = useCallback(() => {
    const now = performance.now();
    
    // Update tap times array
    setTapTempoTimes(prev => {
      const newTimes = [...prev, now].filter(time => now - time < 3000);
      
      // Calculate new tempo if we have enough taps
      if (newTimes.length > 1) {
        const deltas = [];
        for (let i = 1; i < newTimes.length; i++) {
          deltas.push(newTimes[i] - newTimes[i-1]);
        }
        
        // Average the deltas and convert to BPM
        const avgDelta = deltas.reduce((sum, val) => sum + val, 0) / deltas.length;
        const newTempo = Math.round(60000 / avgDelta);
        
        // Clamp tempo to reasonable range
        setTempo(Math.min(Math.max(newTempo, 40), 220));
      }
      
      return newTimes;
    });
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContext.current) {
        audioContext.current.close();
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
    tapTempo
  };
};
