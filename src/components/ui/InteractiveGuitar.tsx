import React, { useState, useEffect, useRef, useCallback } from 'react';
import './InteractiveGuitar.css';

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OPEN_STRINGS = [40, 45, 50, 55, 59, 64]; // MIDI note numbers for standard tuning (E2, A2, D3, G3, B3, E4)
const BASE_FREQUENCY = 440; // A4 is 440 Hz

let audioContext: AudioContext | null = null;

const InteractiveGuitar = () => {
  const [activeFrets, setActiveFrets] = useState(new Set<string>());

  useEffect(() => {
    // Initialize AudioContext on first interaction
    if (typeof window !== 'undefined' && 'AudioContext' in window && !audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    }

    return () => {
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    };
  }, []);

  const playNote = useCallback((fret: number, string: number) => {
    const noteIndex = OPEN_STRINGS[string] + fret;
    const noteName = NOTE_NAMES[noteIndex % 12];
    
    console.log(`Playing note: ${noteName} (Fret ${fret}, String ${string + 1})`);
    
    // Check if AudioContext is supported
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        if (!audioContext) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContext = new AudioContextClass();
        }
        
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const frequency = BASE_FREQUENCY * Math.pow(2, noteIndex / 12);
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    }
    
    setActiveFrets(prev => new Set([...prev, `${fret}-${string}`]));
    setTimeout(() => {
      setActiveFrets(prev => {
        const next = new Set(prev);
        next.delete(`${fret}-${string}`);
        return next;
      });
    }, 500);
  }, [audioContext]);

  const handleSwipe = (direction: string, string: number) => {
    console.log(`Swiped ${direction} on string ${string + 1}`);
    // Implement strumming or other swipe actions here
  };

  const handleFretTouch = (fret: number, string: number) => {
    playNote(fret, string);
  };

  return (
    <div className="interactive-guitar">
      <div className="guitar-body">
        {/* Guitar Strings */}
        {[0, 1, 2, 3, 4, 5].map(string => (
          <div key={string} className="guitar-string"
            onTouchStart={() => handleSwipe('down', string)}
            onTouchEnd={() => handleSwipe('up', string)}
          >
            {/* Frets */}
            {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12].map(fret => (
              <div
                key={fret}
                className={`guitar-fret ${activeFrets.has(`${fret}-${string}`) ? 'active' : ''}`}
                onClick={() => handleFretTouch(fret, string)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveGuitar;
