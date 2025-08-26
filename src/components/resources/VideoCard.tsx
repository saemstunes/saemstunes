// components/resources/VideoCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Lock, Download, Bookmark, BookmarkCheck, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types/resource";
import { useAuth } from "@/context/AuthContext";

interface VideoCardProps {
  resource: Resource;
  onDownload?: (resource: Resource) => void;
  onBookmark?: (resource: Resource) => void;
  onPlay?: (resource: Resource) => void;
  isBookmarked?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  resource,
  onDownload,
  onBookmark,
  onPlay,
  isBookmarked = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePlay = () => {
    if (resource.is_locked && !userHasAccess()) {
      toast({
        title: "Premium Content",
        description: "Please subscribe to access this video.",
        variant: "destructive",
      });
      return;
    }
    
    if (onPlay) {
      onPlay(resource);
    }
  };

  const handleDownload = () => {
    if (resource.is_locked && !userHasAccess()) {
      toast({
        title: "Premium Content",
        description: "This is premium content. Please subscribe to download.",
        variant: "destructive",
      });
      return;
    }
    
    if (onDownload) {
      onDownload(resource);
    } else {
      toast({
        title: "Downloaded",
        description: `${resource.title} has been saved to your device.`,
      });
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(resource);
    } else {
      toast({
        title: isBookmarked ? "Removed from library" : "Added to library",
        description: isBookmarked 
          ? `${resource.title} has been removed from your library.` 
          : `${resource.title} has been added to your library.`,
      });
    }
  };

  const userHasAccess = () => {
    if (!user) return false;
    
    switch (resource.access_level) {
      case 'free':
        return true;
      case 'auth':
        return !!user;
      case 'basic':
        return user.subscription_tier === 'basic' || user.subscription_tier === 'premium' || user.subscription_tier === 'professional';
      case 'premium':
        return user.subscription_tier === 'premium' || user.subscription_tier === 'professional';
      case 'professional':
        return user.subscription_tier === 'professional';
      default:
        return false;
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={resource.thumbnail_url} 
          alt={resource.title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-105"
          )} 
        />
        
        {resource.is_locked && !userHasAccess() && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white" />
            <Badge className="absolute top-4 right-4 bg-gold">Premium</Badge>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            size="lg" 
            className="h-16 w-16 rounded-full bg-gold text-white hover:bg-gold/90 transition-all"
            onClick={handlePlay}
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white capitalize">
            {resource.level}
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-gold hover:text-white"
            onClick={handleBookmark}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
        
        {resource.duration && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white">
              {resource.duration}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="bg-muted/50">
            {resource.subject_category}
          </Badge>
          {resource.tags && resource.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {tag}
            </Badge>
          ))}
          {resource.tags && resource.tags.length > 2 && (
            <Badge variant="outline" className="bg-transparent border-none">
              +{resource.tags.length - 2}
            </Badge>
          )}
        </div>
        
        {resource.instructor && (
          <div className="text-sm text-muted-foreground">
            Instructor: <span className="font-medium">{resource.instructor}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          onClick={handleDownload}
          className={cn("flex-1", resource.is_locked && !userHasAccess() ? "bg-muted" : "bg-gold hover:bg-gold/90 text-white")}
          disabled={resource.is_locked && !userHasAccess()}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button variant="outline" size="icon" onClick={handlePlay}>
          <Play className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
