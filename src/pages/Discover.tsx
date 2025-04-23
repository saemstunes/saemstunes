
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Compass, Search, Music, Mic } from "lucide-react";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("music");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold">Discover</h1>
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for music, courses, artists..." 
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <Tabs defaultValue="music" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="music">
              <Music className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="courses">
              <Mic className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="artists">
              <Compass className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Artists</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="music" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.slice(0, 8).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.filter(v => v.category === "Vocal Development").slice(0, 4).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="artists" className="pt-4">
            <div className="text-center py-12">
              <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Artist Directory Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on bringing you profiles of talented music instructors and artists.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discover;
