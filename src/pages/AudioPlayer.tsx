
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import AudioPlayer from '@/components/media/AudioPlayer';

interface AudioTrack {
  id: string | number;
  src: string;
  name: string;
  artist?: string;
  artwork?: string;
  album?: string;
}

const AudioPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  // Get track data from navigation state or use default
  const trackData = location.state?.track || {
    id: 1,
    src: '/audio/sample.mp3',
    name: 'Sample Track',
    artist: 'Sample Artist',
    artwork: '/lovable-uploads/df415c9b-2546-4c87-9f13-b44439a1f4e4.png',
    album: 'Sample Album'
  };

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

  // Handle audio errors
  const handleAudioError = () => {
    setAudioError(true);
    toast({
      title: "Audio Error",
      description: "Unable to load the audio player. Please try refreshing the page.",
      variant: "destructive",
    });
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

                {/* Audio Player */}
                <div className="space-y-6">
                  {audioError ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Unable to load audio player</p>
                      <Button onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <AudioPlayer
                      src={trackData.src}
                      title={trackData.name}
                      artist={trackData.artist}
                      artwork={trackData.artwork}
                      className="bg-transparent border-0 shadow-none"
                      onError={handleAudioError}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AudioPlayerPage;
