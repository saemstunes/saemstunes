
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import SearchBox from "@/components/discover/SearchBox";
import FeaturedBanner from "@/components/discover/FeaturedBanner";
import ContentTabs from "@/components/discover/ContentTabs";
import RecommendationSection from "@/components/discover/RecommendationSection";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("music");

  // Force dropdown menus to appear on top by adding a container with higher z-index
  useEffect(() => {
    // Add the global container for dropdowns if it doesn't exist
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
    
    // Remove the container when the component unmounts
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
          <SearchBox />
        </div>
        
        {/* Featured content banner */}
        <FeaturedBanner />
        
        {/* Tabs content section */}
        <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* New Recommendation Section */}
        <RecommendationSection />
      </motion.div>
    </MainLayout>
  );
};

export default Discover;
