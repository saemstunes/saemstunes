import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Clean up URL hash
        const currentUrl = new URL(window.location.href);
        if (currentUrl.hash) {
          const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        // Extract parameters
        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
        const code = searchParams.get("code") || hashParams.get("code");
        const provider = searchParams.get("provider") || hashParams.get("provider") || "google";
        const authError = searchParams.get("error") || hashParams.get("error");
        const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
        const errorCode = searchParams.get("error_code") || hashParams.get("error_code");

        // Handle errors
        if (authError) {
          if (errorCode === "provider_email_needs_verification") {
            toast({
              title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Email Verification Required`,
              description: "Please verify your email to continue.",
              duration: 8000,
            });
            navigate("/verification-waiting", { state: { provider, error: errorDescription } });
            return;
          }
          throw new Error(errorDescription || "Authentication failed");
        }

        // Handle OAuth code exchange
        if (code) {
          const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;

          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;

          if (user && user.app_metadata?.provider !== 'web3' && !user.email_confirmed_at) {
            navigate("/verification-waiting", { state: { email: user.email, provider } });
            return;
          }

          toast({
            title: "Welcome!",
            description: `Successfully signed in with ${provider}`,
          });
          window.location.href = '/';
          return;
        }

        // Handle fragment tokens for Web3
        if (location.hash.includes("access_token")) {
          const fragmentParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = fragmentParams.get("access_token");
          const refreshToken = fragmentParams.get("refresh_token");
          
          if (accessToken && refreshToken) {
            const { error: tokenError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (tokenError) throw tokenError;
            
            toast({ title: "Welcome!", description: "Successfully signed in" });
            window.location.href = '/';
            return;
          }
        }

        throw new Error("Invalid authentication response");
        
      } catch (error: any) {
        console.error("Authentication error:", error);
        setError(error.message);
        toast({
          title: "Authentication Failed",
          description: error.message || "Could not authenticate",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth?tab=login"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, location, toast, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-lg">
          {error ? "Authentication failed - redirecting..." : "Authenticating..."}
        </p>
        {error && <p className="mt-2 text-sm text-muted-foreground">{error}</p>}
      </div>
    </div>
  );
};

export default AuthCallback;