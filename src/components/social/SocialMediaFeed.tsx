
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Music2, Play, Heart, MessageCircle, Share, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  link: string;
  timestamp: string;
}

const SocialMediaFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instagram' | 'tiktok'>('instagram');

  // TODO: Replace with actual API data when social media APIs are integrated
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      thumbnail: 'https://i.imgur.com/VfKXMyG.png',
      caption: 'New acoustic cover of "Pale Ulipo" - the emotion in this one hits different 🎸✨',
      likes: 324,
      comments: 47,
      link: 'https://www.instagram.com/saemstunes',
      timestamp: '2h'
    },
    {
      id: '2', 
      platform: 'instagram',
      thumbnail: 'https://i.imgur.com/6yr8BpG.jpeg',
      caption: 'Behind the scenes: Recording "I Need You More" in the home studio 🎵',
      likes: 256,
      comments: 32,
      link: 'https://www.instagram.com/saemstunes',
      timestamp: '1d'
    },
    {
      id: '3',
      platform: 'tiktok',
      thumbnail: 'https://i.imgur.com/LJQDADg.jpeg',
      caption: 'When the chorus hits just right 🔥 #NiHai #OriginalMusic',
      likes: 1247,
      comments: 89,
      link: 'https://www.tiktok.com/@saemstunes',
      timestamp: '3h'
    }
  ];

  const filteredPosts = mockPosts.filter(post => post.platform === activeTab).slice(0, 3);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Music2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Latest Updates</h2>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'instagram' | 'tiktok')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="flex items-center gap-2">
            <Music2 className="h-4 w-4" />
            TikTok
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instagram">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiktok">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-6">
        <Button 
          variant="outline" 
          className="group"
          onClick={() => window.open(
            activeTab === 'instagram' 
              ? 'https://www.instagram.com/saemstunes' 
              : 'https://www.tiktok.com/@saemstunes', 
            '_blank'
          )}
        >
          Follow on {activeTab === 'instagram' ? 'Instagram' : 'TikTok'}
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};

const PostCard: React.FC<{ post: SocialPost; index: number }> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative">
          <img
            src={post.thumbnail}
            alt="Social media post"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Button
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black"
              onClick={() => window.open(post.link, '_blank')}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
            <span className="text-white text-xs">{post.timestamp}</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <p className="text-sm line-clamp-2 mb-3">{post.caption}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {post.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.comments}
              </span>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Check out this post from Saem\'s Tunes',
                    url: post.link
                  });
                } else {
                  navigator.clipboard.writeText(post.link);
                }
              }}
            >
              <Share className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SocialMediaFeed;
