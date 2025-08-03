import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface PlaylistCardProps {
  playlist: any;
  onSelect: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect }) => {
  const navigate = useNavigate();
  const { setPlaylist, playTrack } = useAudioPlayer();

  const handlePlayPlaylist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Fetch playlist tracks
      const tracks = await fetchPlaylistTracks(playlist.id);
      if (tracks.length > 0) {
        setPlaylist(tracks);
        playTrack(tracks[0]);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  return (
    <div 
      className="group relative border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/playlists/${playlist.id}`)}
    >
      <div className="aspect-square bg-muted relative">
        {/* Placeholder for playlist cover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted border border-background" />
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlayPlaylist}
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold truncate">{playlist.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {playlist.description || 'No description'}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {playlist.play_count || 0} plays
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
