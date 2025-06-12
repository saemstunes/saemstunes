
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/context/AuthContext';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import GlobalMiniPlayer from '@/components/player/GlobalMiniPlayer';

// Import existing pages
import Index from '@/pages/Index';
import Tracks from '@/pages/Tracks';
import Library from '@/pages/Library';
import Videos from '@/pages/Videos';
import VideoDetail from '@/pages/VideoDetail';
import AudioPlayer from '@/pages/AudioPlayer';
import Profile from '@/pages/Profile';
import MusicQuizPage from '@/pages/MusicQuizPage';
import DynamicQuizPage from '@/pages/DynamicQuizPage';
import NotFound from '@/pages/NotFound';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    document.documentElement.classList.add("antialiased");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="saems-ui-theme">
        <AuthProvider>
          <AudioPlayerProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tracks" element={<Tracks />} />
                    <Route path="/albums" element={<Library />} />
                    <Route path="/artists" element={<Library />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/audio-player/:id" element={<AudioPlayer />} />
                    <Route path="/quizzes" element={<MusicQuizPage />} />
                    <Route path="/music-quiz" element={<MusicQuizPage />} />
                    <Route path="/dynamic-quiz/:quizId" element={<DynamicQuizPage />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/videos/:id" element={<VideoDetail />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <GlobalMiniPlayer />
                </BrowserRouter>
              </div>
            </TooltipProvider>
          </AudioPlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
