
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Music2, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  caption: string;
  media_url: string;
  thumbnail_url?: string;
  likes_count: number;
  comments_count: number;
  permalink: string;
  timestamp: string;
}

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with actual API calls
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      caption: 'New acoustic cover coming soon! 🎸✨ #AcousticVibes #NewMusic',
      media_url: 'https://i.imgur.com/VfKXMyG.png',
      likes_count: 245,
      comments_count: 18,
      permalink: 'https://instagram.com/p/example1',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      platform: 'tiktok',
      caption: 'Behind the scenes of our latest recording session 🎵',
      media_url: 'https://i.imgur.com/6yr8BpG.jpeg',
      thumbnail_url: 'https://i.imgur.com/6yr8BpG.jpeg',
      likes_count: 1.2,
      comments_count: 34,
      permalink: 'https://tiktok.com/@saemstunes/video/example2',
      timestamp: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      platform: 'instagram',
      caption: 'Grateful for all the love on our latest release! 🙏❤️ #ThankYou',
      media_url: 'https://i.imgur.com/LJQDADg.jpeg',
      likes_count: 189,
      comments_count: 12,
      permalink: 'https://instagram.com/p/example3',
      timestamp: '2024-01-13T09:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      // In real implementation, call Instagram Basic Display API and TikTok API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const formatLikes = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Music2 className="h-5 w-5 text-gold" />
          Latest from Our Socials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Music2 className="h-5 w-5 text-gold" />
          Latest from Our Socials
        </h3>
        <Button variant="outline" size="sm" asChild>
          <a href="https://instagram.com/saemstunes" target="_blank" rel="noopener noreferrer">
            Follow Us
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <ResponsiveImage
                  src={post.thumbnail_url || post.media_url}
                  alt="Social media post"
                  width={300}
                  height={300}
                  mobileWidth={280}
                  mobileHeight={280}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-black/60 rounded-full p-1">
                    {post.platform === 'instagram' ? (
                      <Instagram className="h-4 w-4 text-white" />
                    ) : (
                      <Music2 className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                  {formatTimestamp(post.timestamp)}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm mb-3 line-clamp-3">{post.caption}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatLikes(post.likes_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments_count}
                    </span>
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaFeed;
