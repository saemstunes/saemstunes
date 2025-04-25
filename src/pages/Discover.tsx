
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import VideoCard from "@/components/videos/VideoCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";
import { mockVideos } from "@/data/mockData";
import FeaturedCarousel from "@/components/discovery/FeaturedCarousel";

const Discover = () => {
  const navigate = useNavigate();
  
  // Group videos by categories
  const categories = {
    trending: mockVideos.slice(0, 4),
    vocals: mockVideos.slice(4, 8),
    instruments: mockVideos.slice(8, 12),
    production: mockVideos.slice(0, 4).map(v => ({...v, category: "Production"})),
  };
  
  const CategorySection = ({ title, viewAllLink, videos }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button 
          variant="link"
          className="text-gold"
          onClick={() => navigate(viewAllLink)}
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
        ))}
      </div>
    </div>
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-proxima">Discover</h1>
          <p className="text-muted-foreground">
            Explore our catalog of music lessons, tutorials and resources
          </p>
        </div>
        
        {/* Feature Carousel (similar to Library) */}
        <FeaturedCarousel />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="vocals">Vocals</TabsTrigger>
            <TabsTrigger value="instruments">Instruments</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            <CategorySection 
              title="Trending Now" 
              viewAllLink="/videos?category=trending" 
              videos={categories.trending} 
            />
            
            <CategorySection 
              title="Vocal Techniques" 
              viewAllLink="/videos?category=vocals" 
              videos={categories.vocals} 
            />
            
            <CategorySection 
              title="Instrument Tutorials" 
              viewAllLink="/videos?category=instruments" 
              videos={categories.instruments} 
            />
            
            <CategorySection 
              title="Music Production" 
              viewAllLink="/videos?category=production" 
              videos={categories.production} 
            />
          </TabsContent>
          
          <TabsContent value="trending">
            <CategorySection 
              title="Trending Now" 
              viewAllLink="/videos?category=trending" 
              videos={categories.trending} 
            />
          </TabsContent>
          
          <TabsContent value="vocals">
            <CategorySection 
              title="Vocal Techniques" 
              viewAllLink="/videos?category=vocals" 
              videos={categories.vocals} 
            />
          </TabsContent>
          
          <TabsContent value="instruments">
            <CategorySection 
              title="Instrument Tutorials" 
              viewAllLink="/videos?category=instruments" 
              videos={categories.instruments} 
            />
          </TabsContent>
          
          <TabsContent value="production">
            <CategorySection 
              title="Music Production" 
              viewAllLink="/videos?category=production" 
              videos={categories.production} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discover;
