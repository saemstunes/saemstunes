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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

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
}

const SocialMediaContainer: React.FC = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useIsMobile();

  // Enhanced audio visualization effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioVisualization(Array.from({ length: 24 }, () => Math.random() * 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Update time for dynamic content
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const platforms: Platform[] = [
    {
      name: 'Spotify',
      icon: SpotifyIcon,
      url: 'https://open.spotify.com/artist/6oMbcOwuuETAvO51LesbO8',
      color: '#1DB954',
      description: 'Stream our original compositions',
      followers: '2.5K',
      category: 'music',
      engagement: '94% monthly listeners'
    },
    {
      name: 'Apple Music',
      icon: AppleMusicIcon,
      url: 'https://music.apple.com/ca/artist/saems-tunes/1723336566',
      color: '#FA2C56',
      description: 'Listen on Apple Music',
      followers: '1.8K',
      category: 'music',
      engagement: 'Top 10 Gospel'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/saemstunes',
      color: '#E1306C',
      description: 'Daily music tips & inspiration',
      followers: '15.2K',
      category: 'social',
      engagement: '2.5K avg. likes'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      url: 'https://tiktok.com/@saemstunes',
      color: '#000000',
      description: 'Quick music tutorials',
      followers: '8.7K',
      category: 'social',
      engagement: '45K monthly views'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/saemstunes',
      color: '#1877F2',
      description: 'Community & live sessions',
      followers: '5.1K',
      category: 'social',
      engagement: 'Weekly live streams'
    },
    {
      name: 'Contact',
      icon: Mail,
      url: '/contact-us',
      color: '#A67C00',
      description: 'Get in touch with us',
      category: 'contact',
      engagement: '24h response time'
    }
  ];

  const categories = {
    music: { name: 'Stream Our Music', icon: Headphones, color: 'text-gold', bgColor: 'bg-gold/10' },
    social: { name: 'Follow Our Journey', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    contact: { name: 'Connect With Us', icon: Mail, color: 'text-green-500', bgColor: 'bg-green-500/10' }
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
      scale: isMobile ? 1 : 1.05,
      y: isMobile ? 0 : -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.section 
      className="py-12 sm:py-16 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] w-full overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5 bg-gold"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.08, 0.05],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container px-4 sm:px-6 w-full max-w-7xl mx-auto relative">
        {/* Dynamic Audio Visualization Header */}
        <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden opacity-20">
          <div className="flex items-end justify-between h-full gap-1 px-4">
            {audioVisualization.map((height, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-t-lg bg-gold"
                style={{ height: `${height}%` }}
                animate={{ height: [`${height}%`, `${height * 1.2}%`, `${height}%`] }}
                transition={{ 
                  duration: 0.3, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.02 
                }}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <motion.div 
          className="text-center mb-12 w-full relative z-10"
          variants={containerVariants}
        >
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-gold/20 text-gold px-4 py-1.5 mb-3">
              Join The Community
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-200 tracking-tight">
              Where Music Connects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-base sm:text-lg px-4">
              Connect with Saem's Tunes across platforms for exclusive content, 
              behind-the-scenes, and musical inspiration
            </p>
          </div>
        </motion.div>

        {/* Live Activity Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-5 py-3 border border-gold/30 shadow-lg shadow-gold/10">
            <div className="relative flex">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-sm text-foreground">Live on Instagram Stories</span>
            <Badge className="bg-gold/20 text-gold text-xs">Now</Badge>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
        >
          {[
            { icon: Users, label: 'Total Followers', value: '32.3K', change: '+12%', color: 'bg-blue-500/20', text: 'text-blue-400' },
            { icon: Play, label: 'Monthly Plays', value: '156K', change: '+28%', color: 'bg-purple-500/20', text: 'text-purple-400' },
            { icon: Heart, label: 'Engagement Rate', value: '8.4%', change: '+5%', color: 'bg-rose-500/20', text: 'text-rose-400' },
            { icon: TrendingUp, label: 'Growth', value: '+2.1K', change: 'This month', color: 'bg-green-500/20', text: 'text-green-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.color} backdrop-blur-sm rounded-xl p-5 border border-border/30`}
              whileHover={{ 
                scale: isMobile ? 1 : 1.03,
                y: isMobile ? 0 : -3,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black/30">
                  <stat.icon className={`h-5 w-5 ${stat.text}`} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="font-bold text-2xl">{stat.value}</div>
                <Badge variant="outline" className="text-xs bg-black/30">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${stat.color.replace('/20', '/60')} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${30 + index * 20}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platforms by Category */}
        <div className="space-y-12 w-full max-w-full">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryPlatforms = platforms.filter(p => p.category === categoryKey);
            
            return (
              <motion.div 
                key={categoryKey}
                className="space-y-6 w-full"
                variants={containerVariants}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-xl ${categoryInfo.bgColor} shadow-lg`}>
                    <categoryInfo.icon className={`h-6 w-6 ${categoryInfo.color}`} />
                  </div>
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-gold">
                    {categoryInfo.name}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-full">
                  {categoryPlatforms.map((platform) => (
                    <motion.div
                      key={platform.name}
                      variants={platformVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredPlatform(platform.name)}
                      onHoverEnd={() => setHoveredPlatform(null)}
                      className="w-full max-w-full"
                    >
                      <Card className="group relative overflow-hidden cursor-pointer h-full bg-gradient-to-b from-card/70 to-card/40 backdrop-blur-sm border border-border/30 shadow-lg hover:shadow-xl hover:border-gold/30 transition-all">
                        <CardContent className="p-5 h-full flex flex-col">
                          <div className="flex items-start gap-4 h-full">
                            <div 
                              className="p-3 rounded-lg transition-all duration-300 flex-shrink-0 group-hover:scale-110"
                              style={{ 
                                backgroundColor: hoveredPlatform === platform.name 
                                  ? `${platform.color}20` 
                                  : 'hsl(var(--gold) / 0.1)',
                                boxShadow: `0 4px 15px ${platform.color}20`
                              }}
                            >
                              <platform.icon 
                                className="h-7 w-7 transition-colors duration-300"
                                style={{ 
                                  color: hoveredPlatform === platform.name 
                                    ? platform.color 
                                    : 'hsl(var(--gold))' 
                                }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <h4 className="font-bold text-lg truncate">{platform.name}</h4>
                                {platform.followers && (
                                  <Badge className="text-xs flex-shrink-0 bg-black/40">
                                    <Users className="h-3 w-3 mr-1" />
                                    {platform.followers}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {platform.description}
                              </p>
                              {platform.engagement && (
                                <div className="flex items-center text-xs text-amber-300 gap-1">
                                  <Star className="h-3 w-3 fill-amber-300" />
                                  {platform.engagement}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <Button
                              size="sm"
                              className="bg-transparent hover:bg-gold/10 border border-gold/30 text-gold group-hover:bg-gold/20 transition-colors"
                              onClick={() => window.open(platform.url, '_blank')}
                            >
                              Connect
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <div className="text-xs text-muted-foreground">
                              Tap to explore
                            </div>
                          </div>
                          
                          {/* Hover effect */}
                          <AnimatePresence>
                            {hoveredPlatform === platform.name && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 -z-10 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none"
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

        {/* Newsletter Signup */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto relative"
          variants={containerVariants}
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold/20 to-amber-400/10 blur-lg opacity-30"></div>
          <Card className="bg-gradient-to-r from-[#171717] to-[#0f0f0f] border border-gold/30 backdrop-blur-md relative z-10 overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gold/10 blur-xl"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-amber-400/10 blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-300">
                  Exclusive Music Insights
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Join our inner circle for early access to releases, behind-the-scenes content, 
                  and creative inspiration delivered weekly
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-xl border border-border/40 bg-black/30 text-foreground text-sm focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                  <Button className="bg-gradient-to-r from-gold to-amber-500 text-black hover:from-amber-400 hover:to-gold px-6 py-3 font-medium transition-all shadow-lg shadow-gold/20">
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
          <h3 className="text-2xl font-bold mb-4">Ready to Elevate Your Music Experience?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Follow us on all platforms to become part of our growing creative community
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-gold to-amber-500 text-black hover:from-amber-400 hover:to-gold px-8 py-6 font-bold text-base shadow-lg shadow-gold/30 hover:shadow-xl transition-all"
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
