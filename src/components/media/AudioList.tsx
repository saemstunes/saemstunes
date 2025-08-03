
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Music, 
  Clock, 
  MoreHorizontal, 
  Download,
  Share2,
  Heart,
  HeartOff,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AudioPlayer from './AudioPlayer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
  artwork?: string;
}

interface AudioListProps {
  tracks: AudioTrack[];
  className?: string;
  onTrackSelect?: (track: AudioTrack) => void;
}

const AudioList: React.FC<AudioListProps> = ({
  tracks,
  className,
  onTrackSelect
}) => {
  const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTrackSelect = (track: AudioTrack) => {
    if (activeTrack?.id === track.id) {
      setActiveTrack(null);
    } else {
      setActiveTrack(track);
      if (onTrackSelect) {
        onTrackSelect(track);
      }
    }
  };

  const toggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (favorites.includes(trackId)) {
      setFavorites(favorites.filter(id => id !== trackId));
      toast({
        title: "Removed from favorites",
        description: "Track removed from your favorites"
      });
    } else {
      setFavorites([...favorites, trackId]);
      toast({
        title: "Added to favorites",
        description: "Track added to your favorites"
      });
    }
  };

  const handleDownload = (track: AudioTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = track.src;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Downloading "${track.title}"`
    });
  };

  const handleShare = (track: AudioTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title} by ${track.artist} on Saem's Tunes`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Share",
        description: "Sharing is not supported on this browser"
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        {tracks.map(track => (
          <div 
            key={track.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-md hover:bg-accent cursor-pointer transition-colors",
              activeTrack?.id === track.id && "bg-accent"
            )}
            onClick={() => handleTrackSelect(track)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative h-10 w-10 flex-shrink-0">
                {track.artwork ? (
                  <img 
                    src={track.artwork} 
                    alt={track.title} 
                    className="h-10 w-10 rounded object-cover" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <Music className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                
                {activeTrack?.id === track.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                    {activeTrack && <Pause className="h-5 w-5 text-white" />}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                <Clock className="h-3 w-3" />
                {formatTime(track.duration)}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={(e) => toggleFavorite(track.id, e)}
              >
                {favorites.includes(track.id) ? (
                  <Heart className="h-4 w-4 fill-gold text-gold" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleDownload(track, e)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleShare(track, e)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Playlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => toggleFavorite(track.id, e)}>
                    {favorites.includes(track.id) ? (
                      <>
                        <HeartOff className="h-4 w-4 mr-2" />
                        Remove from Favorites
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Add to Favorites
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      
      {activeTrack && (
        <AudioPlayer 
          src={activeTrack.src}
          title={activeTrack.title}
          artist={activeTrack.artist}
          artwork={activeTrack.artwork}
          autoPlay={true}
          onEnded={() => setActiveTrack(null)}
        />
      )}
    </div>
  );
};

export default AudioList;
