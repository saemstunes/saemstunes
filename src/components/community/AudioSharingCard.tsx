
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Share, Heart, MessageCircle, MoreVertical, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AudioTrackProps {
  id: string;
  title: string;
  artist: string;
  artistImage: string;
  audioSrc: string;
  duration: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

const AudioSharingCard = ({ track }: { track: AudioTrackProps }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(track.isLiked || false);
  const [likes, setLikes] = useState(track.likes);
  const [audioElement] = useState(new Audio(track.audioSrc));
  const { toast } = useToast();

  const togglePlay = () => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback error",
          description: "Could not play the audio file",
          variant: "destructive"
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: isLiked ? "Track removed from your liked songs" : "Track added to your liked songs"
    });
  };

  const handleShare = () => {
    // Simulate sharing functionality
    toast({
      title: "Share options",
      description: "Sharing options would appear here"
    });
  };

  const handleComment = () => {
    // Simulate comment functionality
    toast({
      title: "Comments",
      description: "Comments section would appear here"
    });
  };

  // Clean up audio element on unmount
  React.useEffect(() => {
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  // Add ended event listener
  React.useEffect(() => {
    const handleEnded = () => setIsPlaying(false);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement]);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={track.artistImage} alt={track.artist} />
              <AvatarFallback>{track.artist[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm leading-none">{track.artist}</p>
              <p className="text-xs text-muted-foreground mt-1">Original Content</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center gap-3 mb-4 mt-1">
          <div 
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center",
              "bg-gradient-to-r from-gold/50 to-gold hover:from-gold hover:to-gold/80",
              "cursor-pointer transition-all"
            )}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{track.title}</h3>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <Music className="h-3 w-3" />
              <span>{track.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="h-10 bg-muted/30 rounded-md mb-3"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleLike}
            >
              <Heart 
                className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} 
              />
            </Button>
            <span className="text-xs font-medium">{likes}</span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 ml-2" 
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">{track.comments}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioSharingCard;
