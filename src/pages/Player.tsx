
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic,
  Heart,
  Share2,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Player = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [position, setPosition] = useState(35);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Sample track data
  const track = {
    title: "Introduction to Vocal Techniques",
    artist: "Sarah Johnson",
    album: "Vocal Basics Course",
    duration: "4:32",
    currentTime: "1:35",
    coverArt: "/placeholder.svg"
  };
  
  return (
    <MainLayout showMiniPlayer={true}>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Album Cover Art */}
        <div className="w-full max-w-md">
          <Card className="aspect-square">
            <CardContent className="p-0">
              <div className="relative h-full w-full">
                <img 
                  src={track.coverArt}
                  alt={`${track.title} cover art`}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Player Controls */}
        <div className="w-full max-w-xl">
          <div className="flex flex-col gap-6">
            {/* Track Info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{track.title}</h1>
              <p className="text-lg text-muted-foreground">{track.artist}</p>
              <p className="text-sm text-muted-foreground">{track.album}</p>
            </div>
            
            {/* Playback Slider */}
            <div className="space-y-2">
              <Slider
                value={[position]}
                max={100}
                step={1}
                onValueChange={(vals) => setPosition(vals[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{track.currentTime}</span>
                <span>{track.duration}</span>
              </div>
            </div>
            
            {/* Main Controls */}
            <div className="flex justify-center items-center gap-4 md:gap-6">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                size="icon"
                className="h-12 w-12 rounded-full bg-gold hover:bg-gold/90 text-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6 ml-0.5" />
                }
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Repeat className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? 
                  <VolumeX className="h-5 w-5" /> : 
                  <Volume2 className="h-5 w-5" />
                }
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(vals) => {
                  setVolume(vals[0]);
                  setIsMuted(vals[0] === 0);
                }}
                className="w-28 cursor-pointer"
              />
              
              <div className="ml-auto flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isLiked ? "text-gold" : "text-muted-foreground"}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ListMusic className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Learning Materials */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-gold" />
                    <div>
                      <h3 className="font-medium">Learning Materials</h3>
                      <p className="text-xs text-muted-foreground">View course resources and notes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Back Button */}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate(-1)}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Minimize Player
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Player;
