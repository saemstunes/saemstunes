
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuitarProps {
  className?: string;
}

const OptimizedGuitar: React.FC<GuitarProps> = ({ className = "" }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  // Guitar tuning: E-A-D-G-B-E (low to high)
  const strings = [
    { note: 'E', frequency: 82.41, color: '#8B4513' }, // Low E - thickest string
    { note: 'A', frequency: 110.00, color: '#8B4513' },
    { note: 'D', frequency: 146.83, color: '#CD853F' },
    { note: 'G', frequency: 196.00, color: '#CD853F' },
    { note: 'B', frequency: 246.94, color: '#F4A460' }, // Thinner strings
    { note: 'E', frequency: 329.63, color: '#F4A460' }  // High E - thinnest string
  ];

  const fretNotes = [
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']
  ];

  // Create audio context for sound generation
  const audioContext = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playNote = useCallback((frequency: number, stringIndex: number, fret: number = 0) => {
    if (isMuted || !audioContext.current) return;

    try {
      // Calculate frequency for fretted note
      const noteFreq = frequency * Math.pow(2, fret / 12);
      
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.setValueAtTime(noteFreq, audioContext.current.currentTime);
      oscillator.type = 'sawtooth'; // Guitar-like tone
      
      // Natural guitar decay envelope
      gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1.5);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + 1.5);

      // Visual feedback
      setActiveStrings(prev => new Set(prev).add(stringIndex));
      setTimeout(() => {
        setActiveStrings(prev => {
          const newSet = new Set(prev);
          newSet.delete(stringIndex);
          return newSet;
        });
      }, 200);

    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, [isMuted]);

  const handleStringPluck = (stringIndex: number, fret: number = 0) => {
    const string = strings[stringIndex];
    playNote(string.frequency, stringIndex, fret);
    
    const noteName = fretNotes[stringIndex][fret];
    toast({
      title: `♪ ${noteName}`,
      description: `String ${stringIndex + 1}, Fret ${fret}`,
      duration: 1000,
    });
  };

  const handleStrum = (direction: 'up' | 'down') => {
    if (isMuted) return;
    
    const order = direction === 'down' ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];
    
    order.forEach((stringIndex, i) => {
      setTimeout(() => {
        playNote(strings[stringIndex].frequency, stringIndex);
      }, i * 50); // Slight delay between strings for realistic strum
    });
  };

  return (
    <div ref={containerRef} className={`guitar-container ${className}`}>
      {/* Guitar Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Interactive Guitar</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Guitar Body */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Guitar Outline */}
        <svg 
          width="100%" 
          height="400" 
          viewBox="0 0 800 400" 
          className="border rounded-lg bg-gradient-to-br from-amber-100 to-amber-200"
        >
          {/* Guitar Body */}
          <ellipse cx="600" cy="200" rx="150" ry="120" fill="#D2691E" stroke="#8B4513" strokeWidth="3"/>
          
          {/* Sound Hole */}
          <circle cx="600" cy="200" r="40" fill="#2D1810" stroke="#8B4513" strokeWidth="2"/>
          
          {/* Sound Hole Rosette */}
          <circle cx="600" cy="200" r="45" fill="none" stroke="#8B4513" strokeWidth="1"/>
          <circle cx="600" cy="200" r="50" fill="none" stroke="#8B4513" strokeWidth="1"/>
          
          {/* Guitar Neck */}
          <rect x="50" y="150" width="400" height="100" fill="#DEB887" stroke="#8B4513" strokeWidth="2" rx="5"/>
          
          {/* Fret Wires */}
          {Array.from({ length: 13 }, (_, i) => {
            const fretPosition = 50 + (i + 1) * (400 / 13);
            return (
              <line 
                key={i}
                x1={fretPosition} 
                y1="150" 
                x2={fretPosition} 
                y2="250" 
                stroke="#C0C0C0" 
                strokeWidth="2"
              />
            );
          })}
          
          {/* Fret Markers */}
          {[3, 5, 7, 9].map(fret => {
            const x = 50 + (fret * 400 / 13) - (400 / 26);
            return (
              <circle key={fret} cx={x} cy="200" r="4" fill="#8B4513" opacity="0.7"/>
            );
          })}
          
          {/* Double dot at 12th fret */}
          <circle cx={50 + (12 * 400 / 13) - (400 / 26)} cy="190" r="3" fill="#8B4513" opacity="0.7"/>
          <circle cx={50 + (12 * 400 / 13) - (400 / 26)} cy="210" r="3" fill="#8B4513" opacity="0.7"/>
          
          {/* Nut */}
          <rect x="48" y="150" width="4" height="100" fill="#F5F5DC"/>
          
          {/* Bridge */}
          <rect x="580" y="190" width="40" height="20" fill="#8B4513" rx="2"/>
          
          {/* Strings */}
          {strings.map((string, index) => {
            const y = 160 + (index * 15);
            const strokeWidth = 6 - index; // Thicker strings at top
            const isActive = activeStrings.has(index);
            
            return (
              <g key={index}>
                {/* String line */}
                <line
                  x1="52"
                  y1={y}
                  x2="580"
                  y2={y}
                  stroke={isActive ? '#FFD700' : string.color}
                  strokeWidth={strokeWidth}
                  className={`cursor-pointer transition-all duration-200 ${isActive ? 'filter brightness-150' : ''}`}
                  onClick={() => handleStringPluck(index)}
                />
                
                {/* Fret positions on string */}
                {Array.from({ length: 12 }, (_, fretIndex) => {
                  const fretX = 50 + ((fretIndex + 1) * 400 / 13) - (400 / 26);
                  return (
                    <circle
                      key={fretIndex}
                      cx={fretX}
                      cy={y}
                      r="4"
                      fill="transparent"
                      className="cursor-pointer hover:fill-gold/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStringPluck(index, fretIndex + 1);
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
          
          {/* Headstock */}
          <rect x="20" y="160" width="30" height="80" fill="#8B4513" rx="5"/>
          
          {/* Tuning Pegs */}
          {strings.map((_, index) => {
            const y = 165 + (index * 15);
            return (
              <g key={index}>
                <circle cx="15" cy={y} r="3" fill="#C0C0C0"/>
                <circle cx="35" cy={y} r="2" fill="#8B4513"/>
              </g>
            );
          })}
        </svg>

        {/* Strum Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStrum('down')}
          >
            Strum Down ↓
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStrum('up')}
          >
            Strum Up ↑
          </Button>
        </div>

        {/* String Labels */}
        <div className="flex justify-between items-center mt-2 px-4">
          <div className="text-xs text-muted-foreground">
            <div>Tuning:</div>
            {strings.map((string, index) => (
              <div key={index} className="font-mono">
                {string.note}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <div>Click strings or fret positions to play</div>
            <div>Use strum buttons for chord sounds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedGuitar;
