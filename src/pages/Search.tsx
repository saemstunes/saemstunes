
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Simple search function to filter mock data
  const searchResults = mockVideos.filter((video) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      video.title.toLowerCase().includes(query) || 
      video.description.toLowerCase().includes(query) ||
      video.instructor.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query));
      
    if (activeTab === "all") return matchesQuery;
    if (activeTab === "beginner") return matchesQuery && video.level === "beginner";
    if (activeTab === "intermediate") return matchesQuery && video.level === "intermediate";
    if (activeTab === "advanced") return matchesQuery && video.level === "advanced";
    
    return false;
  });

  return (
    <MainLayout>
      <h1 className="text-3xl font-serif font-bold mb-6">Search</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for videos, resources, tutors..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {searchQuery ? (
            <>
              <p className="text-muted-foreground mb-4">
                {searchResults.length} results for "{searchQuery}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map(video => (
                  <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
                ))}
              </div>
              
              {searchResults.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-xl font-medium">No results found</h2>
                  <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Enter search terms to find videos, resources, tutors and more
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="beginner" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No beginner results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="intermediate" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No intermediate results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No advanced results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SearchPage;
