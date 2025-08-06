import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Declare global interfaces for Web3 wallets
declare global {
  interface Window {
    solana?: {
      connect: () => Promise<void>;
      publicKey: { toString: () => string; toBase58: () => string };
      isPhantom?: boolean;
    };
    phantom?: {
      solana?: {
        connect: () => Promise<void>;
        publicKey: { toString: () => string; toBase58: () => string };
        isPhantom?: boolean;
      };
    };
    braveSolana?: {
      connect: () => Promise<void>;
      publicKey: { toString: () => string; toBase58: () => string };
    };
  }
}

export const SocialLoginOptions = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<"google" | "spotify" | "solana" | null>(null);

  const handleOAuthLogin = async (provider: "google" | "spotify") => {
    setIsLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Spotify-specific parameters
          ...(provider === "spotify" ? {
            scopes: "user-read-email user-read-private",
            queryParams: {
              response_type: "code",
              access_type: "offline",
              prompt: "consent",
            },
          } : {}),
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Login failed",
        description: error.message || `Could not sign in with ${provider}`,
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };

  const handleSolanaLogin = async () => {
    setIsLoading("solana");
    try {
      // Check for Solana wallet providers
      const solanaProvider = window.solana || window.phantom?.solana || window.braveSolana;
      
      if (!solanaProvider) {
        toast({
          title: "Wallet not found",
          description: "Please install a Solana wallet like Phantom to continue",
          variant: "destructive",
        });
        setIsLoading(null);
        return;
      }

      // Connect to wallet
      await solanaProvider.connect();
      const publicKey = solanaProvider.publicKey.toString();

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service at https://www.saemstunes.com/terms',
        wallet: solanaProvider,
      });

      if (error) throw error;

      // Success handling
      toast({
        title: "Wallet Connected!",
        description: `Signed in with ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
      });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      console.error("Solana login error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Solana wallet",
        variant: "destructive",
      });
      setIsLoading(null);
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
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading === "google"}
        >
          {isLoading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
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
          )}
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            {isLoading === "google" ? "Processing..." : "Google"}
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("spotify")}
          disabled={isLoading === "spotify"}
        >
          {isLoading === "spotify" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"
                fill="#1DB954"
              />
            </svg>
          )}
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            {isLoading === "spotify" ? "Processing..." : "Spotify"}
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={handleSolanaLogin}
          disabled={isLoading === "solana"}
        >
          {isLoading === "solana" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 397.7 311.7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                fill="url(#solana-gradient-1)"
              />
              <path
                d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                fill="url(#solana-gradient-2)"
              />
              <path
                d="M333.1 120.1c2.4-2.4 5.7-3.8 9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                fill="url(#solana-gradient-3)"
              />
              <defs>
                <linearGradient id="solana-gradient-1" x1="360.8793" y1="351.4553" x2="141.213" y2="131.7889" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <linearGradient id="solana-gradient-2" x1="264.8291" y1="138.0446" x2="45.1627" y2="-81.6218" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <linearGradient id="solana-gradient-3" x1="312.5484" y1="235.4553" x2="92.8821" y2="15.7889" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <span className="sr-only md:not-sr-only md:text-xs md:font-medium">
            {isLoading === "solana" ? "Processing..." : "Solana"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginOptions;