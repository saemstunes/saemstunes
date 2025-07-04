
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Shuffle, 
  Heart, 
  Music, 
  Headphones,
  Star,
  TrendingUp,
  Users,
  Award,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { pageTransition } from '@/lib/animation-utils';
import MainLayout from '@/components/layout/MainLayout';
import MusicToolsCarousel from '@/components/ui/MusicToolsCarousel';
import SocialMediaContainer from '@/components/social/SocialMediaContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

// Sample data for demonstration
const featuredTracks = [
  {
    id: '1',
    title: 'Heaven\'s Melody',
    artist: 'Saem\'s Tunes',
    duration: '3:42',
    coverUrl: '/placeholder.svg',
    category: 'Gospel',
    isPlaying: false
  },
  {
    id: '2',
    title: 'Praise Anthem',
    artist: 'Saem\'s Tunes', 
    duration: '4:15',
    coverUrl: '/placeholder.svg',
    category: 'Worship',
    isPlaying: false
  },
  {
    id: '3',
    title: 'Faith Journey',
    artist: 'Saem\'s Tunes',
    duration: '3:58',
    coverUrl: '/placeholder.svg',
    category: 'Inspirational',
    isPlaying: false
  }
];

const stats = [
  { icon: Users, label: 'Active Listeners', value: '12.5K', color: 'text-blue-500' },
  { icon: Music, label: 'Songs Available', value: '150+', color: 'text-green-500' },
  { icon: Award, label: 'Awards Won', value: '8', color: 'text-gold' },
  { icon: Star, label: '5-Star Reviews', value: '2.8K', color: 'text-yellow-500' }
];

const Index = () => {
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleTrackPlay = (trackId: string) => {
    setCurrentTrackId(trackId);
    // Integration with audio player context would go here
  };

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5"
          {...pageTransition}
        >
          {/* Hero Section */}
          <motion.section 
            className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div 
                  className="space-y-6"
                  variants={itemVariants}
                >
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/20 mb-4">
                        🎵 New Releases Available
                      </Badge>
                    </motion.div>
                    
                    <motion.h1 
                      className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-foreground">Making Music,</span>
                      <br />
                      <span className="text-gold">Representing Christ</span>
                    </motion.h1>
                    
                    <motion.p 
                      className="text-lg text-muted-foreground max-w-lg leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Discover soul-stirring music that uplifts, inspires, and connects you 
                      to the divine. Join our community of believers through the power of music.
                    </motion.p>
                  </div>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Listening
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Join Community
                    </Button>
                  </motion.div>

                  {/* Stats Row */}
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                        <div className="font-bold text-lg">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right Content - Music Tools Carousel */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl p-6 shadow-2xl">
                    <Suspense fallback={
                      <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
                      </div>
                    }>
                      <MusicToolsCarousel />
                    </Suspense>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Featured Tracks Section */}
          <motion.section 
            className="py-12 px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                variants={itemVariants}
              >
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                  Featured <span className="text-gold">Tracks</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover our latest inspirational music that touches hearts and lifts spirits
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={track.coverUrl} 
                            alt={track.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <Badge className="mb-2 bg-gold/90 text-white">
                              {track.category}
                            </Badge>
                            <h3 className="font-semibold text-white mb-1">{track.title}</h3>
                            <p className="text-white/80 text-sm">{track.artist}</p>
                          </div>
                          <Button
                            size="icon"
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                            onClick={() => handleTrackPlay(track.id)}
                          >
                            {currentTrackId === track.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {track.duration}
                          </span>
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="text-center mt-8"
                variants={itemVariants}
              >
                <Button 
                  variant="outline" 
                  className="border-gold text-gold hover:bg-gold hover:text-white"
                >
                  View All Tracks
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.section>

          {/* Social Media Section */}
          <SocialMediaContainer />

          {/* Call to Action Section */}
          <motion.section 
            className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gold/10 to-gold/5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
                  Ready to Begin Your <span className="text-gold">Musical Journey</span>?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of music lovers who have found inspiration, peace, 
                  and connection through our curated collection of Christian music.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-semibold"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-full font-semibold"
                  >
                    <Headphones className="mr-2 h-5 w-5" />
                    Explore Catalog
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Index;
