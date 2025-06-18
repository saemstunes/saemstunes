import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Pause, Heart, MessageCircle, Music, CheckCircle, Clock, Star, TrendingUp, Share } from "lucide-react";
import AudioPlayer from "@/components/media/AudioPlayer";
import { canAccessContent, AccessLevel } from "@/lib/contentAccess";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedList from "@/components/tracks/AnimatedList";
import ChromaGrid from "@/components/tracks/ChromaGrid";
import TiltedCard from "@/components/tracks/TiltedCard";
import CountUp from "@/components/tracks/CountUp";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { useNavigate } from "react-router-dom";

interface Track {
  id: string;
  title: string;
  description: string;
  audio_path: string;
  cover_path?: string;
  access_level: AccessLevel;
  user_id: string;
  approved: boolean;
  created_at: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
}

const Tracks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState("showcase");
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('free');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Sample data for demonstrations
  const featuredTrack = {
    imageSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover%20Art/salama-featured.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvQ292ZXIgQXJ0L3NhbGFtYS1mZWF0dXJlZC5qcGciLCJpYXQiOjE3NDk5NTMwNTksImV4cCI6MTc4MTQ4OTA1OX0.KtKlRXxj5z5KzzbnTDWd9oRVbztRHwioGA0YN1Xjn4Q",
    title: "Featured Track of the Week",
    artist: "Saem's Tunes ft. Evans Simali - Salama (DEMO)",
    plays: 0,
    likes: 0,
    audioSrc: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Tracks/Salama%20ft.%20Simali%20(DEMO).mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvVHJhY2tzL1NhbGFtYSBmdC4gU2ltYWxpIChERU1PKS5tcDMiLCJpYXQiOjE3NDk2MTU1NDIsImV4cCI6MTc1MjIwNzU0Mn0.kehGk3zwno3PEvRY8Z-lMqD3QNp027VFg-qKwfTXwO0"
  };

  const albumItems = [
    {
      image: "https://i.imgur.com/VfKXMyG.png",
      title: "Pale Ulipo",
      subtitle: "Accompanied Cover",
      handle: "@saemstunes",
      borderColor: "#5A270F",
      gradient: "linear-gradient(145deg, #5A270F, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvQ292ZXJfVHJhY2tzL1BhbGUgVWxpcG8gY292ZXIubTRhIiwiaWF0IjoxNzQ5OTYwMjQ1LCJleHAiOjE3ODE0OTYyNDV9.3vv7kkkTTw2uRXG_HEItaCZ5xC6dbgcucC-PYjJKXLA",
      duration: "2:53",
      previewUrl: "https://www.youtube.com/watch?v=Y5hIQj7WoDg",
      videoUrl: "https://www.youtube.com/watch?v=Y5hIQj7WoDg",
      youtubeUrl: "https://www.youtube.com/watch?v=Y5hIQj7WoDg",
      primaryColor: "#5A270F",
      secondaryColor: "#8B4513",
      backgroundGradient: "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)",
    },
    {
      image: "https://i.imgur.com/6yr8BpG.jpeg", 
      title: "I Need You More",
      subtitle: "Acoustic Cover",
      handle: "@saemstunes",
      borderColor: "#DF8142",
      gradient: "linear-gradient(180deg, #DF8142, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/8fd68d12-48b8-45df-9f9c-47454a8b3d63/1750071545026-I_Need_You_More_-_Abbie_Gamboa__inspired_by_Isaiah_Emmanuel___Saem_s_Tunes_cover__-_02_Intro.mp3",
      duration: "0:53",
      previewUrl: "https://www.youtube.com/shorts/CcC5vemVEjY",
      videoUrl: "https://www.youtube.com/shorts/CcC5vemVEjY",
      youtubeUrl: "https://www.youtube.com/shorts/CcC5vemVEjY",
      primaryColor: "#DF8142",
      secondaryColor: "#F4A460",
      backgroundGradient: "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)",
    },
    {
      image: "https://i.imgur.com/LJQDADg.jpeg",
      title: "Ni Hai",
      subtitle: "Original",
      handle: "@saemstunes, @kendinkonge",
      borderColor: "#EEB38C",
      gradient: "linear-gradient(165deg, #EEB38C, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Salama%20ft.%20Simali%20(DEMO).mp3",
      duration: "1:18",
      previewUrl: "https://youtu.be/0aLSJiQrMRc?si=WJzRMZVah_UTj7Fs",
      videoUrl: "https://youtu.be/0aLSJiQrMRc?si=WJzRMZVah_UTj7Fs",
      youtubeUrl: "https://youtu.be/0aLSJiQrMRc?si=WJzRMZVah_UTj7Fs",
      primaryColor: "#EEB38C",
      secondaryColor: "#DEB887",
      backgroundGradient: "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)",
    },
        {
      image: "https://i.imgur.com/wrm7LI1.jpeg",
      title: "Mapenzi Ya Ajabu",
      subtitle: "Original",
      handle: "@saemstunes",
      borderColor: "#5A270F",
      gradient: "linear-gradient(145deg, #5A270F, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Ni%20Hai%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
      duration: "1:30",
      previewUrl: "https://youtu.be/rl5UOp8q1cM?si=pPE-0BljTQ-kceMl",
      videoUrl: "https://youtu.be/rl5UOp8q1cM?si=pPE-0BljTQ-kceMl",
      youtubeUrl: "https://youtu.be/rl5UOp8q1cM?si=pPE-0BljTQ-kceMl",
      primaryColor: "#5A270F",
      secondaryColor: "#8B4513",
      backgroundGradient: "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)",
    },
    {
      image: "https://i.imgur.com/dzjTYAw.jpeg", 
      title: "LOVE Medley",
      subtitle: "Project",
      handle: "@saemstunes",
      borderColor: "#DF8142",
      gradient: "linear-gradient(180deg, #DF8142, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/8fd68d12-48b8-45df-9f9c-47454a8b3d63/1750071545026-I_Need_You_More_-_Abbie_Gamboa__inspired_by_Isaiah_Emmanuel___Saem_s_Tunes_cover__-_02_Intro.mp3",
      duration: "2:07",
      previewUrl: "https://youtu.be/9NU3PBcj1-U?si=b75lJDDRm1rAiw0A",
      videoUrl: "https://youtu.be/9NU3PBcj1-U?si=b75lJDDRm1rAiw0A",
      youtubeUrl: "https://youtu.be/9NU3PBcj1-U?si=b75lJDDRm1rAiw0A",
      primaryColor: "#DF8142",
      secondaryColor: "#F4A460",
      backgroundGradient: "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)",
    },
    {
      image: "https://i.imgur.com/HDBX1q8.jpeg",
      title: "TCBU Medley",
      subtitle: "Project",
      handle: "@saemstunes, @timgrandmich",
      borderColor: "#EEB38C",
      gradient: "linear-gradient(165deg, #EEB38C, #000)",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Salama%20ft.%20Simali%20(DEMO).mp3",
      duration: "3:36",
      previewUrl: "https://youtu.be/GEcYrcEvFas?si=C9BQt6wvNy2Zxnvk",
      videoUrl: "https://youtu.be/GEcYrcEvFas?si=C9BQt6wvNy2Zxnvk",
      youtubeUrl: "https://youtu.be/GEcYrcEvFas?si=C9BQt6wvNy2Zxnvk",
      primaryColor: "#EEB38C",
      secondaryColor: "#DEB887",
      backgroundGradient: "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)",
    },
  ];

  // Example usage for dynamic background that shifts with current track
  const updateBackgroundGradient = (currentTrackIndex: number) => {
    const currentTrack = albumItems[currentTrackIndex];
    const body = document.body;
    if (body) {
      body.style.background = currentTrack.backgroundGradient;
    }
    
    // Or for a container element
    const container = document.querySelector('.music-player-container') as HTMLElement;
    if (container) {
      container.style.background = currentTrack.backgroundGradient;
    }
  };

  // Example CSS variables approach for dynamic theming
  const applyDynamicColors = (currentTrackIndex: number) => {
    const currentTrack = albumItems[currentTrackIndex];
    const root = document.documentElement;
    
    if (root) {
      root.style.setProperty('--primary-color', currentTrack.primaryColor);
      root.style.setProperty('--secondary-color', currentTrack.secondaryColor);
      root.style.setProperty('--dynamic-gradient', currentTrack.backgroundGradient);
    }
  };

  const playlistTracks = [
    "African Gospel",
    "Christian Afrobeats", 
    "Morning Coffee Jazz",
    "Workout Motivation",
    "Late Night Vibes",
    "Classical Focus",
    "Indie Rock Mix",
    "Electronic Dreams"
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchTracks();
    
    // Set up realtime listener for tracks
    const channel = supabase
      .channel('tracks-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tracks'
      }, (payload) => {
        console.log('Track uploaded:', payload);
        fetchTracks(); // Refresh the list
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
        id,
        title,
        description,
        audio_path,
        cover_path,
        access_level,
        user_id,
        approved,
        created_at,
        profiles:user_id (
        display_name,
        avatar_url
        )
        `)
        .order('created_at', { ascending: false });

      if (error) {
      console.error('Supabase Error Details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
      
      // Filter tracks based on user access level and ensure proper typing
      const typedTracks = (data || []).map(track => ({
        id: track.id,
        title: track.title,
        description: track.description,
        audio_path: track.audio_path,
        cover_path: track.cover_path,
        access_level: track.access_level as AccessLevel,
        user_id: track.user_id,
        created_at: track.created_at,
        profiles: track.profiles
      })) as Track[];
      
      const accessibleTracks = typedTracks.filter(track => 
        canAccessContent(track.access_level, user, user?.subscriptionTier)
      );
      
      setTracks(accessibleTracks);
    } catch (error) {
      console.error('Full Error Object:', error);
      toast({
        title: "Error",
        description: "Failed to load tracks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload tracks",
        variant: "destructive",
      });
      return;
    }

    if (!audioFile || !title.trim()) {
      toast({
        title: "Missing Information", 
        description: "Audio file and title are required",
        variant: "destructive",
      });
      return;
    }

    // Validate file types for security
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedAudioTypes.includes(audioFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid audio file (MP3, WAV, M4A)",
        variant: "destructive",
      });
      return;
    }

    if (coverFile && !allowedImageTypes.includes(coverFile.type)) {
      toast({
        title: "Invalid File Type", 
        description: "Please upload a valid image file (JPEG, PNG)",
        variant: "destructive",
      });
      return;
    }

    // Check file size limits (10MB for audio, 5MB for image)
    if (audioFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Audio file must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    if (coverFile && coverFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Cover image must be less than 5MB", 
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
    // Upload audio file with user folder structure
    const sanitizedAudioName = `${user.id}/${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data: audioData, error: audioError } = await supabase.storage
      .from('tracks')
      .upload(sanitizedAudioName, audioFile); // Remove 'audio/' prefix

    if (audioError) {
      console.error('Audio upload error:', audioError);
      throw new Error(`Audio upload failed: ${audioError.message}`);
    }

    // Upload cover image with user folder structure
    let coverPath = null;
    if (coverFile) {
      const sanitizedCoverName = `${user.id}/${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('tracks')
        .upload(sanitizedCoverName, coverFile); // Remove 'covers/' prefix

      if (coverError) {
        console.error('Cover upload error:', coverError);
        throw new Error(`Cover upload failed: ${coverError.message}`);
      }
      coverPath = coverData.path;
    }

      // Save track to database
      const { error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: title.trim(),
          description: description.trim(),
          audio_path: audioData.path,
          cover_path: coverPath,
          access_level: accessLevel,
          user_id: user.id
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw new Error(`Database save failed: ${dbError.message}`);
      }

      toast({
        title: "Upload Successful!",
        description: "Your track has been uploaded successfully.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setAudioFile(null);
      setCoverFile(null);
      setAccessLevel('free');
      setShowUpload(false);
      
      // Refresh tracks
      fetchTracks();
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload track. Please try again.';
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePlayNow = () => {
    navigate('/audio-player/featured', {
      state: {
        track: {
          id: 'featured',
          src: featuredTrack.audioSrc,
          name: 'Salama (DEMO)',
          artist: 'Saem\'s Tunes ft. Evans Simali',
          artwork: featuredTrack.imageSrc,
          album: 'NaombAoH'
        }
      }
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Music className="h-12 w-12 animate-spin mx-auto mb-4 text-gold" />
            <p>Loading tracks...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tracks - Saem's Tunes</title>
        <meta name="description" content="Discover and share amazing music tracks on Saem's Tunes" />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-background pb-20 lg:pb-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Tracks</h1>
                <p className="text-muted-foreground">Discover and share amazing music</p>
              </div>
              
              {user && (
                <Button 
                  onClick={() => setShowUpload(!showUpload)}
                  className="bg-gold hover:bg-gold/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Track
                </Button>
              )}
            </div>

            {/* Upload Form */}
            {showUpload && user && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Your Track
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Track title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                  
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                  />
                  
                  <Select value={accessLevel} onValueChange={(value: AccessLevel) => setAccessLevel(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free - Everyone can listen</SelectItem>
                      <SelectItem value="auth">Sign In Required</SelectItem>
                      <SelectItem value="basic">Basic Subscribers</SelectItem>
                      <SelectItem value="premium">Premium Subscribers</SelectItem>
                      <SelectItem value="professional">Professional Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Audio File * (Max 10MB)</label>
                    <Input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/mpeg,audio/m4a,audio/aac"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cover Image (Max 5MB)</label>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUpload} 
                      disabled={uploading || !title.trim() || !audioFile}
                      className="bg-gold hover:bg-gold/90"
                    >
                      {uploading ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Track
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowUpload(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="showcase">Showcase</TabsTrigger>
                <TabsTrigger value="albums">Covers</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="showcase" className="space-y-8">
                {/* Featured Track of the Week */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-6 w-6 text-gold" />
                    <h2 className="text-2xl font-bold">Featured Track of the Week</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
                    <div className="flex justify-center relative order-2 md:order-1">
                      <div className="hover:z-[9999] relative transition-all duration-300 w-full max-w-sm">
                        <ResponsiveImage
                          src={featuredTrack.imageSrc}
                          alt="Featured Track Cover"
                          width={400}
                          height={400}
                          mobileWidth={280}
                          mobileHeight={280}
                          className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                          priority={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 order-1 md:order-2 text-center md:text-left">
                      <h3 className="text-xl font-semibold">{featuredTrack.artist}</h3>
                      <p className="text-muted-foreground">
                        Amidst a concerning time around the world, we thought to capture the picture of it in light of what we know & are assured of. This song goes back almost 20 years & to be able to translate it in this way, with some of the people who have been a support to this space, is an esteemed honor. I pray this song grows to translate, even beyond my ability, the moments that can't be imagined: bomb landings in promised sheltered areas, an innocent mum and dad beholding their lost child, a child suddenly made an orphan, the plight of a future riddled with uncertainties as powers that greater be call the shots... how damning to not even be able to promise a solution. But even in the midst of it, just to find a voice that speaks to you, comforts you, is a true balm to the wounds the world oft inflicts. Might I present to you Jesus? He knows every thought, bottles every tear and is sovereign even when it feels He isn't. In Christ, nahnu aaminum/nahnun 'āminūm/sango mbote/we are safe/tuko SALAMA!  
                      </p>
                      
                      <div className="flex gap-8 justify-center md:justify-start">
                        <div className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Play className="h-4 w-4" />
                            <CountUp to={featuredTrack.plays} separator="," className="text-2xl font-bold text-gold" />
                          </div>
                          <p className="text-sm text-muted-foreground">Plays</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Heart className="h-4 w-4" />
                            <CountUp to={featuredTrack.likes} separator="," className="text-2xl font-bold text-gold" />
                          </div>
                          <p className="text-sm text-muted-foreground">Likes</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="bg-gold hover:bg-gold/90 w-full md:w-auto"
                        onClick={handlePlayNow}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Now
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Upcoming Singles */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-6 w-6 text-gold" />
                    <h2 className="text-2xl font-bold">Suggested By You</h2>
                  </div>
                  
                  <div className="grid gap-6">
                    {tracks.slice(0, 3).map((track) => (
                      <TrackCard key={track.id} track={track} user={user} />
                    ))}
                    
                    {tracks.length === 0 && (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Music className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No tracks yet</h3>
                          <p className="text-muted-foreground text-center mb-4">
                            Be the first to share your music with the community!
                          </p>
                          {user && (
                            <Button 
                              onClick={() => setShowUpload(true)}
                              className="bg-gold hover:bg-gold/90"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload First Track
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="albums" className="space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <Music className="h-6 w-6 text-gold" />
                  <h2 className="text-2xl font-bold">Featured Covers</h2>
                </div>
                
                <div className="w-full overflow-hidden">
                  <ChromaGrid 
                    items={albumItems}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                    />
                </div>
              </TabsContent>

              <TabsContent value="playlists" className="space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <Music className="h-6 w-6 text-gold" />
                  <h2 className="text-2xl font-bold">Popular Playlists</h2>
                </div>
                
                <div className="w-full overflow-hidden px-2">
                  <div className="max-w-full">
                    <AnimatedList
                      items={playlistTracks}
                      onItemSelect={(item, index) => console.log(item, index)}
                      showGradients={true}
                      enableArrowNavigation={true}
                      displayScrollbar={true}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="community" className="space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <Music className="h-6 w-6 text-gold" />
                  <h2 className="text-2xl font-bold">Community Tracks</h2>
                </div>
                
                <div className="grid gap-6">
                  {tracks.map((track) => (
                    <TrackCard key={track.id} track={track} user={user} />
                  ))}
                  
                  {tracks.length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Music className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No community tracks yet</h3>
                        <p className="text-muted-foreground text-center mb-4">
                          Be the first to share your music with the community!
                        </p>
                        {user && (
                          <Button 
                            onClick={() => setShowUpload(true)}
                            className="bg-gold hover:bg-gold/90"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload First Track
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

const TrackCard = ({ track, user }: { track: Track; user: any }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  
  const audioUrl = track.audio_path ? 
    supabase.storage.from('tracks').getPublicUrl(track.audio_path).data.publicUrl : '';
  
  const coverUrl = track.cover_path ? 
    supabase.storage.from('tracks').getPublicUrl(track.cover_path).data.publicUrl : '';
  
  useEffect(() => {
    if (user) {
      checkIfLiked();
      checkIfSaved();
      getLikeCount();
    }
  }, [user, track.id]);

  const checkIfLiked = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('track_id', track.id)
      .single();
    
    setLiked(!!data);
  };

  const checkIfSaved = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', track.id)
      .eq('content_type', 'track')
      .single();
    
    setSaved(!!data);
  };

  const getLikeCount = async () => {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('track_id', track.id);
    
    setLikeCount(count || 0);
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like tracks",
        variant: "destructive",
      });
      return;
    }
    
    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', track.id);
      setLiked(false);
      setLikeCount(prev => prev - 1);
      toast({
        title: "Removed from likes",
        description: "Track removed from your liked songs",
      });
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: user.id, track_id: track.id });
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast({
        title: "Added to likes",
        description: "Track added to your liked songs",
      });
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save tracks",
        variant: "destructive",
      });
      return;
    }
    
    if (saved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', track.id)
        .eq('content_type', 'track');
      setSaved(false);
      toast({
        title: "Removed from saved",
        description: "Track removed from your saved songs",
      });
    } else {
      await supabase
        .from('favorites')
        .insert({ 
          user_id: user.id, 
          content_id: track.id,
          content_type: 'track'
        });
      setSaved(true);
      toast({
        title: "Added to saved",
        description: "Track added to your saved songs",
      });
    }
  };

  const handleShare = async () => {
  // Determine the appropriate base URL
  const getBaseUrl = () => {
    // Check if we're on production or development
    const hostname = window.location.hostname;
    
    if (hostname === 'saemstunes.vercel.app') {
      return 'https://saemstunes.vercel.app';
    } else if (hostname === 'saemstunes.lovable.app') {
      return 'https://saemstunes.lovable.app';
    } else {
      // Fallback for local development or other environments
      return window.location.origin;
    }
  };

  const shareData = {
    title: `${track.title} by ${track.profiles?.display_name || 'Unknown Artist'}`,
    text: `Listen to ${track.title} on Saem's Tunes`,
    url: `${getBaseUrl()}/audio-player/${track.id}`,
  };

  try {
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback to copying link
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link copied",
        description: "Track link copied to clipboard",
      });
    }
  } catch (error) {
    console.error('Error sharing:', error);
    // Fallback to copying link
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link copied",
        description: "Track link copied to clipboard",
      });
    } catch (clipboardError) {
      toast({
        title: "Always A Next Time!",
        description: "Come back when you\'re ready & spread the good news",
        variant: "destructive",
      });
    }
  }
};

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
            {track.profiles?.avatar_url ? (
              <ResponsiveImage 
                src={track.profiles.avatar_url} 
                alt="Artist" 
                width={48}
                height={48}
                mobileWidth={48}
                mobileHeight={48}
                className="h-12 w-12 rounded-full object-cover"
                priority={false}
              />
            ) : (
              <Music className="h-6 w-6 text-gold" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{track.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              by {track.profiles?.display_name || 'Unknown Artist'}
            </p>
            {track.description && (
              <p className="text-sm mt-2">{track.description}</p>
            )}
          </div>
          
          {coverUrl && (
            <ResponsiveImage 
              src={coverUrl} 
              alt="Cover" 
              width={64}
              height={64}
              mobileWidth={48}
              mobileHeight={48}
              className="h-16 w-16 md:h-16 md:w-16 sm:h-12 sm:w-12 rounded object-cover"
              priority={false}
            />
          )}
        </div>

        {audioUrl && (
          <div className="mb-4">
            <AudioPlayer 
              src={audioUrl}
              title={track.title}
              artist={track.profiles?.display_name || 'Unknown Artist'}
              artwork={coverUrl}
              compact={false}
            />
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          {user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {likeCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSave}
                className="flex items-center gap-2"
              >
                <CheckCircle className={`h-4 w-4 ${saved ? 'fill-green-500 text-green-500' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(track.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tracks;
