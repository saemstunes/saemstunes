
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
      // Clean up any hash fragments that might be causing issues
      if (window.location.hash) {
        console.log('Hash detected in URL, cleaning up:', window.location.hash);
        // Remove hash without page reload
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      // Get the auth code from the URL
      const code = searchParams.get("code");
      const provider = searchParams.get("provider");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const errorCode = searchParams.get("error_code");

      console.log('Auth callback params:', { code, provider, error, errorDescription, errorCode });

      // Handle error cases first
      if (error) {
        console.error("Auth error:", error, errorDescription);
        
        // Handle specific error cases
        if (errorCode === "provider_email_needs_verification" || 
            errorDescription?.includes("Unverified email")) {
          
          // Extract email from error description if possible
          const emailMatch = errorDescription?.match(/email: ([^\s]+)/);
          const email = emailMatch ? emailMatch[1] : "";
          
          // Show detailed toast notification for provider verification
          toast({
            title: `${provider?.charAt(0).toUpperCase() + provider?.slice(1) || "Email"} Verification Required`,
            description: "An email has been sent to your account. Please verify it to continue.",
            variant: "default",
            duration: 8000,
          });
          
          // Redirect to verification waiting page with detailed info
          navigate("/verification-waiting", {
            state: {
              email,
              provider,
              verificationError: errorDescription
            },
            replace: true
          });
          return;
        }
        
        // For other errors, redirect to auth page with error
        setError(errorDescription || "Authentication failed");
        navigate("/auth", { 
          state: { 
            error: error,
            errorDescription: errorDescription || "",
            provider: provider || "",
            errorCode: errorCode || ""
          },
          replace: true 
        });
        return;
      }

      // No code means no auth attempt - redirect to auth page
      if (!code) {
        console.log('No auth code found, redirecting to auth page');
        navigate("/auth", { replace: true });
        return;
      }

      try {
        console.log('Exchanging code for session...');
        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          throw exchangeError;
        }

        // Get user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Get user error:', userError);
          throw userError;
        }
        
        console.log('User retrieved:', user);

        // Check if email is verified
        if (user && !user.email_confirmed_at) {
          console.log('Email not verified, redirecting to verification page');
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account before logging in.",
            duration: 8000,
          });
          
          navigate("/verification-waiting", {
            state: { 
              email: user.email,
              provider
            },
            replace: true
          });
          return;
        }
        
        // Success - redirect to home
        console.log('Auth successful, redirecting to home');
        toast({
          title: "Successfully signed in",
          description: `Welcome${user?.user_metadata?.name ? ` ${user.user_metadata.name}` : ''}!`,
        });
        
        // Use replace to prevent back button issues and ensure clean URL
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
