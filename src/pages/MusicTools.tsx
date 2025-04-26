
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, FlaskConical, Mic, AlertCircle } from "lucide-react";
import PitchFinder from "@/components/music-tools/PitchFinder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MusicTools = () => {
  const [activeTab, setActiveTab] = useState("pitch-finder");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-serif font-bold flex items-center">
            <Music className="mr-2 h-6 w-6 text-gold" />
            Music Tools
          </h1>
          <p className="text-muted-foreground">
            Tools to help you improve your musical skills
          </p>
        </div>

        <Alert className="bg-gold/10 border-gold/30">
          <AlertCircle className="h-4 w-4 text-gold" />
          <AlertTitle>Microphone Access Required</AlertTitle>
          <AlertDescription>
            Some tools require microphone access. Please allow microphone permissions when prompted.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="pitch-finder" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pitch-finder" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="coming-soon" className="flex items-center">
              <FlaskConical className="h-4 w-4 mr-2" />
              More Tools (Coming Soon)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pitch-finder" className="pt-6">
            <PitchFinder />
          </TabsContent>
          
          <TabsContent value="coming-soon" className="pt-6">
            <div className="text-center p-12 border border-dashed rounded-lg">
              <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">More tools coming soon!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on adding more useful music tools including a metronome,
                chord finder, and scale practice assistant.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MusicTools;
