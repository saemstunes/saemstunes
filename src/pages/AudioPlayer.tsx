
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Audio, formatTime, useVisualizerFrame } from '@sina_byn/re-audio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  ArrowLeft,
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

interface AudioTrack {
  id: string | number;
  src: string;
  name: string;
  artist?: string;
  artwork?: string;
  album?: string;
}

const AudioVisualizer = () => {
  const frame = useVisualizerFrame(32);

  return (
    <div className="flex justify-center items-end gap-1 h-24 px-4">
      {frame.map((f, index) => (
        <div
          key={index}
          style={{ height: `${Math.max((f / 255) * 100, 5)}%` }}
          className="w-1.5 bg-gradient-to-t from-gold to-gold/40 rounded-t-full transition-all duration-75"
        />
      ))}
    </div>
  );
};

const AudioPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  
  // Get track data from navigation state or use default
  const trackData = location.state?.track || {
    id: 1,
    src: '/audio/sample.mp3',
    name: 'Sample Track',
    artist: 'Sample Artist',
    artwork: '/lovable-uploads/df415c9b-2546-4c87-9f13-b44439a1f4e4.png',
    album: 'Sample Album'
  };

  const playlist: AudioTrack[] = [trackData];

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `Track ${isLiked ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trackData.name} by ${trackData.artist}`,
        text: `Listen to ${trackData.name} on Saem's Tunes`,
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
    <>
      <Helmet>
        <title>{`${trackData.name} - Audio Player - Saem's Tunes`}</title>
        <meta name="description" content={`Listen to ${trackData.name} by ${trackData.artist}`} />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Now Playing</h1>
            </div>

            <Audio playlist={playlist} defaultVolume={75}>
              {({
                loading,
                playing,
                togglePlay,
                duration,
                currentTime,
                volume,
                setVolume,
                setCurrentTime,
                muted,
                toggleMuted,
                repeat,
                setRepeat,
                shuffle,
                toggleShuffle,
              }) => (
                <Card className="overflow-hidden bg-gradient-to-b from-card to-card/80 border-gold/20 shadow-2xl">
                  <CardContent className="p-8">
                    {/* Album Artwork and Info */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                      {/* Artwork */}
                      <div className="flex-shrink-0 mx-auto lg:mx-0">
                        <div className="relative group">
                          <img
                            src={trackData.artwork}
                            alt={trackData.name}
                            className="w-80 h-80 rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>

                      {/* Track Info */}
                      <div className="flex flex-col justify-center space-y-6 flex-1 text-center lg:text-left">
                        <div>
                          <h2 className="text-4xl font-bold mb-3 text-foreground">{trackData.name}</h2>
                          <p className="text-2xl text-muted-foreground mb-2">{trackData.artist}</p>
                          {trackData.album && (
                            <p className="text-lg text-muted-foreground/80">{trackData.album}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleLike}
                            className={cn(
                              "h-12 w-12",
                              isLiked ? "text-red-500" : "text-muted-foreground"
                            )}
                          >
                            <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="h-6 w-6" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Audio Visualizer */}
                    <div className="mb-8 bg-gradient-to-r from-gold/10 to-transparent rounded-xl p-6">
                      <AudioVisualizer />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-8">
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={1}
                        onValueChange={(values) => setCurrentTime(values[0])}
                        className="w-full cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration || 0)}</span>
                      </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                          "h-12 w-12",
                          shuffle ? "text-gold" : "text-muted-foreground"
                        )}
                      >
                        <Shuffle className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-muted-foreground hover:text-foreground"
                        disabled
                      >
                        <SkipBack className="h-6 w-6" />
                      </Button>

                      <Button
                        size="icon"
                        onClick={togglePlay}
                        disabled={loading}
                        className="h-20 w-20 bg-gold hover:bg-gold/90 text-white shadow-lg shadow-gold/25"
                      >
                        {loading ? (
                          <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : playing ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-muted-foreground hover:text-foreground"
                        disabled
                      >
                        <SkipForward className="h-6 w-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRepeat(repeat === 'track' ? 'playlist' : 'track')}
                        className={cn(
                          "h-12 w-12 relative",
                          repeat === 'track' ? "text-gold" : "text-muted-foreground"
                        )}
                      >
                        <Repeat className="h-5 w-5" />
                        {repeat === 'track' && (
                          <span className="absolute -top-1 -right-1 text-xs bg-gold text-white rounded-full w-5 h-5 flex items-center justify-center">
                            1
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMuted}
                        className="h-10 w-10 text-muted-foreground hover:text-foreground"
                      >
                        {muted || volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                      
                      <div className="w-32">
                        <Slider
                          value={[muted ? 0 : volume]}
                          max={100}
                          step={1}
                          onValueChange={(values) => {
                            setVolume(values[0]);
                            if (values[0] > 0 && muted) toggleMuted();
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-sm text-muted-foreground w-10 text-center">
                        {Math.round(muted ? 0 : volume)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </Audio>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AudioPlayerPage;
