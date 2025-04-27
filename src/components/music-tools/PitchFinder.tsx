
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

  // Convert cents to a color on a red-to-green gradient
  const getCentsAccuracyColor = (cents: number) => {
    // Get absolute value of cents (distance from perfect pitch)
    const absCents = Math.abs(cents);
    
    // Create a non-linear scale for color mapping (more green for closer matches)
    // Logarithmic calculation for opacity
    let opacity = 1.0;
    if (absCents > 5) {
      // logarithmically decrease opacity as cents increase
      opacity = Math.max(0.2, 1 - Math.log10(absCents / 5) * 0.4);
    }
    
    // Colors: red (furthest) to green (perfect)
    if (absCents < 5) return `rgba(0, 255, 0, ${opacity})`; // Green - perfect match
    if (absCents < 10) return `rgba(0, 200, 100, ${opacity})`; // Turquoise-ish
    if (absCents < 15) return `rgba(0, 150, 150, ${opacity})`; // Blue-ish
    if (absCents < 20) return `rgba(50, 100, 200, ${opacity})`; // Cyan blue
    if (absCents < 30) return `rgba(200, 200, 0, ${opacity})`; // Yellow
    if (absCents < 40) return `rgba(255, 180, 0, ${opacity})`; // Golden
    if (absCents < 50) return `rgba(255, 120, 0, ${opacity})`; // Orange
    return `rgba(255, 0, 0, ${opacity})`; // Red - far off
  };

  // Get CSS class for accuracy badge
  const getCentsAccuracyClass = (cents: number) => {
    const absCents = Math.abs(cents);
    if (absCents < 5) return 'bg-green-500 text-white';
    if (absCents < 15) return 'bg-green-400 text-white';
    if (absCents < 30) return 'bg-yellow-400 text-black';
    if (absCents < 50) return 'bg-orange-400 text-white';
    return 'bg-red-500 text-white';
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
                {/* Decorative music note symbols - arranged in circle */}
                {NOTES.map((note, index) => {
                  // Calculate position on a circle
                  const angle = (index * Math.PI * 2) / NOTES.length;
                  const x = Math.sin(angle) * 80; // Radius
                  const y = -Math.cos(angle) * 80; // Negative because y increases downward
                  
                  const isCurrentNote = currentNote?.name === note;
                  
                  // Dynamic color based on current note and cents difference
                  const noteColor = isCurrentNote && currentNote ? getCentsAccuracyColor(currentNote.cents) : 
                                                                  'rgb(107, 114, 128)'; // text-muted-foreground
                  
                  return (
                    <motion.div 
                      key={index}
                      className="absolute text-sm font-bold transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(${x}px, ${y}px)`,
                        color: isCurrentNote ? noteColor : undefined
                      }}
                      animate={{
                        scale: isCurrentNote ? [1, 1.3, 1] : 1,
                        transition: { duration: isCurrentNote ? 0.3 : 0 }
                      }}
                    >
                      {note}
                    </motion.div>
                  );
                })}
                
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
                        className="text-4xl font-bold"
                        key={currentNote.name + currentNote.octave}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: getCentsAccuracyColor(currentNote.cents) }}
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
          <div className="relative h-16 flex flex-col items-center justify-center" ref={tuningMeterRef}>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              {/* Center line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-10 w-0.5 bg-gold"></div>
              
              {/* Markings */}
              <div className="absolute top-2 left-0 w-full flex justify-between px-0">
                <div className="h-3 w-0.5 bg-muted-foreground"></div>
                <div className="h-2 w-0.5 bg-muted-foreground"></div>
                <div className="h-2 w-0.5 bg-muted-foreground"></div>
                <div className="h-3 w-0.5 bg-muted-foreground"></div>
                <div className="h-2 w-0.5 bg-muted-foreground"></div>
                <div className="h-2 w-0.5 bg-muted-foreground"></div>
                <div className="h-3 w-0.5 bg-muted-foreground"></div>
              </div>
              
              {/* Tuner needle */}
              <motion.div 
                className="absolute top-0 left-1/2 -mt-1"
                initial={{ rotate: 0 }}
                animate={{ rotate: getNeedleRotation(currentNote.cents) }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <div className="h-10 w-1 bg-primary rounded-t-full"></div>
                <div className="w-3 h-3 rounded-full bg-primary absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
              </motion.div>
              
              <div className="flex justify-between px-1 mt-12 text-xs text-muted-foreground">
                <span>-50</span>
                <span>-25</span>
                <span>0</span>
                <span>+25</span>
                <span>+50</span>
              </div>
            </div>
            
            {/* Cents gradient bar */}
            <div className="w-full h-4 mt-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-60"></div>
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
