
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Heart, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MusicFactProps {
  fact: string;
  isOnline: boolean;
}

const MusicFactDisplay: React.FC<MusicFactProps> = ({ fact, isOnline }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [closed, setClosed] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset state when fact changes
    setLiked(false);
    setSaved(false);
    setClosed(false);
  }, [fact]);
  
  if (closed) return null;
  
  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast({
        title: "Fact Liked!",
        description: "We'll show you more facts like this.",
      });
    }
  };
  
  const handleSave = () => {
    setSaved(!saved);
    if (!saved) {
      toast({
        title: "Fact Saved!",
        description: "You can find this in your saved collection.",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
    >
      <Card className="max-w-md mx-4 shadow-xl border-gold/30 bg-card/95 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-gold" />
              </div>
              <span className="font-medium text-lg">
                {isOnline ? "Did you know?" : "Music Fact"}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => setClosed(true)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <motion.p 
            className="text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {fact}
          </motion.p>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full ${saved ? 'text-gold' : ''}`}
              onClick={handleSave}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
          
          {!isOnline && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              You're currently offline. Connect to the internet for fresh facts.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MusicFactDisplay;
