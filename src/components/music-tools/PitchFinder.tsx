
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Mic, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  // Convert cents to a color on a red-to-green gradient with proper opacity
  const getCentsAccuracyColor = (cents: number) => {
    // Get absolute value of cents (distance from perfect pitch)
    const absCents = Math.abs(cents);
    
    // Create a logarithmic scale for color mapping (more green for closer matches)
    let opacity = Math.max(0.2, 1 - Math.log10(Math.max(1, absCents) / 5) * 0.4);
    
    // Color gradient from red to green based on accuracy
    if (absCents < 5) return `rgba(0, 255, 0, ${opacity})`; // Perfect - Green
    if (absCents < 10) return `rgba(120, 255, 0, ${opacity})`; // Near perfect - Light green
    if (absCents < 15) return `rgba(180, 255, 0, ${opacity})`; // Very good - Yellow-green
    if (absCents < 20) return `rgba(255, 255, 0, ${opacity})`; // Good - Yellow
    if (absCents < 30) return `rgba(255, 180, 0, ${opacity})`; // OK - Golden
    if (absCents < 40) return `rgba(255, 120, 0, ${opacity})`; // Not great - Orange
    if (absCents < 50) return `rgba(255, 60, 0, ${opacity})`; // Poor - Dark orange
    return `rgba(255, 0, 0, ${opacity})`; // Far off - Red
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="bg-gradient-to-b from-background to-background/80 border-gold/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/10 pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
            <Music className="h-6 w-6 text-gold" />
            <span>Ultra Pitch Finder</span>
          </CardTitle>
          <CardDescription>
            Detect musical pitches with precision and accuracy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm p-3 bg-destructive/10 rounded-md flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {/* Musical note circular display */}
          <div className="flex justify-center">
            <motion.div 
              className="relative w-64 h-64 md:w-72 md:h-72"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Circular background with wooden texture */}
              <div 
                className="absolute inset-0 rounded-full shadow-xl flex items-center justify-center overflow-hidden"
                style={{
                  background: "radial-gradient(circle, #8B4513 0%, #704214 50%, #5D370F 100%)",
                  boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Wood grain pattern */}
                <div className="absolute inset-0 opacity-30" 
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
                    backgroundSize: "20px 20px",
                    transform: "rotate(30deg)"
                  }}
                />
                
                {/* Inner circle with notes background */}
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-black/80 flex items-center justify-center relative">
                  {/* Decorative music note symbols - arranged in circle */}
                  {NOTES.map((note, index) => {
                    // Calculate position on a circle
                    const angle = (index * Math.PI * 2) / NOTES.length;
                    const x = Math.sin(angle) * 90; // Radius
                    const y = -Math.cos(angle) * 90; // Negative because y increases downward
                    
                    const isCurrentNote = currentNote?.name === note;
                    
                    // Dynamic color based on current note and cents difference
                    const noteColor = isCurrentNote && currentNote 
                      ? getCentsAccuracyColor(currentNote.cents) 
                      : 'rgb(147, 124, 80)'; // gold-ish for wooden theme
                    
                    return (
                      <motion.div 
                        key={index}
                        className={`absolute text-sm md:text-base font-bold transform -translate-x-1/2 -translate-y-1/2 ${
                          isCurrentNote ? 'z-10' : 'z-0'
                        }`}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(${x}px, ${y}px)`,
                          color: isCurrentNote ? noteColor : undefined,
                          textShadow: isCurrentNote ? '0 0 10px rgba(255,255,255,0.7)' : 'none'
                        }}
                        animate={{
                          scale: isCurrentNote ? [1, 1.5, 1] : 1,
                          transition: { 
                            duration: isCurrentNote ? 0.3 : 0,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        {note}
                      </motion.div>
                    );
                  })}
                  
                  {/* Center circle with note display */}
                  <motion.div 
                    className="w-40 h-40 rounded-full bg-black/90 border-2 border-gold/30 shadow-inner flex flex-col items-center justify-center"
                    animate={{
                      scale: currentNote ? [1, 1.05, 1] : 1,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {currentNote ? (
                      <AnimatePresence mode="wait">
                        <motion.div 
                          className="flex flex-col items-center"
                          key={currentNote.name + currentNote.octave}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div 
                            className="text-4xl md:text-5xl font-bold mb-1"
                            style={{ color: getCentsAccuracyColor(currentNote.cents) }}
                            animate={{ 
                              textShadow: [
                                "0 0 8px rgba(255,255,255,0.5)",
                                "0 0 16px rgba(255,255,255,0.7)",
                                "0 0 8px rgba(255,255,255,0.5)"
                              ]
                            }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {currentNote.name}
                          </motion.div>
                          <div className="text-sm text-gold">
                            Octave {currentNote.octave}
                          </div>
                          <div className="mt-1 text-xs text-gold/70">
                            {pitch?.toFixed(1)} Hz
                          </div>
                          <div className={cn(
                            "mt-2 px-3 py-1 rounded-full text-xs font-bold",
                            getCentsAccuracyClass(currentNote.cents)
                          )}>
                            {currentNote.cents > 0 ? '+' : ''}{currentNote.cents} cents
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="text-gold text-opacity-70 text-center px-4">
                        {isListening ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Listening...
                          </motion.div>
                        ) : (
                          "Tap Start to Detect Pitch"
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Improved tuning meter */}
          {currentNote && (
            <motion.div 
              className="relative h-24 flex flex-col items-center justify-center"
              ref={tuningMeterRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Meter background */}
              <div className="h-3 w-full max-w-md bg-black/20 rounded-full overflow-hidden relative">
                {/* Center line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-10 w-0.5 bg-gold"></div>
                
                {/* Markings */}
                <div className="absolute top-3 left-0 w-full flex justify-between px-0">
                  <div className="h-3 w-0.5 bg-gold/50"></div>
                  <div className="h-2 w-0.5 bg-gold/40"></div>
                  <div className="h-2 w-0.5 bg-gold/40"></div>
                  <div className="h-3 w-0.5 bg-gold/50"></div>
                  <div className="h-2 w-0.5 bg-gold/40"></div>
                  <div className="h-2 w-0.5 bg-gold/40"></div>
                  <div className="h-3 w-0.5 bg-gold/50"></div>
                </div>
                
                {/* Tuner needle */}
                <motion.div 
                  className="absolute top-0 left-1/2 -mt-1"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: getNeedleRotation(currentNote.cents) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <motion.div 
                    className="h-10 w-1 bg-primary rounded-t-full"
                    animate={{
                      backgroundColor: getCentsAccuracyColor(currentNote.cents)
                    }}
                  ></motion.div>
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-primary absolute -top-1 left-1/2 transform -translate-x-1/2"
                    animate={{
                      backgroundColor: getCentsAccuracyColor(currentNote.cents)
                    }}
                  ></motion.div>
                </motion.div>
                
                {/* Scale labels */}
                <div className="flex justify-between px-1 mt-12 text-xs text-muted-foreground">
                  <span>-50</span>
                  <span>-25</span>
                  <span>0</span>
                  <span>+25</span>
                  <span>+50</span>
                </div>
              </div>
              
              {/* Cents gradient bar */}
              <div className="w-full max-w-md h-3 mt-2 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-70"></div>
              </div>
            </motion.div>
          )}
          
          {/* Control button */}
          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              onClick={toggleListening}
              size="lg"
              className={cn(
                "rounded-full transition-all shadow-lg",
                isListening 
                  ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                  : "bg-gold hover:bg-gold/90 shadow-gold/20"
              )}
            >
              {isListening ? (
                <>
                  <XCircle className="mr-2 h-5 w-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Listening
                </>
              )}
            </Button>
          </motion.div>
          
          <div className="text-center text-xs text-muted-foreground">
            {isListening ? "Sing or play a note to detect pitch" : "Ready to analyze your musical pitch"}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PitchFinder;
