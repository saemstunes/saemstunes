
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User, 
  Music, 
  MapPin, 
  Users, 
  Star, 
  Heart, 
  Play,
  Verified,
  TrendingUp,
  Clock,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import { useIsMobile } from '@/hooks/use-mobile';

interface Artist {
  id: string;
  name: string;
  genre: string[];
  location: string;
  followerCount: number;
  isVerified: boolean;
  profileImage: string;
  bio: string;
  topTracks: number;
  monthlyListeners: number;
  isFollowing: boolean;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  // Mock artists data
  useEffect(() => {
    const mockArtists: Artist[] = [
      {
        id: '1',
        name: "Saem's Tunes",
        genre: ['Gospel', 'Christian Contemporary'],
        location: 'Nairobi, Kenya',
        followerCount: 15200,
        isVerified: true,
        profileImage: '/placeholder.svg',
        bio: 'Making music that represents Christ and touches hearts worldwide.',
        topTracks: 24,
        monthlyListeners: 45600,
        isFollowing: false,
        socialLinks: {
          instagram: 'https://instagram.com/saemstunes',
          spotify: 'https://open.spotify.com/artist/6oMbcOwuuETAvO51LesbO8'
        }
      },
      {
        id: '2',
        name: 'Grace Wanjiku',
        genre: ['Worship', 'Swahili Gospel'],
        location: 'Mombasa, Kenya',
        followerCount: 8900,
        isVerified: false,
        profileImage: '/placeholder.svg',
        bio: 'Worship leader passionate about African gospel music.',
        topTracks: 18,
        monthlyListeners: 23400,
        isFollowing: false
      },
      {
        id: '3',
        name: 'David Mwangi',
        genre: ['Contemporary Christian', 'Afrobeats Gospel'],
        location: 'Kampala, Uganda',
        followerCount: 12800,
        isVerified: true,
        profileImage: '/placeholder.svg',
        bio: 'Blending modern sounds with timeless gospel messages.',
        topTracks: 31,
        monthlyListeners: 38200,
        isFollowing: false
      },
      {
        id: '4',
        name: 'Praise Collective',
        genre: ['Choir', 'Traditional Gospel'],
        location: 'Lagos, Nigeria',  
        followerCount: 21500,
        isVerified: true,
        profileImage: '/placeholder.svg',
        bio: 'United voices lifting up the name of Jesus across Africa.',
        topTracks: 15,
        monthlyListeners: 67800,
        isFollowing: false
      },
      {
        id: '5',
        name: 'Sarah Kimani',
        genre: ['Christian Pop', 'Youth Ministry'],
        location: 'Kigali, Rwanda',
        followerCount: 6700,
        isVerified: false,
        profileImage: '/placeholder.svg',
        bio: 'Creating music that speaks to the younger generation.',
        topTracks: 12,
        monthlyListeners: 18900,
        isFollowing: false
      },
      {
        id: '6',
        name: 'Emmanuel Sounds',
        genre: ['Hillsong Style', 'Modern Worship'],
        location: 'Accra, Ghana',
        followerCount: 9800,
        isVerified: false,
        profileImage: '/placeholder.svg',
        bio: 'Contemporary worship with an African heartbeat.',
        topTracks: 22,
        monthlyListeners: 29600,
        isFollowing: false
      }
    ];
    
    setArtists(mockArtists);
  }, []);

  const genres = [
    'all',
    'Gospel',
    'Christian Contemporary', 
    'Worship',
    'Afrobeats Gospel',
    'Traditional Gospel',
    'Christian Pop'
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'followers', label: 'Most Followers' },
    { value: 'recent', label: 'Recently Added' }
  ];

  // Filter and sort artists
  const filteredArtists = artists
    .filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artist.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           artist.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || artist.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'followers':
          return b.followerCount - a.followerCount;
        case 'recent':
          return Math.random() - 0.5; // Random for demo
        default: // popularity
          return b.monthlyListeners - a.monthlyListeners;
      }
    });

  const handleFollow = (artistId: string) => {
    setFollowedArtists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artistId)) {
        newSet.delete(artistId);
      } else {
        newSet.add(artistId);
      }
      return newSet;
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

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

  const ArtistCard = ({ artist }: { artist: Artist }) => {
    const isFollowing = followedArtists.has(artist.id);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: isMobile ? 0 : -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 h-full">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={artist.profileImage} 
                alt={artist.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Artist Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-lg truncate">{artist.name}</h3>
                  {artist.isVerified && (
                    <Verified className="h-4 w-4 text-blue-500 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{artist.location}</span>
                </div>
              </div>

              {/* Play Button */}
              <Button
                size="icon"
                className="absolute top-4 right-4 bg-gold hover:bg-gold-dark text-white h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              {/* Genres */}
              <div className="flex flex-wrap gap-1 mb-3">
                {artist.genre.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {artist.genre.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{artist.genre.length - 2}
                  </Badge>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {artist.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <div>
                  <div className="font-bold text-sm">{formatNumber(artist.followerCount)}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div>
                  <div className="font-bold text-sm">{formatNumber(artist.monthlyListeners)}</div>
                  <div className="text-xs text-muted-foreground">Monthly</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleFollow(artist.id)}
                  className={`flex-1 ${
                    isFollowing 
                      ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                      : 'bg-gold hover:bg-gold-dark text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button size="icon" variant="outline">
                  <Music className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5 w-full max-w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container px-3 sm:px-6 lg:px-8 py-6 w-full max-w-full">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Discover <span className="text-gold">Artists</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with talented Christian artists from across Africa and beyond
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="mb-8 space-y-4"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artists, genres, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredArtists.length} artists found</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>24 new this month</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold" />
                  <span>{followedArtists.size} following</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Artists Grid/List */}
          <motion.div 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            variants={containerVariants}
          >
            <AnimatePresence>
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredArtists.length === 0 && (
            <motion.div 
              className="text-center py-16"
              variants={itemVariants}
            >
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No artists found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('all');
                }}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Load More - Future Enhancement */}
          {filteredArtists.length > 0 && (
            <motion.div 
              className="text-center mt-12"
              variants={itemVariants}
            >
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                Load More Artists
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Artists;
