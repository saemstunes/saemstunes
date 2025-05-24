
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoteDial from "./pitch-finder/NoteDial";
import TuningMeter from "./pitch-finder/TuningMeter";
import { usePitchDetection } from "./pitch-finder/usePitchDetection";

const PitchFinder: React.FC = () => {
  const { 
    isListening,
    currentNote, 
    error,
    toggleListening
  } = usePitchDetection();
  
  const [inTune, setInTune] = useState(false);
  
  // Check if the note is in tune (within 10 cents of perfect)
  useEffect(() => {
    if (currentNote?.cents !== undefined) {
      setInTune(Math.abs(currentNote.cents) <= 10);
    } else {
      setInTune(false);
    }
  }, [currentNote]);

  return (
    <div className="space-y-4">
      <Card className="border-gold/20 overflow-hidden">
        <CardHeader className="bg-gold/5 border-b border-gold/10">
          <CardTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2 text-gold" />
            Pitch Detector
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Note Dial */}
            <NoteDial 
              currentNote={currentNote} 
              isListening={isListening}
            />

            {/* Tuning Meter */}
            <div className="w-full max-w-md">
              <TuningMeter 
                currentNote={currentNote}
              />
            </div>
            
            <div className="text-center space-y-2">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <>
                  <p className="text-lg">
                    {currentNote?.frequency ? (
                      <span>Frequency: <span className="font-bold">{currentNote.frequency.toFixed(2)} Hz</span></span>
                    ) : (
                      <span className="text-muted-foreground">No pitch detected</span>
                    )}
                  </p>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={toggleListening}
                      className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gold hover:bg-gold/90'} text-white`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Listening
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm space-y-3 p-4 bg-muted/40 rounded-lg">
        <h3 className="font-medium">How to use:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click "Start Listening" to activate the microphone</li>
          <li>Play or sing a note</li>
          <li>The dial will show you the detected note and how close you are to being in tune</li>
          <li>The green area in the tuning meter indicates when you're in tune</li>
        </ol>
        <p className="text-xs text-muted-foreground mt-2">
          For best results, use in a quiet environment and perform one note at a time
        </p>
      </div>
    </div>
  );
};

export default PitchFinder;
