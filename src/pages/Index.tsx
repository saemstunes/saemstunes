
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import SocialMediaContainer from "@/components/social/SocialMediaContainer";
import InstrumentSelector from "@/components/ui/InstrumentSelector";
import MusicToolsCarousel from "@/components/ui/MusicToolsCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import {
  TrendingUp,
  Users,
  Music,
  PlayCircle,
  Star,
  BookOpen,
  Calendar,
  Headphones,
  Heart,
  Play,
  Share,
  RotateCw
} from "lucide-react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import CountUp from "@/components/tracks/CountUp";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [featuredTracks, setFeaturedTracks] = useState<any[]>([]);

  // Sample featured tracks data
  const allFeaturedTracks = [
    {
      id: 'pale-ulipo',
      imageSrc: "https://i.imgur.com/VfKXMyG.png",
      title: "Pale Ulipo",
      artist: "Saem's Tunes",
      plays: 2543,
      likes: 189,
      audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a",
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

  // Check orientation and device type
  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      const mobile = windowSize.width < 768;
      const landscape = windowSize.width > windowSize.height;
      setIsMobile(mobile);
      setIsLandscape(landscape);
      
      // Show instrument selector for landscape mobile
      if (mobile && landscape) {
        setShowInstrumentSelector(true);
      } else {
        setShowInstrumentSelector(false);
      }
    }
  }, [windowSize]);

  // Randomize featured tracks on mount and periodically
  useEffect(() => {
    const shuffleAndSelectTracks = () => {
      const shuffled = [...allFeaturedTracks].sort(() => 0.5 - Math.random());
      setFeaturedTracks(shuffled.slice(0, 4));
    };

    shuffleAndSelectTracks();
    
    // Refresh every 30 seconds
    const interval = setInterval(shuffleAndSelectTracks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInstrumentSelect = (instrument: string) => {
    navigate(`/music-tools?tool=${instrument}`);
    setShowInstrumentSelector(false);
  };

  const handlePlayTrack = (track: any) => {
    navigate('/audio-player/featured', {
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
        // Could show a toast here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Show instrument selector for landscape mobile
  if (showInstrumentSelector && isMobile && isLandscape) {
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
        <meta name="keywords" content="music, learning, piano, guitar, tracks, community, Saem's Tunes" />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Mobile landscape hint */}
          {isMobile && !isLandscape && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 flex items-center gap-3">
              <RotateCw className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Tip:</span> Rotate your device to landscape mode to access our interactive music tools!
              </p>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {/* Hero Section */}
            <section className="text-center space-y-4 py-8 sm:py-12">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
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
                    onClick={() => navigate('/tracks')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8"
                  >
                    <Music className="mr-2 h-5 w-5" />
                    Explore Tracks
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/music-tools')}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Try Music Tools
                  </Button>
                </div>
              </div>
            </section>

            {/* Stats Dashboard */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="text-center p-4 sm:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    <CountUp to={15420} separator="," />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Plays</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    <CountUp to={2847} separator="," />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Community Members</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-2">
                    <Music className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    <CountUp to={127} />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Original Tracks</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    <CountUp to={98} />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">5-Star Reviews</p>
                </CardContent>
              </Card>
            </section>

            {/* Featured Tracks Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Tracks</h2>
                <Badge variant="secondary" className="ml-2">New</Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredTracks.map((track, index) => (
                  <Card key={track.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <ResponsiveImage
                          src={track.imageSrc}
                          alt={track.title}
                          width={300}
                          height={300}
                          mobileWidth={280}
                          mobileHeight={280}
                          className="w-full aspect-square object-cover rounded-lg"
                          priority={index < 2}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <Button
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                            onClick={() => handlePlayTrack(track)}
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
                            onClick={() => handleShareTrack(track)}
                          >
                            <Share className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/tracks')}
                  className="px-6"
                >
                  View All Tracks
                </Button>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/learning-hub')}>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Learning Hub</h3>
                  <p className="text-muted-foreground text-sm">
                    Access courses, tutorials, and structured learning paths
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/bookings')}>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Book Sessions</h3>
                  <p className="text-muted-foreground text-sm">
                    Schedule one-on-one lessons with expert instructors
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer md:col-span-2 lg:col-span-1" onClick={() => navigate('/community')}>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Join Community</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with fellow musicians and share your journey
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Music Tools Carousel */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Try Our Music Tools</h2>
              <MusicToolsCarousel />
            </section>

            {/* Social Media Container */}
            <section>
              <SocialMediaContainer />
            </section>

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
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Index;
