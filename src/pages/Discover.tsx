
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Compass, Search, Music, Mic, User } from "lucide-react";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("music");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-proxima font-bold">Discover</h1>
            <p className="text-muted-foreground mt-1">
              Explore curated content from across the musical world
            </p>
          </div>
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for music, courses, artists..." 
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Featured content banner */}
        <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-gold/30 to-gold-dark/30 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
          <img 
            src="/placeholder.svg" 
            alt="Featured content" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-end">
            <div className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit">
              FEATURED
            </div>
            <h3 className="text-xl md:text-2xl font-proxima text-white font-bold mb-1">
              Discover Top Music Schools Around the World
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Explore the institutions that have produced the world's greatest musicians
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="music" className="w-full" onValueChange={setActiveTab}>
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
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="artists" className="pt-4">
            <h2 className="text-xl font-proxima font-semibold mb-4">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Artist cards would go here */}
              <div className="rounded-lg overflow-hidden shadow-md bg-card">
                <img src="/placeholder.svg" alt="Artist" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <h3 className="font-bold">John Williams</h3>
                  <p className="text-sm text-muted-foreground">Film Composer</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md bg-card">
                <img src="/placeholder.svg" alt="Artist" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <h3 className="font-bold">Alicia Keys</h3>
                  <p className="text-sm text-muted-foreground">Singer-Songwriter</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md bg-card">
                <img src="/placeholder.svg" alt="Artist" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <h3 className="font-bold">Hans Zimmer</h3>
                  <p className="text-sm text-muted-foreground">Composer</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md bg-card">
                <img src="/placeholder.svg" alt="Artist" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <h3 className="font-bold">Yo-Yo Ma</h3>
                  <p className="text-sm text-muted-foreground">Cellist</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="pt-4">
            <h2 className="text-xl font-proxima font-semibold mb-4">External Educational Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.filter(v => v.category === "Vocal Development").slice(0, 4).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discover;
