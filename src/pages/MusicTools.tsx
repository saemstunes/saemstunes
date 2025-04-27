
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, FlaskConical, Mic, AlertCircle, MessageCircle } from "lucide-react";
import PitchFinder from "@/components/music-tools/PitchFinder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Metronome from "@/components/music-tools/Metronome";

// Tool suggestion form
const ToolSuggestionForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Suggestion submitted!",
      description: "Thank you for your input. We'll consider it for future updates.",
    });
    
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="toolName" className="text-sm font-medium">Tool Name</label>
        <Input 
          id="toolName"
          placeholder="E.g., Scale Practice Helper"
          {...register("toolName", { required: true })}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          placeholder="Tell us what you'd like this tool to do..."
          rows={4}
          {...register("description", { required: true })}
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Suggestion"}
      </Button>
    </form>
  );
};

const MusicTools = () => {
  const [activeTab, setActiveTab] = useState("pitch-finder");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [permissionState, setPermissionState] = useState({
    microphone: null, // null = not asked, true = granted, false = denied
  });

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
      toast({
        title: "Permission Denied",
        description: "Microphone access is required for this feature.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleTabChange = async (value) => {
    // Check if we're switching to a tab that requires microphone
    if ((value === "pitch-finder" || value === "metronome") && permissionState.microphone === null) {
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

        {permissionState.microphone === null && (
          <Alert className="bg-gold/10 border-gold/30">
            <AlertCircle className="h-4 w-4 text-gold" />
            <AlertTitle>Microphone Access Required</AlertTitle>
            <AlertDescription>
              Some tools require microphone access. Please allow microphone permissions when prompted.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="pitch-finder" value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="pitch-finder" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Pitch Finder
            </TabsTrigger>
            <TabsTrigger value="metronome" className="flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Metronome
            </TabsTrigger>
            <TabsTrigger value="suggest-tool" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Suggest a Tool
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pitch-finder" className="pt-6">
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h2 className="text-xl font-medium mb-2">Pitch Finder</h2>
              <p>This tool detects the pitch of your voice or instrument in real-time.</p>
              <p className="text-sm text-muted-foreground mt-2">Sing or play a note to see its pitch displayed below.</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <PitchFinder />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metronome" className="pt-6">
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h2 className="text-xl font-medium mb-2">Metronome</h2>
              <p>A simple metronome to help you practice with accurate timing.</p>
              <p className="text-sm text-muted-foreground mt-2">Adjust the tempo using the slider below.</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Metronome />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggest-tool" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suggest a New Tool</CardTitle>
                  <CardDescription>
                    Help us improve by suggesting music tools you'd like to see.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ToolSuggestionForm />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>Tools we're currently developing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span>Chord Finder</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span>Scale Practice Assistant</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold"></div>
                        <span>Sight Reading Trainer</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
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
      </div>
    </MainLayout>
  );
};

export default MusicTools;
