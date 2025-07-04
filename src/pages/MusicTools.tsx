
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Music, Volume2, Timer, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import Metronome from '@/components/music-tools/Metronome';
import PitchFinder from '@/components/music-tools/PitchFinder';
import InteractivePiano from '@/components/ui/InteractivePiano';
import InteractiveGuitar from '@/components/ui/InteractiveGuitar';
import { pageTransition } from '@/lib/animation-utils';

const MusicTools = () => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tools = [
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: Music,
      category: 'instruments',
      description: 'Practice scales, chords, and melodies',
      component: InteractivePiano,
      color: 'bg-blue-500'
    },
    {
      id: 'guitar',
      name: 'Interactive Guitar',
      icon: Music,
      category: 'instruments', 
      description: 'Learn chords and finger positions',
      component: InteractiveGuitar,
      color: 'bg-green-500'
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: Timer,
      category: 'timing',
      description: 'Keep perfect time while practicing',
      component: Metronome,
      color: 'bg-purple-500'
    },
    {
      id: 'pitch-finder',
      name: 'Pitch Finder',
      icon: Settings,
      category: 'tuning',
      description: 'Tune your instruments with precision',
      component: PitchFinder,
      color: 'bg-orange-500'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Tools' },
    { value: 'instruments', label: 'Instruments' },
    { value: 'timing', label: 'Timing' },
    { value: 'tuning', label: 'Tuning' }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setActiveToolIndex((prev) => 
        prev < filteredTools.length - 1 ? prev + 1 : 0
      );
    },
    onSwipedRight: () => {
      setActiveToolIndex((prev) => 
        prev > 0 ? prev - 1 : filteredTools.length - 1
      );
    },
    trackMouse: true,
    delta: 10
  });

  const nextTool = () => {
    setActiveToolIndex((prev) => 
      prev < filteredTools.length - 1 ? prev + 1 : 0
    );
  };

  const prevTool = () => {
    setActiveToolIndex((prev) => 
      prev > 0 ? prev - 1 : filteredTools.length - 1
    );
  };

  const currentTool = filteredTools[activeToolIndex];
  const CurrentComponent = currentTool?.component;

  return (
    <MainLayout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background to-muted/50"
        {...pageTransition}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-serif font-bold mb-4">
              Music <span className="text-gold">Practice Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your musical journey with our interactive practice tools
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tool Navigation */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={prevTool}
              disabled={filteredTools.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {filteredTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveToolIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeToolIndex ? 'bg-gold' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTool}
              disabled={filteredTools.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Tool Display */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {currentTool && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-gold/10 to-gold/5 p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${currentTool.color}`}>
                          <currentTool.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{currentTool.name}</h2>
                          <p className="text-muted-foreground">{currentTool.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {currentTool.category}
                      </Badge>
                    </div>
                  </div>

                  <div {...handlers} className="p-6 min-h-[400px]">
                    <CurrentComponent />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Tool Grid (Mobile Alternative) */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredTools.map((tool, index) => (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all ${
                  index === activeToolIndex ? 'ring-2 ring-gold' : ''
                }`}
                onClick={() => setActiveToolIndex(index)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`p-3 rounded-full ${tool.color} mx-auto mb-2 w-fit`}>
                    <tool.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default MusicTools;
