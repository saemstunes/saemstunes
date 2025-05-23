import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle auth errors in URL (especially from Spotify)
  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    // Parse hash parameters if they exist
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    
    const error = searchParams.get("error") || hashParams.get("error");
    const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
    const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
    
    // Check specifically for Spotify verification errors
    if (error === "access_denied" && 
        (errorCode === "provider_email_needs_verification" || 
         errorDescription?.includes("Unverified email with spotify"))) {
      
      // Extract email from error description if possible
      const emailMatch = errorDescription?.match(/email: ([^\s]+)/);
      const email = emailMatch ? emailMatch[1] : "";
      const provider = "spotify";
      
      // Show verification toast
      toast({
        title: "Spotify Email Verification Required",
        description: "An email from Spotify just landed in your inbox. Please verify it to continue.",
        duration: 8000,
      });
      
      // Redirect to verification waiting page
      navigate("/verification-waiting", {
        state: {
          email,
          provider,
          verificationError: errorDescription
        }
      });
    }
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
      
      <div className="relative z-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6 font-serif">
          Welcome to <span className="text-gold">Saem's Tunes</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your ultimate destination for music learning and inspiration.
        </p>
        
        <div className="space-y-4">
          <Button onClick={() => navigate("/discover")} className="w-full bg-gold hover:bg-gold/90 text-white">
            Discover New Music <ArrowRight className="ml-2" />
          </Button>
          <Button onClick={() => navigate("/learning-hub")} variant="outline" className="w-full">
            Start Learning Today
          </Button>
          <Button onClick={() => navigate("/community")} variant="secondary" className="w-full">
            Join Our Community
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          New to Saem's Tunes? <Button variant="link" className="p-0" onClick={() => navigate("/auth?tab=signup")}>Create an account</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
