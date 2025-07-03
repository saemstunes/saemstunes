import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Guitar, Piano, ArrowLeft, ArrowRight, RotateCcw, Settings, Info, Zap, X } from 'lucide-react';
import InteractivePiano from './InteractivePiano';
import InteractiveGuitar from './InteractiveGuitar';

const MusicTools: React.FC = () => {
  const [activeInstrument, setActiveInstrument] = useState<'piano' | 'guitar'>('piano');
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [swipeSensitivity, setSwipeSensitivity] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced swipe handlers with better touch detection
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeInstrument === 'piano') {
        setActiveInstrument('guitar');
      }
    },
    onSwipedRight: () => {
      if (activeInstrument === 'guitar') {
        setActiveInstrument('piano');
      }
    },
    delta: 50 - (swipeSensitivity * 4),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false, // Disable mouse tracking to prevent conflicts
    rotationAngle: 0, // Strictly horizontal swipes
  });

  // Reset both instruments
  const handleReset = () => {
    console.log(`Resetting ${activeInstrument}`);
    const eventName = activeInstrument === 'piano' 
      ? 'reset-piano' 
      : 'reset-guitar';
    
    window.dispatchEvent(new CustomEvent(eventName));
  };

  // Close tutorial after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Improved swipe detection for mobile
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsTouch(isMobile);
  }, []);

  return (
    <div 
      {...handlers}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto p-4 sm:p-6"
      ref={containerRef}
      style={{ touchAction: 'pan-y' }} // Critical for swipe to work
    >
      {/* Background effects - reduced z-index */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 opacity-50 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_70%)] z-0" />
      
      {/* Floating particles - reduced z-index */}
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
      
      {/* Navigation Controls - increased z-index */}
      <div className="flex justify-between items-center mb-6 z-20 relative">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors ${
              activeInstrument === 'piano' 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setActiveInstrument('piano')}
          >
            <Piano className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors ${
              activeInstrument === 'guitar' 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setActiveInstrument('guitar')}
          >
            <Guitar className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-full transition-colors"
            onClick={handleReset}
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
      
      {/* Tutorial Tooltip - increased z-index */}
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
              {activeInstrument === 'piano' 
                ? 'Play with keyboard or swipe for guitar →' 
                : '← Swipe for piano or tap frets to play'}
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
      
      {/* Settings Panel - increased z-index */}
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
                  <h4 className="text-amber-400 font-medium mb-3">Instrument Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Default Instrument</span>
                      <select
                        value={activeInstrument}
                        onChange={(e) => setActiveInstrument(e.target.value as 'piano' | 'guitar')}
                        className="bg-black/50 text-white rounded-lg px-2 py-1 text-sm border border-white/20"
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
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
                    Adjust how easily you can switch instruments
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

      {/* Instrument Container with Swipe Indicators - increased z-index */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeInstrument}
            initial={{ x: activeInstrument === 'piano' ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: activeInstrument === 'piano' ? -100 : 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10"
          >
            {activeInstrument === 'piano' ? <InteractivePiano /> : <InteractiveGuitar />}
          </motion.div>
        </AnimatePresence>
        
        {/* Swipe Navigation Hints */}
        {activeInstrument === 'piano' && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-700/50 backdrop-blur-sm p-2 rounded-full z-0"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="h-6 w-6 text-amber-400" />
          </motion.div>
        )}
        
        {activeInstrument === 'guitar' && (
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-700/50 backdrop-blur-sm p-2 rounded-full z-0"
            animate={{ x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowLeft className="h-6 w-6 text-amber-400" />
          </motion.div>
        )}
      </div>
      
      {/* Footer Status */}
      <div className="mt-6 text-center text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-700/50 px-2 py-1 rounded-full">
            {activeInstrument === 'piano' ? '88-key Piano' : '6-string Guitar'}
          </span>
          <span className="hidden sm:block">|</span>
        </div>
        <div>
          Swipe or use buttons to switch instruments
        </div>
      </div>
    </div>
  );
};

export default MusicTools;
