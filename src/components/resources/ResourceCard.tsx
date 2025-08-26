// components/resources/ResourceCard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, FileText, Music, Video, Share, Bookmark, BookmarkCheck, Lock, Play, ImageIcon, Volume2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types/resource";
import { useAuth } from "@/context/AuthContext";

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
  onDownload?: (resource: Resource) => void;
  onBookmark?: (resource: Resource) => void;
  onView?: (resource: Resource) => void;
  isBookmarked?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  compact = false,
  onDownload,
  onBookmark,
  onView,
  isBookmarked = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const getResourceIcon = () => {
    switch (resource.category_name) {
      case "videos":
        return <Video className="h-5 w-5" />;
      case "infographics":
        return <ImageIcon className="h-5 w-5" />;
      case "audios":
        return <Volume2 className="h-5 w-5" />;
      case "documents":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getResourceTypeName = () => {
    switch (resource.category_name) {
      case "videos":
        return "Video";
      case "infographics":
        return "Infographic";
      case "audios":
        return "Audio";
      case "documents":
        return "Document";
      default:
        return "Resource";
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

  const handleView = () => {
    if (resource.is_locked && !userHasAccess()) {
      toast({
        title: "Premium Content",
        description: "Please subscribe to access this resource.",
        variant: "destructive",
      });
      return;
    }
    
    if (onView) {
      onView(resource);
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

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="w-20 h-20 bg-muted flex items-center justify-center relative">
            <img 
              src={resource.thumbnail_url} 
              alt={resource.title} 
              className="w-full h-full object-cover"
            />
            {resource.is_locked && !userHasAccess() && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          
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
                {getResourceTypeName()}
              </Badge>
              
              <Badge variant="secondary" className="text-xs capitalize">
                {resource.level}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="aspect-[4/3] w-full bg-muted relative">
        <img 
          src={resource.thumbnail_url} 
          alt={resource.title} 
          className="w-full h-full object-cover"
        />
        {resource.is_locked && !userHasAccess() && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white" />
          </div>
        )}
        
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground">
            {getResourceTypeName()}
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
        
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white capitalize">
            {resource.level}
          </Badge>
        </div>
        
        {resource.duration && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white">
              {resource.duration}
            </Badge>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full bg-gold text-white hover:bg-gold/90"
            onClick={handleView}
          >
            {resource.category_name === "videos" ? <Play className="h-6 w-6 ml-1" /> : <Eye className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
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
          <div className="text-xs text-muted-foreground">
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
        
        <Button variant="outline" size="icon" onClick={handleView}>
          <Eye className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
