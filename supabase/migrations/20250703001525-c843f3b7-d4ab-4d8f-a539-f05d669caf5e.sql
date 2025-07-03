-- Create comprehensive playlists and courses system

-- Enhanced playlists table
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_art_url TEXT,
    category TEXT CHECK (category IN ('covers', 'originals_by_saems_tunes', 'personal_playlist')) DEFAULT 'personal_playlist',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    play_count INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(playlist_id, track_id)
);

-- Artists table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    genre TEXT[],
    location TEXT,
    verified_status BOOLEAN DEFAULT false,
    social_links JSONB,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Artist followers junction table
CREATE TABLE IF NOT EXISTS public.artist_followers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(artist_id, user_id)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, learning_path_id)
);

-- Tool suggestions table
CREATE TABLE IF NOT EXISTS public.tool_suggestions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tool_name TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[],
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media watermarks table for downloaded content
CREATE TABLE IF NOT EXISTS public.media_watermarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    watermarked_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_watermarks ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view public playlists or their own" ON public.playlists
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" ON public.playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON public.playlists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON public.playlists
    FOR DELETE USING (auth.uid() = user_id);

-- Playlist tracks policies
CREATE POLICY "Users can view tracks in accessible playlists" ON public.playlist_tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.playlists p 
            WHERE p.id = playlist_id 
            AND (p.is_public = true OR p.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage tracks in their playlists" ON public.playlist_tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.playlists p 
            WHERE p.id = playlist_id AND p.user_id = auth.uid()
        )
    );

-- Artists policies
CREATE POLICY "Anyone can view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Only admins can manage artists" ON public.artists FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Artist followers policies
CREATE POLICY "Users can view all follows" ON public.artist_followers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON public.artist_followers
    FOR ALL USING (auth.uid() = user_id);

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Tool suggestions policies
CREATE POLICY "Users can view all suggestions" ON public.tool_suggestions FOR SELECT USING (true);
CREATE POLICY "Users can create suggestions" ON public.tool_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suggestions" ON public.tool_suggestions
    FOR UPDATE USING (auth.uid() = user_id);

-- Media watermarks policies
CREATE POLICY "Users can view their own watermarks" ON public.media_watermarks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own watermarks" ON public.media_watermarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_category ON public.playlists(category);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON public.playlists(is_public);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON public.playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON public.playlist_tracks(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_artists_name ON public.artists(name);
CREATE INDEX IF NOT EXISTS idx_artist_followers_artist_id ON public.artist_followers(artist_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_suggestions_status ON public.tool_suggestions(status);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON public.playlists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tool_suggestions_updated_at
    BEFORE UPDATE ON public.tool_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();