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
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        const cleanUrl = () => {
          const url = new URL(window.location.href);
          url.hash = '';
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        };

        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
        const code = searchParams.get("code") || hashParams.get("code");
        const provider = searchParams.get("provider") || hashParams.get("provider") || "email";
        const authError = searchParams.get("error") || hashParams.get("error");
        const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
        const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");
        const expiresIn = hashParams.get("expires_in");
        const type = hashParams.get("type");

        cleanUrl();

        if (authError) {
          if (errorCode === "provider_email_needs_verification" || 
              errorDescription?.includes("Unverified email")) {
            toast({
              title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Email Verification Required`,
              description: "Please verify your email to continue.",
              duration: 8000,
            });
            
            let email = "";
            if (errorDescription) {
              const emailMatch = errorDescription.match(/email[:\s]+([^\s@]+@[^\s@]+\.[^\s@]+)/i);
              email = emailMatch ? emailMatch[1] : "";
            }
            
            navigate("/verification-waiting", { 
              state: { provider, error: errorDescription, email } 
            });
            return;
          }
          
          throw new Error(errorDescription || `Authentication failed: ${authError}`);
        }

        if (code) {
          const { error: sessionError, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);
          
          if (sessionError) {
            if (sessionError.message.includes("email_not_confirmed") || 
                sessionError.message.includes("unverified email")) {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user && !user.email_confirmed_at) {
                navigate("/verification-waiting", { 
                  state: { email: user.email, provider } 
                });
                return;
              }
            }
            throw sessionError;
          }

          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;

          if (user && !user.email_confirmed_at) {
            navigate("/verification-waiting", { state: { email: user.email, provider } });
            return;
          }

          toast({
            title: "Welcome!",
            description: `Successfully signed in with ${provider}`,
          });

          navigate('/', { replace: true });
          return;
        }

        if (accessToken && refreshToken) {
          const { error: tokenError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (tokenError) {
            throw tokenError;
          }

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          
          if (session) {
            toast({
              title: "Welcome!",
              description: "Successfully signed in",
            });
            navigate('/', { replace: true });
            return;
          } else {
            throw new Error("Failed to establish session");
          }
        }

        if (type === "signup" || type === "recovery") {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            toast({
              title: "Email verified!",
              description: "Your email has been successfully verified.",
            });
            navigate('/', { replace: true });
            return;
          }
          
          toast({
            title: "Email verified",
            description: "Your email has been verified. Please sign in to continue.",
          });
          navigate("/auth?tab=login", { replace: true });
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/', { replace: true });
          return;
        }
        
        throw new Error("Invalid authentication response - no valid parameters found");
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Authentication Failed",
          description: error.message || "Could not authenticate",
          variant: "destructive",
        });
        
        setTimeout(() => navigate("/auth?tab=login", { replace: true }), 3000);
      } finally {
        setIsProcessing(false);
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
        {error && (
          <div className="mt-4 max-w-md">
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Redirecting to login page...
            </p>
          </div>
        )}
        {!error && isProcessing && (
          <p className="text-sm text-muted-foreground mt-2">
            Processing authentication...
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
