
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockVideos } from "@/data/mockData";

const featuredContent = [
  {
    id: "featured1",
    title: "Advanced Music Production Techniques",
    description: "Learn professional music production techniques from industry experts",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    ctaText: "Watch Now",
    isPremium: true,
    category: "Production"
  },
  {
    id: "featured2",
    title: "Music Theory Masterclass",
    description: "Master music theory fundamentals with our comprehensive guide",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    ctaText: "Start Learning",
    isPremium: false,
    category: "Theory"
  },
  {
    id: "featured3",
    title: "Piano Performance Workshop",
    description: "Improve your piano technique with professional pianist Saem",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
    ctaText: "Join Workshop",
    isPremium: true,
    category: "Performance"
  }
];

const FeaturedCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
    setIsPlaying(false);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsPlaying(true), 10000);
  };
  
  const handleContentClick = (id: string, isPremium: boolean) => {
    if (isPremium) {
      navigate(`/payment?contentId=${id}`);
    } else {
      navigate(`/videos/${id}`);
    }
  };
  
  return (
    <div className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {featuredContent.map((item, index) => (
            <CarouselItem key={item.id}>
              <div 
                className={cn(
                  "relative overflow-hidden rounded-xl aspect-[21/9] w-full transition-all duration-500",
                  index === activeSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                )}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                  <div className="mb-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "bg-white/10 backdrop-blur-sm text-white border-white/20",
                        item.isPremium && "bg-gold/80 border-gold/30"
                      )}
                    >
                      {item.isPremium ? "Premium" : "Free"} • {item.category}
                    </Badge>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-proxima">{item.title}</h2>
                  
                  <p className="text-sm md:text-base text-white/80 mb-4 max-w-2xl line-clamp-2">
                    {item.description}
                  </p>
                  
                  <Button 
                    onClick={() => handleContentClick(item.id, item.isPremium)}
                    className={cn(
                      "mt-2",
                      item.isPremium ? "bg-gold hover:bg-gold-dark" : ""
                    )}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    {item.ctaText}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute z-10 bottom-4 right-4 flex gap-1 md:gap-2">
          <CarouselPrevious 
            onClick={() => handleSlideChange((activeSlide - 1 + featuredContent.length) % featuredContent.length)} 
            className="h-8 w-8 relative -translate-y-0 left-0 rounded-full"
          />
          <CarouselNext 
            onClick={() => handleSlideChange((activeSlide + 1) % featuredContent.length)}
            className="h-8 w-8 relative -translate-y-0 right-0 rounded-full" 
          />
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeSlide ? "bg-white w-6" : "bg-white/40 w-2"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedCarousel;
