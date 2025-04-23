
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MiniPlayerProps {
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  thumbnail?: string;
  onTogglePlay?: () => void;
  onExpand?: () => void;
}

const MiniPlayer = ({
  isPlaying = false,
  title = "Untitled Track",
  artist = "Unknown Artist",
  thumbnail = "/placeholder.svg",
  onTogglePlay = () => {},
  onExpand = () => {}
}: MiniPlayerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-[3.5rem] left-0 right-0 bg-card border-t border-border lg:hidden z-40 px-3 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center flex-1 min-w-0">
          <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
            <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium truncate">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8" 
            onClick={onTogglePlay}
          >
            {isPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8" 
            onClick={onExpand}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
