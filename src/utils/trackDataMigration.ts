
import { supabase } from '@/integrations/supabase/client';

interface SampleTrack {
  title: string;
  subtitle: string;
  handle: string;
  audioUrl: string;
  image: string;
  duration: string;
  videoUrl?: string;
  youtubeUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundGradient: string;
}

export const migrateSampleTracksToSupabase = async (userId: string) => {
  const sampleTracks: SampleTrack[] = [
    {
      title: "Pale Ulipo",
      subtitle: "Accompanied Cover",
      handle: "@saemstunes",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/sign/tracks/Cover_Tracks/Pale%20Ulipo%20cover.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjQzNDkyMC03Y2ViLTQ2MDQtOWU2Zi05YzY2ZmEwMDAxYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cmFja3MvQ292ZXJfVHJhY2tzL1BhbGUgVWxpcG8gY292ZXIubTRhIiwiaWF0IjoxNzQ5OTYwMjQ1LCJleHAiOjE3ODE0OTYyNDV9.3vv7kkkTTw2uRXG_HEItaCZ5xC6dbgcucC-PYjJKXLA",
      image: "https://i.imgur.com/VfKXMyG.png",
      duration: "2:53",
      videoUrl: "https://www.youtube.com/watch?v=Y5hIQj7WoDg",
      youtubeUrl: "https://www.youtube.com/watch?v=Y5hIQj7WoDg",
      primaryColor: "#5A270F",
      secondaryColor: "#8B4513",
      backgroundGradient: "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)",
    },
    {
      title: "I Need You More",
      subtitle: "Acoustic Cover",
      handle: "@saemstunes",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/I%20Need%20You%20More.wav",
      image: "https://i.imgur.com/6yr8BpG.jpeg",
      duration: "0:53",
      videoUrl: "https://www.youtube.com/shorts/CcC5vemVEjY",
      youtubeUrl: "https://www.youtube.com/shorts/CcC5vemVEjY",
      primaryColor: "#DF8142",
      secondaryColor: "#F4A460",
      backgroundGradient: "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)",
    },
    {
      title: "Ni Hai",
      subtitle: "Original",
      handle: "@saemstunes, @kendinkonge",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Ni%20Hai%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
      image: "https://i.imgur.com/LJQDADg.jpeg",
      duration: "1:18",
      videoUrl: "https://youtu.be/0aLSJiQrMRc?si=WJzRMZVah_UTj7Fs",
      youtubeUrl: "https://youtu.be/0aLSJiQrMRc?si=WJzRMZVah_UTj7Fs",
      primaryColor: "#EEB38C",
      secondaryColor: "#DEB887",
      backgroundGradient: "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)",
    },
    {
      title: "Mapenzi Ya Ajabu",
      subtitle: "Original",
      handle: "@saemstunes",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/Mapenzi%20Ya%20Ajabu%20(Demo)%20-%20Saem's%20Tunes%20(OFFICIAL%20MUSIC%20VIDEO)%20(128kbit_AAC).m4a",
      image: "https://i.imgur.com/wrm7LI1.jpeg",
      duration: "1:30",
      videoUrl: "https://youtu.be/rl5UOp8q1cM?si=pPE-0BljTQ-kceMl",
      youtubeUrl: "https://youtu.be/rl5UOp8q1cM?si=pPE-0BljTQ-kceMl",
      primaryColor: "#5A270F",
      secondaryColor: "#8B4513",
      backgroundGradient: "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)",
    },
    {
      title: "LOVE Medley",
      subtitle: "Project",
      handle: "@saemstunes",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/LOVE%20Medley%20-%20Greatest,%20MYA(OC),%20Kama%20Si%20We,%20Hold%20On%20Me.mp3",
      image: "https://i.imgur.com/dzjTYAw.jpeg",
      duration: "2:07",
      videoUrl: "https://youtu.be/9NU3PBcj1-U?si=b75lJDDRm1rAiw0A",
      youtubeUrl: "https://youtu.be/9NU3PBcj1-U?si=b75lJDDRm1rAiw0A",
      primaryColor: "#DF8142",
      secondaryColor: "#F4A460",
      backgroundGradient: "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)",
    },
    {
      title: "TCBU Medley",
      subtitle: "Project",
      handle: "@saemstunes, @timgrandmich",
      audioUrl: "https://uxyvhqtwkutstihtxdsv.supabase.co/storage/v1/object/public/tracks/Tracks/TCBU%20Medley%20ft.%20Tim%20GrandMich.mp3",
      image: "https://i.imgur.com/HDBX1q8.jpeg",
      duration: "3:36",
      videoUrl: "https://youtu.be/GEcYrcEvFas?si=C9BQt6wvNy2Zxnvk",
      youtubeUrl: "https://youtu.be/GEcYrcEvFas?si=C9BQt6wvNy2Zxnvk",
      primaryColor: "#EEB38C",
      secondaryColor: "#DEB887",
      backgroundGradient: "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)",
    }
  ];

  const playlistNames = [
    "African Gospel",
    "Christian Afrobeats", 
    "Morning Coffee Jazz",
    "Workout Motivation",
    "Late Night Vibes",
    "Classical Focus",
    "Indie Rock Mix",
    "Electronic Dreams"
  ];

  try {
    // Insert sample tracks with proper categorization
    const trackInserts = sampleTracks.map(track => {
      let category = 'personal_playlist'; // default
      
      // Categorize based on subtitle
      if (track.subtitle.toLowerCase().includes('cover')) {
        category = 'covers';
      } else if (track.subtitle.toLowerCase().includes('original') || track.handle.includes('@saemstunes')) {
        category = 'originals_by_saems_tunes';
      }

      return {
        title: track.title,
        description: `${track.subtitle} by ${track.handle} • Duration: ${track.duration}`,
        audio_path: track.audioUrl,
        cover_path: track.image,
        access_level: 'free' as const,
        user_id: userId,
        approved: true,
        metadata: {
          category,
          subtitle: track.subtitle,
          handle: track.handle,
          duration: track.duration,
          videoUrl: track.videoUrl,
          youtubeUrl: track.youtubeUrl,
          primaryColor: track.primaryColor,
          secondaryColor: track.secondaryColor,
          backgroundGradient: track.backgroundGradient,
        }
      };
    });

    const { data: tracksData, error: tracksError } = await supabase
      .from('tracks')
      .insert(trackInserts)
      .select('id, title');

    if (tracksError) {
      console.error('Error inserting tracks:', tracksError);
      throw tracksError;
    }

    // Create playlists
    const playlistInserts = playlistNames.map(name => ({
      name,
      description: `Curated ${name.toLowerCase()} playlist by Saem's Tunes`,
      category: 'personal_playlist' as const,
      user_id: userId,
      is_public: true,
      cover_art_url: sampleTracks[Math.floor(Math.random() * sampleTracks.length)].image
    }));

    const { data: playlistsData, error: playlistsError } = await supabase
      .from('playlists')
      .insert(playlistInserts)
      .select('id, name');

    if (playlistsError) {
      console.error('Error inserting playlists:', playlistsError);
      throw playlistsError;
    }

    // Add tracks to playlists randomly
    if (tracksData && playlistsData) {
      const playlistTrackInserts = [];
      
      for (const playlist of playlistsData) {
        // Add 2-4 random tracks to each playlist
        const trackCount = Math.floor(Math.random() * 3) + 2;
        const selectedTracks = tracksData
          .sort(() => 0.5 - Math.random())
          .slice(0, trackCount);
        
        selectedTracks.forEach((track, index) => {
          playlistTrackInserts.push({
            playlist_id: playlist.id,
            track_id: track.id,
            position: index + 1
          });
        });
      }

      const { error: playlistTracksError } = await supabase
        .from('playlist_tracks')
        .insert(playlistTrackInserts);

      if (playlistTracksError) {
        console.error('Error inserting playlist tracks:', playlistTracksError);
        throw playlistTracksError;
      }
    }

    console.log('Sample data migration completed successfully!');
    console.log(`Inserted ${tracksData?.length} tracks and ${playlistsData?.length} playlists`);
    
    return {
      tracks: tracksData,
      playlists: playlistsData,
      success: true
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to get track category
export const getTrackCategory = (subtitle: string, handle: string): 'covers' | 'originals_by_saems_tunes' | 'personal_playlist' => {
  if (subtitle.toLowerCase().includes('cover')) {
    return 'covers';
  } else if (subtitle.toLowerCase().includes('original') || handle.includes('@saemstunes')) {
    return 'originals_by_saems_tunes';
  }
  return 'personal_playlist';
};

// Function to update existing tracks with categories
export const updateTrackCategories = async () => {
  try {
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('id, title, description')
      .is('metadata', null);

    if (error) throw error;

    if (tracks) {
      const updates = tracks.map(track => {
        const description = track.description || '';
        let category = 'personal_playlist';
        
        if (description.toLowerCase().includes('cover')) {
          category = 'covers';
        } else if (description.toLowerCase().includes('original') || description.includes('@saemstunes')) {
          category = 'originals_by_saems_tunes';
        }

        return {
          id: track.id,
          metadata: { category }
        };
      });

      for (const update of updates) {
        await supabase
          .from('tracks')
          .update({ metadata: update.metadata })
          .eq('id', update.id);
      }

      console.log(`Updated ${updates.length} tracks with categories`);
    }

  } catch (error) {
    console.error('Error updating track categories:', error);
  }
};
