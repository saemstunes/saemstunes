import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, User, Mic, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VideoCardWrapper from "@/components/videos/VideoCardWrapper";
import { mockVideos } from "@/data/mockData";
import ArtistCard from "./ArtistCard";
import { supabase } from "@/integrations/supabase/client";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

interface Artist {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  profile_image_url: string | null;
  specialties: string[] | null;
  social_links: Record<string, string> | null;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('id, slug, name, bio, profile_image_url, specialties, social_links')
          .limit(8);

        if (error) {
          console.error('Error fetching artists:', error);
          return;
        }

        if (data && Array.isArray(data)) {
          setArtists(data as unknown as Artist[]);
        }
      } catch (error) {
        console.error('Error during artist fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <Tabs defaultValue="music" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="music">
          <Music className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">General Lessons</span>
        </TabsTrigger>
        <TabsTrigger value="artists">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Cool Artists</span>
        </TabsTrigger>
        <TabsTrigger value="courses">
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">More On Music</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="music" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">Lessons from Around The World</h2>
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
            View All Classes
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="artists" className="pt-4">
  <h2 className="text-xl font-proxima font-semibold mb-4">Artists You Should Listen To</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {artists.map(artist => (
      <div key={artist.id} className="group relative">
        <ArtistCard 
          name={artist.name}
          role={artist.specialties?.join(', ') || 'Artist'}
          imageSrc={artist.profile_image_url || ''}
          slug={artist.slug} // Pass slug here
        />
        {artist.social_links && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
              onClick={(e) => {
                e.preventDefault();
                const firstLink = Object.values(artist.social_links)[0];
                if (firstLink) {
                  window.open(firstLink, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <ExternalLink className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </div>
    ))}
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
