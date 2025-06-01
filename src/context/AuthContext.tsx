
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

// Define the User interface to match our profiles table
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  subscribed: boolean;
}

// Define the user roles to match the database enum
export type UserRole = "student" | "adult" | "parent" | "teacher" | "admin";

// Define the auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => Promise<void>;
  login: (email: string, password: string, captchaToken?: string) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile fetching to avoid potential deadlocks
          setTimeout(async () => {
            await fetchUserProfile(session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          setSession(session);
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      // Fetch user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a basic user object from auth data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || "User",
          role: (authUser.user_metadata?.role as UserRole) || "student",
          avatar: authUser.user_metadata?.avatar_url || "/lovable-uploads/avatar-1.png",
          subscribed: false,
        });
        return;
      }

      // Check for active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .gte('valid_until', new Date().toISOString())
        .maybeSingle();

      setUser({
        id: profile.id,
        email: profile.email || authUser.email || "",
        name: profile.display_name || profile.full_name || profile.first_name || "User",
        role: profile.role as UserRole,
        avatar: profile.avatar_url || "/lovable-uploads/avatar-1.png",
        subscribed: !!subscription,
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
          role,
          avatar_url: "/lovable-uploads/avatar-1.png",
        },
        captchaToken: captchaToken,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken,
      },
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
    setSession(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const checkPermission = (requiredRoles?: UserRole[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  const updateUserProfile = async (userUpdate: User) => {
    // Update the local user state immediately for frontend display
    setUser(userUpdate);
    
    try {
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: userUpdate.name,
          avatar_url: userUpdate.avatar 
        })
        .eq('id', userUpdate.id);
      
      if (error) {
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
    }
  };
  
  const value = {
    user,
    session,
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
