import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface WalletContextType {
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window !== 'undefined') {
      const solana = window.solana || window.phantom?.solana || window.braveSolana;
      if (solana) {
        try {
          await solana.connect();
          const key = solana.publicKey.toString();
          setPublicKey(key);
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletPublicKey', key);
        } catch (error) {
          console.error('Wallet connection failed:', error);
        }
      }
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletPublicKey');
  };

  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined') {
        const solana = window.solana || window.phantom?.solana || window.braveSolana;
        const wasConnected = localStorage.getItem('walletConnected');
        const storedKey = localStorage.getItem('walletPublicKey');
        
        if (solana && wasConnected && storedKey) {
          try {
            await solana.connect();
            setPublicKey(solana.publicKey.toString());
          } catch (error) {
            console.error('Auto wallet connection failed:', error);
            disconnect();
          }
        }
      }
    };

    initWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ 
      publicKey, 
      connect, 
      disconnect, 
      isConnected: !!publicKey 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};