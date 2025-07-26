
import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { PlaylistActions } from '@/components/playlists/PlaylistActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist?: string;
  cover_path?: string;
  audio_path: string;
  description?: string;
  created_at: string;
}

interface EnhancedAnimatedListProps {
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
  className?: string;
}

const EnhancedAnimatedList: React.FC<EnhancedAnimatedListProps> = ({
  tracks,
  onTrackSelect,
  className
}) => {
  const { state, playTrack, pauseTrack } = useAudioPlayer();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handleTrackPlay = async (track: Track) => {
    const audioUrl = track.audio_path.startsWith('http') 
      ? track.audio_path 
      : `https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/${track.audio_path}`;

    const audioTrack = {
      id: track.id,
      src: audioUrl,
      name: track.title,
      artist: track.artist || 'Unknown Artist',
      artwork: track.cover_path || '/placeholder.svg',
    };

    if (state?.currentTrack?.id === track.id && state?.isPlaying) {
      pauseTrack();
    } else {
      playTrack(audioTrack);
      onTrackSelect?.(track);
    }
  };

  const isCurrentTrack = (trackId: string) => state?.currentTrack?.id === trackId;
  const isPlaying = (trackId: string) => isCurrentTrack(trackId) && state?.isPlaying;

  return (
    <div className={cn("space-y-2", className)}>
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full",
            "hover:bg-accent/50 group cursor-pointer",
            isCurrentTrack(track.id) && "bg-accent/30"
          )}
          onMouseEnter={() => setHoveredTrack(track.id)}
          onMouseLeave={() => setHoveredTrack(null)}
          onClick={() => handleTrackPlay(track)}
        >
          {/* Play/Pause Button */}
          <div className="relative flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center",
              "transition-all duration-200"
            )}>
              {track.cover_path ? (
                <ResponsiveImage
                  src={track.cover_path}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            {/* Play/Pause Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center",
              "transition-opacity duration-200 rounded-lg",
              hoveredTrack === track.id || isCurrentTrack(track.id) ? "opacity-100" : "opacity-0"
            )}>
              {isPlaying(track.id) ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-sm truncate",
              isCurrentTrack(track.id) && "text-primary"
            )}>
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {track.artist || 'Unknown Artist'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <PlaylistActions trackId={track.id} />
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite toggle
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Queue
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedAnimatedList;
