
import React, { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Mic, MicOff, Play, Square, Volume2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Add proper type declaration
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const MusicTools = () => {
  const [activeTab, setActiveTab] = useState("pitch");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Music Tools</h1>
          <p className="text-muted-foreground">
            Handy tools for musicians to find pitch and tempo
          </p>
        </div>

        <Tabs defaultValue="pitch" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="pitch" className="text-center" aria-label="Pitch Finder Tool">
              <Music className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="tempo" className="text-center" aria-label="Tempo Finder Tool">
              <Volume2 className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Tempo Finder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pitch" className="space-y-4">
            <PitchFinder />
          </TabsContent>
          
          <TabsContent value="tempo" className="space-y-4">
            <TempoFinder />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Pitch Finder Component
const PitchFinder = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState("--");
  const [frequency, setFrequency] = useState(0);
  const [micAccessGranted, setMicAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [centsDifference, setCentsDifference] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const startListening = async () => {
    try {
      // First initialize AudioContext
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsListening(true);
      setMicAccessGranted(true);
      setError("");
      
      detectPitch();
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access to use this feature.");
      console.error("Error accessing microphone:", err);
    }
  };
  
  const stopListening = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsListening(false);
    setCurrentNote("--");
    setFrequency(0);
    setCentsDifference(0);
  };
  
  const detectPitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Float32Array(bufferLength);
    
    const detectPitchFrame = () => {
      analyserRef.current?.getFloatTimeDomainData(dataArray);
      
      const ac = autoCorrelate(dataArray, audioContextRef.current?.sampleRate || 44100);
      
      if (ac !== -1) {
        // Calculate note and cents difference
        const noteNum = 12 * (Math.log(ac / 440) / Math.log(2));
        const roundedNoteNum = Math.round(noteNum);
        const cents = Math.round((noteNum - roundedNoteNum) * 100);
        
        const note = notes[Math.round(noteNum) % 12];
        setCurrentNote(note);
        setFrequency(Math.round(ac));
        setCentsDifference(cents);
      }
      
      animationRef.current = requestAnimationFrame(detectPitchFrame);
    };
    
    detectPitchFrame();
  };
  
  // Auto-correlation algorithm for pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;
    
    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    // Not enough signal
    if (rms < 0.01) return -1;
    
    // Find best correlation
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
      
      if (correlation > 0.9) {
        foundGoodCorrelation = true;
      } else if (foundGoodCorrelation) {
        break;
      }
    }
    
    if (bestCorrelation > 0.5) {
      return sampleRate / bestOffset;
    }
    
    return -1;
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Get tuning indicator display
  const getTuningIndicator = () => {
    if (centsDifference === 0 || currentNote === "--") return null;
    
    let indicatorText = "In tune";
    let indicatorColor = "text-green-500";
    
    if (centsDifference > 5) {
      indicatorText = "Sharp";
      indicatorColor = "text-amber-500";
    } else if (centsDifference < -5) {
      indicatorText = "Flat";
      indicatorColor = "text-amber-500";
    }
    
    if (Math.abs(centsDifference) > 30) {
      indicatorColor = "text-red-500";
    }
    
    return (
      <div className={`text-sm ${indicatorColor}`}>
        {indicatorText} ({centsDifference > 0 ? "+" : ""}{centsDifference} cents)
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-gold" />
          Pitch Finder
        </CardTitle>
        <CardDescription>
          Detect the pitch of the notes you sing or play
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-gold mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{currentNote}</div>
            {frequency > 0 && (
              <div className="text-sm text-muted-foreground">{frequency} Hz</div>
            )}
            {getTuningIndicator()}
          </div>
        </div>
        
        {error && (
          <div className="text-center text-destructive mb-4 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <Button
          onClick={isListening ? stopListening : startListening}
          className={cn(
            "flex items-center gap-2 mb-4",
            isListening ? "bg-destructive hover:bg-destructive/90" : "bg-gold hover:bg-gold/90"
          )}
          size="lg"
          aria-label={isListening ? "Stop listening for pitch" : "Start listening for pitch"}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Start Listening
            </>
          )}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          {!micAccessGranted ? 
            "Click 'Start Listening' and allow microphone access to begin" : 
            isListening ? 
              "Sing or play a note to detect its pitch" : 
              "Click 'Start Listening' to detect pitch again"
          }
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Note: For best results, use in a quiet environment with a clear tone.
        </p>
      </CardFooter>
    </Card>
  );
};

