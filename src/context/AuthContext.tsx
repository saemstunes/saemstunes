
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the User interface since it's not exported from supabase types
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  subscribed: boolean;
}

// Define the user roles
export type UserRole = "student" | "adult" | "parent" | "teacher" | "admin";

// Define the auth context type
interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  checkPermission: (requiredRoles?: UserRole[]) => boolean;
  isLoading: boolean;
  updateUserProfile: (userUpdate: User) => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        // In a real app, you would fetch the user profile from your database
        // For now, we'll create a mock user based on the auth data
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.name || "User",
          role: (data.session.user.user_metadata?.role as UserRole) || "student",
          avatar: data.session.user.user_metadata?.avatar || "/lovable-uploads/avatar-1.png",
          subscribed: data.session.user.user_metadata?.subscribed || false,
        });
      }
      
      setIsLoading(false);
    };

    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
            role: (session.user.user_metadata?.role as UserRole) || "student",
            avatar: session.user.user_metadata?.avatar || "/lovable-uploads/avatar-1.png",
            subscribed: session.user.user_metadata?.subscribed || false,
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          avatar: "/lovable-uploads/avatar-1.png", // Default avatar
          subscribed: false,
        },
        captchaToken: captchaToken,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const checkPermission = (requiredRoles?: UserRole[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  const updateUserProfile = (userUpdate: User) => {
    // Update the local user state immediately for frontend display
    setUser(userUpdate);
    
    // In a real app, you would also call an API to update the user in the database
    console.log("User profile updated:", userUpdate);
    
    // Example of how you might update the user profile in Supabase
    // await supabase.from('profiles').update({ avatar: userUpdate.avatar }).eq('id', user.id);
  };
  
  const value = {
    user,
    signUp,
    login,
    logout,
    isAdmin,
    checkPermission,
    isLoading,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
