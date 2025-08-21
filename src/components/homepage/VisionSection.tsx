import React from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';
import { Globe } from 'lucide-react';

const VisionSection = () => {
  const musicConnections = [
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi (base)
    end: { lat: 40.7128, lng: -74.0060 }, // New York, USA
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, 
    end: { lat: 51.5072, lng: -0.1276 }, // London, UK
  },
  {
    start: { lat: -1.2921, lng: 36.8219 },
    end: { lat: -23.5505, lng: -46.6333 }, // São Paulo, Brazil
  },
  {
    start: { lat: -1.2921, lng: 36.8219 },
    end: { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
  },
  {
    start: { lat: -1.2921, lng: 36.8219 },
    end: { lat: -33.9249, lng: 18.4241 }, // Cape Town, South Africa
  },
  {
    start: { lat: -1.2921, lng: 36.8219 },
    end: { lat: 9.0765, lng: 7.3986 }, // Abuja, Nigeria
  },
  {
    start: { lat: 40.7128, lng: -74.0060 }, // New York
    end: { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan (instead of Morioka in ocean)
  },
  {
    start: { lat: 51.5072, lng: -0.1276 }, // London
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
  },
  {
    start: { lat: 28.6139, lng: 77.2090 }, // New Delhi, India
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
  {
    start: { lat: 59.9139, lng: 10.7522 }, // Oslo, Norway (instead of Stavanger, avoids ocean offset)
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
];

  return (
    <motion.section 
      className="py-12 sm:py-16 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto text-center px-4">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            The <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vision</span>
          </h2>
        </div>
        
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto py-4 leading-relaxed">
          Connecting musicians across continents. Where African rhythms meet global melodies, 
          and every student finds their voice in our worldwide community.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <WorldMap
          dots={musicConnections}
          lineColor="#d4af37" // Your gold theme color
        />
      </div>
    </motion.section>
  );
};

export default VisionSection;
