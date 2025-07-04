import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Guitar, Piano, ArrowLeft, ArrowRight, RotateCcw, Settings, Info, Zap, X, Plus, MessageCircle } from 'lucide-react';
import InteractivePiano from '@/components/ui/InteractivePiano';
import InteractiveGuitar from '@/components/ui/InteractiveGuitar';
import Metronome from '@/components/music-tools/Metronome';
import PitchFinder from '@/components/music-tools/PitchFinder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MusicTools: React.FC = () => {
  // State for tools management
  const [activeTool, setActiveTool] = useState<'piano' | 'guitar' | 'metronome' | 'pitch-finder' | 'suggest-tool'>('piano');
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [swipeSensitivity, setSwipeSensitivity] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('instruments');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Define tools with categories
  const tools = [
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: Piano,
      category: 'instruments',
      description: 'Practice scales, chords, and melodies',
      component: InteractivePiano,
      color: 'bg-blue-500'
    },
    {
      id: 'guitar',
      name: 'Interactive Guitar',
      icon: Guitar,
      category: 'instruments', 
      description: 'Learn chords and finger positions',
      component: InteractiveGuitar,
      color: 'bg-green-500'
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: RotateCcw,
      category: 'tools',
      description: 'Keep perfect time while practicing',
      component: Metronome,
      color: 'bg-purple-500'
    },
    {
      id: 'pitch-finder',
      name: 'Pitch Finder',
      icon: Settings,
      category: 'tools',
      description: 'Tune your instruments with precision',
      component: PitchFinder,
      color: 'bg-orange-500'
    },
    // Suggest Tool placeholder
    {
      id: 'suggest-tool',
      name: 'Suggest a Tool',
      icon: Plus,
      category: 'feedback',
      description: 'Help us improve our toolkit',
      component: () => null,
      color: 'bg-amber-500'
    }
  ];

  const categories = [
    { value: 'instruments', label: 'Instruments' },
    { value: 'tools', label: 'Practice Tools' }
  ];

  // Filter tools based on category
  const filteredTools = tools.filter(tool => tool.category === selectedCategory);
  const currentTool = tools.find(tool => tool.id === activeTool) || tools[0];
  
  // Enhanced swipe handlers
  const handlers = useSwipeable({
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
    if (activeTool !== 'suggest-tool') {
      window.dispatchEvent(new CustomEvent(`reset-${activeTool}`));
    }
  };

  // Handle suggestion submission
  const handleSuggestionSubmit = () => {
    console.log('Tool suggestion submitted:', suggestion);
    // Here you would typically send the suggestion to your backend
    setShowSuggestionModal(false);
    setSuggestion('');
    
    // Show confirmation
    setShowTutorial(true);
    setTimeout(() => setShowTutorial(false), 3000);
  };

  // Close tutorial after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      {...handlers}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto p-4 sm:p-6"
      ref={containerRef}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 opacity-50 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_70%)] z-0" />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full z-0"
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
      
      {/* Category Filter */}
      <div className="flex justify-center mb-4 z-20 relative">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {categories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="hover:bg-slate-700 focus:bg-slate-700 text-slate-200"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mb-4 z-20 relative">
        <div className="flex items-center gap-2">
          {filteredTools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full transition-colors ${
                activeTool === tool.id 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => {
                if (tool.id === 'suggest-tool') {
                  setShowSuggestionModal(true);
                } else {
                  setActiveTool(tool.id as any);
                }
              }}
            >
              <tool.icon className="h-5 w-5" />
            </motion.button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-full transition-colors"
            onClick={handleReset}
            disabled={activeTool === 'suggest-tool'}
          >
            <RotateCcw className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors ${
              showSettings 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Tool Navigation Indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              if (tool.id === 'suggest-tool') {
                setShowSuggestionModal(true);
              } else {
                setActiveTool(tool.id as any);
              }
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              activeTool === tool.id ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      
      {/* Tutorial Tooltip */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 text-white text-sm font-medium z-30 shadow-lg flex items-center"
          >
            <Zap className="inline w-4 h-4 mr-2" />
            <span>
              {activeTool === 'piano' 
                ? 'Play with keyboard or swipe for guitar →' 
                : activeTool === 'guitar'
                ? '← Swipe for piano or tap frets to play'
                : activeTool === 'suggest-tool'
                ? 'Tap the + icon to suggest new tools!'
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
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-2xl z-30 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Music Tools Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-amber-400 font-medium mb-3">Tool Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Default Category</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-black/50 text-white rounded-lg px-2 py-1 text-sm border border-white/20"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Show Tutorial</span>
                      <button
                        onClick={() => setShowTutorial(!showTutorial)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          showTutorial ? 'bg-amber-500' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          showTutorial ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-purple-400 font-medium mb-3">Swipe Sensitivity</h4>
                  <p className="text-white/80 text-sm mb-3">
                    Adjust how easily you can switch tools
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={swipeSensitivity}
                      onChange={(e) => setSwipeSensitivity(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-white/80 text-sm">High</span>
                  </div>
                  <div className="mt-2 text-center text-xs text-amber-400">
                    Current: {swipeSensitivity} (Delta: {50 - (swipeSensitivity * 4)}px)
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-3">Theme</h4>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border-2 border-amber-500" />
                  <button className="w-10 h-10 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-lg border border-white/20" />
                  <button className="w-10 h-10 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-lg border border-white/20" />
                  <button className="w-10 h-10 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-lg border border-white/20" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Card Container */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden z-10 relative">
        <CardContent className="p-0">
          {/* Tool Header */}
          <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${currentTool.color}`}>
                  <currentTool.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentTool.name}</h2>
                  <p className="text-slate-300 text-sm">{currentTool.description}</p>
                </div>
              </div>
              <Badge className="bg-slate-700/50 text-slate-300 capitalize">
                {currentTool.category}
              </Badge>
            </div>
          </div>

          {/* Tool Content with Swipe Indicators */}
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
                {activeTool === 'suggest-tool' ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 p-6 rounded-full mb-6">
                      <Plus className="h-12 w-12 text-amber-400 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Have an idea?</h3>
                    <p className="text-slate-300 mb-6 max-w-md">
                      We're always looking to improve our toolkit. Suggest a new music tool or feature you'd like to see!
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      onClick={() => setShowSuggestionModal(true)}
                    >
                      Suggest a Tool
                    </Button>
                  </div>
                ) : (
                  React.createElement(currentTool.component)
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Swipe Navigation Hints */}
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-700/50 backdrop-blur-sm p-2 rounded-full"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="h-6 w-6 text-amber-400" />
            </motion.div>
            
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-700/50 backdrop-blur-sm p-2 rounded-full"
              animate={{ x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowLeft className="h-6 w-6 text-amber-400" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer Status */}
      <div className="mt-4 text-center text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-700/50 px-2 py-1 rounded-full">
            {activeTool === 'piano' 
              ? '88-key Piano' 
              : activeTool === 'guitar' 
                ? '6-string Guitar' 
                : activeTool === 'metronome'
                ? 'Adjustable Metronome'
                : activeTool === 'pitch-finder'
                ? 'Precision Tuner'
                : 'Your Ideas Matter'}
          </span>
        </div>
        <div>
          Swipe or tap icons to switch tools
        </div>
      </div>
      
      {/* Suggestion Modal */}
      <AnimatePresence>
        {showSuggestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuggestionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-amber-400" />
                  Suggest a New Tool
                </h3>
                <button
                  onClick={() => setShowSuggestionModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-300">
                  What music tool would you like to see in our app? Describe your idea below:
                </p>
                
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="I'd love to see a tool for..."
                />
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSuggestionModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={handleSuggestionSubmit}
                    disabled={!suggestion.trim()}
                  >
                    Submit Idea
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicTools;
