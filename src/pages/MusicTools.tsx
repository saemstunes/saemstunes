import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { 
  Guitar, Piano, ArrowLeft, ArrowRight, RotateCcw, 
  Settings, Zap, X, Plus, MessageCircle, Timer, TrendingUp, RotateCw
} from 'lucide-react';
import InteractivePiano from '@/components/ui/InteractivePiano';
import RealisticGuitar from '@/components/ui/RealisticGuitar';
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
  const [activeTool, setActiveTool] = useState<'piano' | 'guitar' | 'metronome' | 'pitch-finder'>('guitar');
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [swipeSensitivity, setSwipeSensitivity] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('instruments');
  const [showOrientationAlert, setShowOrientationAlert] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topSwipeAreaRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  
  // Define tools with categories
  const tools = [
    {
      id: 'guitar',
      name: 'Realistic Guitar',
      icon: Guitar,
      category: 'instruments', 
      description: 'Strum and play with realistic guitar feel',
      component: RealisticGuitar,
      color: 'bg-gradient-to-r from-amber-600 to-amber-700'
    },
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: Piano,
      category: 'instruments',
      description: 'Practice scales, chords, and melodies',
      component: InteractivePiano,
      color: 'bg-gradient-to-r from-slate-600 to-slate-700'
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: Timer,
      category: 'tools',
      description: 'Keep perfect time while practicing',
      component: Metronome,
      color: 'bg-gradient-to-r from-blue-600 to-blue-700'
    },
    {
      id: 'pitch-finder',
      name: 'Pitch Finder',
      icon: TrendingUp,
      category: 'tools',
      description: 'Tune your instruments with precision',
      component: PitchFinder,
      color: 'bg-gradient-to-r from-green-600 to-green-700'
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

  // Check for mobile and orientation
  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      const mobile = windowSize.width < 768;
      const landscape = windowSize.width > windowSize.height;
      setIsMobile(mobile);
      setIsLandscape(landscape);
      setShowOrientationAlert(mobile && !landscape);
    }
  }, [windowSize]);

  // Close tutorial after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div 
        className="relative bg-gradient-to-br from-background via-card to-background rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl mx-auto p-4 sm:p-6"
        ref={containerRef}
      >
        {/* Background effects with app theming */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,124,0,0.1),transparent_70%)] z-0" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full z-0"
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
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary/80 to-accent/80 backdrop-blur-sm border border-primary/50 rounded-lg px-4 py-3 text-primary-foreground text-sm font-medium z-40 shadow-lg flex items-center w-11/12 max-w-md"
            >
              <RotateCw className="inline w-4 h-4 mr-2 text-primary-foreground animate-spin" />
              <span>
                Rotate your device to landscape mode for the best experience
              </span>
              <button 
                className="ml-3 text-primary-foreground/70 hover:text-primary-foreground"
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
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary/70 to-accent/70 backdrop-blur-sm border border-primary/50 rounded-full px-4 py-2 text-primary-foreground text-sm font-medium z-30 shadow-lg flex items-center"
            >
              <Zap className="inline w-4 h-4 mr-2 text-primary-foreground" />
              <span>
                {activeTool === 'piano' 
                  ? 'Play with keyboard or swipe for guitar →' 
                  : activeTool === 'guitar'
                  ? '← Swipe for piano or tap frets • Swipe across strings to strum'
                  : 'Swipe left/right to switch between tools'}
              </span>
              <button 
                className="ml-3 text-primary-foreground/70 hover:text-primary-foreground"
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
              className="text-4xl font-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Music Tools
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
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
              <SelectTrigger className="w-48 bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                    className="hover:bg-accent focus:bg-accent text-foreground"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation Controls - Enhanced for better mobile interaction */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {filteredTools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-full transition-colors shadow-lg ${
                    activeTool === tool.id 
                      ? `${tool.color} text-white shadow-xl` 
                      : 'bg-card text-foreground hover:bg-accent border border-border'
                  } ${isMobile ? 'min-w-[56px] min-h-[56px]' : 'min-w-[48px] min-h-[48px]'}`}
                  onClick={() => setActiveTool(tool.id as any)}
                >
                  <tool.icon className={`${isMobile ? 'h-7 w-7' : 'h-6 w-6'}`} />
                </motion.button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-card text-foreground hover:bg-accent rounded-full transition-colors shadow-lg border border-border"
                onClick={handleReset}
              >
                <RotateCcw className="h-6 w-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full transition-colors shadow-lg border border-border ${
                  showSettings 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground hover:bg-accent'
                }`}
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
          
          {/* Tool Navigation Indicators */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  activeTool === tool.id ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Tool Card Container */}
        <Card className="bg-card/80 backdrop-blur-md border-border rounded-xl overflow-hidden z-10 relative">
          <CardContent className="p-0">
            {/* Tool Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${currentTool.color}`}>
                    <currentTool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {currentTool.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {currentTool.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-accent text-accent-foreground border-border capitalize">
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
              
              {/* Enhanced Swipe Navigation Buttons */}
              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card/90 backdrop-blur-sm p-4 rounded-full border border-border z-40 shadow-xl hover:bg-accent transition-colors"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => {
                  const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
                  const nextIndex = (currentIndex + 1) % filteredTools.length;
                  setActiveTool(filteredTools[nextIndex].id as any);
                }}
                style={{ zIndex: 1000 }}
              >
                <ArrowRight className="h-6 w-6 text-foreground" />
              </motion.button>
              
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card/90 backdrop-blur-sm p-4 rounded-full border border-border z-40 shadow-xl hover:bg-accent transition-colors"
                animate={{ x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => {
                  const currentIndex = filteredTools.findIndex(t => t.id === activeTool);
                  const prevIndex = (currentIndex - 1 + filteredTools.length) % filteredTools.length;
                  setActiveTool(filteredTools[prevIndex].id as any);
                }}
                style={{ zIndex: 1000 }}
              >
                <ArrowLeft className="h-6 w-6 text-foreground" />
              </motion.button>
            </div>
          </CardContent>
        </Card>
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-card backdrop-blur-md rounded-xl p-6 mt-6 border border-border shadow-2xl z-30 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground font-semibold text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Music Tools Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-accent/50 rounded-lg p-4">
                    <h4 className="text-foreground font-medium mb-3">Tool Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Default Category</span>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-background text-foreground rounded-lg px-2 py-1 text-sm border border-border"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Show Tutorial</span>
                        <button
                          onClick={() => setShowTutorial(!showTutorial)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            showTutorial ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            showTutorial ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/50 rounded-lg p-4">
                    <h4 className="text-foreground font-medium mb-3">Swipe Sensitivity</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Adjust how easily you can switch tools
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">Low</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={swipeSensitivity}
                        onChange={(e) => setSwipeSensitivity(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <span className="text-muted-foreground text-sm">High</span>
                    </div>
                    <div className="mt-2 text-center text-xs text-foreground">
                      Current: {swipeSensitivity} (Delta: {50 - (swipeSensitivity * 4)}px)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggest a Tool Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-card/80 backdrop-blur-md border-border rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                Suggest a Music Tool
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Have an idea for a music tool you'd like to see? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToolSuggestionForm adminEmail="admin@saemstunes.com" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default MusicTools;
