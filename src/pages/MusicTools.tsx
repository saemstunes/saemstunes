

import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@uidotdev/usehooks";
import InteractiveGuitar from "@/components/ui/InteractiveGuitar";
import InteractivePiano from "@/components/ui/InteractivePiano";
import Metronome from "@/components/music-tools/Metronome";
import PitchFinder from "@/components/music-tools/PitchFinder";
import ToolSuggestionForm from "@/components/music-tools/ToolSuggestionForm";
import { 
  Music,
  Lightbulb, 
  Piano, 
  Guitar, 
  Timer, 
  Mic,
  Volume2,
  RotateCcw,
  ArrowLeft,
  Smartphone,
  Tablet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for responsive behavior
const useResponsiveLayout = () => {
  const windowSize = useWindowSize();
  
  const isMobile = windowSize.width ? windowSize.width < 768 : false;
  const isTablet = windowSize.width ? windowSize.width >= 768 && windowSize.width < 1024 : false;
  const isLandscape = windowSize.width && windowSize.height 
    ? windowSize.width > windowSize.height 
    : false;
  
  return { isMobile, isTablet, isLandscape, windowSize };
};

// Tool definitions
const MUSIC_TOOLS = [
  {/* {
    id: 'guitar',
    name: 'Interactive Guitar',
    icon: Guitar,
    description: 'Practice chords and strumming patterns',
    component: InteractiveGuitar,
    category: 'instruments',
    minWidth: 600,
    recommendedOrientation: 'landscape'
  }, */}
  {
    id: 'piano',
    name: 'Interactive Piano',
    icon: Piano,
    description: 'Learn scales, chords, and melodies',
    component: InteractivePiano,
    category: 'instruments',
    minWidth: 500,
    recommendedOrientation: 'any'
  },
  {
    id: 'metronome',
    name: 'Metronome',
    icon: Timer,
    description: 'Keep perfect time while practicing',
    component: Metronome,
    category: 'utilities',
    minWidth: 300,
    recommendedOrientation: 'portrait'
  },
  {
    id: 'tuner',
    name: 'Pitch Finder',
    icon: Mic,
    description: 'Tune your instruments accurately',
    component: PitchFinder,
    category: 'utilities',
    minWidth: 350,
    recommendedOrientation: 'portrait'
  }, // Fixed: Added missing comma here
  {
    id: 'suggest-tool',
    name: 'Suggest a Tool',
    icon: Lightbulb,
    description: 'Have an idea for a new tool? Let us know!',
    component: ToolSuggestionForm, // Fixed: Removed function wrapper
    category: 'feedback',
    minWidth: 300,
    recommendedOrientation: 'any',
    props: { adminEmail: "contact@saemstunes.com" } // Added props for the component
  }
];

const OrientationGuide = ({ tool, onDismiss }) => {
  if (!tool || tool.recommendedOrientation === 'any') return null;
  
  const isLandscapeRecommended = tool.recommendedOrientation === 'landscape';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-3">
        {isLandscapeRecommended ? (
          <Smartphone className="h-5 w-5 text-amber-600 transform rotate-90" />
        ) : (
          <Tablet className="h-5 w-5 text-amber-600" />
        )}
        <div className="flex-1">
          <p className="text-sm text-amber-800">
            <strong>Tip:</strong> {tool.name} works best in{' '}
            <strong>{tool.recommendedOrientation}</strong> orientation for optimal experience.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-amber-600 hover:text-amber-700"
        >
          ×
        </Button>
      </div>
    </motion.div>
  );
};

const ToolCard = ({ tool, isActive, onClick, isOptimal }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'hover:shadow-lg hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          {!isOptimal && (
            <Badge variant="outline" className="text-xs">
              Limited
            </Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);

