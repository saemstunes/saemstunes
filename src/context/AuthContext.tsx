import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  Session,
  User,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'student' | 'adult' | 'parent' | 'teacher' | 'admin';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  parent_id?: string;
  bio?: string;
  onboarding_complete?: boolean;
  email?: string;
  full_name?: string;
}

interface ExtendedUser extends User {
  profile?: Profile;
  role: UserRole;
  subscribed?: boolean;
  subscriptionTier?: SubscriptionTier;
  name: string;
  avatar?: string;
}

interface AuthContextProps {
  session: Session | null;
  user: ExtendedUser | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  login: (email: string, password: string, captchaToken?: string | null) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  updateUserProfile: (userData: ExtendedUser) => void;
  logout: () => Promise<void>;
  subscription: UserSubscription | null;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: Date | null;
}

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Create extended user object
  const createExtendedUser = async (authUser: User): Promise<ExtendedUser> => {
    const profile = await fetchUserProfile(authUser.id);
    
    return {
      ...authUser,
      profile,
      role: profile?.role || 'student',
      name: profile?.full_name || profile?.first_name || authUser.user_metadata?.full_name || authUser.email || 'User',
      avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
      subscribed: false,
      subscriptionTier: 'free'
    };
  };

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const extendedUser = await createExtendedUser(session.user);
          setUser(extendedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        
        if (session?.user) {
          const extendedUser = await createExtendedUser(session.user);
          setUser(extendedUser);
        } else {
          setUser(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setSubscription(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    const getSubscription = async () => {
      if (user) {
        // Mock subscription check - replace with actual logic
        const mockSubscription: UserSubscription = {
          tier: user.profile?.role === 'admin' ? 'professional' : 'free',
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
        setSubscription(mockSubscription);
      } else {
        setSubscription(null);
      }
    };

    getSubscription();
  }, [user]);

  const signIn = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      alert("Check your email for the magic link to sign in!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, captchaToken?: string | null) => {
    try {
      setIsLoading(true);
      const signInOptions: any = { email, password };
      
      if (captchaToken) {
        signInOptions.options = { captchaToken };
      }
      
      const { error } = await supabase.auth.signInWithPassword(signInOptions);
      if (error) throw error;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const signUp = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      alert("Check your email to verify your account!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (userData: ExtendedUser) => {
    setUser(userData);
  };

  const isAdmin = user?.role === 'admin' || false;

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
    login,
    updateUser,
    updateUserProfile,
    logout,
    subscription,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
