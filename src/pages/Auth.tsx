
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react";
import { supabase } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);  
  const [musicIconClicks, setMusicIconClicks] = useState(0);
  const [musicLastClickTime, setMusicLastClickTime] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Set the correct tab based on URL path
    if (location.pathname === "/login") {
      setActiveTab("login");
    } else if (location.pathname === "/signup") {
      setActiveTab("signup");
    }
    
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [location.pathname, user, navigate]);

  const handleMusicIconClick = () => {
    const currentTime = Date.now();
    
    // Check if this click is within 3 seconds of the last click
    if (currentTime - musicLastClickTime < 3000) {
      const newClickCount = musicIconClicks + 1;
      setMusicIconClicks(newClickCount);
      
      // Show countdown toasts
      if (newClickCount === 5) {
        toast({
          title: "2 more taps until admin access",
          duration: 2000,
        });
      } else if (newClickCount === 6) {
        toast({
          title: "1 more tap until admin access",
          duration: 2000,
        });
      }
      
      // After 7 clicks, show admin login
      if (newClickCount >= 7) {
        setShowAdminLogin(true);
        setMusicIconClicks(0); // Reset clicks
        toast({
          title: "Knew you could do it!",
          description: "Go right ahead, admin",
          duration: 3000,
        });
      }
    } else {
      // Reset clicks if more than 3 seconds have passed
      setMusicIconClicks(1);
    }
    
    setMusicLastClickTime(currentTime);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      // The redirect will happen automatically
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Login failed",
        description: "Could not sign in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full sm:max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block mb-2">
              <Logo size="lg" variant="icon" className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold font-proxima">Karibu Sana</h1>
            <p className="text-muted-foreground">
              Sign in to continue to Saem's Tunes
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <div className="my-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 h-10"
                    onClick={handleGoogleSignIn}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Continue with Google</span>
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        or
                      </span>
                    </div>
                  </div>
                </div>
                
                <TabsContent value="login" className="mt-0">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup" className="mt-0">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent>
              {/* Content is rendered by the TabsContent components above */}
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2 border-t pt-5">
              <div 
                className="cursor-pointer"
                onClick={handleMusicIconClick}
              >
                <Globe className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors mb-2" />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                By continuing, you agree to Saem's Tunes
                <br />
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                {" & "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {showAdminLogin && (
        <AdminLoginForm onClose={() => setShowAdminLogin(false)} />
      )}
    </MainLayout>
  );
};

export default Auth;
