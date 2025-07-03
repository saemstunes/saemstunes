import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Music, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import InteractivePiano from './InteractivePiano';
import InteractiveGuitar from './InteractiveGuitar';
import SwipableContainer from './SwipableContainer';

const MusicToolsCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'piano',
      title: 'Interactive Piano',
      description: 'Practice scales, chords, and melodies',
      component: <InteractivePiano />
    },
    {
      id: 'guitar',
      title: 'Interactive Guitar',
      description: 'Learn chords and fingerpicking patterns',
      component: <InteractiveGuitar />
    },
    {
      id: 'more-tools',
      title: 'Discover More Tools',
      description: 'Metronome, tuner, and advanced music tools',
      component: (
        <motion.div
          className="bg-gradient-to-br from-gold/20 to-purple-500/20 backdrop-blur-sm border border-gold/30 rounded-2xl p-8 text-center h-64 flex flex-col items-center justify-center max-w-lg mx-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gold/20 p-4 rounded-full mb-4">
            <Music className="h-8 w-8 text-gold" />
          </div>
          <h3 className="text-xl font-serif font-bold mb-2">More Tools Await</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Explore our complete collection of professional music tools
          </p>
          <Button
            onClick={() => navigate('/music-tools')}
            className="bg-gold hover:bg-gold-dark text-white"
          >
            Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )
    }
  ];

  return (
    <div className="relative w-full h-72 sm:h-80">
      <SwipableContainer
        onSlideChange={setCurrentSlide}
        className="h-full"
        indicators={true}
        showControls={true}
      >
        {slides.map((slide) => slide.component)}
      </SwipableContainer>
      
      {/* Slide titles overlay */}
      <motion.div
        className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 z-20"
        key={currentSlide}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-semibold text-sm">{slides[currentSlide]?.title}</h3>
        <p className="text-xs text-muted-foreground">{slides[currentSlide]?.description}</p>
      </motion.div>
    </div>
  );
};

export default MusicToolsCarousel;