
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, User, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VideoCardWrapper from "@/components/videos/VideoCardWrapper";
import { mockVideos } from "@/data/mockData";
import ArtistCard from "./ArtistCard";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  return (
    <Tabs defaultValue="music" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="music">
          <Music className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Music</span>
        </TabsTrigger>
        <TabsTrigger value="artists">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Artists</span>
        </TabsTrigger>
        <TabsTrigger value="courses">
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">External Courses</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="music" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">Popular Music Worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockVideos.slice(0, 8).map(video => (
            <VideoCardWrapper 
              key={video.id} 
              video={video} 
              onClick={() => navigate(`/videos/${video.id}`)}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/videos')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Music
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="artists" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">Featured Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Artist cards */}
          <ArtistCard 
            name="John Williams"
            role="Film Composer"
            imageSrc="/placeholder.svg"
            onClick={() => navigate('/artist/john-williams')}
          />
          <ArtistCard 
            name="Alicia Keys"
            role="Singer-Songwriter"
            imageSrc="/placeholder.svg"
            onClick={() => navigate('/artist/alicia-keys')}
          />
          <ArtistCard 
            name="Hans Zimmer"
            role="Composer"
            imageSrc="/placeholder.svg"
            onClick={() => navigate('/artist/hans-zimmer')}
          />
          <ArtistCard 
            name="Yo-Yo Ma"
            role="Cellist"
            imageSrc="/placeholder.svg"
            onClick={() => navigate('/artist/yo-yo-ma')}
          />
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/artists')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Artists
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="courses" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">External Educational Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockVideos.filter(v => v.category === "Vocal Development").slice(0, 4).map(video => (
            <VideoCardWrapper 
              key={video.id} 
              video={video} 
              onClick={() => navigate(`/videos/${video.id}`)}
              isPremium
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/courses')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Courses
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
