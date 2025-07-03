
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Timer, TrendingUp, Piano, Guitar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Metronome from "@/components/music-tools/Metronome";
import PitchFinder from "@/components/music-tools/PitchFinder";
import ToolSuggestionForm from "@/components/music-tools/ToolSuggestionForm";
import InteractivePiano from "@/components/ui/InteractivePiano";
import InteractiveGuitar from "@/components/ui/InteractiveGuitar";
import SwipableContainer from "@/components/ui/SwipableContainer";

const MusicTools = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("interactive-tools");
  const [showDropdown, setShowDropdown] = useState(false);
  const [interactiveToolIndex, setInteractiveToolIndex] = useState(0);

  const tabs = [
    { id: "interactive-tools", label: "Interactive Tools", icon: Piano },
    { id: "metronome", label: "Metronome", icon: Timer },
    { id: "pitch-finder", label: "Pitch Finder", icon: TrendingUp },
    { id: "suggest-a-tool", label: "Suggest a Tool", icon: Music }
  ];

  const interactiveTools = [
    { id: "piano", label: "Piano", component: <InteractivePiano /> },
    { id: "guitar", label: "Guitar", component: <InteractiveGuitar /> }
  ];

  useEffect(() => {
    // Check if we need to open the suggest-a-tool tab
    if (location.state?.openSuggestTool) {
      setActiveTab("suggest-a-tool");
    }
  }, [location.state]);

  const handleTabSwipe = (direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (direction === 'left' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    } else if (direction === 'right' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Music Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional music tools to enhance your practice and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab List with Dropdown */}
          <div className="relative">
            <TabsList className={`grid w-full ${tabs.length <= 4 ? `grid-cols-${tabs.length}` : 'grid-cols-4'}`}>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 relative"
                  onClick={() => {
                    if (tab.id === "interactive-tools") {
                      setShowDropdown(!showDropdown);
                    } else {
                      setShowDropdown(false);
                    }
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.id === "interactive-tools" && (
                    <ChevronDown className={`h-3 w-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Dropdown for Interactive Tools */}
            <AnimatePresence>
              {showDropdown && activeTab === "interactive-tools" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 z-20 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  {interactiveTools.map((tool, index) => (
                    <Button
                      key={tool.id}
                      variant="ghost"
                      className="w-full justify-start px-4 py-3 hover:bg-gold/10"
                      onClick={() => {
                        setInteractiveToolIndex(index);
                        setShowDropdown(false);
                      }}
                    >
                      {tool.id === "piano" ? <Piano className="h-4 w-4 mr-2" /> : <Guitar className="h-4 w-4 mr-2" />}
                      {tool.label}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Contents with Swipe Support */}
          <div className="mt-6">
            <TabsContent value="interactive-tools">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {interactiveTools[interactiveToolIndex].id === "piano" ? (
                      <Piano className="h-5 w-5 text-gold" />
                    ) : (
                      <Guitar className="h-5 w-5 text-gold" />
                    )}
                    Interactive {interactiveTools[interactiveToolIndex].label}
                  </CardTitle>
                  <CardDescription>
                    Practice and learn with our interactive {interactiveTools[interactiveToolIndex].label.toLowerCase()} simulator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SwipableContainer
                    onSlideChange={setInteractiveToolIndex}
                    indicators={true}
                    showControls={true}
                    className="min-h-[400px]"
                  >
                    {interactiveTools.map((tool) => tool.component)}
                  </SwipableContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metronome">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-gold" />
                    Digital Metronome
                  </CardTitle>
                  <CardDescription>
                    Keep perfect time with our digital metronome
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Metronome />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pitch-finder">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    Pitch Finder & Tuner
                  </CardTitle>
                  <CardDescription>
                    Find the perfect pitch and tune your instruments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PitchFinder />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggest-a-tool">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-gold" />
                    Suggest a Music Tool
                  </CardTitle>
                  <CardDescription>
                    Have an idea for a music tool you'd like to see? Let us know!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ToolSuggestionForm adminEmail="admin@saemstunes.com" />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MusicTools;
