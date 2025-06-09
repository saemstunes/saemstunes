
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Pause, Heart, MessageCircle, Music, CheckCircle, Clock } from "lucide-react";
import AudioPlayer from "@/components/media/AudioPlayer";
import { canAccessContent } from "@/lib/contentAccess";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet";

type AccessLevel = 'free' | 'auth' | 'basic' | 'premium' | 'enterprise';

interface Track {
  id: string;
  title: string;
  description: string;
  audio_path: string;
  cover_path?: string;
  access_level: AccessLevel;
  user_id: string;
  created_at: string;
  approved: boolean;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
}

const MusicShowcase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('free');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTracks();
    
    // Set up realtime listener for approved tracks
    const channel = supabase
      .channel('tracks-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tracks',
        filter: 'approved=eq.true'
      }, (payload) => {
        console.log('Track approved:', payload);
        fetchTracks(); // Refresh the list
        
        // Create notification for approved track
        if (payload.new) {
          createNotification(payload.new as Track);
        }
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
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('approved', true) // Only show approved tracks
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter tracks based on user access level and ensure proper typing
      const tracksWithApproval = data?.map(track => ({
        ...track,
        approved: track.approved ?? true,
        access_level: track.access_level as AccessLevel
      })) || [];
      
      const accessibleTracks = tracksWithApproval.filter(track => 
        canAccessContent(track.access_level, user, user?.subscriptionTier)
      );
      
      setTracks(accessibleTracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load tracks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (track: Track) => {
    try {
      const visibleTo = track.access_level === 'free' ? 'all' : 
                       track.access_level === 'auth' ? 'signed-in' :
                       track.access_level;
      
      await supabase
        .from('notifications')
        .insert({
          message: `🎵 New ${track.access_level} track: "${track.title}" has been uploaded!`,
          visible_to: visibleTo,
          type: 'new-track'
        });
    } catch (error) {
      console.error('Error creating notification:', error);
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
      // Call moderation edge function first
      const { data: moderationResult, error: moderationError } = await supabase.functions
        .invoke('moderate-upload', {
          body: {
            title,
            description,
            user_id: user.id
          }
        });

      if (moderationError || !moderationResult?.approved) {
        toast({
          title: "Upload Rejected",
          description: moderationResult?.reason || "Track did not pass moderation",
          variant: "destructive",
        });
        return;
      }

      // Upload audio file with sanitized filename
      const sanitizedAudioName = `${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('tracks')
        .upload(`audio/${sanitizedAudioName}`, audioFile);

      if (audioError) throw audioError;

      // Upload cover image if provided
      let coverPath = null;
      if (coverFile) {
        const sanitizedCoverName = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from('tracks')
          .upload(`covers/${sanitizedCoverName}`, coverFile);

        if (coverError) throw coverError;
        coverPath = coverData.path;
      }

      // Save track to database (pending approval)
      const { error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: title.trim(),
          description: description.trim(),
          audio_path: audioData.path,
          cover_path: coverPath,
          access_level: accessLevel,
          user_id: user.id,
          approved: false // Pending admin approval
        });

      if (dbError) throw dbError;

      // Send email notification to admin
      await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'track_upload',
          title,
          description,
          user_email: user.email,
          user_name: user.name || 'Unknown User'
        }
      });

      toast({
        title: "Upload Submitted!",
        description: "Your track has been submitted for review. You'll be notified once it's approved.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setAudioFile(null);
      setCoverFile(null);
      setAccessLevel('free');
      setShowUpload(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
        <title>Music Showcase - Saem's Tunes</title>
        <meta name="description" content="Discover and share amazing music on Saem's Tunes" />
      </Helmet>
      
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Music Showcase</h1>
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
                  <p className="text-sm text-muted-foreground">
                    Your track will be reviewed before being published to ensure quality and safety.
                  </p>
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
                      <SelectItem value="enterprise">Enterprise Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Audio File * (Max 10MB)</label>
                    <Input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/mpeg,audio/m4a"
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit for Review
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

            {/* Tracks Feed */}
            <div className="grid gap-6">
              {tracks.length === 0 ? (
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
              ) : (
                tracks.map((track) => (
                  <TrackCard key={track.id} track={track} user={user} />
                ))
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

const TrackCard = ({ track, user }: { track: Track; user: any }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      checkIfLiked();
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

  const getLikeCount = async () => {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('track_id', track.id);
    
    setLikeCount(count || 0);
  };

  const toggleLike = async () => {
    if (!user) return;
    
    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', track.id);
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: user.id, track_id: track.id });
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const audioUrl = track.audio_path ? 
    supabase.storage.from('tracks').getPublicUrl(track.audio_path).data.publicUrl : '';
  
  const coverUrl = track.cover_path ? 
    supabase.storage.from('tracks').getPublicUrl(track.cover_path).data.publicUrl : '';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
            {track.profiles?.avatar_url ? (
              <img 
                src={track.profiles.avatar_url} 
                alt="Artist" 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <Music className="h-6 w-6 text-gold" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{track.title}</h3>
              {track.approved && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              by {track.profiles?.display_name || 'Unknown Artist'}
            </p>
            {track.description && (
              <p className="text-sm mt-2">{track.description}</p>
            )}
          </div>
          
          {coverUrl && (
            <img 
              src={coverUrl} 
              alt="Cover" 
              className="h-16 w-16 rounded object-cover"
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

        <div className="flex items-center gap-4">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              {likeCount}
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comment
          </Button>
          
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(track.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicShowcase;