// Tempo Finder Component
const TempoFinder = () => {
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countingMode, setCountingMode] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [timeSignature, setTimeSignature] = useState({ beats: 4, value: 4 });
  const [currentBeat, setCurrentBeat] = useState(1);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatsRef = useRef<number>(1);
  const visualTimerRef = useRef<number | null>(null);
  
  // Tempo presets
  const tempoPresets = [
    { name: "Largo", bpm: 50 },
    { name: "Adagio", bpm: 70 },
    { name: "Andante", bpm: 90 },
    { name: "Moderato", bpm: 110 },
    { name: "Allegro", bpm: 130 },
    { name: "Vivace", bpm: 160 },
    { name: "Presto", bpm: 180 }
  ];
  
  // Initialize AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (visualTimerRef.current) {
        cancelAnimationFrame(visualTimerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Metronome click sound
  const playClick = () => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // First beat gets higher pitch
    oscillator.frequency.value = beatsRef.current === 1 ? 1000 : 800;
    gainNode.gain.value = 0.5;
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
    
    // Update current beat
    setCurrentBeat(beatsRef.current);
    
    // Increment beat counter
    beatsRef.current = beatsRef.current % timeSignature.beats + 1;
  };
  
  // Start/Stop metronome
  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      beatsRef.current = 1;
      setCurrentBeat(1);
      return;
    }
    
    setIsPlaying(true);
    beatsRef.current = 1;
    
    const intervalTime = 60000 / tempo;
    playClick();
    intervalRef.current = setInterval(playClick, intervalTime);
  };
  
  // Handle tempo change
  const handleTempoChange = (value: number[]) => {
    const newTempo = value[0];
    setTempo(newTempo);
    
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const intervalTime = 60000 / newTempo;
      intervalRef.current = setInterval(playClick, intervalTime);
    }
  };
  
  // Handle tap tempo
  const handleTapTempo = () => {
    const now = Date.now();
    
    if (countingMode) {
      // Add new tap
      const newTaps = [...taps, now];
      setTaps(newTaps);
      
      if (newTaps.length > 1) {
        // Calculate BPM from taps
        const differences = [];
        for (let i = 1; i < newTaps.length; i++) {
          differences.push(newTaps[i] - newTaps[i - 1]);
        }
        
        const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
        const calculatedTempo = Math.round(60000 / avgDifference);
        
        // Ensure calculated tempo is within reasonable range (40-240 BPM)
        if (calculatedTempo >= 40 && calculatedTempo <= 240) {
          setTempo(calculatedTempo);
        }
      }
      
      setTapCount(prevCount => prevCount + 1);
    } else {
      // Start counting mode
      setCountingMode(true);
      setTaps([now]);
      setTapCount(1);
      
      // Auto exit counting mode after 5 seconds of inactivity
      setTimeout(() => {
        setCountingMode(false);
        setTapCount(0);
      }, 5000);
    }
  };
  
  // Handle time signature change
  const handleTimeSignatureChange = (beats: number, value: number) => {
    setTimeSignature({ beats, value });
    beatsRef.current = 1;
    setCurrentBeat(1);
    
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const intervalTime = 60000 / tempo;
      intervalRef.current = setInterval(playClick, intervalTime);
    }
  };
  
  // Apply tempo preset
  const applyTempoPreset = (bpm: number) => {
    setTempo(bpm);
    
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const intervalTime = 60000 / bpm;
      intervalRef.current = setInterval(playClick, intervalTime);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-gold" />
          Tempo Finder
        </CardTitle>
        <CardDescription>
          Set the tempo manually or tap to find it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="text-7xl font-bold mb-0">{tempo}</div>
          <div className="text-lg text-muted-foreground mb-2">BPM</div>
          
          {/* Visual beat indicator */}
          <div className="flex gap-1 mb-2">
            {Array.from({ length: timeSignature.beats }).map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-100",
                  currentBeat === index + 1 && isPlaying
                    ? "bg-gold scale-125"
                    : "bg-muted"
                )}
                aria-label={`Beat ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>40</span>
            <span>240</span>
          </div>
          <Slider 
            defaultValue={[tempo]} 
            min={40} 
            max={240} 
            step={1} 
            value={[tempo]}
            onValueChange={handleTempoChange}
            className="my-4"
            aria-label="Tempo slider"
          />
        </div>
        
        {/* Tempo presets */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tempoPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyTempoPreset(preset.bpm)}
              className="text-xs"
              aria-label={`Set tempo to ${preset.name} (${preset.bpm} BPM)`}
            >
              {preset.name} ({preset.bpm})
            </Button>
          ))}
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={togglePlay}
            size="lg"
            className={cn(
              "flex items-center gap-2 w-1/3",
              isPlaying ? "bg-destructive hover:bg-destructive/90" : "bg-gold hover:bg-gold/90"
            )}
            aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
          >
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Stop" : "Play"}
          </Button>
          
          <Button
            onClick={handleTapTempo}
            variant="outline"
            size="lg"
            className={cn(
              "border-2 w-1/3",
              countingMode ? "border-gold" : ""
            )}
            aria-label="Tap tempo button"
          >
            Tap Tempo {tapCount > 0 && `(${tapCount})`}
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={40}
              max={240}
              value={tempo}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 40 && val <= 240) setTempo(val);
              }}
              className="w-24"
              aria-label="Enter BPM manually"
            />
            <span className="text-sm text-muted-foreground">BPM</span>
          </div>
          
          {/* Time signature selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time:</span>
            <div className="flex border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-l-md",
                  timeSignature.beats === 3 ? "bg-muted" : ""
                )}
                onClick={() => handleTimeSignatureChange(3, 4)}
                aria-label="Set 3/4 time signature"
              >
                3/4
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-none",
                  timeSignature.beats === 4 ? "bg-muted" : ""
                )}
                onClick={() => handleTimeSignatureChange(4, 4)}
                aria-label="Set 4/4 time signature"
              >
                4/4
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-none",
                  timeSignature.beats === 6 ? "bg-muted" : ""
                )}
                onClick={() => handleTimeSignatureChange(6, 8)}
                aria-label="Set 6/8 time signature"
              >
                6/8
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-r-md",
                  timeSignature.beats === 5 ? "bg-muted" : ""
                )}
                onClick={() => handleTimeSignatureChange(5, 4)}
                aria-label="Set 5/4 time signature"
              >
                5/4
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Tap the "Tap Tempo" button at a consistent rhythm to calculate BPM automatically
        </p>
      </CardFooter>
    </Card>
  );
};

export default MusicTools;
