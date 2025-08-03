
import { useState, useEffect, useRef, useCallback } from 'react';
import { Note, NOTES } from './NoteDial';

export const usePitchDetection = (options = { cleanAudio: false }) => {
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
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Constants for pitch detection
  const BUFFER_SIZE = 5; // Size of buffer for smoothing pitch variations
  const STABILITY_THRESHOLD = 3; // Hz - Maximum pitch variance to consider it stable
  const MIN_AMPLITUDE = 0.01; // Minimum input signal amplitude to register
  const UPDATE_INTERVAL = 50; // Only update state every 50ms to avoid performance issues

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
    const minLag = Math.floor(sampleRate / 5000); // Min frequency ~5000Hz
    const maxLag = Math.floor(sampleRate / 60);   // Max frequency ~60Hz
    
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
    const frequency = bestLag > 0 ? sampleRate / bestLag : null;
    
    // Only return frequency if correlation is high enough
    if (maxCorrelation > 0.3 && frequency > 80 && frequency < 1500) {
      return frequency;
    }
    
    return null;
  }, []);

  // Check if this is a secure context (needed for microphone access)
  const isSecureContext = useCallback(() => {
    return typeof window !== 'undefined' && window.isSecureContext === true;
  }, []);

  // Check if browser supports getUserMedia
  const isMicrophoneSupported = useCallback(() => {
    return !!(navigator?.mediaDevices?.getUserMedia);
  }, []);
  
  // Check if AudioContext is supported
  const isAudioContextSupported = useCallback(() => {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }, []);

  // Setup audio context and analyzer
  const setupAudio = async () => {
    if (!isSecureContext()) {
      setError('Microphone access requires a secure connection (HTTPS).');
      return;
    }

    if (!isMicrophoneSupported()) {
      setError('Your browser does not support microphone access.');
      return;
    }

    if (!isAudioContextSupported()) {
      setError('Your browser does not support audio processing.');
      return;
    }

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Critical for iOS - must resume context after creation
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 8192; // Might need to be smaller on mobile, like 4096 or 2048
      
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: options.cleanAudio ? {
          // For better pitch accuracy, disable audio processing
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } : {
          // For better voice quality, enable audio processing
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Microphone access granted, setting up audio processing');
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
      lastUpdateTimeRef.current = 0;
      
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
        } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
          errorMessage = 'Could not access your microphone. It might be in use by another application.';
        } else if (err.name === 'SecurityError') {
          errorMessage = 'Microphone access not allowed in this context. Please use HTTPS.';
        } else if (err.name === 'TypeError') {
          errorMessage = 'Your browser does not fully support microphone access.';
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
    
    // Close AudioContext explicitly - important for mobile
    if (audioContext) {
      audioContext.close().catch(console.error);
    }
    
    setIsListening(false);
    setMicStream(null);
    setPitch(null);
    setCurrentNote(null);
    pitchBufferRef.current = [];
    lastNoteRef.current = null;
    setAudioContext(null);
    setAnalyser(null);
  };

  // Start the pitch detection loop
  const startPitchDetection = (analyzer: AnalyserNode, sampleRate: number) => {
    const bufferLength = analyzer.fftSize;
    const buffer = new Float32Array(bufferLength);
    
    const detectLoop = () => {
      try {
        // Try to use Float data if supported
        analyzer.getFloatTimeDomainData(buffer);
      } catch (e) {
        // Fallback to byte data if float isn't supported (some older browsers)
        console.log('Float time domain not supported, falling back to byte data');
        const byteBuffer = new Uint8Array(bufferLength);
        analyzer.getByteTimeDomainData(byteBuffer);
        
        // Convert byte data to float [-1.0, 1.0]
        for (let i = 0; i < bufferLength; i++) {
          buffer[i] = (byteBuffer[i] - 128) / 128;
        }
      }
      
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
              const now = Date.now();
              
              // Only update state every UPDATE_INTERVAL ms to avoid over-rendering
              // Especially important on mobile devices
              if (now - lastUpdateTimeRef.current > UPDATE_INTERVAL) {
                lastUpdateTimeRef.current = now;
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
    };
  }, []);

  // Makes sure the audio context is resumed after a user gesture
  // This is crucial for iOS and some Android browsers
  const toggleListening = async () => {
    if (isListening) {
      stopAudio();
    } else {
      // Check for existing context that may be suspended
      if (audioContext && audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
          console.log('Resumed existing audio context');
          // Start the pitch detection with existing context
          if (analyser) {
            setIsListening(true);
            startPitchDetection(analyser, audioContext.sampleRate);
            return;
          }
        } catch (err) {
          console.error('Failed to resume AudioContext:', err);
          // If resume fails, try completely new setup
          setAudioContext(null);
          setAnalyser(null);
        }
      }
      
      // Normal setup path
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
