
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SearchBox from '@/components/discover/SearchBox';
import CategoryNavigation from '@/components/discover/CategoryNavigation';
import ContentTabs from '@/components/discover/ContentTabs';
import RecommendationSection from '@/components/discover/RecommendationSection';
import { supabase } from '@/integrations/supabase/client';
import EnhancedFeaturedBanner from "@/components/discover/EnhancedFeaturedBanner";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'resources', label: 'Resources' },
  ];

  useEffect(() => {
    fetchContent();
  }, [selectedCategory]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch video content instead of videos table
      const { data: videosData, error: videosError } = await supabase
        .from('video_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;

      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (tracksError) throw tracksError;

      setVideos(videosData || []);
      setTracks(tracksData || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || video.category === selectedCategory)
  );

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || track.category === selectedCategory)
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover</h1>
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            category={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <EnhancedFeaturedBanner />

        <CategoryNavigation 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ContentTabs 
          videos={filteredVideos}
          tracks={filteredTracks}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        <RecommendationSection 
          videos={filteredVideos}
          tracks={filteredTracks}
        />
      </div>
    </MainLayout>
  );
};

export default Discover;
