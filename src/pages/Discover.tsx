import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import SearchBox from "@/components/discover/SearchBox";
import EnhancedFeaturedBanner from "@/components/discover/EnhancedFeaturedBanner";
import CategoryNavigation from "@/components/ui/CategoryNavigation";
import ContentTabs from "@/components/discover/ContentTabs";
import RecommendationSection from "@/components/discover/RecommendationSection";
import { supabase } from "@/integrations/supabase/client";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("music");
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
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('approved', true)
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

  // Force dropdown menus to appear on top by adding a container with higher z-index
  useEffect(() => {
    if (!document.getElementById('portal-dropdown-container')) {
      const dropdownContainer = document.createElement('div');
      dropdownContainer.id = 'portal-dropdown-container';
      dropdownContainer.style.position = 'fixed';
      dropdownContainer.style.top = '0';
      dropdownContainer.style.left = '0';
      dropdownContainer.style.width = '100%';
      dropdownContainer.style.height = '100%';
      dropdownContainer.style.pointerEvents = 'none';
      dropdownContainer.style.zIndex = '999';
      document.body.appendChild(dropdownContainer);
    }
    
    return () => {
      const container = document.getElementById('portal-dropdown-container');
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6" 
        {...pageTransition}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-proxima font-bold">Discover</h1>
            <p className="text-muted-foreground mt-1">
              Explore curated content from across the musical world
            </p>
          </div>
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            category={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        {/* Enhanced featured content banner */}
        <EnhancedFeaturedBanner />
        
        {/* Category Navigation */}
        <CategoryNavigation 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Tabs content section */}
        <ContentTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          videos={filteredVideos}
          tracks={filteredTracks}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        {/* Recommendation Section */}
        <RecommendationSection 
          videos={filteredVideos}
          tracks={filteredTracks}
        />
      </motion.div>
    </MainLayout>
  );
};

export default Discover;
