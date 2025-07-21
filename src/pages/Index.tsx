import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import SocialMediaContainer from "@/components/social/SocialMediaContainer";
import FourPointerSection from "@/components/homepage/FourPointerSection"; // NEW
import InstrumentSelector from "@/components/ui/InstrumentSelector";
import MusicToolsCarousel from "@/components/ui/MusicToolsCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { 
  Music, PlayCircle, Star, BookOpen, Calendar, 
  Headphones, Heart, Play, Share, RotateCw, 
  Users, TrendingUp, Zap
} from "lucide-react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import CountUp from "@/components/tracks/CountUp";
import { motion } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import { AudioStorageManager } from "@/utils/audioStorageManager"; // NEW

// Constants - PRESERVE ORIGINAL STRUCTURE
const STATS = [
  { icon: TrendingUp, label: "Total Plays", value: 15420 },
  { icon: Users, label: "Community Members", value: 2847 },
  { icon: Music, label: "Original Tracks", value: 127 },
  { icon: Star, label: "5-Star Reviews", value: 98 }
];

const QUICK_ACTIONS = [  // KEEP ORIGINAL 3 ACTIONS
  { 
    icon: BookOpen, 
    title: "Learning Hub", 
    description: "Access courses, tutorials, and structured learning paths",
    path: "/learning-hub"
  },
  { 
    icon: Calendar, 
    title: "Book Sessions", 
    description: "Schedule one-on-one lessons with expert instructors",
    path: "/bookings"
  },
  { 
    icon: Users, 
    title: "Join Community", 
    description: "Connect with fellow musicians and share your journey",
    path: "/community"
  }
];

// Custom hook for orientation detection
const useWindowOrientation = () => {
  const windowSize = useWindowSize();
  
  const isMobile = windowSize.width ? windowSize.width < 768 : false;
  const isLandscape = windowSize.width && windowSize.height 
    ? windowSize.width > windowSize.height 
    : false;
  
  return { isMobile, isLandscape };
};

// IMPROVED TRACK HANDLING WITH AUDIO STORAGE MANAGER
const useShuffledTracks = (count: number, interval: number) => {
  const [shuffledTracks, setShuffledTracks] = useState<any[]>([]);

  useEffect(() => {
    const shuffleAndSelectTracks = async () => {
      try {
        const tracks = await AudioStorageManager.getShuffledTracks(count);
        setShuffledTracks(tracks);
      } catch (error) {
        console.error('Error fetching shuffled tracks:', error);
        // Fallback to static tracks if needed
        const shuffled = FEATURED_TRACKS.sort(() => 0.5 - Math.random());
        setShuffledTracks(shuffled.slice(0, count));
      }
    };

    shuffleAndSelectTracks();
    
    const id = setInterval(shuffleAndSelectTracks, interval);
    return () => clearInterval(id);
  }, [count, interval]);

  return shuffledTracks;
};

// IMPROVED HERO BUTTON TEXT
const HomeHero = ({ onExploreTracks, onTryTools }) => (
  <motion.section 
    className="text-center space-y-4 py-8 sm:py-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Saem's Tunes
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
        Your musical journey starts here. Discover amazing tracks, learn instruments, 
        and join our vibrant community of music lovers.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={onExploreTracks}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 group"
        >
          <Music className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          Discover Music {/* UPDATED TEXT */}
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={onTryTools}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 group"
        >
          <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          Try Music Tools
        </Button>
      </div>
    </div>
  </motion.section>
);

// IMPROVED TRACK CARD WITH ANALYTICS SUPPORT
const TrackCard = ({ track, onPlay, onShare }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
    <CardContent className="p-4">
      <div className="relative mb-4 aspect-square">
        <img
          src={track.cover_art_url || track.imageSrc}
          alt={track.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
            onClick={() => onPlay(track)}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1">{track.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{track.artist}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              <CountUp to={track.play_count || track.plays || 0} separator="," />
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <CountUp to={track.likes || 0} separator="," />
            </span>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onShare(track)}
          >
            <Share className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isLandscape } = useWindowOrientation();
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  
  // IMPROVED TRACK FETCHING
  const featuredTracks = useShuffledTracks(4, 30000);

  useEffect(() => {
    setShowInstrumentSelector(isMobile && isLandscape);
  }, [isMobile, isLandscape]);

  const handleInstrumentSelect = (instrument: string) => {
    navigate(`/music-tools?tool=${instrument}`);
    setShowInstrumentSelector(false);
  };

  // ADDED PLAY TRACKING ANALYTICS
  const handlePlayTrack = async (track: any) => {
    if (track.id && track.id !== 'featured-fallback') {
      await AudioStorageManager.trackPlay(track.id, user?.id);
    }
    
    navigate(`/audio-player/${track.id}`, {
      state: {
        track: {
          id: track.id,
          src: track.audio_url || track.audioSrc,
          name: track.title,
          artist: track.artist,
          artwork: track.cover_art_url || track.imageSrc,
          album: 'Featured'
        }
      }
    });
  };

  // PRESERVED ORIGINAL SHARE FUNCTIONALITY
  const handleShareTrack = async (track: any) => {
    const handleShareTrack = async (track: any) => {
    const shareData = {
      title: `${track.title} by ${track.artist}`,
      text: `Listen to ${track.title} on Saem's Tunes`,
      url: `${window.location.origin}/tracks/${track.id}`,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        // Show toast notification in a real implementation
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
    
  if (showInstrumentSelector) {
    return (
      <InstrumentSelector
        onInstrumentSelect={handleInstrumentSelect}
        onBackToHome={() => setShowInstrumentSelector(false)}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Saem's Tunes - Your Musical Journey Starts Here</title>
        <meta name="description" content="Discover amazing music, learn instruments, and join our musical community. Practice with interactive tools, explore our tracks, and grow your musical skills." />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-background overflow-x-hidden">
          <OrientationHint />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <div className="space-y-6 sm:space-y-8">
              <HomeHero 
                onExploreTracks={() => navigate('/tracks')}
                onTryTools={() => navigate('/music-tools')}
              />
              
              <StatsSection />
              
              <FeaturedTracksSection 
                tracks={featuredTracks}
                onPlayTrack={handlePlayTrack}
                onShareTrack={handleShareTrack}
              />
              
              <QuickActionsSection />
              
              {/* NEW COMPONENT ADDED */}
              <FourPointerSection />
              
              {/* IMPROVED TOOLS CAROUSEL CONTAINER */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Try Our Music Tools
                </h2>
                <div className="overflow-hidden"> {/* ADDED WRAPPER */}
                  <MusicToolsCarousel />
                </div>
              </section>
              
              {/* PRESERVED ORIGINAL SOCIAL COMPONENT */}
              <SocialMediaContainer />
              
              {user && (
                <>
                  <DashboardStats />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <RecommendedContent />
                    <UpcomingBookings />
                  </div>
                </>
              )}
              
              {/* FINAL CTA WITH IMPROVED LINKING */}
              <section className="py-12 bg-gradient-to-r from-primary/10 via-purple-500/5 to-primary/10 rounded-xl">
                <div className="max-w-3xl mx-auto text-center px-4">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Ready to Begin Your <span className="text-primary">Musical Journey</span>?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of music lovers who have found inspiration through our platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 group"
                      onClick={() => navigate(user ? '/dashboard' : '/signup')}
                    >
                      <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      {user ? 'Go to Dashboard' : 'Get Started'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 group"
                      onClick={() => navigate('/pricing')} // PRESERVED ORIGINAL LINK
                    >
                      <Star className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      View Premium
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};