const MusicTools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { isMobile, isTablet, isLandscape, windowSize } = useResponsiveLayout();
  const [activeTool, setActiveTool] = useState(searchParams.get('tool') || 'piano');
  const [showOrientationGuide, setShowOrientationGuide] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    // Check if we need to open the suggest-a-tool tab
    if (location.state?.openSuggestTool) {
      setActiveTool("suggest-tool");
      setSearchParams({ tool: "suggest-tool" });
    }
  }, [location.state]);
  
  // Get current tool
  const currentTool = MUSIC_TOOLS.find(tool => tool.id === activeTool);
  const CurrentComponent = currentTool?.component;

  // Check if current screen size is optimal for the tool
  const isOptimalSize = currentTool 
    ? (windowSize.width || 0) >= currentTool.minWidth 
    : true;

  const isOptimalOrientation = currentTool 
    ? currentTool.recommendedOrientation === 'any' ||
      (currentTool.recommendedOrientation === 'landscape' && isLandscape) ||
      (currentTool.recommendedOrientation === 'portrait' && !isLandscape)
    : true;

  useEffect(() => {
    const toolFromParams = searchParams.get('tool');
    if (toolFromParams && MUSIC_TOOLS.find(t => t.id === toolFromParams)) {
      setActiveTool(toolFromParams);
    }
  }, [searchParams]);

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
    setSearchParams({ tool: toolId });
    setResetKey(prev => prev + 1);
    
    // Reset any active audio contexts
    window.dispatchEvent(new CustomEvent('reset-guitar'));
    window.dispatchEvent(new CustomEvent('reset-piano'));
  };

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    
    // Dispatch reset events for all tools
    window.dispatchEvent(new CustomEvent('reset-guitar'));
    window.dispatchEvent(new CustomEvent('reset-piano'));
  };

  const groupedTools = {
    instruments: MUSIC_TOOLS.filter(tool => tool.category === 'instruments'),
    utilities: MUSIC_TOOLS.filter(tool => tool.category === 'utilities'),
    feedback: MUSIC_TOOLS.filter(tool => tool.category === 'feedback') // Added feedback category
  };

  return (
    <>
      <Helmet>
        <title>Music Tools - Saem's Tunes</title>
        <meta name="description" content="Interactive music tools for learning and practice. Features guitar, piano, metronome, and tuner." />
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-background pb-20 lg:pb-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Music className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  Music Tools
                </h1>
                <p className="text-muted-foreground mt-1">
                  Interactive tools for learning and practice
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Orientation Guide */}
            <AnimatePresence>
              {showOrientationGuide && !isOptimalOrientation && (
                <OrientationGuide 
                  tool={currentTool}
                  onDismiss={() => setShowOrientationGuide(false)}
                />
              )}
            </AnimatePresence>

            {/* Performance Warning */}
            {!isOptimalSize && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center gap-2 text-yellow-800">
                  <Volume2 className="h-4 w-4" />
                  <p className="text-sm">
                    <strong>Note:</strong> {currentTool?.name} may have limited functionality on smaller screens. 
                    Minimum recommended width: {currentTool?.minWidth}px
                  </p>
                </div>
              </motion.div>
            )}

            <Tabs value={activeTool} onValueChange={handleToolChange} className="w-full">
              {/* Desktop Tool Selection */}
              <div className="hidden md:block mb-6">
                <h3 className="text-lg font-semibold mb-4">Choose Your Tool</h3>
                <div className="space-y-4">
                  {Object.entries(groupedTools).map(([category, tools]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {tools.map((tool) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            isActive={activeTool === tool.id}
                            onClick={() => handleToolChange(tool.id)}
                            isOptimal={(windowSize.width || 0) >= tool.minWidth}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Tool Selection - Updated for 5 items */}
              <TabsList className="grid grid-cols-3 w-full mb-6 md:hidden">
                {MUSIC_TOOLS.map((tool) => (
                  <TabsTrigger 
                    key={tool.id} 
                    value={tool.id}
                    className="flex items-center gap-2 text-xs p-2"
                  >
                    <tool.icon className="h-4 w-4" />
                    <span className="hidden xs:inline truncate">{tool.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tool Content */}
              <div className="w-full">
                {MUSIC_TOOLS.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id} className="mt-0">
                    <div className="w-full overflow-hidden rounded-lg">
                      {CurrentComponent && (
                        <div key={resetKey} className="w-full max-w-none">
                          {/* Pass props if they exist */}
                          {tool.props ? (
                            <CurrentComponent {...tool.props} />
                          ) : (
                            <CurrentComponent adminEmail="contact@saemstunes.com" />
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            {/* Usage Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-muted/50 rounded-lg"
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                Quick Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use headphones for the best audio experience</li>
                <li>• {isMobile ? 'Tap' : 'Click'} the reset button to clear all active notes</li>
                <li>• Guitar: Swipe vertically to strum, {isMobile ? 'tap' : 'click'} frets to play individual notes</li>
                <li>• Piano: Hold keys longer for different note durations</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MusicTools;
