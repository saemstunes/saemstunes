
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Artists from "./pages/Artists";
import MusicTools from "./pages/MusicTools";
import Library from "./pages/Library";
import Tracks from "./pages/Tracks";
import Discover from "./pages/Discover";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import BookTutor from "./pages/BookTutor";
import Bookings from "./pages/Bookings";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import MusicShowcase from "./pages/MusicShowcase";
import LearningHub from "./pages/LearningHub";
import LearningModulePage from "./pages/LearningModulePage";
import Community from "./pages/Community";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import FollowUs from "./pages/FollowUs";
import SupportUs from "./pages/SupportUs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import VerificationWaiting from "./pages/VerificationWaiting";
import UserDetails from "./pages/UserDetails";
import Admin from "./pages/Admin";
import Player from "./pages/Player";
import AudioPlayer from "./pages/AudioPlayer";
import ArtistProfile from "./pages/ArtistProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <AudioPlayerProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/music-tools" element={<MusicTools />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/tracks" element={<Tracks />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/book-tutor" element={<BookTutor />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/videos/:id" element={<VideoDetail />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/:id" element={<ResourceDetail />} />
                  <Route path="/music-showcase" element={<MusicShowcase />} />
                  <Route path="/learning-hub" element={<LearningHub />} />
                  <Route path="/learning-hub/:moduleId" element={<LearningModulePage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/follow-us" element={<FollowUs />} />
                  <Route path="/support-us" element={<SupportUs />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/verification-waiting" element={<VerificationWaiting />} />
                  <Route path="/user-details" element={<UserDetails />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/player" element={<Player />} />
                  <Route path="/audio-player" element={<AudioPlayer />} />
                  <Route path="/artist/:id" element={<ArtistProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </AudioPlayerProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
