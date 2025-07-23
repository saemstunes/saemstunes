import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockTutors, mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import MagicBento from "@/components/ui/MagicBento";
import ArtistModal from "@/components/artists/ArtistModal";
import { Calendar, Mail, Music, Video, Star, MapPin, ExternalLink } from "lucide-react";

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<string>('');
  
  const tutorVideos = mockVideos.slice(0, 4);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching artist:', error);
          setError('Artist not found');
          return;
        }

        if (data) {
          setArtist(data);
        }
      } catch (error) {
        console.error('Error during artist fetch:', error);
        setError('Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const displayArtist = artist || mockTutors.find(tutor => tutor.id === id) || mockTutors[0];

  const handleBentoClick = (type: string) => {
    setModalType(type);
    setModalData(displayArtist);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading artist profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !displayArtist) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] overflow-hidden bg-gradient-to-b from-background to-muted flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={displayArtist?.profile_image_url || displayArtist?.avatar} />
                <AvatarFallback>{displayArtist?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
              {displayArtist?.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {displayArtist?.genre?.join(', ') || displayArtist?.specialties?.join(', ') || 'Artist'}
            </p>
            
            <div className="flex items-center justify-center mb-6">
              <Star className="h-5 w-5 text-gold fill-gold" />
              <Star className="h-5 w-5 text-gold fill-gold" />
              <Star className="h-5 w-5 text-gold fill-gold" />
              <Star className="h-5 w-5 text-gold fill-gold" />
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="ml-2 text-sm">(4.0)</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold hover:bg-gold-dark text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Book Lesson
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              {displayArtist?.social_links && (
                <Button variant="outline" onClick={() => window.open(displayArtist.social_links.spotify || displayArtist.social_links.instagram, '_blank')}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Follow
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Magic Bento Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore Artist Profile</h2>
            <p className="text-muted-foreground">
              Click on each section to learn more about this artist
            </p>
          </div>
          
          <div className="relative">
            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="167, 124, 0"
              cardData={[
                {
                  color: "hsl(20 14% 15%)",
                  title: "Biography",
                  description: "Artist's story & journey",
                  label: "About",
                  onClick: () => handleBentoClick('bio')
                },
                {
                  color: "hsl(20 14% 15%)",
                  title: "Location",
                  description: "Where they're based",
                  label: "Location",
                  onClick: () => handleBentoClick('location')
                },
                {
                  color: "hsl(20 14% 15%)",
                  title: "Genre",
                  description: "Musical style & influences",
                  label: "Style",
                  onClick: () => handleBentoClick('genre')
                },
                {
                  color: "hsl(20 14% 15%)",
                  title: "Statistics",
                  description: "Followers & engagement",
                  label: "Stats",
                  onClick: () => handleBentoClick('stats')
                },
                {
                  color: "hsl(20 14% 15%)",
                  title: "Social Media",
                  description: "Connect & follow",
                  label: "Connect",
                  onClick: () => handleBentoClick('social')
                },
                {
                  color: "hsl(20 14% 15%)",
                  title: "Achievements",
                  description: "Awards & recognition",
                  label: "Awards",
                  onClick: () => handleBentoClick('achievements')
                }
              ]}
            />
          </div>
        </div>
        
        {/* Artist Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="p-4 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-medium mb-4">Biography</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {displayArtist?.bio || `${displayArtist?.name} is a talented music instructor with years of experience in teaching 
                    ${displayArtist?.genre?.join(', ') || displayArtist?.specialties?.join(', ')}. They are passionate about helping students reach their 
                    musical potential through personalized instruction and engaging learning experiences.`}
                  </p>
                  
                  <h3 className="text-lg font-medium mt-8 mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {(displayArtist?.genre || displayArtist?.specialties || []).map((item: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>

                  {displayArtist?.verified_status && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Verified Artist</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="font-medium mb-6">Artist Info</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm">Location</p>
                          <p className="text-sm font-medium">{displayArtist?.location || 'Global'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Music className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm">Followers</p>
                          <p className="text-sm font-medium">{displayArtist?.follower_count || '1K+'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Video className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm">Content</p>
                          <p className="text-sm font-medium">Music & Lessons</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Star className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm">Rating</p>
                          <p className="text-sm font-medium">4.0 out of 5</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {displayArtist?.social_links && Object.keys(displayArtist.social_links).length > 0 && (
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h3 className="font-medium mb-4">Connect</h3>
                      <div className="space-y-2">
                        {Object.entries(displayArtist.social_links).map(([platform, url]) => (
                          <Button
                            key={platform}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => window.open(url as string, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lessons" className="p-4">
              <h2 className="text-xl font-medium mb-4">Featured Lessons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tutorVideos.map(video => (
                  <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="p-4">
              <div className="text-center py-16">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Courses Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  This instructor hasn't published any courses yet. Check back soon!
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="p-4">
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Schedule a Lesson</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Book a private or group session with this instructor
                </p>
                <Button 
                  onClick={() => window.location.href = `/book/${displayArtist?.id}`}
                  className="bg-gold hover:bg-gold-dark text-white"
                >
                  View Available Times
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Artist Modal */}
        <ArtistModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          data={modalData}
          type={modalType as any}
        />
      </div>
    </MainLayout>
  );
};

export default ArtistProfile;
