
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Heart, MoreHorizontal, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverArt: string;
  genre: string;
  duration: string;
  tracks: Track[];
}

interface Track {
  id: string;
  title: string;
  duration: string;
  trackNumber: number;
  audioUrl: string;
}

const AlbumsPage = () => {
  const navigate = useNavigate();
  const { playTrack } = useAudioPlayer();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const albums: Album[] = [
    {
      id: 'album1',
      title: 'Worship Sessions Vol. 1',
      artist: "Saem's Tunes",
      year: 2024,
      coverArt: '/placeholder.svg',
      genre: 'Contemporary Christian',
      duration: '45:32',
      tracks: [
        { id: 'track1', title: 'Holy Ground', duration: '4:23', trackNumber: 1, audioUrl: '/audio/track1.mp3' },
        { id: 'track2', title: 'Amazing Grace', duration: '3:45', trackNumber: 2, audioUrl: '/audio/track2.mp3' },
        { id: 'track3', title: 'How Great Thou Art', duration: '5:12', trackNumber: 3, audioUrl: '/audio/track3.mp3' },
        { id: 'track4', title: 'Blessed Assurance', duration: '4:01', trackNumber: 4, audioUrl: '/audio/track4.mp3' },
        { id: 'track5', title: 'The Old Rugged Cross', duration: '4:34', trackNumber: 5, audioUrl: '/audio/track5.mp3' },
        { id: 'track6', title: 'In the Garden', duration: '3:52', trackNumber: 6, audioUrl: '/audio/track6.mp3' },
        { id: 'track7', title: 'Great Is Thy Faithfulness', duration: '4:18', trackNumber: 7, audioUrl: '/audio/track7.mp3' },
        { id: 'track8', title: 'It Is Well', duration: '5:45', trackNumber: 8, audioUrl: '/audio/track8.mp3' },
        { id: 'track9', title: 'Be Thou My Vision', duration: '4:07', trackNumber: 9, audioUrl: '/audio/track9.mp3' },
        { id: 'track10', title: 'Cornerstone', duration: '5:35', trackNumber: 10, audioUrl: '/audio/track10.mp3' }
      ]
    },
    {
      id: 'album2',
      title: 'Gospel Classics',
      artist: "Saem's Tunes",
      year: 2023,
      coverArt: '/placeholder.svg',
      genre: 'Gospel',
      duration: '52:18',
      tracks: [
        { id: 'track11', title: 'Swing Low Sweet Chariot', duration: '4:45', trackNumber: 1, audioUrl: '/audio/track11.mp3' },
        { id: 'track12', title: 'Wade in the Water', duration: '3:32', trackNumber: 2, audioUrl: '/audio/track12.mp3' },
        { id: 'track13', title: 'Go Tell It on the Mountain', duration: '4:12', trackNumber: 3, audioUrl: '/audio/track13.mp3' },
        { id: 'track14', title: 'This Little Light of Mine', duration: '3:28', trackNumber: 4, audioUrl: '/audio/track14.mp3' },
        { id: 'track15', title: 'When the Saints Go Marching In', duration: '5:01', trackNumber: 5, audioUrl: '/audio/track15.mp3' },
        { id: 'track16', title: 'Deep River', duration: '4:38', trackNumber: 6, audioUrl: '/audio/track16.mp3' },
        { id: 'track17', title: 'Nobody Knows the Trouble', duration: '4:15', trackNumber: 7, audioUrl: '/audio/track17.mp3' },
        { id: 'track18', title: 'Sometimes I Feel', duration: '5:22', trackNumber: 8, audioUrl: '/audio/track18.mp3' },
        { id: 'track19', title: 'Joshua Fought the Battle', duration: '3:47', trackNumber: 9, audioUrl: '/audio/track19.mp3' },
        { id: 'track20', title: 'He\'s Got the Whole World', duration: '4:18', trackNumber: 10, audioUrl: '/audio/track20.mp3' }
      ]
    }
  ];

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
  };

  const handleTrackPlay = (track: Track, album: Album) => {
    const audioTrack = {
      id: track.id,
      src: track.audioUrl,
      name: track.title,
      artist: album.artist,
      artwork: album.coverArt,
      album: album.title
    };
    playTrack(audioTrack);
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  if (selectedAlbum) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAlbum(null)}
            className="mb-4"
          >
            ← Back to Albums
          </Button>
          
          {/* Album Header */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg">
            <div className="w-full md:w-64 h-64 flex-shrink-0">
              <img 
                src={selectedAlbum.coverArt} 
                alt={selectedAlbum.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">Album</Badge>
                <h1 className="text-4xl font-bold mb-2">{selectedAlbum.title}</h1>
                <p className="text-xl text-muted-foreground mb-2">{selectedAlbum.artist}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedAlbum.year}
                  </span>
                  <span>{selectedAlbum.tracks.length} tracks</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedAlbum.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                  onClick={() => handleTrackPlay(selectedAlbum.tracks[0], selectedAlbum)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play Album
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Save
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Duration</div>
              <div className="col-span-2"></div>
            </div>
            {selectedAlbum.tracks.map((track, index) => (
              <div 
                key={track.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-md group cursor-pointer transition-colors"
                onClick={() => handleTrackPlay(track, selectedAlbum)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="group-hover:hidden">{track.trackNumber}</span>
                  <Play className="h-4 w-4 hidden group-hover:block" />
                </div>
                <div className="col-span-6 flex items-center">
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedAlbum.artist}</p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center text-muted-foreground">
                  {track.duration}
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Albums</h1>
          <p className="text-muted-foreground">Discover amazing albums from Saem's Tunes</p>
        </div>

        <div className="responsive-grid">
          {albums.map((album) => (
            <Card 
              key={album.id} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={album.coverArt} 
                  alt={album.title}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    size="icon" 
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full h-12 w-12"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackPlay(album.tracks[0], album);
                    }}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1 mb-1">{album.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{album.artist}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{album.year}</span>
                  <span>{album.tracks.length} tracks</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AlbumsPage;
