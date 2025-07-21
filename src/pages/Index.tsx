import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import SocialMediaContainer from "@/components/social/SocialMediaContainer";
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

// Constants
const STATS = [
  { icon: TrendingUp, label: "Total Plays", value: 15420 },
  { icon: Users, label: "Community Members", value: 2847 },
  { icon: Music, label: "Original Tracks", value: 127 },
  { icon: Star, label: "5-Star Reviews", value: 98 }
];

const QUICK_ACTIONS = [
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

const FEATURED_TRACKS = [
  {
    id: 'pale-ulipo',
    imageSrc: "https://i.imgur.com/VfKXMyG.png",
    title: "Pale Ulipo",
    artist: "Saem's Tunes",
    plays: 2543,
    likes: 189,
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvQ292ZXJfVHJhY2tzL1BhbGUgVWxpcG8gY292ZXIubTRhIiwiaWF0IjoxNzQ5OTYwMjQ1LCJleHAiOjE3ODE0OTYyNDV9.3vv7kkkTTw2uRXG_HEItaCZ5xC6dbgcucC-PYjJKXLA",
    description: "Beautiful acoustic cover with heartfelt vocals"
  },
  {
    id: 'i-need-you-more',
    imageSrc: "https://i.imgur.com/6yr8BpG.jpeg",
    title: "I Need You More",
    artist: "Saem's Tunes",
    plays: 1876,
    likes: 156,
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/I%20Need%20You%20More.wav",
    description: "Soulful acoustic performance"
  },
  {
    id: 'ni-hai',
    imageSrc: "https://i.imgur.com/LJQDADg.jpeg",
    title: "Ni Hai",
    artist: "Saem's Tunes ft. Kendin Konge",
    plays: 3421,
    likes: 267,
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Ni%20Hai%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
    description: "Original composition with powerful message"
  },
  {
    id: 'mapenzi-ya-ajabu',
    imageSrc: "https://i.imgur.com/wrm7LI1.jpeg",
    title: "Mapenzi Ya Ajabu",
    artist: "Saem's Tunes",
    plays: 2198,
    likes: 203,
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Mapenzi%20Ya%20Ajabu%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
    description: "Inspiring original about amazing love"
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

// Custom hook for shuffled tracks
const useShuffledTracks = (count: number, interval: number) => {
  const [shuffledTracks, setShuffledTracks] = useState<any[]>([]);

  useEffect(() => {
    const shuffleAndSelectTracks = () => {
      const shuffled = [...FEATURED_TRACKS].sort(() => 0.5 - Math.random());
      setShuffledTracks(shuffled.slice(0, count));
    };

    shuffleAndSelectTracks();
    
    const id = setInterval(shuffleAndSelectTracks, interval);
    return () => clearInterval(id);
  }, [count, interval]);

  return shuffledTracks;
};

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
          Explore Tracks
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

const StatsSection = () => (
  <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
    {STATS.map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <Card className="text-center p-4 sm:p-6 h-full">
          <CardContent className="p-0">
            <div className="flex items-center justify-center mb-2">
              <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              <CountUp to={stat.value} separator="," />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </section>
);

const TrackCard = ({ track, onPlay, onShare }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
    <CardContent className="p-4">
      <div className="relative mb-4 aspect-square">
  <img
    src={track.imageSrc}
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
              <CountUp to={track.plays} separator="," />
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <CountUp to={track.likes} separator="," />
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

const FeaturedTracksSection = ({ tracks, onPlayTrack, onShareTrack }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="flex items-center gap-2 mb-6">
      <Star className="h-6 w-6 text-primary" />
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Tracks</h2>
      <Badge variant="secondary" className="ml-2">New</Badge>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {tracks.map((track) => (
        <TrackCard 
          key={track.id}
          track={track}
          onPlay={onPlayTrack}
          onShare={onShareTrack}
        />
      ))}
    </div>
    
    <div className="text-center mt-6">
      <Button 
        variant="outline" 
        asChild
        className="px-6"
      >
        <Link to="/tracks">View All Tracks</Link>
      </Button>
    </div>
  </motion.section>
);

const QuickActionCard = ({ icon: Icon, title, description, path }) => (
  <Link to={path}>
    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
      <CardContent className="p-6 text-center">
        <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

const QuickActionsSection = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {QUICK_ACTIONS.map((action, index) => (
      <motion.div
        key={action.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
      >
        <QuickActionCard 
          icon={action.icon}
          title={action.title}
          description={action.description}
          path={action.path}
        />
      </motion.div>
    ))}
  </section>
);

const OrientationHint = () => {
  const { isMobile, isLandscape } = useWindowOrientation();
  
  if (!isMobile || isLandscape) return null;
  
  return (
    <motion.div 
      className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 flex items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <RotateCw className="h-5 w-5 text-primary flex-shrink-0" />
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Tip:</span> Rotate your device to access interactive music tools!
      </p>
    </motion.div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isLandscape } = useWindowOrientation();
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  
  // Use custom hook for shuffled tracks
  const featuredTracks = useShuffledTracks(4, 30000);

  useEffect(() => {
    // Show instrument selector for landscape mobile
    setShowInstrumentSelector(isMobile && isLandscape);
  }, [isMobile, isLandscape]);

  const handleInstrumentSelect = (instrument: string) => {
    navigate(`/music-tools?tool=${instrument}`);
    setShowInstrumentSelector(false);
  };

  const handlePlayTrack = (track: any) => {
    navigate(`/audio-player/${track.id}`, {
      state: {
        track: {
          id: track.id,
          src: track.audioSrc,
          name: track.title,
          artist: track.artist,
          artwork: track.imageSrc,
          album: 'Featured'
        }
      }
    });
  };

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

  // Show instrument selector for landscape mobile
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

          {/* Main content container with max-width */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
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
            
            {/* Music Tools Carousel */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Try Our Music Tools
              </h2>
              <MusicToolsCarousel />
            </section>
            
            <SocialMediaContainer />
            
            {/* Dashboard Components for Authenticated Users */}
            {user && (
              <>
                <DashboardStats />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <RecommendedContent />
                  <UpcomingBookings />
                </div>
              </>
            )}
            
             {/* Final CTA with proper container */}
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
                      onClick={() => navigate('/pricing')}
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
export default Index;
