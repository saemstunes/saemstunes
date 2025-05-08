
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, FileText, Music, Video, Share, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type ResourceType = "sheet_music" | "tutorial" | "article" | "audio" | "video" | "chord_chart";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  thumbnail?: string;
  fileSize?: string;
  dateAdded: string;
  tags: string[];
  premium: boolean;
  downloadUrl?: string;
  views: number;
  author: string;
  offline?: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
  onDownload?: (resource: Resource) => void;
  onBookmark?: (resource: Resource) => void;
  isBookmarked?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  compact = false,
  onDownload,
  onBookmark,
  isBookmarked = false
}) => {
  const { toast } = useToast();
  
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "sheet_music":
        return <Music className="h-5 w-5" />;
      case "tutorial":
        return <Video className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "chord_chart":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getResourceTypeName = (type: ResourceType) => {
    switch (type) {
      case "sheet_music":
        return "Sheet Music";
      case "tutorial":
        return "Tutorial";
      case "article":
        return "Article";
      case "audio":
        return "Audio";
      case "video":
        return "Video";
      case "chord_chart":
        return "Chord Chart";
      default:
        return "Resource";
    }
  };

  const handleDownload = () => {
    if (resource.premium) {
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

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          {resource.thumbnail ? (
            <div className="w-20 h-20 bg-muted">
              <img 
                src={resource.thumbnail} 
                alt={resource.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-muted flex items-center justify-center">
              {getResourceIcon(resource.type)}
            </div>
          )}
          
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm line-clamp-1">{resource.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
              </div>
              
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleBookmark}>
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-gold" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-xs">
                {getResourceTypeName(resource.type)}
              </Badge>
              
              {resource.offline && (
                <Badge variant="secondary" className="text-xs">
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {resource.thumbnail ? (
        <div className="aspect-[4/3] w-full bg-muted relative">
          <img 
            src={resource.thumbnail} 
            alt={resource.title} 
            className="w-full h-full object-cover"
          />
          {resource.premium && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-gold">Premium</Badge>
            </div>
          )}
          {resource.offline && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary">Available Offline</Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center relative">
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
            {getResourceIcon(resource.type)}
          </div>
          {resource.premium && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-gold">Premium</Badge>
            </div>
          )}
          {resource.offline && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary">Available Offline</Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleBookmark}>
            {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-gold" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="bg-transparent border-none">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{resource.author}</span>
          <span>{resource.dateAdded}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          onClick={handleDownload}
          className={cn("flex-1", resource.premium ? "bg-muted" : "bg-gold hover:bg-gold/90 text-white")}
          disabled={resource.premium && !resource.offline}
        >
          <Download className="mr-2 h-4 w-4" />
          {resource.offline ? "Save Offline" : "Download"}
        </Button>
        
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
