import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the auth code from the URL
      const code = searchParams.get("code");
      const provider = searchParams.get("provider");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Handle error cases first
      if (error) {
        console.error("Auth error:", error, errorDescription);
        
        // Handle specific error cases
        if (errorDescription?.includes("Unverified email")) {
          // Extract email from error description if possible
          const emailMatch = errorDescription.match(/email: ([^\s]+)/);
          const email = emailMatch ? emailMatch[1] : "";
          
          // Show toast and redirect to verification waiting page
          toast({
            title: "Email verification required",
            description: `Please verify your ${provider || ""} email address to continue.`,
            variant: "destructive",
          });
          
          navigate("/verification-waiting", {
            state: {
              email,
              provider,
              verificationError: errorDescription
            }
          });
          return;
        }
        
        // For other errors, redirect to auth page with error
        setError(errorDescription || "Authentication failed");
        navigate(`/auth?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || "")}&provider=${provider || ""}`, { replace: true });
        return;
      }

      // No code means no auth attempt
      if (!code) {
        navigate("/auth", { replace: true });
        return;
      }

      try {
        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }

        // Get user data
        const { data: { user } } = await supabase.auth.getUser();
        
        // Check if email is verified
        if (user && !user.email_confirmed_at) {
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account before logging in.",
          });
          
          navigate("/verification-waiting", {
            state: { 
              email: user.email,
              provider
            }
          });
          return;
        }
        
        // Success - redirect to home or intended destination
        toast({
          title: "Successfully signed in",
          description: `Welcome${user?.user_metadata?.name ? ` ${user.user_metadata.name}` : ''}!`,
        });
        
        navigate("/", { replace: true });
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        
        toast({
          title: "Authentication failed",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        });
        
        navigate("/auth", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-destructive">
            <p className="text-lg font-bold">Authentication Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto" />
            <h1 className="mt-4 text-xl font-serif">Completing sign in...</h1>
            <p className="text-muted-foreground mt-2">Please wait while we authenticate your account</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
