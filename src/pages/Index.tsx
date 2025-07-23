
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import SocialMediaContainer from "@/components/social/SocialMediaContainer";
import FourPointerSection from "@/components/homepage/FourPointerSection";
import InstrumentSelector from "@/components/ui/InstrumentSelector";
import MusicToolsCarousel from "@/components/ui/MusicToolsCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { 
  Music, PlayCircle, Star, BookOpen, Calendar, 
  Headphones, Heart, Play, Share, RotateCw, 
  Users, TrendingUp, Zap, X, Gift
} from "lucide-react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import CountUp from "@/components/tracks/CountUp";
import { motion } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import { AudioStorageManager } from "@/utils/audioStorageManager";

// Constants - PRESERVE ORIGINAL STRUCTURE
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
const HomeHero = ({ onExploreTracks, onTryTools }: { onExploreTracks: () => void; onTryTools: () => void }) => (
  <motion.section 
    className="text-center space-y-4 py-8 sm:py-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-4xl mx-auto px-4">
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
          Discover Music
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
const TrackCard = ({ track, onPlay, onShare }: { track: any; onPlay: (track: any) => void; onShare: (track: any) => void }) => (
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
            onClick={() => onPlay(track.audio_path)}
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
  const { state } = useAudioPlayer();
  const navigate = useNavigate();
  const { isMobile, isLandscape } = useWindowOrientation();
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  
  // Fix: Use currentTrack from audio player context with null checking
  const currentTrack = state?.currentTrack || null;
  
  // IMPROVED TRACK FETCHING
  const featuredTracks = useShuffledTracks(4, 30000);

  useEffect(() => {
    setShowInstrumentSelector(isMobile && isLandscape);
  }, [isMobile, isLandscape]);

  useEffect(() => {
    const M = setTimeout(() => {
      // Auto-shuffle timeout logic here
    }, 30000);
    return () => clearTimeout(M);
  }, [currentTrack]); // Now currentTrack is properly defined

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
        <div className="min-h-screen bg-background">
          <OrientationHint />

          {/* REMOVED FIXED WIDTH CONTAINER - RESPONSIVE MOBILE FIX */}
          <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8 px-4 sm:px-6">
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
            
            <FourPointerSection />
            
            {/* <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Try Our Music Tools
              </h2>
              <div className="overflow-x-hidden py-2">
                <MusicToolsCarousel />
              </div>
            </section> 
            
            <SocialMediaContainer /> */}
            
            {user && (
              <div className="overflow-x-auto">
                <DashboardStats role={user?.user_metadata?.role || 'student'} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <RecommendedContent />
                  <UpcomingBookings />
                </div>
              </div>
            )}
            
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
      </MainLayout>
    </>
  );
};

export default Index;

const FEATURED_TRACKS = [
  {
    id: 'featured-1',
    title: "Pale Ulipo",
    artist: "Saem's Tunes",
    imageSrc: "https://i.imgur.com/VfKXMyG.png",
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a",
    likes: 2543,
    plays: 15420
  },
  {
    id: 'featured-2',
    title: "I Need You More",
    artist: "Saem's Tunes",
    imageSrc: "https://i.imgur.com/6yr8BpG.jpeg",
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/I%20Need%20You%20More.wav",
    likes: 1876,
    plays: 12847
  },
  {
    id: 'featured-3',
    title: "Ni Hai",
    artist: "Saem's Tunes ft. Kendi Nkonge",
    imageSrc: "https://i.imgur.com/LJQDADg.jpeg",
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Ni%20Hai%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
    likes: 3421,
    plays: 22127
  },
  {
    id: 'featured-4',
    title: "Mapenzi Ya Ajabu",
    artist: "Saem's Tunes",
    imageSrc: "https://i.imgur.com/wrm7LI1.jpeg",
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Mapenzi%20Ya%20Ajabu%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
    likes: 2198,
    plays: 18954
  }
];

const StatsSection = () => (
  <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
    {STATS.map((stat, index) => (
      <Card key={index} className="bg-card text-card-foreground shadow-md overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 space-y-2">
          <stat.icon className="h-6 w-6 text-muted-foreground" />
          <div className="text-2xl font-bold"><CountUp to={stat.value} separator="," /></div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </CardContent>
      </Card>
    ))}
  </section>
);

const FeaturedTracksSection = ({ tracks, onPlayTrack, onShareTrack }: { tracks: any[]; onPlayTrack: (track: any) => void; onShareTrack: (track: any) => void }) => (
  <section>
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
      Featured Tracks
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {tracks.map(track => (
        <TrackCard
          key={track.id}
          track={track}
          onPlay={onPlayTrack}
          onShare={onShareTrack}
        />
      ))}
    </div>
  </section>
);

const QuickActionsSection = () => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    {QUICK_ACTIONS.map((action, index) => (
      <Card key={index} className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardContent className="flex flex-col items-start justify-start p-4 space-y-3">
          <action.icon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{action.title}</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
          <Link to={action.path} className="text-sm text-primary hover:underline">
            Learn More
          </Link>
        </CardContent>
      </Card>
    ))}
  </section>
);

const OrientationHint = () => {
  const { isMobile, isLandscape } = useWindowOrientation();
  const [dismissed, setDismissed] = useState(false);
  
  // Check if first-time user
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('orientationHintSeen');
    setDismissed(!!hasSeenHint);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('orientationHintSeen', 'true');
    setDismissed(true);
  };

  if (isMobile && !isLandscape && !dismissed) {
    return (
      <motion.div 
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 backdrop-blur-lg"
        style={{
          background: 'radial-gradient(circle, var(--gold-light) 0%, var(--brown-dark) 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-card hover:bg-primary/20 rounded-full p-2 transition-all"
            aria-label="Close orientation hint"
          >
            <X className="h-6 w-6 text-card-foreground" />
          </Button>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, rotate: -30 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }
          }}
          className="mb-8"
        >
          <div className="relative">
            <Gift className="h-24 w-24 text-primary" />
            <RotateCw className="h-10 w-10 text-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>
        
        <div className="text-center max-w-md space-y-4">
          <Badge variant="secondary" className="mb-2 bg-primary/30 text-primary-foreground">
            Special Gift
          </Badge>
          <h2 className="text-2xl font-bold text-card">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Turn Your Screen for a Surprise!
            </span>
          </h2>
          <p className="text-lg text-card-foreground">
            Discover a special musical experience by rotating your device
          </p>
        </div>
        
        <Button
          onClick={handleDismiss}
          className="mt-8 bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground group"
        >
          <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          Continue without rotating
        </Button>
      </motion.div>
    );
  }

  return null;
};
