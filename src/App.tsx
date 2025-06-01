
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./components/auth/AuthCallback";
import Profile from "./pages/Profile";
import Subscriptions from "./pages/Subscriptions";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Library from "./pages/Library";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Discover from "./pages/Discover";
import ArtistProfile from "./pages/ArtistProfile";
import MusicTools from "./pages/MusicTools";
import LearningHub from "./pages/LearningHub";
import LearningModulePage from "./pages/LearningModulePage";
import Community from "./pages/Community";
import BookTutor from "./pages/BookTutor";
import Player from "./pages/Player";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import SupportUs from "./pages/SupportUs";
import FollowUs from "./pages/FollowUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import VerificationWaiting from "./pages/VerificationWaiting";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Redirect all auth-related routes to /auth */}
              <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
              <Route path="/signup" element={<Navigate to="/auth?tab=signup" replace />} />
              <Route path="/signin" element={<Navigate to="/auth?tab=login" replace />} />
              <Route path="/admin" element={<Navigate to="/auth" replace />} />
              <Route path="/user-details" element={<Navigate to="/auth" replace />} />
              
              <Route path="/verification-waiting" element={<VerificationWaiting />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/library" element={<Library />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/tools" element={<MusicTools />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/learning/:moduleId" element={<LearningModulePage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/book-tutor" element={<BookTutor />} />
              <Route path="/player" element={<Player />} />
              <Route path="/search" element={<Search />} />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />

              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/support" element={<SupportUs />} />
              <Route path="/follow" element={<FollowUs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
