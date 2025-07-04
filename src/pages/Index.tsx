
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
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data for demonstration - now pulling from actual tracks
const featuredTracks = [
  {
    id: '1',
    title: 'Pale Ulipo',
    artist: 'Saem\'s Tunes',
    duration: '2:53',
    coverUrl: '/placeholder.svg',
    category: 'Acoustic Cover',
    isPlaying: false
  },
  {
    id: '2',
    title: 'I Need You',
    artist: 'Saem\'s Tunes', 
    duration: '0:53',
    coverUrl: '/placeholder.svg',
    category: 'Acoustic Cover',
    isPlaying: false
  },
  {
    id: '3',
    title: 'Heaven\'s Melody',
    artist: 'Saem\'s Tunes',
    duration: '3:42',
    coverUrl: '/placeholder.svg',
    category: 'Gospel',
    isPlaying: false
  },
  {
    id: '4',
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
  const { state, pauseTrack, resumeTrack } = useAudioPlayer();
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Randomize featured tracks on each session
  const [randomizedTracks, setRandomizedTracks] = useState(featuredTracks);
  
  useEffect(() => {
    const shuffled = [...featuredTracks].sort(() => Math.random() - 0.5);
    setRandomizedTracks(shuffled);
  }, []);

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

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  return (
    <MainLayout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5 w-full max-w-full overflow-x-hidden"
        {...pageTransition}
      >
        {/* Hero Section - Mobile Optimized */}
        <motion.section 
          className="relative pt-4 pb-6 px-3 sm:px-6 lg:px-8 w-full max-w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center w-full">
              {/* Left Content - Mobile Optimized */}
              <motion.div 
                className="space-y-3 sm:space-y-6 w-full"
                variants={itemVariants}
              >
                <div className="space-y-2 sm:space-y-4 w-full">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/20 mb-2 sm:mb-4 text-xs sm:text-sm">
                      🎵 New Releases Available
                    </Badge>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold leading-tight w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-foreground">Making Music,</span>
                    <br />
                    <span className="text-gold">Representing Christ</span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-full lg:max-w-lg leading-relaxed w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Discover soul-stirring music that uplifts, inspires, and connects you 
                    to the divine. Join our community of believers through the power of music.
                  </motion.p>
                </div>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    className="bg-gold hover:bg-gold-dark text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                  >
                    <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Start Listening
                  </Button>
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    variant="outline" 
                    className="border-gold text-gold hover:bg-gold hover:text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto"
                  >
                    <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Join Community
                  </Button>
                </motion.div>

                {/* Stats Row - Mobile Optimized */}
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-8 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 ${stat.color}`} />
                      <div className="font-bold text-xs sm:text-lg">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Content - Music Tools Carousel - Mobile Optimized */}
              <motion.div 
                className="relative mt-4 lg:mt-0 w-full"
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-6 shadow-2xl w-full max-w-full">
                  <Suspense fallback={
                    <div className="h-48 sm:h-64 lg:h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-12 sm:w-12 border-4 border-gold border-t-transparent"></div>
                    </div>
                  }>
                    <MusicToolsCarousel />
                  </Suspense>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Tracks Section - Mobile Optimized */}
        <motion.section 
          className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              className="text-center mb-6 sm:mb-12 w-full"
              variants={itemVariants}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold mb-2 sm:mb-4">
                Featured <span className="text-gold">Tracks</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
                Discover our latest inspirational music that touches hearts and lifts spirits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-full">
              {randomizedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full max-w-full"
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 w-full">
                    <CardContent className="p-0 w-full">
                      <div className="relative w-full">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title}
                          className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                          <Badge className="mb-1 sm:mb-2 bg-gold/90 text-white text-xs">
                            {track.category}
                          </Badge>
                          <h3 className="font-semibold text-white mb-1 text-xs sm:text-base truncate">{track.title}</h3>
                          <p className="text-white/80 text-xs sm:text-sm truncate">{track.artist}</p>
                        </div>
                        <Button
                          size="icon"
                          className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
                          onClick={() => handleTrackPlay(track.id)}
                        >
                          {currentTrackId === track.id ? (
                            <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="p-2 sm:p-4 flex items-center justify-between w-full">
                        <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 sm:h-auto sm:w-auto p-1">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-4 sm:mt-8 w-full"
              variants={itemVariants}
            >
              <Button 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold hover:text-white w-full sm:w-auto"
              >
                View All Tracks
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Social Media Section - Mobile Optimized */}
        <div className="w-full max-w-full overflow-x-hidden">
          <SocialMediaContainer />
        </div>

        {/* Call to Action Section - Mobile Optimized */}
        <motion.section 
          className="py-8 sm:py-16 px-3 sm:px-6 lg:px-8 bg-gradient-to-r from-gold/10 to-gold/5 w-full max-w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div variants={itemVariants} className="w-full">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold mb-3 sm:mb-6">
                Ready to Begin Your <span className="text-gold">Musical Journey</span>?
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of music lovers who have found inspiration, peace, 
                and connection through our curated collection of Christian music.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center w-full max-w-md mx-auto">
                <Button 
                  size={isMobile ? "default" : "lg"}
                  className="bg-gold hover:bg-gold-dark text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold w-full sm:w-auto"
                >
                  <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Get Started Free
                </Button>
                <Button 
                  size={isMobile ? "default" : "lg"}
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold w-full sm:w-auto"
                >
                  <Headphones className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Explore Catalog
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </MainLayout>
  );
};

export default Index;
