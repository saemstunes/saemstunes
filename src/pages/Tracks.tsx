import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import ChromaGrid from "@/components/tracks/ChromaGrid";

const Tracks = () => {
  return (
    <MainLayout>
      <motion.div
        className="space-y-8"
        {...pageTransition}
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-proxima font-bold">Featured Tracks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of musical tracks, each crafted to inspire and educate.
          </p>
        </div>
        
        <ChromaGrid 
          radius={260}
          damping={60}
          stiffness={200}
        />
      </div>
    </MainLayout>
  );
};

export default Tracks;
