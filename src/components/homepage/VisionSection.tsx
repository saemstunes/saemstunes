import React from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';

const VisionSection = () => {
  const musicConnections = [
  { // Nairobi -> New York
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: 38.1343, lng: -74.0060 },
  },
  { // Nairobi -> London
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: 48.9289, lng: -0.1278 },
  },
  { // Nairobi -> Vitória (Brazil)
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: -22.8761, lng: -40.2958 },
  },
  { // Nairobi -> Cairo
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: 27.4659, lng: 31.2357 },
  },
  { // Nairobi -> Johannesburg
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: -28.7826, lng: 28.0473 },
  },
  { // Nairobi -> Abuja
    start: { lat: -3.8649, lng: 36.8172 },
    end:   { lat: 6.4980, lng: 7.3986 },
  },
  { // New York -> Morioka (Japan)
    start: { lat: 38.1343, lng: -74.0060 },
    end:   { lat: 37.1251, lng: 141.1527 },
  },
  { // London -> Sydney
    start: { lat: 48.9289, lng: -0.1278 },
    end:   { lat: -36.4473, lng: 151.2093 },
  },
  { // New Delhi -> Nairobi
    start: { lat: 26.0354, lng: 77.2090 },
    end:   { lat: -3.8649, lng: 36.8172 },
  },
  { // Stavanger -> Nairobi
    start: { lat: 56.3915, lng: 5.7331 },
    end:   { lat: -3.8649, lng: 36.8172 },
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            The <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vision</span>
          </h2>
        </div>
        
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto py-4 leading-relaxed">
          From the Behringer's of Nairobi to the Shure's of Morioka, from the Senheisser of Stavenger to the Neumann of Sydney - we provide a hub for the voices of the world where every note matters, every voice belongs, every rhythm tells His story through our own 
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
