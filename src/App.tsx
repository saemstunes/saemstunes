import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { WalletProvider } from "@/context/WalletContext";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { MediaStateProvider } from '@/components/idle-state/mediaStateContext';
import { PlaylistProvider } from '@/context/PlaylistContext';
import { FeaturedItemsProvider } from '@/context/FeaturedItemsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import SplashScreen from "@/components/ui/splash-screen";
import GlobalMiniPlayer from "@/components/player/GlobalMiniPlayer";
import IdleStateManager from "@/components/idle-state/IdleStateManager";
import { appRoutes } from '@/config/routes';

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <WalletProvider>
              <MediaStateProvider>
                <AudioPlayerProvider>
                  <PlaylistProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <SplashScreen loading={loading} />
                      <FeaturedItemsProvider>
                        <BrowserRouter>
                          <IdleStateManager idleTime={60000} />
                          <Routes>
                            {appRoutes.map((route, index) => (
                              <Route
                                key={index}
                                path={route.path}
                                element={route.element}
                              />
                            ))}
                          </Routes>
                          <GlobalMiniPlayer />
                          <SpeedInsights />
                          <Analytics />
                        </BrowserRouter>
                      </FeaturedItemsProvider>
                    </TooltipProvider>
                  </PlaylistProvider>
                </AudioPlayerProvider>
              </MediaStateProvider>
            </WalletProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>   
    </QueryClientProvider>
  );
};

export default App;
