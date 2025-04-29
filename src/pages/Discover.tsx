
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import SearchBox from "@/components/discover/SearchBox";
import FeaturedBanner from "@/components/discover/FeaturedBanner";
import CategoryNavigation from "@/components/discover/CategoryNavigation";
import ContentTabs from "@/components/discover/ContentTabs";
import RecommendationSection from "@/components/discover/RecommendationSection";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("music");

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6" 
        {...pageTransition}
      >
        <div className="flex items-center justify-between">
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
        
        {/* Category Navigation */}
        <CategoryNavigation />

        {/* Tabs content section */}
        <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* New Recommendation Section */}
        <RecommendationSection />
      </motion.div>
    </MainLayout>
  );
};

export default Discover;
