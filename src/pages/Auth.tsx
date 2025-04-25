
// Modified Auth.tsx with Secret Admin Access
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Music, Mic, Headphones, Piano, Guitar, Disc, Flask } from "lucide-react";
import Logo from "@/components/branding/Logo";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

// Music-related icons for random decoration
const MUSIC_ICONS = [
  { icon: Mic, label: "Microphone" },
  { icon: Headphones, label: "Headphones" },
  { icon: Piano, label: "Piano" },
  { icon: Guitar, label: "Guitar" },
  { icon: Disc, label: "Vinyl" },
  { icon: Music, label: "Music" },
];

// Get random icons for decoration
const getRandomIcons = (count: number) => {
  const icons = [...MUSIC_ICONS];
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * icons.length);
    result.push(icons[randomIndex]);
    icons.splice(randomIndex, 1);
    if (icons.length === 0) break;
  }
  
  return result;
};

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [decorativeIcons] = useState(() => getRandomIcons(5));
  const [showCliquePicker, setShowCliquePicker] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Secret admin access state
  const logoRef = useRef<HTMLDivElement>(null);
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  
  // Get the active tab from URL params or default to "login"
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Get the redirect path from URL params or default to "/"
  const redirectPath = searchParams.get("redirect") || "/";

  // Check if the user just registered
  const justRegistered = searchParams.get("registered") === "true";

  // Secret admin access handler
  useEffect(() => {
    const handleSecretTap = () => {
      const currentTime = new Date().getTime();
      const timeSinceLastTap = currentTime - lastTapTimeRef.current;
      
      // Reset counter if more than 2 seconds passed between taps
      if (timeSinceLastTap > 2000) {
        tapCountRef.current = 0;
      }
      
      tapCountRef.current++;
      lastTapTimeRef.current = currentTime;
      
      // When seven taps are detected, show admin login
      if (tapCountRef.current === 7) {
        setShowAdminLogin(true);
        tapCountRef.current = 0; // Reset counter
        
        // Subtle feedback (small vibration if available)
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }
    };
    
    const logoElement = logoRef.current;
    if (logoElement) {
      logoElement.addEventListener("click", handleSecretTap);
    }
    
    return () => {
      if (logoElement) {
        logoElement.removeEventListener("click", handleSecretTap);
      }
    };
  }, []);

  // Redirect to home or specified path if already logged in
  useEffect(() => {
    if (user && !isLoading && !justRegistered) {
      navigate(redirectPath);
    }

    // Show clique picker if user just registered
    if (user && justRegistered) {
      setShowCliquePicker(true);
    }
  }, [user, isLoading, navigate, redirectPath, justRegistered]);

  const handleCliqueSelection = (clique: string) => {
    // In a real app, you would save this preference to the user profile
    setShowCliquePicker(false);
    navigate("/");
  };

  // Close admin dialog
  const handleCloseAdminDialog = () => {
    setShowAdminLogin(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div ref={logoRef} className="cursor-pointer">
          <Logo size="md" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/40 relative overflow-hidden">
        {/* Music note background */}
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        
        {/* Musical elements */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 blur-xl"></div>
        <div className="absolute h-64 w-64 rounded-full bg-gold/5 blur-3xl -top-20 -right-20"></div>
        <div className="absolute h-64 w-64 rounded-full bg-gold/5 blur-3xl -bottom-20 -left-20"></div>
        
        {/* Decorative floating icons */}
        {decorativeIcons.map((IconObj, index) => {
          const randomTop = Math.floor(Math.random() * 70) + 10;
          const randomLeft = Math.floor(Math.random() * 70) + 10;
          const randomSize = Math.floor(Math.random() * 10) + 20;
          const randomRotate = Math.floor(Math.random() * 45) - 22;
          const IconComponent = IconObj.icon;
          
          return (
            <div 
              key={index}
              className="absolute text-gold/20 animate-pulse z-0"
              style={{ 
                top: `${randomTop}%`, 
                left: `${randomLeft}%`,
                transform: `rotate(${randomRotate}deg)`,
                animation: `pulse ${2 + index}s infinite ease-in-out`
              }}
            >
              <IconComponent size={randomSize} />
            </div>
          );
        })}
        
        {/* Music notes animation */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => {
            const size = Math.random() * 20 + 10;
            const startX = Math.random() * 100;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            
            return (
              <div
                key={i}
                className="absolute text-gold/10"
                style={{
                  left: `${startX}%`,
                  bottom: '-50px',
                  fontSize: `${size}px`,
                  animation: `float ${duration}s ${delay}s infinite linear`
                }}
              >
                ♪
              </div>
            );
          })}
        </div>
        
        {/* Auth tabs container */}
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-gold/10 mb-4 animate-fade-in">
              <Logo size="lg" variant="icon" />
            </div>
            <h1 className="font-proxima text-3xl font-bold">Welcome to Saem's Tunes</h1>
            <p className="text-muted-foreground mt-2">Your musical journey begins here</p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-base py-3">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-base py-3">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-fade-in">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup" className="animate-fade-in">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Clique Selection Dialog */}
      <Dialog open={showCliquePicker} onOpenChange={setShowCliquePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Choose Your Clique</DialogTitle>
            <DialogDescription className="text-center">
              Select how you'd like to experience Saem's Tunes
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div 
              className="flex flex-col items-center p-4 border rounded-xl cursor-pointer hover:border-gold hover:bg-gold/5 transition-all"
              onClick={() => handleCliqueSelection('student')}
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                <Headphones className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-1">Student</h3>
              <p className="text-xs text-center text-muted-foreground">
                Access educational content and music learning resources
              </p>
            </div>
            
            <div 
              className="flex flex-col items-center p-4 border rounded-xl cursor-pointer hover:border-gold hover:bg-gold/5 transition-all"
              onClick={() => handleCliqueSelection('fam')}
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                <Music className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-1">Fam</h3>
              <p className="text-xs text-center text-muted-foreground">
                Exclusive access to premium content and music releases
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCliquePicker(false);
                navigate("/");
              }}
            >
              I'll decide later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Secret Admin Login Dialog */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Admin Access</DialogTitle>
            <DialogDescription className="text-center">
              Enter admin credentials to continue
            </DialogDescription>
          </DialogHeader>
          
          <AdminLoginForm onClose={handleCloseAdminDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
