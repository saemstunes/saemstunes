
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import MainLayout from "@/components/layout/MainLayout";
import TiltedCard from "@/components/tracks/TiltedCard";
import ChromaGrid from "@/components/tracks/ChromaGrid";

const Tracks = () => {
  return (
    <MainLayout>
      <motion.div className="space-y-8" {...pageTransition}>
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">
            Music <span className="text-gold">Showcase</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our featured tracks and discover new musical experiences
          </p>
        </div>

        {/* ChromaGrid Section */}
        <div className="w-full" style={{ height: '600px' }}>
          <ChromaGrid />
        </div>

        {/* Tilted Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <TiltedCard
            imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
            altText="Kendrick Lamar - GNX Album Cover"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={true}
          />
          
          <TiltedCard
            imageSrc="https://picsum.photos/300/300?random=2"
            altText="Featured Track 2"
            captionText="Amazing Music Track"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={15}
            scaleOnHover={1.1}
            showMobileWarning={false}
            showTooltip={true}
          />
          
          <TiltedCard
            imageSrc="https://picsum.photos/300/300?random=3"
            altText="Featured Track 3"
            captionText="Melodic Harmony"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={10}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
          />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Tracks;
