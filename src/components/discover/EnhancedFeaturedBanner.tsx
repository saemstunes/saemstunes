
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  isExternal?: boolean;
}

const featuredItems: FeaturedItem[] = [
  {
    id: '1',
    title: "How 'Salama' Was Written",
    description: "Explore the intricacy of co-writing with Simali a song heard in Machakos, written in Eldoret and recorded in Nairobi",
    image: "https://i.imgur.com/5PLIYGQ.jpeg",
    link: "/videos/v1"
  },
  {
    id: '2',
    title: "Behind the Music: Creative Process",
    description: "Dive deep into the creative journey of modern songwriting and production techniques",
    image: "https://i.imgur.com/VfKXMyG.png",
    link: "/resources"
  },
  {
    id: '3',
    title: "Artist Spotlight: Rising Stars",
    description: "Discover emerging artists making waves in the music industry",
    image: "https://i.imgur.com/LJQDADg.jpeg",
    link: "/artists"
  },
  {
    id: '4',
    title: "We're building a Music Library"",
    decscription: "From quizzes and courses to offline resources and exclusive lessons — the Library is your hub for structured, engaging, and fun music learning.",
    image: "https://i.imgur.com/wLMm6QD.jpeg",
    link: "/library",
  }
];

const EnhancedFeaturedBanner = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleItemClick = (item: FeaturedItem) => {
    if (item.isExternal) {
      window.open(item.link, '_blank');
    } else {
      navigate(item.link);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const currentItem = featuredItems[currentIndex];

  return (
    <div 
      className="relative rounded-lg overflow-hidden h-48 md:h-64 mb-8 group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => handleItemClick(currentItem)}
        drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.offset.x < -50) {
              goToNext(); // swipe left → next
            } else if (info.offset.x > 50) {
              goToPrevious(); // swipe right → previous
            }
          }}
          >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
          <img 
            src={currentItem.image} 
            alt={currentItem.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-end">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit"
            >
              FEATURED
            </motion.div>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-proxima text-white font-bold mb-1"
            >
              {currentItem.title}
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm md:text-base max-w-lg"
            >
              {currentItem.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white" : "bg-white/50"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedFeaturedBanner;
