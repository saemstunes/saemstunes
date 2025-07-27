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
import { getImageUrl } from '@/lib/urlUtils'; // Add this import

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
    const audioUrl = getImageUrl(track.audio_path); // Use helper

    const audioTrack = {
      id: track.id,
      src: audioUrl,
      name: track.title,
      artist: track.artist || 'Unknown Artist',
      artwork: track.cover_path ? getImageUrl(track.cover_path) : '/placeholder.svg',
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
    <div className={cn("space-y-2 w-full", className)}>
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 w-full",
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
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center",
              "transition-all duration-200"
            )}>
              {track.cover_path ? (
                <ResponsiveImage
                  src={getImageUrl(track.cover_path)} // Use helper
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
              )}
            </div>
            
            {/* Play/Pause Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center",
              "transition-opacity duration-200 rounded-full",
              hoveredTrack === track.id || isCurrentTrack(track.id) ? "opacity-100" : "opacity-0"
            )}>
              {isPlaying(track.id) ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className={cn(
              "font-medium text-xs sm:text-sm truncate",
              isCurrentTrack(track.id) && "text-primary"
            )}>
              {track.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {track.artist || 'Unknown Artist'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <PlaylistActions trackId={track.id} />
            
            <Button
              variant="ghost"
              size="xs"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite toggle
              }}
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem className="text-xs">
                  <Plus className="h-3 w-3 mr-2" />
                  Add to Queue
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <Heart className="h-3 w-3 mr-2" />
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
