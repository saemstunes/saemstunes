import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import VerificationWaiting from "@/pages/VerificationWaiting";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Unauthorized from "@/pages/Unauthorized";
import AuthCallback from "@/components/auth/AuthCallback";
import Videos from "@/pages/Videos";
import VideoDetail from "@/pages/VideoDetail";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/ResourceDetail";
import Search from "@/pages/Search";
import Discover from "@/pages/Discover";
import Library from "@/pages/Library";
import Community from "@/pages/Community";
import Tracks from "@/pages/Tracks";
import Player from "@/pages/Player";
import LearningHub from "@/pages/LearningHub";
import LearningModulePage from "@/pages/LearningModulePage";
import ArtistProfile from "@/pages/ArtistProfile";
import Notifications from "@/pages/Notifications";
import FollowUs from "@/pages/FollowUs";
import ContactUs from "@/pages/ContactUs";
import SupportUs from "@/pages/SupportUs";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Services from "@/pages/Services";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Subscriptions from "@/pages/Subscriptions";
import MusicTools from "@/pages/MusicTools";
import Artists from "@/pages/Artists";
import Bookings from "@/pages/Bookings";
import BookTutor from "@/pages/BookTutor";
import UserDetails from "@/pages/UserDetails";
import ComingSoon from "@/pages/ComingSoon";
import AudioPlayer from "@/pages/AudioPlayer";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export interface AppRoute {
  path: string;
  element: ReactElement;
  protected?: boolean;
  requiredRoles?: string[];
}

// Helper components for redirects
const MusicShowcaseRedirect = () => <Navigate to="/tracks" replace />;
const AudioPlayerRedirect = () => <Navigate to="/tracks" replace />;

export const appRoutes: AppRoute[] = [
  { path: '/', element: <Index /> },
  { path: '/admin', element: <Admin /> },
  { path: '/login', element: <Auth /> },
  { path: '/signup', element: <Auth /> },
  { path: '/auth', element: <Auth /> },
  { path: '/verification-waiting', element: <VerificationWaiting /> },
  { path: '/terms', element: <Terms /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/videos', element: <Videos /> },
  { path: '/videos/:id', element: <VideoDetail /> },
  { path: '/resources', element: <Resources /> },
  { path: '/resources/:id', element: <ResourceDetail /> },
  { path: '/search', element: <Search /> },
  { path: '/discover', element: <Discover /> },
  { path: '/library', element: <Library /> },
  { path: '/community', element: <Community /> },
  { path: '/tracks', element: <Tracks /> },
  { path: '/music-showcase', element: <MusicShowcaseRedirect /> },
  { path: '/player', element: <Player /> },
  { path: '/learning-hub', element: <LearningHub /> },
  { path: '/learning-hub/:id', element: <LearningModulePage /> },
  { path: '/learning-module/:id', element: <LearningModulePage /> },
  { path: '/artist/:slug', element: <ArtistProfile /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/follow-us', element: <FollowUs /> },
  { path: '/contact-us', element: <ContactUs /> },
  { path: '/support-us', element: <SupportUs /> },
  { path: '/settings', element: <Settings /> },
  { 
    path: '/profile', 
    element: <ProtectedRoute><Profile /></ProtectedRoute>, 
    protected: true 
  },
  { path: '/services', element: <Services /> },
  { path: '/payment', element: <Payment /> },
  { path: '/payment-success', element: <PaymentSuccess /> },
  { path: '/subscriptions', element: <Subscriptions /> },
  { path: '/music-tools', element: <MusicTools /> },
  { path: '/artists', element: <Artists /> },
  { 
    path: '/bookings', 
    element: <ProtectedRoute requiredRoles={["student", "adult_learner", "parent"]}><Bookings /></ProtectedRoute>, 
    protected: true,
    requiredRoles: ["student", "adult_learner", "parent"]
  },
  { 
    path: '/book/:id', 
    element: <ProtectedRoute requiredRoles={["student", "adult_learner", "parent"]}><BookTutor /></ProtectedRoute>, 
    protected: true,
    requiredRoles: ["student", "adult_learner", "parent"]
  },
  { 
    path: '/book-tutor', 
    element: <ProtectedRoute requiredRoles={["student", "adult_learner", "parent"]}><BookTutor /></ProtectedRoute>, 
    protected: true,
    requiredRoles: ["student", "adult_learner", "parent"]
  },
  { 
    path: '/user-details', 
    element: <ProtectedRoute><UserDetails /></ProtectedRoute>, 
    protected: true 
  },
  { path: '/coming-soon', element: <ComingSoon /> },
  { path: '/tracks/:slug', element: <AudioPlayer /> },
  { path: '/audio-player/:id', element: <AudioPlayerRedirect /> },
  { path: '*', element: <NotFound /> }
];

export const getRoutePaths = (): string[] => {
  return appRoutes.map(route => route.path);
};

export const isKnownRoute = (pathname: string): boolean => {
  const cleanPathname = pathname.split('?')[0].split('#')[0];
  
  return appRoutes.some(route => {
    if (route.path === cleanPathname) return true;
    
    if (route.path.includes(':')) {
      const routeSegments = route.path.split('/');
      const pathSegments = cleanPathname.split('/');
      
      if (routeSegments.length !== pathSegments.length) return false;
      
      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const pathSegment = pathSegments[i];
        
        if (routeSegment.startsWith(':')) continue;
        if (routeSegment !== pathSegment) return false;
      }
      
      return true;
    }
    
    return false;
  });
};
