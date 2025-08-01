// src/pages/artist/[slug].tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoCard from "@/components/videos/VideoCard";
import MagicBento from "@/components/ui/MagicBento";
import ArtistModal from "@/components/artists/ArtistModal";
import { Calendar, Mail, Music, Video, Star, MapPin, ExternalLink } from "lucide-react";
import { slugify } from "@/utils/slugify";

// Define the artist type
interface Artist {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  profile_image_url: string | null;
  genre: string[] | null;
  specialties: string[] | null;
  location: string | null;
  verified_status: boolean;
  social_links: Record<string, string> | null;
  follower_count: number;
  rating: number | null;
  lessons_available: boolean;
  courses_available: boolean;
  achievements: any[] | null;
  created_at: string;
  updated_at: string;
}

const ArtistProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Artist | null>(null);
  const [modalType, setModalType] = useState<string>('');

  useEffect(() => {
    const fetchArtist = async () => {
      if (!slug) {
        setError('Invalid artist URL');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching artist:', error);
          setError('Artist not found');
          return;
        }

        if (data) {
          setArtist(data);
        } else {
          setError('Artist not found');
        }
      } catch (error) {
        console.error('Error during artist fetch:', error);
        setError('Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [slug]);

  const handleBentoClick = (type: string) => {
    if (!artist) return;
    setModalType(type);
    setModalData(artist);
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

  if (error || !artist) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
            <p className="text-muted-foreground">{error || 'The artist you requested does not exist'}</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Browse Artists
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Calculate star rating
  const rating = artist.rating || 4.0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] overflow-hidden bg-gradient-to-b from-background to-muted flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={artist.profile_image_url || undefined} />
                <AvatarFallback>
                  {artist.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
              {artist.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {artist.genre?.join(', ') || artist.specialties?.join(', ') || 'Artist'}
            </p>
            
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < fullStars || (i === fullStars && hasHalfStar)
                      ? 'text-gold fill-gold'
                      : 'text-muted-foreground'
                  } mr-1`}
                />
              ))}
              <span className="ml-2 text-sm">({rating.toFixed(1)})</span>
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
              {artist.social_links && (
                <Button variant="outline" 
                  onClick={() => window.open(
                    artist.social_links?.spotify || 
                    artist.social_links?.instagram || 
                    '#', '_blank'
                  )}
                >
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
                  onClick: () => handleBentoClick('achievements'),
                  disabled: !artist.achievements || artist.achievements.length === 0
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
              {artist.lessons_available && (
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
              )}
              {artist.courses_available && (
                <TabsTrigger value="courses">Courses</TabsTrigger>
              )}
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="p-4 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-medium mb-4">Biography</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {artist.bio || `${artist.name} is a talented music artist.`}
                  </p>
                  
                  <h3 className="text-lg font-medium mt-8 mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {(artist.genre || artist.specialties || []).map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>

                  {artist.verified_status && (
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
                          <p className="text-sm font-medium">{artist.location || 'Global'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Music className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm">Followers</p>
                          <p className="text-sm font-medium">
                            {artist.follower_count.toLocaleString()}
                          </p>
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
                          <p className="text-sm font-medium">
                            {rating.toFixed(1)} out of 5
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {artist.social_links && Object.keys(artist.social_links).length > 0 && (
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h3 className="font-medium mb-4">Connect</h3>
                      <div className="space-y-2">
                        {Object.entries(artist.social_links).map(([platform, url]) => (
                          <Button
                            key={platform}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => window.open(url, '_blank')}
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
            
            {artist.lessons_available && (
              <TabsContent value="lessons" className="p-4">
                <h2 className="text-xl font-medium mb-4">Featured Lessons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Lesson content would go here */}
                  <p className="text-muted-foreground">No lessons available yet</p>
                </div>
              </TabsContent>
            )}
            
            {artist.courses_available && (
              <TabsContent value="courses" className="p-4">
                <div className="text-center py-16">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Courses Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    This artist hasn't published any courses yet. Check back soon!
                  </p>
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="schedule" className="p-4">
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Schedule a Lesson</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Book a private or group session with this artist
                </p>
                <Button 
                  onClick={() => window.location.href = `/book/${artist.id}`}
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
