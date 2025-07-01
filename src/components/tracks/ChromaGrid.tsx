import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Play, Pause, Stop, Volume2, VolumeX, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';

interface ChromaGridProps {
  rows?: number;
  cols?: number;
  initialScale?: string;
  initialRootNote?: string;
  initialOctave?: number;
}

const ChromaGrid: React.FC<ChromaGridProps> = ({
  rows = 5,
  cols = 12,
  initialScale = "Chromatic",
  initialRootNote = "C",
  initialOctave = 3
}) => {
  const [grid, setGrid] = useState<boolean[][]>(() => Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [scale, setScale] = useState<string>(initialScale);
  const [rootNote, setRootNote] = useState<string>(initialRootNote);
  const [octave, setOctave] = useState<number>(initialOctave);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [tempo, setTempo] = useState<number>(120);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const synthRef = useRef<Tone.Synth<Tone.SynthOptions> | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  
  const { toast } = useToast();
  
  // Available musical scales
  const scales = {
    "Chromatic": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "Major": [0, 2, 4, 5, 7, 9, 11],
    "Minor": [0, 2, 3, 5, 7, 8, 10],
    "Pentatonic Major": [0, 2, 4, 7, 9],
    "Pentatonic Minor": [0, 3, 5, 7, 10],
    "Blues": [0, 2, 3, 4, 5, 7, 9, 10, 11]
  };
  
  // Available root notes
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  // Initialize Tone.js synth
  useEffect(() => {
    const initSynth = async () => {
      try {
        setLoading(true);
        await Tone.start();
        const synth = new Tone.Synth().toDestination();
        synthRef.current = synth;
        console.log('Audio context and synth initialized');
      } catch (error) {
        console.error('Failed to initialize Tone.js', error);
        setError('Failed to initialize audio engine.');
        toast({
          title: "Error initializing audio",
          description: "There was an error starting the audio engine. Please ensure your browser supports WebAudio and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    initSynth();
    
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, [toast]);
  
  // Generate notes based on scale, root note, and octave
  const generateNotes = useCallback(() => {
    const selectedScale = scales[scale] || scales["Chromatic"];
    const rootNoteIndex = notes.indexOf(rootNote);
    
    if (rootNoteIndex === -1) {
      console.warn(`Root note "${rootNote}" not found. Using C as default.`);
      return [];
    }
    
    return selectedScale.map(interval => {
      const noteIndex = (rootNoteIndex + interval) % 12;
      const octaveAdjust = Math.floor((rootNoteIndex + interval) / 12);
      return notes[noteIndex] + (octave + octaveAdjust);
    });
  }, [scale, rootNote, octave]);
  
  // Toggle cell state
  const toggleCell = useCallback((row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map((rowArray, rowIndex) =>
        rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? !cell : cell)) : rowArray
      );
      return newGrid;
    });
  }, []);
  
  // Play the sequence
  const playSequence = useCallback(() => {
    if (!synthRef.current) {
      console.error("Synth not initialized.");
      setError("Audio engine not ready. Please wait and try again.");
      toast({
        title: "Audio Error",
        description: "The audio engine is not ready. Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }
    
    const notesToPlay = generateNotes();
    
    // Create a new sequence
    const sequence = new Tone.Sequence(
      (time, col) => {
        // Check if the column is within the grid's bounds
        if (col < cols) {
          setCurrentColumn(col);
          
          grid.forEach((row, rowIndex) => {
            if (row[col]) {
              // Ensure the note index is within the generated notes array
              if (rowIndex < notesToPlay.length) {
                const note = notesToPlay[rowIndex];
                synthRef.current?.triggerAttackRelease(note, "8n", time);
              } else {
                console.warn(`Note index ${rowIndex} out of bounds for scale ${scale}.`);
              }
            }
          });
        }
      },
      Array.from({ length: cols }, (_, i) => i),
      "8n"
    ).start(0);
    
    sequenceRef.current = sequence;
    
    Tone.Transport.start();
    setIsPlaying(true);
  }, [grid, generateNotes, scale, cols, toast]);
  
  // Stop the sequence
  const stopSequence = useCallback(() => {
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    
    Tone.Transport.stop();
    setIsPlaying(false);
    setCurrentColumn(0);
  }, []);
  
  // Toggle play/stop
  const togglePlay = () => {
    if (isPlaying) {
      stopSequence();
    } else {
      playSequence();
    }
  };
  
  // Change volume
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    Tone.Destination.volume.value = Tone.dbToGain(newVolume * 40 - 20); // Scale volume to a reasonable range
  };
  
  // Toggle mute
  const toggleMute = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    Tone.Destination.mute = muted;
  };
  
  // Change tempo
  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value, 10);
    setTempo(newTempo);
    Tone.Transport.bpm.value = newTempo;
  };
  
  // Shift octave
  const shiftOctave = (direction: number) => {
    setOctave(prevOctave => {
      const newOctave = prevOctave + direction;
      if (newOctave >= 0 && newOctave <= 8) {
        return newOctave;
      } else {
        toast({
          title: "Octave limit reached",
          description: "Octave must be between 0 and 8.",
        });
        return prevOctave;
      }
    });
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing audio...
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                disabled={loading}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={stopSequence}
                disabled={!isPlaying || loading}
              >
                <Stop className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute} 
                className="h-8 w-8"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20 lg:w-24">
                <Slider
                  value={[isMuted ? 0 : volume]} 
                  min={0} 
                  max={1} 
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label htmlFor="tempo" className="w-12 text-right">Tempo:</Label>
            <Input
              type="number"
              id="tempo"
              value={tempo}
              onChange={handleTempoChange}
              className="w-20"
            />
            <span className="text-muted-foreground">BPM</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label className="w-24 text-right">Scale:</Label>
            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="bg-background border rounded px-2 py-1"
            >
              {Object.keys(scales).map((scaleName) => (
                <option key={scaleName} value={scaleName}>{scaleName}</option>
              ))}
            </select>
            
            <Label className="w-24 text-right">Root Note:</Label>
            <select
              value={rootNote}
              onChange={(e) => setRootNote(e.target.value)}
              className="bg-background border rounded px-2 py-1"
            >
              {notes.map((note) => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
            
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => shiftOctave(-1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2">Octave: {octave}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shiftOctave(1)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="chroma-grid-container">
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "chroma-cell",
                    { "chroma-active": cell },
                    currentColumn === colIndex && isPlaying ? "bg-gold" : "bg-muted"
                  )}
                  style={{
                    backgroundColor: currentColumn === colIndex && isPlaying ? 'gold' : undefined,
                    opacity: cell ? 1 : 0.5,
                  }}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                />
              ))
            ))}
          </div>
        </>
      )}

      {/* Custom CSS - Remove jsx prop */}
      <style>{`
        .chroma-grid-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 4px;
          padding: 16px;
          background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chroma-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .chroma-cell:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }
        
        .chroma-active {
          box-shadow: 0 0 20px currentColor;
          transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
          .chroma-grid-container {
            grid-template-columns: repeat(6, 1fr);
            gap: 2px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChromaGrid;
