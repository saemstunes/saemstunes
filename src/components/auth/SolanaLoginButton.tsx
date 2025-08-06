import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import bs58 from 'bs58';

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

interface SolanaLoginButtonProps {
  onLoginSuccess: () => void;
}

export const SolanaLoginButton = ({ onLoginSuccess }: SolanaLoginButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSolanaLogin = async () => {
    setIsLoading(true);
    try {
      // Check for Solana wallet providers
      const solanaProvider = window.solana || window.phantom?.solana || window.braveSolana;
      
      if (!solanaProvider) {
        toast({
          title: "Wallet not found",
          description: "Please install a Solana wallet like Phantom to continue",
          variant: "destructive",
        });
        setIsLoading(false);
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
      
      onLoginSuccess();
    } catch (error: any) {
      console.error("Solana login error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Solana wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center justify-center gap-2 w-full"
      onClick={handleSolanaLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 397.7 311.7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Solana SVG icon */}
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
          <span>Sign in with Solana</span>
        </>
      )}
    </Button>
  );
};
