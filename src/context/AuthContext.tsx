import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; // Updated import path
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

// Define user roles
export type UserRole = "student" | "adult" | "parent" | "teacher" | "admin";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subscribed: boolean;
  parentId?: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for fallback
const MOCK_USERS: User[] = [
  // Your mock users...
];

// Helper function to transform Supabase user to our User type
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
  // Get user metadata or use defaults
  const userData = supabaseUser.user_metadata || {};
  
  return {
    id: supabaseUser.id,
    name: userData.full_name || userData.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    // Default to 'student' role, but ideally this would come from your database
    role: (userData.role as UserRole) || 'student',
    avatar: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
    subscribed: !!userData.subscribed,
  };
};

// Create the provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const transformedUser = transformSupabaseUser(session.user);
          setUser(transformedUser);
        } else {
          // Fallback to localStorage for mock data
          const storedUser = localStorage.getItem("saems_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const transformedUser = transformSupabaseUser(session.user);
        setUser(transformedUser);
        localStorage.removeItem("saems_user"); // Clean up mock data
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem("saems_user");
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Supabase email/password login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const transformedUser = transformSupabaseUser(data.user);
        setUser(transformedUser);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${transformedUser.name}`,
        });
      }
    } catch (error: any) {
      // Fall back to mock users if in development
      if (process.env.NODE_ENV === 'development') {
        try {
          const foundUser = MOCK_USERS.find(u => u.email === email);
        
          if (foundUser && password === "password") {
            setUser(foundUser);
            localStorage.setItem("saems_user", JSON.stringify(foundUser));
            toast({
              title: "Welcome back!",
              description: `Logged in as ${foundUser.name} (MOCK)`,
            });
            return;
          }
        } catch {
          // If mock fails, continue to error handling
        }
      }
      
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Supabase email/password signup
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            subscribed: false
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error: any) {
      // Fall back to mock signup if in development
      if (process.env.NODE_ENV === 'development') {
        try {
          if (MOCK_USERS.some(u => u.email === email)) {
            throw new Error("Email already in use");
          }
          
          const newUser: User = {
            id: `${MOCK_USERS.length + 1}`,
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            subscribed: false,
          };
          
          setUser(newUser);
          localStorage.setItem("saems_user", JSON.stringify(newUser));
          
          toast({
            title: "Account created! (MOCK)",
            description: `Welcome to Saem's Tunes, ${name}!`,
          });
          return;
        } catch (mockError: any) {
          // If mock fails, continue to error handling
          error = mockError;
        }
      }
      
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      // The redirect will happen automatically, no need to set user here
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("saems_user");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
