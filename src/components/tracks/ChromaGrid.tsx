import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackItem {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  audioUrl: string;
  duration: string;
  previewUrl: string;
  videoUrl: string;
  youtubeUrl: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundGradient: string;
}

interface ChromaGridProps {
  items?: TrackItem[];
  radius?: number;
  damping?: number;
  stiffness?: number;
}

const mockTracks: TrackItem[] = [
  {
    image: "https://images.unsplash.com/photo-1544513519-a826469e5984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    title: "Midnight City Lights",
    subtitle: "Synthwave Nostalgia",
    handle: "midnight-city",
    borderColor: "#A3E4DB",
    gradient: "bg-gradient-to-br from-[#A3E4DB]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "3:45",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#A3E4DB",
    secondaryColor: "#75daad",
    backgroundGradient: "linear-gradient(to right, #A3E4DB, #75daad)",
  },
  {
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    title: "Lost in the Woods",
    subtitle: "Ambient Soundscape",
    handle: "lost-woods",
    borderColor: "#F2D7D9",
    gradient: "bg-gradient-to-br from-[#F2D7D9]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "4:20",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#F2D7D9",
    secondaryColor: "#e4b7ba",
    backgroundGradient: "linear-gradient(to right, #F2D7D9, #e4b7ba)",
  },
  {
    image: "https://images.unsplash.com/photo-1506318137072-495641cb9155?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    title: "City at Dusk",
    subtitle: "Mellow Hip-Hop Beats",
    handle: "city-dusk",
    borderColor: "#D5DAD9",
    gradient: "bg-gradient-to-br from-[#D5DAD9]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "2:50",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#D5DAD9",
    secondaryColor: "#b2b6b5",
    backgroundGradient: "linear-gradient(to right, #D5DAD9, #b2b6b5)",
  },
  {
    image: "https://images.unsplash.com/photo-1517457379141-f85e56f1ca4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    title: "Neon Drive",
    subtitle: "Retro Synthwave",
    handle: "neon-drive",
    borderColor: "#F2D7D9",
    gradient: "bg-gradient-to-br from-[#F2D7D9]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "3:15",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#F2D7D9",
    secondaryColor: "#e4b7ba",
    backgroundGradient: "linear-gradient(to right, #F2D7D9, #e4b7ba)",
  },
  {
    image: "https://images.unsplash.com/photo-1542626991-cbc4e3e426cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    title: "Distant Echoes",
    subtitle: "Cinematic Ambient",
    handle: "distant-echoes",
    borderColor: "#D5DAD9",
    gradient: "bg-gradient-to-br from-[#D5DAD9]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "5:02",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#D5DAD9",
    secondaryColor: "#b2b6b5",
    backgroundGradient: "linear-gradient(to right, #D5DAD9, #b2b6b5)",
  },
  {
    image: "https://images.unsplash.com/photo-1568794489849-c6e63f75134a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    title: "Urban Flow",
    subtitle: "Lo-Fi Hip-Hop",
    handle: "urban-flow",
    borderColor: "#A3E4DB",
    gradient: "bg-gradient-to-br from-[#A3E4DB]/30 to-transparent",
    audioUrl: "/audio/sample-audio.mp3",
    duration: "2:30",
    previewUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    primaryColor: "#A3E4DB",
    secondaryColor: "#75daad",
    backgroundGradient: "linear-gradient(to right, #A3E4DB, #75daad)",
  },
];

const ChromaGrid = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackItem | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const motionRadius = useMotionValue(260);
  const springRadius = useSpring(motionRadius, { damping: 60, stiffness: 200 });

  const handleTrackHover = (track: TrackItem) => {
    setCurrentTrack(track);
  };

  const handlePlayPause = useCallback(() => {
    if (!currentTrack) return;

    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    audioElement.addEventListener('ended', handleAudioEnded);

    return () => {
      audioElement.removeEventListener('ended', handleAudioEnded);
    };
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
      <style jsx>{`
        .chroma-grid {
          background: radial-gradient(circle at 50% 50%, rgba(139, 69, 199, 0.3) 0%, transparent 70%);
        }
        
        .track-card {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .control-button {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        
        .visualizer {
          background: linear-gradient(45deg, rgba(139, 69, 199, 0.2), rgba(59, 130, 246, 0.2));
          border-radius: 12px;
          padding: 1rem;
        }
        
        .frequency-bar {
          background: linear-gradient(to top, #8b45c7, #3b82f6);
          border-radius: 2px;
          animation: pulse 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
      
      <div className="absolute inset-0 chroma-grid" />
      
      <motion.div
        style={{
          width: springRadius,
          height: springRadius,
        }}
        className="relative rounded-full mx-auto flex items-center justify-center"
      >
        {mockTracks.map((track, index) => {
          const angle = (index / mockTracks.length) * 360;
          const x = Math.cos((angle - 90) * Math.PI / 180) * (260 / 2);
          const y = Math.sin((angle - 90) * Math.PI / 180) * (260 / 2);
          
          return (
            <motion.div
              key={track.handle}
              style={{
                x,
                y,
                position: 'absolute',
              }}
              onHoverStart={() => handleTrackHover(track)}
              className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
            >
              <img
                src={track.image}
                alt={track.title}
                className="w-full h-full object-cover transform scale-110 transition-transform duration-300 hover:scale-120"
              />
            </motion.div>
          );
        })}
      </motion.div>
      
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-10 left-0 right-0 mx-auto w-full max-w-md"
          >
            <Card className="track-card p-4 text-white">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
                    <p className="text-sm text-gray-300">{currentTrack.subtitle}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handlePlayPause}
                      size="icon"
                      className="control-button rounded-full"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-4 w-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16"
                  />
                </div>
                <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChromaGrid;
