
import React from 'react';
import { Play, Pause, X, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { cn } from '@/lib/utils';

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const GlobalMiniPlayer: React.FC = () => {
  const { state, pauseTrack, resumeTrack, seek, clearPlayer, clearError, playTrack } = useAudioPlayer();

  if (!state.currentTrack) return null;

  const handlePlayPause = () => {
    if (state.error) {
      // If there's an error, try to restart the track
      clearError();
      if (state.currentTrack) {
        playTrack(state.currentTrack, state.lastPlayedTime);
      }
      return;
    }

    if (state.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleProgressChange = (values: number[]) => {
    if (!state.error && state.duration > 0) {
      seek(values[0]);
    }
  };

  const handleClose = () => {
    clearPlayer();
  };

  const handleRetry = () => {
    clearError();
    if (state.currentTrack) {
      playTrack(state.currentTrack, state.lastPlayedTime);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg",
      "lg:bottom-4 lg:left-4 lg:right-4 lg:rounded-lg lg:border lg:max-w-md lg:mx-auto"
    )}>
      <div className="p-3">
        {/* Error State */}
        {state.error && (
          <div className="mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">{state.error}</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto h-6 px-2 text-xs"
                onClick={handleRetry}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Track Info */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
              <img 
                src={state.currentTrack.artwork || '/placeholder.svg'} 
                alt={state.currentTrack.name} 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{state.currentTrack.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {state.currentTrack.artist}
                {state.isLoading && " • Loading..."}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={handlePlayPause}
              disabled={state.isLoading}
            >
              {state.error ? (
                <RotateCcw className="h-4 w-4" />
              ) : state.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 space-y-1">
          <Slider 
            value={[state.currentTime]}
            max={state.duration || 100} 
            step={0.1}
            onValueChange={handleProgressChange}
            className={cn("h-1", state.error && "opacity-50")}
            disabled={Boolean(state.error) || state.isLoading || state.duration === 0}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom nav spacing */}
      <div className="h-16 lg:hidden" />
    </div>
  );
};

export default GlobalMiniPlayer;
