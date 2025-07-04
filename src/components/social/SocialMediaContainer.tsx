
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Instagram, 
  Facebook, 
  Mail, 
  Heart, 
  ExternalLink,
  Headphones,
  Radio,
  Mic,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Custom Spotify icon
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.4c-.17.3-.57.4-.87.23-2.39-1.46-5.4-1.79-8.94-.98-.35.08-.7-.18-.78-.53-.08-.35.18-.7.53-.78 3.85-.88 7.22-.5 9.83 1.13.3.17.4.57.23.87v.06zm1.23-2.75c-.21.37-.66.49-1.04.28-2.73-1.68-6.9-2.16-10.13-1.18-.42.13-.86-.11-.99-.53-.13-.42.11-.86.53-.99 3.7-1.13 8.32-.6 11.35 1.38.38.21.5.66.28 1.04zm.11-2.87C14.25 8 8.47 7.81 4.95 8.84c-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.07-1.19 10.42-.96 14.51 1.34.44.25.59.81.34 1.25-.25.44-.81.59-1.25.34l-.02-.01z"/>
  </svg>
);

// Apple Music icon
const AppleMusicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.14H5.866c-.53.005-1.051.047-1.565.14-.674.121-1.304.353-1.878.727-1.118.733-1.863 1.732-2.18 3.043-.175.72-.24 1.452-.24 2.19v11.991c0 .738.065 1.47.24 2.189.317 1.312 1.062 2.312 2.18 3.044.574.374 1.204.606 1.878.727.514.093 1.035.135 1.565.14h12.27c.526-.005 1.047-.047 1.564-.14.673-.121 1.303-.353 1.577-.727 1.118-.732 1.863-1.732 2.18-3.044.175-.719.24-1.451.24-2.189V6.124z"/>
  </svg>
);

interface Platform {
  name: string;
  icon: React.ComponentType<any>;
  url: string;
  color: string;
  description: string;
  followers?: string;
  category: 'social' | 'music' | 'contact';
}

const SocialMediaContainer: React.FC = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);

  // Audio visualization effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioVisualization(Array.from({ length: 8 }, () => Math.random() * 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const platforms: Platform[] = [
    {
      name: 'Spotify',
      icon: SpotifyIcon,
      url: 'https://open.spotify.com/artist/6oMbcOwuuETAvO51LesbO8',
      color: '#1DB954',
      description: 'Stream our original compositions',
      followers: '2.5K',
      category: 'music'
    },
    {
      name: 'Apple Music',
      icon: AppleMusicIcon,
      url: 'https://music.apple.com/ca/artist/saems-tunes/1723336566',
      color: '#FA2C56',
      description: 'Listen on Apple Music',
      followers: '1.8K',
      category: 'music'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/saemstunes',
      color: '#E1306C',
      description: 'Daily music tips & inspiration',
      followers: '15.2K',
      category: 'social'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      url: 'https://tiktok.com/@saemstunes',
      color: '#000000',
      description: 'Quick music tutorials',
      followers: '8.7K',
      category: 'social'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/saemstunes',
      color: '#1877F2',
      description: 'Community & live sessions',
      followers: '5.1K',
      category: 'social'
    },
    {
      name: 'Contact',
      icon: Mail,
      url: '/contact-us',
      color: '#A67C00',
      description: 'Get in touch with us',
      category: 'contact'
    }
  ];

  const categories = {
    music: { name: 'Stream Our Music', icon: Headphones, color: 'text-gold' },
    social: { name: 'Follow Our Journey', icon: Users, color: 'text-blue-500' },
    contact: { name: 'Connect With Us', icon: Mail, color: 'text-green-500' }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const platformVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.section 
      className="py-8 sm:py-12 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={containerVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Music className="h-8 w-8 text-gold" />
              {/* Audio visualization bars */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-end gap-0.5 h-6">
                {audioVisualization.map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gold/60 rounded-full"
                    style={{ height: `${Math.max(height * 0.3, 10)}%` }}
                    animate={{ height: `${Math.max(height * 0.3, 10)}%` }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Join Our <span className="text-gold">Musical Community</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Connect with Saem's Tunes across all platforms for the latest updates, 
            exclusive content, and musical inspiration
          </p>
        </motion.div>

        {/* Platforms by Category */}
        <div className="space-y-8">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryPlatforms = platforms.filter(p => p.category === categoryKey);
            
            return (
              <motion.div 
                key={categoryKey}
                className="space-y-4"
                variants={containerVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <categoryInfo.icon className={`h-5 w-5 ${categoryInfo.color}`} />
                  <h3 className="text-lg font-semibold">{categoryInfo.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPlatforms.map((platform) => (
                    <motion.div
                      key={platform.name}
                      variants={platformVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredPlatform(platform.name)}
                      onHoverEnd={() => setHoveredPlatform(null)}
                    >
                      <Card className="group relative overflow-hidden cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="p-3 rounded-xl transition-colors duration-300"
                              style={{ 
                                backgroundColor: hoveredPlatform === platform.name 
                                  ? `${platform.color}20` 
                                  : 'rgba(166, 124, 0, 0.1)' 
                              }}
                            >
                              <platform.icon 
                                className="h-6 w-6 transition-colors duration-300"
                                style={{ 
                                  color: hoveredPlatform === platform.name 
                                    ? platform.color 
                                    : '#A67C00' 
                                }}
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{platform.name}</h4>
                                {platform.followers && (
                                  <Badge variant="secondary" className="text-xs">
                                    {platform.followers}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {platform.description}
                              </p>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(platform.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Hover overlay */}
                          <AnimatePresence>
                            {hoveredPlatform === platform.name && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none"
                              />
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-8 p-6 bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl"
          variants={containerVariants}
        >
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Follow us on your favorite platforms to never miss new releases, tutorials, and exclusive content
          </p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              Join thousands of music lovers worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SocialMediaContainer;
