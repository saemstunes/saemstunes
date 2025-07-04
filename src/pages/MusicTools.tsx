import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { 
  Guitar, Piano, ArrowLeft, ArrowRight, RotateCcw, 
  Settings, Zap, X, Plus, MessageCircle, Timer, TrendingUp 
} from 'lucide-react';
import InteractivePiano from '@/components/ui/InteractivePiano';
import InteractiveGuitar from '@/components/ui/InteractiveGuitar';
import Metronome from '@/components/music-tools/Metronome';
import PitchFinder from '@/components/music-tools/PitchFinder';
import ToolSuggestionForm from '@/components/music-tools/ToolSuggestionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import { useWindowSize } from '@uidotdev/usehooks';

const MusicTools: React.FC = () => {
  // State management
  const [activeTool, setActiveTool] = useState<'piano' | 'guitar' | 'metronome' | 'pitch-finder'>('piano');
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [swipeSensitivity, setSwipeSensitivity] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('instruments');
  const [showOrientationAlert, setShowOrientationAlert] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topSwipeAreaRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  
  // Define tools with categories
  const tools = [
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: Piano,
      category: 'instruments',
      description: 'Practice scales, chords, and melodies',
      component: InteractivePiano,
      color: 'bg-[#A67C00]'
    },
    {
      id: 'guitar',
      name: 'Interactive Guitar',
      icon: Guitar,
      category: 'instruments', 
      description: 'Learn chords and finger positions',
      component: InteractiveGuitar,
      color: 'bg-[#A67C00]'
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: Timer,
      category: 'tools',
      description: 'Keep perfect time while practicing',
      component: Metronome,
      color: 'bg-[#A67C00]'
    },
    {
      id: 'pitch-finder',
      name: 'Pitch Finder',
      icon: TrendingUp,
      category: 'tools',
      description: 'Tune your instruments with precision',
      component: PitchFinder,
      color: 'bg-[#A67C00]'
    }
  ];

  const categories = [
    { value: 'instruments', label: 'Instruments' },
    { value: 'tools', label: 'Practice Tools' }
  ];

  // Filter tools based on category
  const filteredTools = tools.filter(tool => tool.category === selectedCategory);
  const currentTool = tools.find(tool => tool.id === activeTool) || tools[0];
  
  // Enhanced swipe handlers for top navigation area
  const topSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
      const nextIndex = (currentIndex + 1) % filteredTools.length;
      setActiveTool(filteredTools[nextIndex].id as any);
    },
    onSwipedRight: () => {
      const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
      const prevIndex = (currentIndex - 1 + filteredTools.length) % filteredTools.length;
      setActiveTool(filteredTools[prevIndex].id as any);
    },
    delta: 50 - (swipeSensitivity * 4),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
  });

  // Reset current tool
  const handleReset = () => {
    window.dispatchEvent(new CustomEvent(`reset-${activeTool}`));
  };

  // Close tutorial after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Check for mobile portrait orientation
  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      const isMobile = windowSize.width < 768;
      const isPortrait = windowSize.height > windowSize.width;
      setShowOrientationAlert(isMobile && isPortrait);
    }
  }, [windowSize]);

  return (
    <MainLayout>
      <div 
        className="relative bg-gradient-to-br from-[#251515] via-[#3B2F2F] to-[#251515] rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto p-4 sm:p-6"
        ref={containerRef}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A67C00]/10 via-transparent to-[#7A5A00]/10 opacity-50 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,124,0,0.1),transparent_70%)] z-0" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4A936]/30 rounded-full z-0"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Orientation alert */}
        <AnimatePresence>
          {showOrientationAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#A67C00]/80 to-[#7A5A00]/80 backdrop-blur-sm border border-[#D4A936]/50 rounded-lg px-4 py-3 text-white text-sm font-medium z-40 shadow-lg flex items-center w-11/12 max-w-md"
            >
              <Zap className="inline w-4 h-4 mr-2 text-[#D4A936]" />
              <span>
                For the best experience, rotate your device to landscape mode
              </span>
              <button 
                className="ml-3 text-white/70 hover:text-white"
                onClick={() => setShowOrientationAlert(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showTutorial && !showOrientationAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#A67C00]/70 to-[#7A5A00]/70 backdrop-blur-sm border border-[#D4A936]/50 rounded-full px-4 py-2 text-white text-sm font-medium z-30 shadow-lg flex items-center"
            >
              <Zap className="inline w-4 h-4 mr-2 text-[#D4A936]" />
              <span>
                {activeTool === 'piano' 
                  ? 'Play with keyboard or swipe for guitar →' 
                  : activeTool === 'guitar'
                  ? '← Swipe for piano or tap frets to play'
                  : 'Swipe left/right to switch between tools'}
              </span>
              <button 
                className="ml-3 text-white/70 hover:text-white"
                onClick={() => setShowTutorial(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top swipe area for navigation */}
        <div 
          {...topSwipeHandlers}
          ref={topSwipeAreaRef}
          className="z-20 relative"
        >
          <div className="text-center pt-4">
            <motion.h1 
              className="text-4xl font-bold text-[#D4A936] mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Music Tools
            </motion.h1>
            <motion.p 
              className="text-xl text-[#D4A936]/80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Professional music tools to enhance your practice and performance
            </motion.p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center my-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-[#3B2F2F] border-[#5A4A4A] text-[#D4A936]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#3B2F2F] border-[#5A4A4A]">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                    className="hover:bg-[#5A4A4A] focus:bg-[#5A4A4A] text-[#D4A936]"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {filteredTools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full transition-colors ${
                    activeTool === tool.id 
                      ? 'bg-[#A67C00] text-white' 
                      : 'bg-[#3B2F2F] text-[#D4A936] hover:bg-[#5A4A4A]'
                  }`}
                  onClick={() => setActiveTool(tool.id as any)}
                >
                  <tool.icon className="h-6 w-6" />
                </motion.button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-[#3B2F2F] text-[#D4A936] hover:bg-[#5A4A4A] rounded-full transition-colors"
                onClick={handleReset}
              >
                <RotateCcw className="h-6 w-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full transition-colors ${
                  showSettings 
                    ? 'bg-[#A67C00] text-white' 
                    : 'bg-[#3B2F2F] text-[#D4A936] hover:bg-[#5A4A4A]'
                }`}
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
          
          {/* Tool Navigation Indicators */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  activeTool === tool.id ? 'bg-[#D4A936]' : 'bg-[#5A4A4A]'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Tool Card Container */}
        <Card className="bg-gradient-to-br from-[#3B2F2F]/80 to-[#251515]/90 backdrop-blur-md border border-[#5A4A4A] rounded-xl overflow-hidden z-10 relative">
          <CardContent className="p-0">
            {/* Tool Header */}
            <div className="bg-gradient-to-r from-[#A67C00]/20 to-[#7A5A00]/20 p-4 border-b border-[#5A4A4A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${currentTool.color}`}>
                    <currentTool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-[#D4A936]">
                      {currentTool.name}
                    </CardTitle>
                    <CardDescription className="text-[#D4A936]/80">
                      {currentTool.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-[#3B2F2F] text-[#D4A936] border-[#5A4A4A] capitalize">
                  {currentTool.category}
                </Badge>
              </div>
            </div>

            {/* Tool Content */}
            <div className="relative min-h-[400px] p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTool}
                  initial={{ x: filteredTools.findIndex(t => t.id === activeTool) > 0 ? 100 : -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: filteredTools.findIndex(t => t.id === activeTool) > 0 ? -100 : 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="h-full"
                >
                  {React.createElement(currentTool.component)}
                </motion.div>
              </AnimatePresence>
              
              {/* Swipe Navigation Buttons */}
              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#3B2F2F]/80 backdrop-blur-sm p-3 rounded-full border border-[#5A4A4A] z-30 shadow-lg"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => {
                  const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
                  const nextIndex = (currentIndex + 1) % filteredTools.length;
                  setActiveTool(filteredTools[nextIndex].id as any);
                }}
              >
                <ArrowRight className="h-6 w-6 text-[#D4A936]" />
              </motion.button>
              
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#3B2F2F]/80 backdrop-blur-sm p-3 rounded-full border border-[#5A4A4A] z-30 shadow-lg"
                animate={{ x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => {
                  const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
                  const prevIndex = (currentIndex - 1 + filteredTools.length) % filteredTools.length;
                  setActiveTool(filteredTools[prevIndex].id as any);
                }}
              >
                <ArrowLeft className="h-6 w-6 text-[#D4A936]" />
              </motion.button>
            </div>
          </CardContent>
        </Card>
        
        {/* Suggest a Tool Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-[#3B2F2F]/80 to-[#251515]/90 backdrop-blur-md border border-[#5A4A4A] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#D4A936]">
                <div className="p-2 bg-gradient-to-r from-[#A67C00]/20 to-[#7A5A00]/20 rounded-full">
                  <Plus className="h-5 w-5 text-[#D4A936]" />
                </div>
                Suggest a Music Tool
              </CardTitle>
              <CardDescription className="text-[#D4A936]/80">
                Have an idea for a music tool you'd like to see? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#A67C00]/10 to-[#7A5A00]/10 p-6 rounded-xl border border-[#D4A936]/30">
                  <h3 className="text-xl font-bold text-[#D4A936] mb-2">Help Us Improve!</h3>
                  <p className="text-[#D4A936]/80 mb-4">
                    We're always looking to enhance our music toolkit. Share your ideas for new features 
                    or improvements to existing tools.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#3B2F2F]/50 p-4 rounded-lg border border-[#5A4A4A]">
                      <div className="bg-[#A67C00]/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <Guitar className="h-5 w-5 text-[#D4A936]" />
                      </div>
                      <h4 className="font-medium text-[#D4A936]">New Instruments</h4>
                      <p className="text-[#D4A936]/60 text-sm mt-1">
                        Violin, drums, or other instruments
                      </p>
                    </div>
                    <div className="bg-[#3B2F2F]/50 p-4 rounded-lg border border-[#5A4A4A]">
                      <div className="bg-[#A67C00]/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <Timer className="h-5 w-5 text-[#D4A936]" />
                      </div>
                      <h4 className="font-medium text-[#D4A936]">Practice Tools</h4>
                      <p className="text-[#D4A936]/60 text-sm mt-1">
                        Tuners, rhythm trainers, etc.
                      </p>
                    </div>
                    <div className="bg-[#3B2F2F]/50 p-4 rounded-lg border border-[#5A4A4A]">
                      <div className="bg-[#A67C00]/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <Settings className="h-5 w-5 text-[#D4A936]" />
                      </div>
                      <h4 className="font-medium text-[#D4A936]">Features</h4>
                      <p className="text-[#D4A936]/60 text-sm mt-1">
                        Recording, sharing, or analysis
                      </p>
                    </div>
                  </div>
                </div>
                
                <ToolSuggestionForm adminEmail="admin@saemstunes.com" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#251515] to-[#3B2F2F] backdrop-blur-md rounded-xl p-6 mt-6 border border-[#D4A936]/30 shadow-2xl z-30 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D4A936] font-semibold text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Music Tools Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[#D4A936]/60 hover:text-[#D4A936] transition-colors p-1 rounded-full hover:bg-[#A67C00]/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#3B2F2F]/50 rounded-lg p-4">
                    <h4 className="text-[#D4A936] font-medium mb-3">Tool Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#D4A936]/80">Default Category</span>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-[#251515] text-[#D4A936] rounded-lg px-2 py-1 text-sm border border-[#5A4A4A]"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#D4A936]/80">Show Tutorial</span>
                        <button
                          onClick={() => setShowTutorial(!showTutorial)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            showTutorial ? 'bg-[#A67C00]' : 'bg-[#5A4A4A]'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            showTutorial ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#3B2F2F]/50 rounded-lg p-4">
                    <h4 className="text-[#D4A936] font-medium mb-3">Swipe Sensitivity</h4>
                    <p className="text-[#D4A936]/80 text-sm mb-3">
                      Adjust how easily you can switch tools
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4A936]/80 text-sm">Low</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={swipeSensitivity}
                        onChange={(e) => setSwipeSensitivity(parseInt(e.target.value))}
                        className="w-full accent-[#A67C00]"
                      />
                      <span className="text-[#D4A936]/80 text-sm">High</span>
                    </div>
                    <div className="mt-2 text-center text-xs text-[#D4A936]">
                      Current: {swipeSensitivity} (Delta: {50 - (swipeSensitivity * 4)}px)
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#3B2F2F]/50 rounded-lg p-4">
                  <h4 className="text-[#D4A936] font-medium mb-3">Theme</h4>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-gradient-to-br from-[#251515] via-[#3B2F2F] to-[#251515] rounded-lg border-2 border-[#A67C00]" />
                    <button className="w-10 h-10 bg-gradient-to-br from-[#3B2F2F] via-[#5A4A4A] to-[#3B2F2F] rounded-lg border border-[#D4A936]/30" />
                    <button className="w-10 h-10 bg-gradient-to-br from-[#7A5A00] via-[#A67C00] to-[#7A5A00] rounded-lg border border-[#D4A936]/30" />
                    <button className="w-10 h-10 bg-gradient-to-br from-[#251515] via-[#5A4A4A] to-[#251515] rounded-lg border border-[#D4A936]/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default MusicTools;
