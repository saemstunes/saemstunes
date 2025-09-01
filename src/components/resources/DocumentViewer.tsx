// components/resources/DocumentViewer.tsx
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Download, Play, Pause, RotateCcw, Music, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types/resource";
import { useAuth } from "@/context/AuthContext";

interface DocumentViewerProps {
  resource: Resource;
  onClose?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  resource,
  onClose
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock document pages for demonstration
  const totalPages = 8;
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };
  
  const handleResetZoom = () => {
    setZoomLevel(100);
  };
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Playback Error",
            description: "Could not play the audio. Please try again.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handlePageChange = (value: number[]) => {
    setCurrentPage(value[0]);
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded.`,
    });
  };
  
  const userHasAccess = () => {
    if (!user) return false;
    
    switch (resource.access_level) {
      case 'free':
        return true;
      case 'auth':
        return !!user;
      case 'basic':
        return user.subscriptionTier === 'basic' || user.subscriptionTier === 'premium' || user.subscriptionTier === 'professional';
      case 'premium':
        return user.subscriptionTier === 'premium' || user.subscriptionTier === 'professional';
      case 'professional':
        return user.subscriptionTier === 'professional';
      default:
        return false;
    }
  };

  if (resource.is_locked && !userHasAccess()) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Premium Content</CardTitle>
          <CardDescription className="text-center">
            Please subscribe to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button className="bg-gold hover:bg-gold/90 text-white">
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Document navigation and controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm w-12 text-center">{zoomLevel}%</span>
            
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handleResetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            
            {/* Audio playback for music sheets */}
            {resource.category_name === "documents" && resource.subject_category.includes("Music") && (
              <Button variant="outline" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"} Audio
              </Button>
            )}
          </div>
        </div>
        
        {/* Page navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <div className="w-48">
              <Slider
                value={[currentPage]}
                min={1}
                max={totalPages}
                step={1}
                onValueChange={handlePageChange}
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        
        {/* Document content */}
        <div className="border rounded-lg p-4 bg-muted/20 min-h-[500px] flex items-center justify-center">
          <div 
            className="bg-white p-6 shadow-inner w-full h-full overflow-auto"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Mock document content based on resource type */}
            {resource.category_name === "documents" && (
              <div className="text-center">
                <div className="mb-6">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold mt-2">{resource.title}</h3>
                  <p className="text-muted-foreground">{resource.description}</p>
                </div>
                
                {resource.subject_category.includes("Music") && (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium mb-4">Sheet Music Preview</h4>
                    <div className="bg-white border rounded p-4 inline-block">
                      <div className="flex items-center justify-center mb-2">
                        <Music className="h-6 w-6 mr-2" />
                        <span className="font-mono text-lg">C - G - Am - F</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>4/4 Time Signature</p>
                        <p>Key of C Major</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-left max-w-md mx-auto">
                      <p className="font-medium">Playing Tips:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Maintain a steady rhythm throughout</li>
                        <li>Focus on smooth transitions between chords</li>
                        <li>Use a metronome to practice timing</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden audio element for music sheets */}
        {resource.category_name === "documents" && resource.subject_category.includes("Music") && (
          <audio ref={audioRef} src="/api/placeholder-audio/30" />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
