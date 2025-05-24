import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { FileText, Shield } from "lucide-react";

const MusicTools = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Music Tools</h1>
          <p className="text-muted-foreground mt-1">
            Explore helpful tools for musicians and learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Online Metronome</CardTitle>
              <CardDescription>Keep the beat with a simple metronome</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A basic metronome to help you practice with precision.
              </p>
              <Button variant="link" className="mt-4">
                Open Metronome
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Chord Finder</CardTitle>
              <CardDescription>Discover chords for various instruments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find the right chords for your song.
              </p>
              <Button variant="link" className="mt-4">
                Find Chords
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Scale Generator</CardTitle>
              <CardDescription>Generate scales for different keys</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate scales for different keys and modes.
              </p>
              <Button variant="link" className="mt-4">
                Generate Scales
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Tuner</CardTitle>
              <CardDescription>Tune your instrument with precision</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tune your instrument with precision.
              </p>
              <Button variant="link" className="mt-4">
                Tune Instrument
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Tempo Calculator</CardTitle>
              <CardDescription>Calculate the tempo of a song</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Calculate the tempo of a song.
              </p>
              <Button variant="link" className="mt-4">
                Calculate Tempo
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Ear Trainer</CardTitle>
              <CardDescription>Improve your ear training skills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Improve your ear training skills.
              </p>
              <Button variant="link" className="mt-4">
                Train Your Ear
              </Button>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </MainLayout>
  );
};

export default MusicTools;
