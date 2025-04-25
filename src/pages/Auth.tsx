
import { Flask } from "@/components/icons";
import { useEffect, useState } from "react";
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

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);  // Fixed: Correct useState syntax
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  
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

  const handleLogoClick = () => {
    const currentTime = Date.now();
    
    // Check if this click is within 2 seconds of the last click
    if (currentTime - lastClickTime < 2000) {
      const newClickCount = logoClicks + 1;
      setLogoClicks(newClickCount);
      
      // After 7 clicks, show admin login
      if (newClickCount >= 7) {
        setShowAdminLogin(true);
        setLogoClicks(0); // Reset clicks
      }
    } else {
      // Reset clicks if more than 2 seconds have passed
      setLogoClicks(1);
    }
    
    setLastClickTime(currentTime);
  };

  const handleGoogleSignIn = () => {
    // This would normally call the Google Sign In method
    console.log("Google sign in clicked");
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full sm:max-w-md">
          <div className="text-center mb-6">
            <div 
              className="inline-block cursor-pointer" 
              onClick={handleLogoClick}
              aria-label="Logo"
            >
              <Logo size="lg" className="mx-auto mb-2" />
            </div>
            <h1 className="text-3xl font-bold font-proxima">Welcome Back</h1>
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
