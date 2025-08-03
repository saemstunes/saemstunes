
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  ChevronDown,
  ChevronUp,
  Heart,
  MoreHorizontal
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes example
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  // Mock track data
  const currentTrack = {
    title: "Sample Track",
    artist: "Sample Artist",
    album: "Sample Album",
    artwork: "/placeholder.svg"
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  
  const toggleRepeat = () => {
    setRepeatMode(prev => (prev + 1) % 3);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  return (
    <>
      <Helmet>
        <title>Player - Saem's Tunes</title>
        <meta name="description" content="Music player interface for Saem's Tunes" />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
          <div className="max-w-4xl mx-auto">
            {/* Main Player Card */}
            <Card className={cn(
              "transition-all duration-300 ease-in-out",
              isMinimized ? "h-24" : "min-h-[600px]"
            )}>
              <CardContent className="p-6">
                {!isMinimized ? (
                  // Full Player View
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Now Playing</h1>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMinimized(true)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Album Artwork and Track Info */}
                    <div className="flex flex-col lg:flex-row gap-8 flex-1">
                      {/* Artwork */}
                      <div className="flex-shrink-0 mx-auto lg:mx-0">
                        <div className="relative">
                          <img
                            src={currentTrack.artwork}
                            alt={currentTrack.title}
                            className="w-80 h-80 rounded-xl shadow-2xl object-cover"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>

                      {/* Track Info and Controls */}
                      <div className="flex flex-col justify-center space-y-6 flex-1">
                        {/* Track Info */}
                        <div className="text-center lg:text-left">
                          <h2 className="text-3xl font-bold mb-2">{currentTrack.title}</h2>
                          <p className="text-xl text-muted-foreground mb-1">{currentTrack.artist}</p>
                          <p className="text-lg text-muted-foreground/80">{currentTrack.album}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <Slider
                            value={[currentTime]}
                            max={duration}
                            step={1}
                            onValueChange={handleProgressChange}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Main Controls */}
                        <div className="flex items-center justify-center gap-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleShuffle}
                            className={cn(
                              "h-10 w-10",
                              isShuffled ? "text-gold" : "text-muted-foreground"
                            )}
                          >
                            <Shuffle className="h-5 w-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                          >
                            <SkipBack className="h-6 w-6" />
                          </Button>

                          <Button
                            size="icon"
                            onClick={togglePlay}
                            className="h-16 w-16 bg-gold hover:bg-gold/90 text-white"
                          >
                            {isPlaying ? (
                              <Pause className="h-8 w-8" />
                            ) : (
                              <Play className="h-8 w-8 ml-1" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                          >
                            <SkipForward className="h-6 w-6" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleRepeat}
                            className={cn(
                              "h-10 w-10",
                              repeatMode > 0 ? "text-gold" : "text-muted-foreground"
                            )}
                          >
                            <Repeat className="h-5 w-5" />
                            {repeatMode === 2 && (
                              <span className="absolute -top-1 -right-1 text-xs bg-gold text-white rounded-full w-4 h-4 flex items-center justify-center">
                                1
                              </span>
                            )}
                          </Button>
                        </div>

                        {/* Secondary Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleLike}
                              className={cn(
                                "h-8 w-8",
                                isLiked ? "text-red-500" : "text-muted-foreground"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Volume Control */}
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleMute}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                            <Slider
                              value={[isMuted ? 0 : volume]}
                              max={100}
                              step={1}
                              onValueChange={handleVolumeChange}
                              className="w-20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Minimized Player View - Focus on the audio
                  <div className="flex items-center gap-4 h-12">
                    <img
                      src={currentTrack.artwork}
                      alt={currentTrack.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlay}
                            className="h-8 w-8"
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMinimized(false)}
                            className="h-8 w-8"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Now Playing Bar - Positioned above bottom navigation */}
        <div className="fixed bottom-20 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 shadow-lg z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-10 h-10 rounded object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-8 w-8"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="w-20 hidden sm:block">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleProgressChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Player;
