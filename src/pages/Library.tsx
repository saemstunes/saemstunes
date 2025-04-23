
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Library as LibraryIcon, BookOpen, Bookmark, Clock, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";

const Library = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");

  // Sample saved content data (would come from API in a real app)
  const savedVideos = mockVideos.slice(0, 4);
  
  const EmptyState = ({ title, description, icon: Icon }) => (
    <div className="text-center py-16">
      <div className="bg-muted/30 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      <Button 
        onClick={() => window.location.href = "/discover"}
        className="bg-gold hover:bg-gold-dark text-white"
      >
        Explore Content
      </Button>
    </div>
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold">Your Library</h1>
          {user && (
            <Button
              variant="outline"
              onClick={() => window.location.href = "/discover"}
              className="hidden sm:flex"
            >
              <Music className="mr-2 h-4 w-4" />
              Discover New Music
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="saved">
              <Bookmark className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="playlists">
              <LibraryIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Playlists</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="pt-4">
            {savedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Saved Content" 
                description="Start saving videos, lessons, and resources to access them quickly in your library."
                icon={Bookmark}
              />
            )}
          </TabsContent>
          
          <TabsContent value="courses" className="pt-4">
            <EmptyState 
              title="No Courses Yet" 
              description="Enroll in courses to track your progress and continue learning."
              icon={BookOpen}
            />
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <EmptyState 
              title="No Viewing History" 
              description="Your recently watched content will appear here."
              icon={Clock}
            />
          </TabsContent>
          
          <TabsContent value="playlists" className="pt-4">
            <EmptyState 
              title="No Playlists" 
              description="Create playlists to organize your favorite content."
              icon={LibraryIcon}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Library;
