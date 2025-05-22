
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SocialLoginOptions = () => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Spotify login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Spotify",
        variant: "destructive",
      });
    }
  };

  const handleSolanaLogin = async () => {
    try {
      // Placeholder for Solana wallet integration
      // This would typically use a Solana wallet adapter
      toast({
        title: "Solana login",
        description: "Solana wallet login will be implemented soon",
      });
    } catch (error: any) {
      console.error("Solana login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Solana wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            Google
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={handleSpotifyLogin}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
              fill="#1ED760"
            />
            <path
              d="M16.7461 16.1472C16.5381 16.4792 16.0941 16.5752 15.7621 16.3672C13.3941 14.9352 10.4341 14.6352 7.19614 15.3472C6.81614 15.4352 6.44414 15.1872 6.35614 14.8072C6.26814 14.4272 6.51614 14.0552 6.89614 13.9672C10.4941 13.1752 13.7861 13.5232 16.5261 15.1632C16.8581 15.3712 16.9541 15.8152 16.7461 16.1472ZM17.8261 13.5032C17.5581 13.9192 17.0021 14.0392 16.5861 13.7712C13.8501 12.1072 9.91214 11.6632 6.95814 12.5672C6.48814 12.7192 5.98814 12.4592 5.83614 11.9872C5.68414 11.5152 5.94414 11.0152 6.41614 10.8632C9.90814 9.80324 14.3421 10.3032 17.5581 12.2632C17.9741 12.5312 18.0941 13.0872 17.8261 13.5032ZM17.9381 10.7432C14.6981 8.83324 9.56614 8.66724 6.66614 9.69724C6.10614 9.87724 5.51214 9.55724 5.33214 8.99724C5.15214 8.43724 5.47214 7.84324 6.03214 7.66324C9.41214 6.48324 15.1021 6.67724 18.8661 8.91724C19.3741 9.22324 19.5181 9.87724 19.2121 10.3832C18.9061 10.8912 18.2541 11.0352 17.7461 10.7292L17.9381 10.7432Z"
              fill="white"
            />
          </svg>
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            Spotify
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={handleSolanaLogin}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="12" fill="#9945FF" />
            <path
              d="M7.5 14.6c0.2-0.2 0.5-0.3 0.8-0.3h12c0.2 0 0.3 0.2 0.2 0.4 -0.2 0.2-0.5 0.3-0.8 0.3h-12C7.5 15 7.4 14.8 7.5 14.6z"
              fill="white"
            />
            <path
              d="M7.5 8.3C7.7 8.1 8 8 8.3 8h12c0.2 0 0.3 0.2 0.2 0.4 -0.2 0.2-0.5 0.3-0.8 0.3h-12C7.5 8.7 7.4 8.5 7.5 8.3z"
              fill="white"
            />
            <path
              d="M7.5 11.4c0.2-0.2 0.5-0.3 0.8-0.3h12c0.2 0 0.3 0.2 0.2 0.4 -0.2 0.2-0.5 0.3-0.8 0.3h-12C7.5 11.8 7.4 11.6 7.5 11.4z"
              fill="white"
            />
          </svg>
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            Solana
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginOptions;
