import React from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';
import { Globe } from 'lucide-react';

const VisionSection = () => {
  const musicConnections = [
  { // Nairobi -> New York
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: 40.7128, lng: -74.0060 },
  },
  { // Nairobi -> London
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: 51.5074, lng: -0.1278 },
  },
  { // Nairobi -> Vitória (Brazil)  ⟵ matches the east-coast dot (not São Paulo)
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: -20.2976, lng: -40.2958 },
  },
  { // Nairobi -> Cairo
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: 30.0444, lng: 31.2357 },
  },
  { // Nairobi -> Johannesburg  ⟵ inland SA dot (not Cape Town)
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: -26.2041, lng: 28.0473 },
  },
  { // Nairobi -> Abuja
    start: { lat: -1.2864, lng: 36.8172 },
    end:   { lat: 9.0765, lng: 7.3986 },
  },
  { // New York -> Morioka (Japan)  ⟵ north Honshu dot
    start: { lat: 40.7128, lng: -74.0060 },
    end:   { lat: 39.7036, lng: 141.1527 },
  },
  { // London -> Sydney
    start: { lat: 51.5074, lng: -0.1278 },
    end:   { lat: -33.8688, lng: 151.2093 },
  },
  { // New Delhi -> Nairobi
    start: { lat: 28.6139, lng: 77.2090 },
    end:   { lat: -1.2864, lng: 36.8172 },
  },
  { // Stavanger -> Nairobi  ⟵ west-coast Norway dot
    start: { lat: 58.9700, lng: 5.7331 },
    end:   { lat: -1.2864, lng: 36.8172 },
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
