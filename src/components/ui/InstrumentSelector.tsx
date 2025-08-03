
import React from 'react';
import { motion } from 'framer-motion';
import { Guitar, Piano, Timer, TrendingUp, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InstrumentSelectorProps {
  onInstrumentSelect: (instrument: string) => void;
  onBackToHome: () => void;
}

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ 
  onInstrumentSelect, 
  onBackToHome 
}) => {
  const instruments = [
    {
      id: 'guitar',
      name: 'Realistic Guitar',
      icon: Guitar,
      description: 'Strum and play with realistic guitar feel',
      color: 'from-amber-600 to-amber-700',
      borderColor: 'border-amber-500'
    },
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: Piano,
      description: 'Practice scales, chords, and melodies',
      color: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-500'
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: Timer,
      description: 'Keep perfect time while practicing',
      color: 'from-blue-600 to-blue-700',
      borderColor: 'border-blue-500'
    },
    {
      id: 'pitch-finder',
      name: 'Pitch Finder',
      icon: TrendingUp,
      description: 'Tune your instruments with precision',
      color: 'from-green-600 to-green-700',
      borderColor: 'border-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            Choose Your Instrument
          </h1>
          <p className="text-xl text-muted-foreground">
            Select an instrument to start practicing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {instruments.map((instrument, index) => (
            <motion.div
              key={instrument.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${instrument.borderColor} border-2 hover:border-primary bg-card/80 backdrop-blur-sm`}
                onClick={() => onInstrumentSelect(instrument.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${instrument.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <instrument.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {instrument.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {instrument.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="outline"
            onClick={onBackToHome}
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            <Music className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default InstrumentSelector;
