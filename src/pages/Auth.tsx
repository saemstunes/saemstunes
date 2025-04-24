
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Music, Mic, Headphones, Piano, Guitar, Disc } from "lucide-react";
import Logo from "@/components/branding/Logo";

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
  
  // Get the active tab from URL params or default to "login"
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Get the redirect path from URL params or default to "/"
  const redirectPath = searchParams.get("redirect") || "/";

  // Redirect to home or specified path if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, redirectPath]);

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
        <Logo size="md" />
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
    </div>
  );
};

export default Auth;
