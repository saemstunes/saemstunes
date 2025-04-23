
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Music, Mic, Headphones, Piano, Guitar } from "lucide-react";

// Music-related icons for random decoration
const MUSIC_ICONS = [
  { icon: Mic, label: "Microphone" },
  { icon: Headphones, label: "Headphones" },
  { icon: Piano, label: "Piano" },
  { icon: Guitar, label: "Guitar" },
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
  const [decorativeIcons] = useState(() => getRandomIcons(3));
  
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
        <div className="flex items-center gap-2" onClick={() => navigate("/")} role="button">
          <Music className="h-6 w-6 text-gold" />
          <h1 className="font-serif text-xl font-bold">
            Saem's <span className="text-gold">Tunes</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        
        {/* Decorative floating icons */}
        {decorativeIcons.map((IconObj, index) => {
          const randomTop = Math.floor(Math.random() * 70) + 10;
          const randomLeft = Math.floor(Math.random() * 70) + 10;
          const randomSize = Math.floor(Math.random() * 10) + 20;
          const IconComponent = IconObj.icon;
          
          return (
            <div 
              key={index}
              className="absolute text-gold/20 animate-pulse z-0"
              style={{ 
                top: `${randomTop}%`, 
                left: `${randomLeft}%`,
                animation: `pulse ${2 + index}s infinite ease-in-out`
              }}
            >
              <IconComponent size={randomSize} />
            </div>
          );
        })}
        
        {/* Auth tabs container */}
        <div className="relative z-10 w-full max-w-md">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-base py-3">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-base py-3">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
