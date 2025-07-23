
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoCard from '@/components/videos/VideoCard';
import AudioPlayer from '@/components/media/AudioPlayer';
import { Music, Video } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist?: string;
  audio_path: string;
  cover_path?: string;
  description?: string;
  created_at: string;
}

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  instructor: string;
  level: string;
  category: string;
  isLocked?: boolean;
}

interface ContentTabsProps {
  videos: VideoContent[];
  tracks: Track[];
  searchTerm: string;
  selectedCategory: string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  videos,
  tracks,
  searchTerm,
  selectedCategory
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="tracks">Tracks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <div className="space-y-6">
          {videos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.slice(0, 6).map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}
          
          {tracks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music className="h-5 w-5" />
                Tracks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracks.slice(0, 6).map((track) => (
                  <Card key={track.id}>
                    <CardContent className="p-4">
                      <AudioPlayer
                        src={track.audio_path}
                        title={track.title}
                        artist={track.artist}
                        artwork={track.cover_path}
                        compact={false}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="videos" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="tracks" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-4">
                <AudioPlayer
                  src={track.audio_path}
                  title={track.title}
                  artist={track.artist}
                  artwork={track.cover_path}
                  compact={false}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
