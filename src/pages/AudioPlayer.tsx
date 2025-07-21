
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Heart, Share2, Download, Repeat, Shuffle
} from "lucide-react";

const AudioPlayer = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state, dispatch } = useAudioPlayer();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Get track from location state or audio player context
    const track = location.state?.track || state.currentTrack;
    setCurrentTrack(track);
    
    if (track && track.id === id) {
      // Track is already loaded in the audio player
      console.log('Track loaded:', track);
    }
  }, [id, location.state, state.currentTrack]);

  const handlePlayPause = () => {
    if (state.isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else {
      dispatch({ type: 'PLAY' });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS' });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT' });
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    dispatch({ type: 'SEEK', payload: seekTime });
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0] / 100;
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (currentTrack && navigator.share) {
      try {
        await navigator.share({
          title: currentTrack.name,
          text: `Listen to ${currentTrack.name} by ${currentTrack.artist}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  if (!currentTrack) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Track Not Found</h2>
            <p className="text-muted-foreground">The requested track could not be loaded.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
        <div className="max-w-4xl mx-auto">
          {/* Album Art and Track Info */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  {currentTrack.artwork ? (
                    <img 
                      src={currentTrack.artwork} 
                      alt={currentTrack.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Volume2 className="h-16 w-16" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{currentTrack.name}</h1>
                    <p className="text-xl text-muted-foreground">{currentTrack.artist}</p>
                    {currentTrack.album && (
                      <p className="text-lg text-muted-foreground">{currentTrack.album}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant={isLiked ? "default" : "outline"}
                      onClick={toggleLike}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button size="icon" variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <Button size="icon" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player Controls */}
          <Card>
            <CardContent className="p-6">
              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <Progress 
                  value={(state.currentTime / state.duration) * 100} 
                  className="cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    handleSeek([percent * state.duration]);
                  }}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(state.currentTime)}</span>
                  <span>{formatTime(state.duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button size="icon" variant="outline">
                  <Shuffle className="h-4 w-4" />
                </Button>
                
                <Button size="icon" variant="outline" onClick={handlePrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  className="h-16 w-16 rounded-full"
                  onClick={handlePlayPause}
                >
                  {state.isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                
                <Button size="icon" variant="outline" onClick={handleNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <Button size="icon" variant="outline">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 justify-center">
                <Volume2 className="h-4 w-4" />
                <div className="w-32">
                  <Progress 
                    value={state.volume * 100}
                    className="cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleVolumeChange([percent * 100]);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to format time
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default AudioPlayer;
