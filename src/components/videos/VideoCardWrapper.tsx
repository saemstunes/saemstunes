
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  instructor: string;
  level: string;
  category: string;
  isLocked?: boolean;
}

interface VideoCardWrapperProps {
  video: Video;
  onClick?: () => void;
  isPremium?: boolean;
  className?: string;
}

const VideoCardWrapper: React.FC<VideoCardWrapperProps> = ({
  video,
  onClick,
  isPremium = false,
  className
}) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleClick = () => {
    // Check if user has access - using profile.role as proxy for subscription
    const hasAccess = !isPremium && !video.isLocked || (profile && (profile.role === 'admin' || profile.role === 'tutor'));
    
    if ((isPremium || video.isLocked) && !hasAccess) {
      navigate("/subscriptions");
      return;
    }
    
    if (onClick) {
      onClick();
    } else {
      navigate(`/videos/${video.id}`);
    }
  };

  const isLocked = isPremium || video.isLocked;
  const canAccess = !isLocked || (profile && (profile.role === 'admin' || profile.role === 'tutor'));

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay for locked content */}
        {!canAccess && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <Badge className="bg-gold text-white">Premium</Badge>
            </div>
          </div>
        )}
        
        {/* Play button overlay */}
        {canAccess && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="h-6 w-6 text-foreground fill-current" />
            </div>
          </div>
        )}
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2 text-sm leading-5">{video.title}</h3>
          <p className="text-xs text-muted-foreground">{video.instructor}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize">
              {video.level}
            </Badge>
            <span className="text-xs text-muted-foreground">{video.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCardWrapper;
