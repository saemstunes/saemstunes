
import React, { useState, useRef, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

const Player = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setShuffle] = useState(false);
  
  // Sample track data
  const track = {
    title: "Introduction to Vocal Techniques",
    artist: "Sarah Johnson",
    album: "Vocal Basics Course",
    duration: "4:32",
    currentTime: "1:35",
    coverArt: "/placeholder.svg",
    audioSrc: "/sample-audio.mp3" // This would be a real audio file
  };

  // Audio time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setPosition((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      }
    });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isRepeat]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          toast({
            title: "Playback Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive"
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setPosition(value[0]);
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSkipForward = () => {
    toast({
      title: "Next Track",
      description: "Playing next song in playlist",
    });
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      if (currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else {
        toast({
          title: "Previous Track",
          description: "Playing previous song in playlist",
        });
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Track removed from your favorites" : "Track saved to your favorites",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title} by ${track.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Track link copied to clipboard",
      });
    }
  };
  
  return (
    <MainLayout showMiniPlayer={false}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={track.audioSrc} preload="metadata" />
      
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
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Main Controls */}
            <div className="flex justify-center items-center gap-4 md:gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-muted-foreground ${isShuffle ? 'text-gold' : ''}`}
                onClick={() => setShuffle(!isShuffle)}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground"
                onClick={handleSkipBack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                size="icon"
                className="h-12 w-12 rounded-full bg-gold hover:bg-gold/90 text-white"
                onClick={togglePlay}
              >
                {isPlaying ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6 ml-0.5" />
                }
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground"
                onClick={handleSkipForward}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-muted-foreground ${isRepeat ? 'text-gold' : ''}`}
                onClick={() => setIsRepeat(!isRepeat)}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground"
                onClick={toggleMute}
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
                onValueChange={handleVolumeChange}
                className="w-28 cursor-pointer"
              />
              
              <div className="ml-auto flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isLiked ? "text-gold" : "text-muted-foreground"}
                  onClick={handleLike}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={() => navigate("/library")}
                >
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
                  <Button variant="outline" size="sm" onClick={() => navigate("/resources")}>View</Button>
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
