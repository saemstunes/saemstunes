
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Mic, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Define types for note detection
type Note = {
  name: string;
  frequency: number;
  cents: number;
  octave: number;
};

// Define the musical notes in the chromatic scale
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PitchFinder = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const tuningMeterRef = useRef<HTMLDivElement>(null);

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

  // Convert cents to a tuning accuracy indication
  const getCentsAccuracyClass = (cents: number) => {
    const absCents = Math.abs(cents);
    if (absCents < 5) return 'bg-green-500';
    if (absCents < 15) return 'bg-green-400';
    if (absCents < 30) return 'bg-yellow-400';
    if (absCents < 50) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Calculate needle position based on cents
  const getNeedleRotation = (cents: number) => {
    // Map cents (-50 to +50) to degrees (-45 to +45)
    return (cents / 50) * 45;
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

  // Clean up on component unmount
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
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Music className="h-5 w-5 text-gold" />
          <span>Pitch Finder</span>
        </CardTitle>
        <CardDescription>
          Analyze and identify musical notes in real-time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Musical note display */}
        <div className="flex justify-center">
          <motion.div 
            className="relative w-56 h-56"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Circular background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-900 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Inner circle with musical notes background */}
              <div className="w-52 h-52 rounded-full bg-card flex items-center justify-center relative">
                {/* Decorative music note symbols */}
                {NOTES.map((note, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "absolute text-xs font-bold transform -translate-x-1/2 -translate-y-1/2",
                      currentNote?.name === note ? "text-gold font-bold" : "text-muted-foreground"
                    )}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `rotate(${index * 30}deg) translate(0, -21px) rotate(${-index * 30}deg)`
                    }}
                  >
                    {note}
                  </div>
                ))}
                
                {/* Center circle with note display */}
                <motion.div 
                  className="w-36 h-36 rounded-full bg-background shadow-inner flex flex-col items-center justify-center"
                  animate={{
                    scale: currentNote ? [1, 1.05, 1] : 1,
                    transition: { duration: 0.3 }
                  }}
                >
                  {currentNote ? (
                    <>
                      <motion.div 
                        className="text-4xl font-bold text-gold"
                        key={currentNote.name + currentNote.octave}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {currentNote.name}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">
                        Octave {currentNote.octave}
                      </div>
                      <div className="mt-1 text-xs">
                        {pitch?.toFixed(1)} Hz
                      </div>
                      <div className={cn(
                        "mt-1 px-2 py-0.5 rounded-full text-xs",
                        getCentsAccuracyClass(currentNote.cents)
                      )}>
                        {currentNote.cents > 0 ? '+' : ''}{currentNote.cents} cents
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">
                      {isListening ? 'Listening...' : 'Ready'}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Tuning meter */}
        {currentNote && (
          <div className="relative h-10 flex items-center justify-center" ref={tuningMeterRef}>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full flex justify-center">
                <div className="h-10 w-1 bg-gold rounded-full"></div>
              </div>
              
              <motion.div 
                className="absolute top-1 left-1/2"
                initial={{ rotate: 0 }}
                animate={{ rotate: getNeedleRotation(currentNote.cents) }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-20 h-1 bg-primary rounded-full origin-left transform -translate-x-1"></div>
                <div className="w-3 h-3 rounded-full bg-primary absolute -right-1 -top-1"></div>
              </motion.div>
              
              <div className="flex justify-between px-4 mt-3 text-xs text-muted-foreground">
                <span>-50</span>
                <span>-25</span>
                <span>0</span>
                <span>+25</span>
                <span>+50</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Control button */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={toggleListening}
            size="lg"
            className={cn(
              "rounded-full transition-all",
              isListening ? "bg-destructive hover:bg-destructive/90" : "bg-gold hover:bg-gold/90"
            )}
          >
            {isListening ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Listening
              </>
            )}
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          {isListening ? "Tap to stop" : "Tap to start detecting pitch"}
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchFinder;
