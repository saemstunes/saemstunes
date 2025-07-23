
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Music, Users, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import MagicBento from '@/components/ui/MagicBento';
import ArtistModal from '@/components/artists/ArtistModal';

interface Artist {
  id: string;
  name: string;
  bio?: string;
  profile_image_url?: string;
  location?: string;
  genre?: string[];
  social_links?: any;
  verified_status?: boolean;
  follower_count?: number;
  created_at: string;
}

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: any;
    type: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      fetchArtist();
    }
  }, [id]);

  const fetchArtist = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArtist(data);
    } catch (error) {
      console.error('Error fetching artist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBentoClick = (type: string) => {
    if (!artist) return;
    
    const contentMap = {
      bio: {
        title: 'Biography',
        content: artist.bio || 'No biography available',
        type: 'bio'
      },
      location: {
        title: 'Location',
        content: artist.location || 'Location not specified',
        type: 'location'
      },
      genre: {
        title: 'Musical Genres',
        content: artist.genre || ['Genre not specified'],
        type: 'genre'
      },
      social: {
        title: 'Social Links',
        content: artist.social_links || {},
        type: 'social'
      },
      stats: {
        title: 'Statistics',
        content: {
          followers: artist.follower_count || 0,
          verified: artist.verified_status || false,
          joinDate: artist.created_at
        },
        type: 'stats'
      }
    };

    setModalContent(contentMap[type as keyof typeof contentMap]);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!artist) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
            <p className="text-muted-foreground">The artist you're looking for doesn't exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src={artist.profile_image_url} alt={artist.name} />
              <AvatarFallback className="text-2xl">
                {artist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                {artist.verified_status && (
                  <Badge variant="default" className="bg-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{artist.follower_count || 0} followers</span>
                </div>
                {artist.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{artist.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(artist.created_at).getFullYear()}</span>
                </div>
              </div>
              
              {artist.genre && artist.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.genre.map((g, index) => (
                    <Badge key={index} variant="secondary">{g}</Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  variant={following ? "outline" : "default"}
                  onClick={() => setFollowing(!following)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${following ? 'fill-current' : ''}`} />
                  {following ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline">Contact</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Magic Bento Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">About {artist.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleBentoClick('bio')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Biography</h3>
              </div>
              <p className="text-sm text-muted-foreground">Life & Journey</p>
              <p className="text-xs mt-2 text-muted-foreground">Learn more about {artist.name}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleBentoClick('location')}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="text-sm text-muted-foreground">Based in</p>
              <p className="text-xs mt-2 text-muted-foreground">Where they create</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleBentoClick('genre')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Musical Style</h3>
              </div>
              <p className="text-sm text-muted-foreground">Genres & Influences</p>
              <p className="text-xs mt-2 text-muted-foreground">Musical diversity</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleBentoClick('social')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Social Media</h3>
              </div>
              <p className="text-sm text-muted-foreground">Connect Online</p>
              <p className="text-xs mt-2 text-muted-foreground">Find them everywhere</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleBentoClick('stats')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Statistics</h3>
              </div>
              <p className="text-sm text-muted-foreground">Numbers & Metrics</p>
              <p className="text-xs mt-2 text-muted-foreground">Artist insights</p>
            </motion.div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About {artist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {artist.bio || 'No biography available for this artist.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="music" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Music</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Music content will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No upcoming events scheduled.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Media content will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Artist Modal */}
      <ArtistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent?.title || ''}
        content={modalContent?.content}
        type={modalContent?.type || ''}
      />
    </MainLayout>
  );
};

export default ArtistProfile;
