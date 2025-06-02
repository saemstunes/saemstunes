
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Timer, TrendingUp } from "lucide-react";
import Metronome from "@/components/music-tools/Metronome";
import PitchFinder from "@/components/music-tools/PitchFinder";
import ToolSuggestionForm from "@/components/music-tools/ToolSuggestionForm";

const MusicTools = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("metronome");

  useEffect(() => {
    // Check if we need to open the suggest-a-tool tab
    if (location.state?.openSuggestTool) {
      setActiveTab("suggest-a-tool");
    }
  }, [location.state]);

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metronome" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Metronome
            </TabsTrigger>
            <TabsTrigger value="pitch-finder" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="suggest-a-tool" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Suggest a Tool
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metronome" className="mt-6">
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

          <TabsContent value="pitch-finder" className="mt-6">
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

          <TabsContent value="suggest-a-tool" className="mt-6">
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
                <ToolSuggestionForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MusicTools;
