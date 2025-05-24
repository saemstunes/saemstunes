
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, FlaskConical, Mic, AlertCircle, MessageCircle } from "lucide-react";
import PitchFinder from "@/components/music-tools/PitchFinder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Metronome from "@/components/music-tools/Metronome";
import ToolSuggestionForm from "@/components/music-tools/ToolSuggestionForm";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import SEOHead from "@/components/seo/SEOHead";

const MusicTools = () => {
  const [activeTab, setActiveTab] = useState("pitch-finder");
  const navigate = useNavigate();
  const [permissionState, setPermissionState] = useState({
    microphone: null, // null = not asked, true = granted, false = denied
  });

  // SEO schema for music tools
  const musicToolsSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Music Tools by Saem's Tunes",
    "applicationCategory": "EducationalApplication, MusicApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web Browser",
    "description": "Free interactive music tools including pitch finder, metronome, and more to help musicians practice and improve their skills.",
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://saemstunes.app/music-tools"
      }
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionState(prev => ({ ...prev, microphone: true }));
      // Stop the audio tracks after permission is granted
      result.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error("Error requesting microphone permission:", err);
      setPermissionState(prev => ({ ...prev, microphone: false }));
      return false;
    }
  };

  const handleTabChange = async (value) => {
    // Check if we're switching to a tab that requires microphone
    if ((value === "pitch-finder") && permissionState.microphone === null) {
      const permissionGranted = await requestMicrophonePermission();
      if (permissionGranted) {
        setActiveTab(value);
      }
    } else {
      setActiveTab(value);
    }
  };

  return (
    <MainLayout>
      <SEOHead 
        title="Music Tools - Pitch Finder, Metronome & More | Saem's Tunes"
        description="Free interactive music tools to enhance your musical journey. Use our pitch finder, metronome, and other tools to improve your skills."
        keywords="pitch finder, metronome, music tools, music practice, tuner app, music learning"
        url="https://saemstunes.app/music-tools"
        structuredData={musicToolsSchema}
      />
      <motion.div 
        className="space-y-6 pb-24 md:pb-12"
        {...pageTransition}
      >
        <div className="flex flex-col space-y-2">
          <motion.h1 
            className="text-3xl font-serif font-bold flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Music className="mr-2 h-6 w-6 text-gold" />
            Music Tools
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Interactive tools to enhance your musical journey
          </motion.p>
        </div>

        {permissionState.microphone === null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-gold/10 border-gold/30">
              <AlertCircle className="h-4 w-4 text-gold" />
              <AlertTitle>Microphone Access Required</AlertTitle>
              <AlertDescription>
                Some tools require microphone access. Please allow microphone permissions when prompted.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <Tabs defaultValue="pitch-finder" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 bg-muted/70">
            <TabsTrigger value="pitch-finder" className="flex items-center data-[state=active]:bg-gold/20">
              <Mic className="h-4 w-4 mr-2" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="metronome" className="flex items-center data-[state=active]:bg-gold/20">
              <Music className="h-4 w-4 mr-2" />
              Metronome
            </TabsTrigger>
            <TabsTrigger value="suggest-tool" className="flex items-center data-[state=active]:bg-gold/20">
              <MessageCircle className="h-4 w-4 mr-2" />
              Suggest a Tool
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pitch-finder" className="pt-6">
            <div className="mb-4 p-4 bg-gold/5 rounded-lg border border-gold/10">
              <h2 className="text-xl font-medium mb-2 flex items-center">
                <Mic className="mr-2 h-5 w-5 text-gold" />
                <span>Pitch Finder</span>
              </h2>
              <p>Analyze and identify musical notes with precision in real-time.</p>
              <p className="text-sm text-muted-foreground mt-2">Sing or play an instrument to see the detected pitch, note, and accuracy.</p>
            </div>
            <PitchFinder />
          </TabsContent>
          
          <TabsContent value="metronome" className="pt-6">
            <div className="mb-4 p-4 bg-gold/5 rounded-lg border border-gold/10">
              <h2 className="text-xl font-medium mb-2 flex items-center">
                <Music className="mr-2 h-5 w-5 text-gold" />
                <span>Metronome</span>
              </h2>
              <p>Keep perfect time with our wooden-style interactive metronome.</p>
              <p className="text-sm text-muted-foreground mt-2">Adjust tempo, beats per measure, and watch the pendulum swing to the beat.</p>
            </div>
            <Card className="border-gold/20 shadow-md overflow-hidden">
              <CardContent className="pt-6">
                <Metronome />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggest-tool" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gold/20 shadow-md">
                <CardHeader className="bg-gold/5 border-b border-gold/10">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-gold" />
                    Suggest a New Tool
                  </CardTitle>
                  <CardDescription>
                    Help us improve by suggesting music tools you'd like to see.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ToolSuggestionForm adminEmail="saemstunes@gmail.com" />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <Card className="border-gold/20 shadow-md">
                  <CardHeader className="bg-gold/5 border-b border-gold/10">
                    <CardTitle className="flex items-center">
                      <FlaskConical className="mr-2 h-5 w-5 text-gold" />
                      Coming Soon
                    </CardTitle>
                    <CardDescription>Tools we're currently developing</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 p-2 rounded-md bg-gold/5 hover:bg-gold/10 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span className="font-medium">Chord Finder</span>
                        <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">Coming soon</span>
                      </li>
                      <li className="flex items-center gap-3 p-2 rounded-md bg-gold/5 hover:bg-gold/10 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span className="font-medium">Scale Practice Assistant</span>
                        <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">Coming soon</span>
                      </li>
                      <li className="flex items-center gap-3 p-2 rounded-md bg-gold/5 hover:bg-gold/10 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span className="font-medium">Sight Reading Trainer</span>
                        <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">Coming soon</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-gold/30 text-gold hover:bg-gold/10"
                      onClick={() => navigate('/contact-us')}
                    >
                      Contact Us For More Ideas
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legal Links Footer */}
        <div className="flex justify-center space-x-4 pt-8 border-t">
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/privacy")}
            className="text-muted-foreground hover:text-gold"
          >
            Privacy Policy
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/terms")}
            className="text-muted-foreground hover:text-gold"
          >
            Terms of Service
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default MusicTools;
