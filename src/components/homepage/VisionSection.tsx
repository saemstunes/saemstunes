import React from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';
import { Globe } from 'lucide-react';

const VisionSection = () => {
  const musicConnections = [
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi (your base)
    end: { lat: 40.7128, lng: -74.006 }, // New York (global music hub)
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: 51.5074, lng: -0.1278 }, // London (music education)
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: -23.5505, lng: -46.6333 }, // São Paulo (Latin music)
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: -33.9249, lng: 18.4241 }, // Cape Town, South Africa
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: 9.0765, lng: 7.3986 }, // Abuja, Nigeria
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 39.7036, lng: 141.1527 }, // Morioka, Iwate, Japan
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney (worldwide)
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Back to Nairobi
  },
  {
    start: { lat: 58.9700, lng: 5.7331 }, // Stavanger, Norway
    end: { lat: -1.2921, lng: 36.8219 }, // Back to Nairobi
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
