
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADULT = 'adult'
}

export interface ExtendedUser extends User {
  name?: string;
  avatar?: string;
  subscribed?: boolean;
  subscriptionTier?: 'free' | 'premium' | 'pro';
  role?: UserRole;
}

interface AuthContextProps {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, captchaToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<ExtendedUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url,
          subscribed: session.user.user_metadata?.subscribed || false,
          subscriptionTier: session.user.user_metadata?.subscription_tier || 'free',
          role: session.user.user_metadata?.role as UserRole || UserRole.USER
        };
        setUser(extendedUser);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url,
          subscribed: session.user.user_metadata?.subscribed || false,
          subscriptionTier: session.user.user_metadata?.subscription_tier || 'free',
          role: session.user.user_metadata?.role as UserRole || UserRole.USER
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUserProfile = async (updates: Partial<ExtendedUser>) => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const value: AuthContextProps = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
