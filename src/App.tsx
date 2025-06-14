
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/context/AuthContext';
import HomePage from '@/pages/Index';
import TracksPage from '@/pages/Tracks';
import AlbumsPage from '@/pages/Library';
import ArtistsPage from '@/pages/Library';
import ProfilePage from '@/pages/Profile';
import AudioPlayerPage from '@/pages/AudioPlayer';
import QuizzesPage from '@/pages/Library';
import MusicQuizPage from '@/pages/MusicQuiz';
import DynamicQuizPage from '@/pages/DynamicQuiz';
import NotFoundPage from '@/pages/NotFound';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import GlobalMiniPlayer from '@/components/player/GlobalMiniPlayer';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    document.documentElement.classList.add("antialiased");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AudioPlayerProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tracks" element={<TracksPage />} />
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/artists" element={<ArtistsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/audio-player/:id" element={<AudioPlayerPage />} />
                    <Route path="/quizzes" element={<QuizzesPage />} />
                    <Route path="/music-quiz" element={<MusicQuizPage />} />
                    <Route path="/dynamic-quiz/:quizId" element={<DynamicQuizPage />} />
                    <Route path="*" element={<NotFoundPage />} />
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
