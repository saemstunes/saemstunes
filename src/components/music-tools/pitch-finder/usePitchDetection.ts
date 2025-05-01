
import { useState, useEffect, useRef } from 'react';
import { Note } from './NoteDial';
import { userPreferences } from '@/lib/animation-utils';

export const usePitchDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Define the musical notes in the chromatic scale
  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Function to convert frequency to note name, octave, and cents deviation
  const frequencyToNote = (frequency: number): Note => {
    // A4 = 440Hz (standard pitch)
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    
    // Calculate how many half-steps away from C0
    const halfStepsFromC0 = 12 * Math.log2(frequency / C0);
    
    // Round to get the closest note number
    const noteNum = Math.round(halfStepsFromC0);
    
    // Calculate the octave
    const octave = Math.floor(noteNum / 12);
    
    // Get the note name from the NOTES array
    const noteName = NOTES[noteNum % 12];
    
    // Calculate cents deviation
    // 100 cents = 1 half-step, so calculate how many cents away from the perfect pitch
    const exactHalfSteps = halfStepsFromC0;
    const cents = Math.round((exactHalfSteps - noteNum) * 100);
    
    return {
      name: noteName,
      frequency,
      cents,
      octave
    };
  };

  // Function to detect pitch using autocorrelation
  const detectPitch = (buffer: Float32Array, sampleRate: number) => {
    // Buffer size 
    const bufferSize = buffer.length;
    
    // Find where the signal repeats through autocorrelation
    const correlations: number[] = [];
    
    for (let lag = 0; lag < bufferSize; lag++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - lag; i++) {
        correlation += buffer[i] * buffer[i + lag];
      }
      correlations[lag] = correlation;
    }
    
    // Find the lag with the highest correlation
    let maxCorrelation = -1;
    let maxLag = -1;
    
    for (let lag = 50; lag < correlations.length; lag++) {
      if (correlations[lag] > maxCorrelation) {
        maxCorrelation = correlations[lag];
        maxLag = lag;
      }
    }
    
    // Convert lag to frequency (Hz)
    const frequency = sampleRate / maxLag;
    
    // Filter out frequencies that are too high or too low to be human voice or common instruments
    if (frequency > 80 && frequency < 1500 && maxCorrelation > 0.25) {
      return frequency;
    }
    
    return null;
  };

  // Setup audio context and analyzer
  const setupAudio = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 2048;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const micSource = context.createMediaStreamSource(stream);
      micSource.connect(analyzer);
      
      setAudioContext(context);
      setAnalyser(analyzer);
      setMicStream(stream);
      setIsListening(true);
      setError(null);
      
      // Start the pitch detection loop
      startPitchDetection(analyzer, context.sampleRate);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  // Stop audio processing
  const stopAudio = () => {
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsListening(false);
    setMicStream(null);
    setPitch(null);
    setCurrentNote(null);
  };

  // Start the pitch detection loop
  const startPitchDetection = (analyzer: AnalyserNode, sampleRate: number) => {
    const bufferLength = analyzer.fftSize;
    const buffer = new Float32Array(bufferLength);
    
    const detectLoop = () => {
      analyzer.getFloatTimeDomainData(buffer);
      
      const detectedPitch = detectPitch(buffer, sampleRate);
      
      if (detectedPitch !== null) {
        setPitch(detectedPitch);
        const detectedNote = frequencyToNote(detectedPitch);
        setCurrentNote(detectedNote);
      }
      
      animationRef.current = requestAnimationFrame(detectLoop);
    };
    
    animationRef.current = requestAnimationFrame(detectLoop);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopAudio();
    } else {
      setupAudio();
    }
  };

  return {
    isListening,
    error,
    currentNote,
    pitch,
    toggleListening,
  };
};
