
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SplashScreen from "@/components/ui/splash-screen";
import Admin from "@/pages/Admin";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth"; 
import VerificationWaiting from "./pages/VerificationWaiting";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Bookings from "./pages/Bookings";
import BookTutor from "./pages/BookTutor";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Unauthorized from "./pages/Unauthorized";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Community from "./pages/Community";
import Player from "./pages/Player";
import ArtistProfile from "./pages/ArtistProfile";
import LearningHub from "./pages/LearningHub";
import LearningModulePage from "./pages/LearningModulePage";
import Notifications from "./pages/Notifications";
import FollowUs from "./pages/FollowUs";
import ContactUs from "./pages/ContactUs";
import SupportUs from "./pages/SupportUs";
import Settings from "./pages/Settings";
import Services from "./pages/Services";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MusicTools from "./pages/MusicTools";
import AuthCallback from "./components/auth/AuthCallback";
import UserDetails from "./pages/UserDetails";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import IdleStateManager from "./components/idle-state/IdleStateManager";
import Subscriptions from "./pages/Subscriptions";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SplashScreen loading={loading} />
          <BrowserRouter>
            <IdleStateManager idleTime={60000} /> {/* Set to 60 seconds (1 minute) */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verification-waiting" element={<VerificationWaiting />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/library" element={<Library />} />
              <Route path="/community" element={<Community />} />
              <Route path="/player" element={<Player />} />
              <Route path="/learning-hub" element={<LearningHub />} />
              <Route path="/learning-hub/:id" element={<LearningModulePage />} />
              <Route path="/learning-module/:id" element={<LearningModulePage />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/follow-us" element={<FollowUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/support-us" element={<SupportUs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/services" element={<Services />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/music-tools" element={<MusicTools />} />
              
              {/* Protected Routes */}
              <Route path="/bookings" element={
                <ProtectedRoute requiredRoles={["student", "adult", "parent"]}>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/book/:id" element={
                <ProtectedRoute requiredRoles={["student", "adult", "parent"]}>
                  <BookTutor />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/user-details" element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
