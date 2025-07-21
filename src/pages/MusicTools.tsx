
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Piano, 
  Guitar, 
  Drum, 
  Mic, 
  Music, 
  Settings, 
  RotateCcw,
  Smartphone,
  Monitor
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import InteractivePiano from "@/components/ui/InteractivePiano";
import OptimizedGuitar from "@/components/ui/OptimizedGuitar";
import Metronome from "@/components/music-tools/Metronome";
import PitchFinder from "@/components/music-tools/PitchFinder";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";

const MusicTools = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [isLandscape, setIsLandscape] = useState(false);

  // Detect device orientation
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
      setIsLandscape(isLandscapeMode);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const tools = [
    {
      id: 'piano',
      name: 'Interactive Piano',
      icon: <Piano className="h-8 w-8" />,
      description: 'Play and learn with our virtual piano keyboard',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-blue-700',
      component: <InteractivePiano />
    },
    {
      id: 'guitar',
      name: 'Virtual Guitar',
      icon: <Guitar className="h-8 w-8" />,
      description: 'Strum and play guitar with realistic sound',
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
      textColor: 'text-amber-700',
      component: <OptimizedGuitar />
    },
    {
      id: 'metronome',
      name: 'Metronome',
      icon: <Music className="h-8 w-8" />,
      description: 'Keep perfect time with our digital metronome',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      textColor: 'text-green-700',
      component: <Metronome />
    },
    {
      id: 'tuner',
      name: 'Pitch Finder',
      icon: <Mic className="h-8 w-8" />,
      description: 'Tune your instruments with precision',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      textColor: 'text-purple-700',
      component: <PitchFinder />
    }
  ];

  const renderToolSelector = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Music Tools</h1>
        <p className="text-muted-foreground">
          Interactive instruments and utilities for your musical journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${tool.color} border-2`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto ${tool.textColor} mb-4`}>
                  {tool.icon}
                </div>
                <CardTitle className={`${tool.textColor}`}>{tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <Button variant="outline" size="sm">
                  Launch Tool
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Landscape Mode Instructions */}
      {!isLandscape && (
        <Card className="border-dashed border-2 border-gold/50 bg-gold/5">
          <CardContent className="text-center py-6">
            <div className="flex justify-center gap-4 mb-4">
              <Smartphone className="h-6 w-6 text-gold" />
              <RotateCcw className="h-6 w-6 text-gold" />
              <Monitor className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-semibold mb-2">Enhanced Experience Available</h3>
            <p className="text-sm text-muted-foreground">
              Rotate your device to landscape mode for a more immersive instrument experience
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSelectedTool = () => {
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={tool.textColor}>
              {tool.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tool.name}</h1>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTool('')}
            >
              <Settings className="h-4 w-4 mr-2" />
              All Tools
            </Button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {tool.component}
        </div>
      </div>
    );
  };

  // Show full-screen instrument selector in landscape mode on mobile
  if (isLandscape) {
    return (
      <>
        <Helmet>
          <title>Music Tools - Saem's Tunes</title>
          <meta name="description" content="Interactive music tools and instruments" />
        </Helmet>
        
        <div className="min-h-screen bg-background p-4">
          <motion.div {...pageTransition}>
            {selectedTool ? renderSelectedTool() : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Choose Your Instrument</h1>
                  <Badge variant="secondary" className="bg-gold/20 text-gold">
                    Landscape Mode
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {tools.map((tool) => (
                    <Card 
                      key={tool.id}
                      className={`cursor-pointer transition-all duration-300 ${tool.color} border-2 h-32`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <CardContent className="flex flex-col items-center justify-center h-full p-4">
                        <div className={`${tool.textColor} mb-2`}>
                          {tool.icon}
                        </div>
                        <h3 className={`font-semibold text-sm ${tool.textColor} text-center`}>
                          {tool.name}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Music Tools - Saem's Tunes</title>
        <meta name="description" content="Interactive music tools and instruments for learning and practice" />
      </Helmet>
      
      <MainLayout>
        <motion.div className="space-y-8 pb-20 lg:pb-0" {...pageTransition}>
          {selectedTool ? renderSelectedTool() : renderToolSelector()}
        </motion.div>
      </MainLayout>
    </>
  );
};

export default MusicTools;
