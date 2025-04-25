
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ExclusiveItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  isLocked?: boolean;
}

const ExclusiveCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample exclusive content
  const exclusiveItems: ExclusiveItem[] = [
    {
      id: "ex1",
      title: "Master Class: Advanced Guitar Techniques",
      description: "Learn advanced techniques from Saem's top instructor. Explore fingerstyle, tapping, and more.",
      image: "/placeholder.svg",
      link: "/videos/exclusive-1",
      isLocked: true
    },
    {
      id: "ex2",
      title: "Vocal Performance Secrets",
      description: "Professional tips for improving your vocal range, tone, and stage presence.",
      image: "/placeholder.svg",
      link: "/videos/exclusive-2",
      isLocked: true
    },
    {
      id: "ex3",
      title: "Music Production Masterclass",
      description: "Learn to produce professional tracks from home with industry-standard techniques.",
      image: "/placeholder.svg",
      link: "/videos/exclusive-3",
      isLocked: true
    }
  ];

  // Auto-advance the carousel
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % exclusiveItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, exclusiveItems.length]);

  const handlePrevious = () => {
    setAutoPlay(false);
    setCurrent(prev => (prev === 0 ? exclusiveItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrent(prev => (prev + 1) % exclusiveItems.length);
  };

  const handleItemClick = (item: ExclusiveItem) => {
    if (item.isLocked && (!user || !user.subscribed)) {
      navigate('/payment', { 
        state: { 
          service: { title: item.title },
          returnUrl: item.link
        } 
      });
      return;
    }
    navigate(item.link);
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10 rounded-xl"></div>
      
      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/50 hover:bg-black/70 text-white" 
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/50 hover:bg-black/70 text-white" 
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Carousel Content */}
      <div className="relative w-full h-80">
        <AnimatePresence mode="wait">
          {exclusiveItems.map((item, index) => (
            current === index && (
              <motion.div 
                key={item.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <Badge className="bg-gold text-white mb-2">EXCLUSIVE</Badge>
                    <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-white/90 mb-4 line-clamp-2">{item.description}</p>
                    
                    <Button
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "bg-gold hover:bg-gold-dark text-white",
                        item.isLocked && (!user || !user.subscribed) ? "pl-3" : "pl-4"
                      )}
                    >
                      {item.isLocked && (!user || !user.subscribed) ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock Premium
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {exclusiveItems.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              current === index ? "bg-gold" : "bg-white/50"
            )}
            onClick={() => {
              setAutoPlay(false);
              setCurrent(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ExclusiveCarousel;
