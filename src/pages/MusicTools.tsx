
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
import { Music, Mic, MicOff, Play, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Window {
  webkitAudioContext: typeof AudioContext;
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
            <TabsTrigger value="pitch" className="text-center">
              <Music className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="tempo" className="text-center">
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
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          const audioContext = new AudioContextClass();
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
  };
  
  const detectPitch = () => {
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Float32Array(bufferLength);
    
    const detectPitchFrame = () => {
      analyserRef.current.getFloatTimeDomainData(dataArray);
      
      const ac = autoCorrelate(dataArray, audioContextRef.current.sampleRate);
      
      if (ac !== -1) {
        const noteNum = 12 * (Math.log(ac / 440) / Math.log(2));
        const note = notes[Math.round(noteNum) % 12];
        setCurrentNote(note);
        setFrequency(Math.round(ac));
      }
      
      animationRef.current = requestAnimationFrame(detectPitchFrame);
    };
    
    detectPitchFrame();
  };
  
  // Auto-correlation algorithm for pitch detection
  const autoCorrelate = (buffer, sampleRate) => {
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
    };
  }, []);
  
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
          </div>
        </div>
        
        {error && (
          <div className="text-center text-destructive mb-4">
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
  const [taps, setTaps] = useState([]);
  const [tapCount, setTapCount] = useState(0);
  
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const countRef = useRef(0);
  
  // Initialize AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    
    oscillator.frequency.value = countRef.current % 4 === 0 ? 1000 : 800;
    gainNode.gain.value = 0.5;
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
    countRef.current++;
  };
  
  // Start/Stop metronome
  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      countRef.current = 0;
      return;
    }
    
    setIsPlaying(true);
    countRef.current = 0;
    
    const intervalTime = 60000 / tempo;
    playClick();
    intervalRef.current = setInterval(playClick, intervalTime);
  };
  
  // Handle tempo change
  const handleTempoChange = (value) => {
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
          <div className="text-7xl font-bold mb-2">{tempo}</div>
          <div className="text-lg text-muted-foreground">BPM</div>
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
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={togglePlay}
            size="lg"
            className={cn(
              "flex items-center gap-2 w-1/3",
              isPlaying ? "bg-destructive hover:bg-destructive/90" : "bg-gold hover:bg-gold/90"
            )}
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
          >
            Tap Tempo {tapCount > 0 && `(${tapCount})`}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-6">
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
          />
          <span className="text-sm text-muted-foreground">BPM</span>
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
