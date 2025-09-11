import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons for navigation

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

  const statements = [
    "Rooted in humble beginnings, we equip learners everywhere to grow in music, serve their communities and give back - all to the glory of God.",
    "From simple beginnings to a global vision, Saem's Tunes equips learners to grow, serve and give back through music and ministry.",
    "Saem's Tunes is a global home for learners - pushing what's possible in music, shaping lives, serving communities and lifting every voice to God."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate statements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statements.length);
    }, 7500);
    
    return () => clearInterval(interval);
  }, [statements.length]);

  const nextStatement = () => {
    setCurrentIndex((prev) => (prev + 1) % statements.length);
  };

  const prevStatement = () => {
    setCurrentIndex((prev) => (prev - 1 + statements.length) % statements.length);
  };

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
        
        {/* Statement Carousel */}
        <div className="relative max-w-2xl mx-auto py-4 min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: 200 }}   // enter from right
              animate={{ opacity: 1, x: 0 }}     // center
              exit={{ opacity: 0, x: -200 }}     // leave left
              transition={{ duration: 0.8 }}
              className="text-sm md:text-lg text-muted-foreground leading-relaxed absolute px-2 text-center"
            >
              {statements[currentIndex]}
            </motion.p>
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevStatement}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Previous statement"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextStatement}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Next statement"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Indicator Dots */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {statements.map((_, index) => (
               <motion.button
                 key={index}
                 onClick={() => setCurrentIndex(index)}
                 className="h-2 w-2 rounded-full"
                 aria-label={`Go to statement ${index + 1}`}
                 animate={{
                   scale: index === currentIndex ? 1.4 : 1,     // enlarge active dot
                   backgroundColor: index === currentIndex ? "#d4af37" : "#d1d5db" // gold vs muted
                     }}
                 transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.8 }}
                 />
            ))}
          </div>
        </div>
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
export { VisionSection };
