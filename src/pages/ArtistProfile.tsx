
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, MapPin, Calendar, Users, Star, Music, Award, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import MagicBento from '@/components/ui/MagicBento';
import ArtistModal from '@/components/artists/ArtistModal';

interface Artist {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  verified_status?: boolean;
  profile_image_url?: string;
  follower_count?: number;
  genre?: string[];
  social_links?: any;
  created_at: string;
  updated_at: string;
}

const ArtistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<'bio' | 'location' | 'genre' | 'stats' | 'social' | 'achievements'>('bio');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchArtist();
      if (user) {
        checkFollowStatus();
      }
    }
  }, [id, user]);

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
      toast({
        title: "Error",
        description: "Failed to load artist profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('artist_followers')
        .select('*')
        .eq('user_id', user.id)
        .eq('artist_id', id)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      // User not following
      setIsFollowing(false);
    }
  };

  const toggleFollow = async () => {
    if (!user || !id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to follow artists",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('artist_followers')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_id', id);
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You're no longer following ${artist?.name}`,
        });
      } else {
        await supabase
          .from('artist_followers')
          .insert({
            user_id: user.id,
            artist_id: id,
          });
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You're now following ${artist?.name}`,
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  const openModal = (type: 'bio' | 'location' | 'genre' | 'stats' | 'social' | 'achievements', title: string) => {
    setModalType(type);
    setModalTitle(title);
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

  if (!artist) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
            <p className="text-muted-foreground">The artist profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Artist Header */}
        <div className="relative mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={artist.profile_image_url || '/placeholder.svg'}
                alt={artist.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
              {artist.verified_status && (
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                  <Star className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                {artist.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{artist.location}</span>
                  </div>
                )}
                {artist.verified_status && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{artist.follower_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{artist.genre?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Genres</div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-center md:justify-start">
                <Button
                  onClick={toggleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Calendar className="h-5 w-5 mr-2" />
            Book A Lesson
          </Button>
          <Button size="lg" variant="outline">
            <Mail className="h-5 w-5 mr-2" />
            Contact
          </Button>
        </div>

        {/* Magic Bento Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bio Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('bio', 'About the Artist')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Biography</h3>
                    <p className="text-sm text-muted-foreground">Life Story</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {artist.bio || 'Discover their musical journey'}
                </p>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('location', 'Location')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-sm text-muted-foreground">Where They Create</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {artist.location || 'Location not specified'}
                </p>
              </CardContent>
            </Card>

            {/* Genre Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('genre', 'Musical Style')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Genres</h3>
                    <p className="text-sm text-muted-foreground">Musical Styles</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {artist.genre?.slice(0, 2).map((g, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                  {artist.genre && artist.genre.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{artist.genre.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('stats', 'Statistics')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Stats</h3>
                    <p className="text-sm text-muted-foreground">Fan Metrics</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {artist.follower_count || 0}
                </div>
                <p className="text-sm text-muted-foreground">Followers</p>
              </CardContent>
            </Card>

            {/* Social Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('social', 'Connect')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Social</h3>
                    <p className="text-sm text-muted-foreground">Connect Online</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {artist.social_links && Object.keys(artist.social_links).length > 0 
                    ? `${Object.keys(artist.social_links).length} platforms`
                    : 'No social links'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('achievements', 'Achievements')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Awards</h3>
                    <p className="text-sm text-muted-foreground">Recognition</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {artist.verified_status && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About {artist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {artist.bio || 'No biography available for this artist.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lesson information will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Course information will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Schedule information will be displayed here.
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
        title={modalTitle}
        data={modalData}
        type={modalType}
      />
    </MainLayout>
  );
};

export default ArtistProfile;
