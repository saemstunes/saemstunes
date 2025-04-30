
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Music, Mic } from "lucide-react";

const RecommendationSection = () => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-proxima font-semibold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white/80" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1">Getting Started with Music Theory</h3>
            <p className="text-sm text-muted-foreground">Perfect for beginners looking to understand the fundamentals of music.</p>
            <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Explore</Button>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="h-12 w-12 text-white/80" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1">Top 10 Easy Guitar Songs</h3>
            <p className="text-sm text-muted-foreground">Learn these popular songs to impress your friends and family.</p>
            <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Start Learning</Button>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Mic className="h-12 w-12 text-white/80" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1">Vocal Warm-up Techniques</h3>
            <p className="text-sm text-muted-foreground">Protect your voice and improve your vocal range with these exercises.</p>
            <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Watch Tutorial</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationSection;
