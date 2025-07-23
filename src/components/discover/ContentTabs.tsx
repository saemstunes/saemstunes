
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Video } from 'lucide-react';

interface ContentTabsProps {
  videos: any[];
  tracks: any[];
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
    <Tabs defaultValue="tracks" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tracks">Tracks ({tracks.length})</TabsTrigger>
        <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tracks" className="space-y-4">
        {tracks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tracks found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search or category filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tracks.map((track) => (
              <Card key={track.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    {track.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {track.description || 'No description available'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="videos" className="space-y-4">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search or category filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    {video.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {video.description || 'No description available'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
