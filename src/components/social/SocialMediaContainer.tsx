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
  Users,
  Star,
  TrendingUp,
  Radio,
  Play,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  category: 'music' | 'social' | 'contact';
  engagement?: string;
  growth?: string;
}

const SocialMediaContainer: React.FC = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'music' | 'social' | 'contact'>('all');
  const isMobile = useIsMobile();

  // Enhanced audio visualization effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioVisualization(Array.from({ length: 24 }, () => Math.random() * 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const platforms: Platform[] = [
    {
      name: 'Spotify',
      icon: SpotifyIcon,
      url: 'https://open.spotify.com/artist/6oMbcOwuuETAvO51LesbO8',
      color: '#1DB954',
      description: 'Stream our original compositions and curated playlists',
      followers: '2.5K',
      growth: '+12%',
      category: 'music',
      engagement: '94% monthly listeners'
    },
    {
      name: 'Apple Music',
      icon: AppleMusicIcon,
      url: 'https://music.apple.com/ca/artist/saems-tunes/1723336566',
      color: '#FA2C56',
      description: 'Listen to our full catalog and exclusive releases',
      followers: '1.8K',
      growth: '+8%',
      category: 'music',
      engagement: 'Top 10 Gospel'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/saemstunes',
      color: '#E1306C',
      description: 'Daily music tips, behind-the-scenes, and inspiration',
      followers: '15.2K',
      growth: '+22%',
      category: 'social',
      engagement: '2.5K avg. likes'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      url: 'https://tiktok.com/@saemstunes',
      color: '#000000',
      description: 'Quick music tutorials and viral content',
      followers: '8.7K',
      growth: '+35%',
      category: 'social',
      engagement: '45K monthly views'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/saemstunes',
      color: '#1877F2',
      description: 'Community hub with live sessions and events',
      followers: '5.1K',
      growth: '+18%',
      category: 'social',
      engagement: 'Weekly live streams'
    },
    {
      name: 'Contact',
      icon: Mail,
      url: '/contact-us',
      color: '#A67C00',
      description: 'Get in touch for collaborations and inquiries',
      category: 'contact',
      engagement: '24h response time'
    }
  ];

  const categories = {
    music: { name: 'Streaming', icon: Headphones, color: 'text-gold' },
    social: { name: 'Social', icon: Users, color: 'text-blue-400' },
    contact: { name: 'Connect', icon: Mail, color: 'text-green-400' }
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15
      }
    },
    hover: {
      scale: isMobile ? 1 : 1.03,
      y: isMobile ? 0 : -3,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20
      }
    }
  };

  // Filter platforms based on active category
  const filteredPlatforms = activeCategory === 'all' 
    ? platforms 
    : platforms.filter(p => p.category === activeCategory);

  return (
    <motion.section 
      className="py-12 sm:py-16 bg-gradient-to-br from-background to-muted w-full overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-[0.03] dark:opacity-[0.03] bg-foreground"
            style={{
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container px-4 sm:px-6 w-full max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 w-full relative"
          variants={containerVariants}
        >
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <Badge 
              className="bg-gold/10 text-gold px-4 py-1.5 mb-3 font-medium rounded-lg border border-gold/20"
              variant="secondary"
            >
              Join The Community
            </Badge>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-600 dark:to-amber-300">
                Connect
              </span>{' '}
              <span className="text-foreground">with Saem's Tunes</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-base sm:text-lg">
              Follow us across platforms for exclusive content, behind-the-scenes, and musical inspiration
            </p>
          </div>
        </motion.div>

        {/* Live Activity Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 bg-card/80 dark:bg-card/90 backdrop-blur-md rounded-full px-5 py-3 border border-gold/20 shadow-sm">
            <div className="relative flex">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-sm text-foreground">Live on Instagram Stories</span>
            <Badge className="bg-gold/10 text-gold text-xs border border-gold/20">Now</Badge>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
        >
          {[
            { icon: Users, label: 'Total Followers', value: '32.3K', change: '+12%', color: 'bg-blue-400/10', text: 'text-blue-400' },
            { icon: Play, label: 'Monthly Plays', value: '156K', change: '+28%', color: 'bg-purple-400/10', text: 'text-purple-400' },
            { icon: Heart, label: 'Engagement Rate', value: '8.4%', change: '+5%', color: 'bg-rose-400/10', text: 'text-rose-400' },
            { icon: TrendingUp, label: 'Growth', value: '+2.1K', change: 'This month', color: 'bg-green-400/10', text: 'text-green-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.color} backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm`}
              whileHover={{ 
                y: isMobile ? 0 : -4,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-background">
                  <stat.icon className={`h-5 w-5 ${stat.text}`} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="font-bold text-xl">{stat.value}</div>
                <Badge variant="outline" className="text-xs bg-background">
                  {stat.change}
                </Badge>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          variants={containerVariants}
        >
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className={cn(
              "rounded-full px-5 py-2 border border-gold/20",
              activeCategory === 'all' ? 'bg-gold/10 text-gold' : 'bg-transparent'
            )}
            onClick={() => setActiveCategory('all')}
          >
            All Platforms
          </Button>
          
          {Object.entries(categories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'outline'}
              className={cn(
                "rounded-full px-5 py-2 flex items-center gap-2 border",
                activeCategory === key 
                  ? `bg-${key === 'music' ? 'gold' : key === 'social' ? 'blue-400' : 'green-400'}/10 text-foreground border-transparent` 
                  : 'bg-transparent border-border'
              )}
              onClick={() => setActiveCategory(key as any)}
            >
              <category.icon className={`h-4 w-4 ${category.color}`} />
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Social Platform Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-full"
          variants={containerVariants}
        >
          {filteredPlatforms.map((platform) => (
            <motion.div
              key={platform.name}
              variants={platformVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredPlatform(platform.name)}
              onHoverEnd={() => setHoveredPlatform(null)}
              className="w-full max-w-full"
            >
              <Card className="group relative overflow-hidden cursor-pointer h-full bg-card backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-start gap-4 h-full">
                    <div 
                      className={cn(
                        "p-3 rounded-lg transition-all duration-300 flex-shrink-0 group-hover:scale-110",
                        `bg-${platform.category === 'music' ? 'gold' : platform.category === 'social' ? 'blue-400' : 'green-400'}/10`
                      )}
                    >
                      <platform.icon 
                        className="h-7 w-7 transition-colors duration-300"
                        style={{ color: platform.color }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h4 className="font-bold text-lg">{platform.name}</h4>
                        {platform.followers && (
                          <Badge 
                            className={cn(
                              "text-xs flex-shrink-0 bg-background border",
                              platform.category === 'music' ? 'border-gold/30' : 
                              platform.category === 'social' ? 'border-blue-400/30' : 
                              'border-green-400/30'
                            )}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {platform.followers}
                            {platform.growth && (
                              <span className="text-green-500 ml-1">{platform.growth}</span>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {platform.description}
                      </p>
                      {platform.engagement && (
                        <div className="flex items-center text-xs gap-1">
                          <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                          <span className="text-foreground">{platform.engagement}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      size="sm"
                      className={cn(
                        "bg-transparent hover:bg-gold/10 border transition-colors",
                        platform.category === 'music' ? 'border-gold/30 text-gold hover:bg-gold/10' : 
                        platform.category === 'social' ? 'border-blue-400/30 text-blue-400 hover:bg-blue-400/10' : 
                        'border-green-400/30 text-green-400 hover:bg-green-400/10'
                      )}
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      Connect
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Tap to explore
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Engagement Visual */}
        <motion.div
          className="mt-14 mb-16"
          variants={containerVariants}
        >
          <Card className="bg-gradient-to-r from-card to-muted/50 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                Platform Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.slice(0, 3).map((platform, idx) => (
                  <div key={platform.name} className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-sm font-medium">{platform.followers}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: platform.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${30 + idx * 20}%` }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto"
          variants={containerVariants}
        >
          <Card className="bg-gradient-to-r from-card to-muted/50 border border-border shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gold/10 p-3 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Exclusive Music Updates</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Subscribe to receive early access to releases, creative insights, 
                  and behind-the-scenes content
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                  <Button 
                    className="bg-gold hover:bg-amber-600 text-white px-6 py-3 font-medium shadow-sm transition-all"
                    variant="default"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Join 5,000+ subscribers. Unsubscribe anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center mt-16 relative"
          variants={containerVariants}
        >
          <h3 className="text-2xl font-bold mb-4">Become Part of Our Creative Journey</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Follow us on all platforms to access exclusive content and join our growing community
          </p>
          <Button 
            size="lg"
            className="bg-gold hover:bg-amber-600 text-white px-8 py-6 font-bold text-base shadow-sm hover:shadow-md transition-all"
            variant="default"
          >
            Explore All Platforms
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SocialMediaContainer;
