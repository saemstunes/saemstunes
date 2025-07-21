
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Plus, Share2, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistActionsProps {
  playlistId: string;
  onPlay?: () => void;
  onAddToPlaylist?: () => void;
  onShare?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
}

export const PlaylistActions: React.FC<PlaylistActionsProps> = ({
  playlistId,
  onPlay,
  onAddToPlaylist,
  onShare,
  onToggleLike,
  isLiked = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Playlist action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => handleAction(onPlay || (() => {}))}
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90"
      >
        <Play className="h-4 w-4 mr-1" />
        Play
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction(onToggleLike || (() => {}))}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
      </Button>

      <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAction(onAddToPlaylist || (() => {}))}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Playlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(onShare || (() => {}))}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PlaylistActions;
