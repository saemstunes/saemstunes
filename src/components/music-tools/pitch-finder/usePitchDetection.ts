import { useState, useEffect, useRef, useCallback } from 'react';
import { Note, NOTES } from './NoteDial';

export const usePitchDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const pitchBufferRef = useRef<number[]>([]);
  const lastNoteRef = useRef<Note | null>(null);
  
  // Constants for pitch detection
  const BUFFER_SIZE = 5; // Size of buffer for smoothing pitch variations
  const STABILITY_THRESHOLD = 3; // Hz - Maximum pitch variance to consider it stable
  const MIN_AMPLITUDE = 0.01; // Minimum input signal amplitude to register

  // Function to convert frequency to note name, octave, and cents deviation
  const frequencyToNote = useCallback((frequency: number): Note => {
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
    const exactHalfSteps = halfStepsFromC0;
    const cents = Math.round((exactHalfSteps - noteNum) * 100);

    return {
      name: noteName,
      frequency,
      cents,
      octave
    };
  }, []);

  // Function to calculate average pitch from buffer for smoother readings
  const calculateAveragePitch = useCallback(() => {
    if (pitchBufferRef.current.length === 0) return null;
    
    // Calculate the average of stored pitches
    const sum = pitchBufferRef.current.reduce((acc, val) => acc + val, 0);
    return sum / pitchBufferRef.current.length;
  }, []);

  // Improved pitch detection using autocorrelation
  const detectPitch = useCallback((buffer: Float32Array, sampleRate: number) => {
    // First check if signal has enough amplitude
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    
    // Skip processing if the signal is too quiet
    if (rms < MIN_AMPLITUDE) {
      return null;
    }
    
    // Buffer size
    const bufferSize = buffer.length;
    
    // Apply a windowing function to the signal to improve frequency detection
    for (let i = 0; i < bufferSize; i++) {
      // Hann window function
      const multiplier = 0.5 * (1 - Math.cos(2 * Math.PI * i / (bufferSize - 1)));
      buffer[i] = buffer[i] * multiplier;
    }
    
    // Find where the signal repeats through autocorrelation
    const correlations: number[] = [];
    
    // Skip the first few samples where correlation is meaningless
    const minLag = Math.floor(sampleRate / 1500); // Min frequency ~1500Hz
    const maxLag = Math.floor(sampleRate / 80);   // Max frequency ~80Hz
    
    for (let lag = minLag; lag < maxLag; lag++) {
      let correlation = 0;
      let normalFactor = 0;
      
      for (let i = 0; i < bufferSize - lag; i++) {
        correlation += buffer[i] * buffer[i + lag];
        normalFactor += buffer[i] * buffer[i] + buffer[i + lag] * buffer[i + lag];
      }
      
      // Normalize to avoid false peaks
      correlations[lag] = normalFactor > 0 ? 2 * correlation / normalFactor : 0;
    }
    
    // Find the lag with the highest correlation
    let maxCorrelation = -1;
    let bestLag = -1;
    
    for (let lag = minLag; lag < correlations.length; lag++) {
      if (correlations[lag] > maxCorrelation) {
        maxCorrelation = correlations[lag];
        bestLag = lag;
      }
    }
    
    // Convert lag to frequency (Hz)
    const frequency = sampleRate / maxLag;
    
    // Only return frequency if correlation is high enough
    if (maxCorrelation > 0.3 && frequency > 80 && frequency < 1500) {
      return frequency;
    }
    
    return null;
  }, []);

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
      
      // Clear any previous note detection
      setCurrentNote(null);
      setPitch(null);
      pitchBufferRef.current = [];
      lastNoteRef.current = null;
      
      // Start the pitch detection loop
      startPitchDetection(analyzer, context.sampleRate);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      let errorMessage = 'Could not access microphone. Please check permissions.';
      
      // More specific error messages
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No microphone detected. Please connect a microphone and try again.';
        }
      }
      
      setError(errorMessage);
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
    pitchBufferRef.current = [];
    lastNoteRef.current = null;
  };

  // Start the pitch detection loop
  const startPitchDetection = (analyzer: AnalyserNode, sampleRate: number) => {
    const bufferLength = analyzer.fftSize;
    const buffer = new Float32Array(bufferLength);
    
    const detectLoop = () => {
      analyzer.getFloatTimeDomainData(buffer);
      
      const detectedPitch = detectPitch(buffer, sampleRate);
      
      if (detectedPitch !== null) {
        // Add to rolling buffer for stability
        pitchBufferRef.current.push(detectedPitch);
        if (pitchBufferRef.current.length > BUFFER_SIZE) {
          pitchBufferRef.current.shift();
        }
        
        // Only update if we have enough samples
        if (pitchBufferRef.current.length >= BUFFER_SIZE) {
          // Calculate average pitch
          const averagePitch = calculateAveragePitch();
          
          if (averagePitch !== null) {
            // Only update if the pitch is stable enough
            const isPitchStable = pitchBufferRef.current.every(
              p => Math.abs(p - averagePitch) < STABILITY_THRESHOLD
            );
            
            if (isPitchStable) {
              setPitch(averagePitch);
              const detectedNote = frequencyToNote(averagePitch);
              
              // Update the note if it's new or significantly different
              if (!lastNoteRef.current || 
                  lastNoteRef.current.name !== detectedNote.name || 
                  Math.abs(lastNoteRef.current.cents - detectedNote.cents) > 5) {
                setCurrentNote(detectedNote);
                lastNoteRef.current = detectedNote;
              }
            }
          }
        }
      } else {
        // If no pitch detected for a while, clear the buffer
        if (pitchBufferRef.current.length > 0) {
          pitchBufferRef.current = [];
        }
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
