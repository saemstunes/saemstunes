// Updated AuthContext with support for extended user profiles, multiple providers, and compatibility aliases

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'student' | 'parent' | 'admin' | 'user' | 'adult_learner' | 'tutor';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  role: UserRole;
  onboarding_complete: boolean;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
  last_active?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithSpotify: () => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'spotify') => Promise<void>;
  logout: () => Promise<void>;

  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (userUpdate: any) => void;
  refreshProfile: () => Promise<void>;
  completeOnboarding: () => Promise<void>;

  isAdmin: () => boolean;
  checkPermission: (requiredRoles?: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const mapUserRole = (role?: string): UserRole => {
    switch (role?.toLowerCase()) {
      case 'adult': return 'adult_learner';
      case 'teacher': return 'tutor';
      case 'student': return 'student';
      case 'parent': return 'parent';
      case 'admin': return 'admin';
      default: return 'user';
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      console.error('Fetch profile error:', error);
      return null;
    }
    return data as UserProfile;
  };

  const createProfile = async (user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile | null> => {
    const profileData: UserProfile = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.name || additionalData?.full_name || '',
      display_name: additionalData?.display_name || user.email?.split('@')[0] || '',
      first_name: additionalData?.first_name || '',
      last_name: additionalData?.last_name || '',
      avatar_url: user.user_metadata?.avatar_url || additionalData?.avatar_url || '',
      role: mapUserRole(additionalData?.role),
      onboarding_complete: false,
      ...additionalData,
    };
    const { data, error } = await supabase.from('profiles').insert([profileData]).select().single();
    if (error) {
      console.error('Create profile error:', error);
      return null;
    }
    return data as UserProfile;
  };

  const syncOAuthProfile = async (user: User): Promise<UserProfile | null> => {
    let userProfile = await fetchUserProfile(user.id);
    if (!userProfile) {
      userProfile = await createProfile(user);
    }
    return userProfile;
  };

  const refreshProfile = async () => {
    if (user) {
      const latest = await fetchUserProfile(user.id);
      setProfile(latest);
    }
  };

  useEffect(() => {
    const { subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        const userProfile = await syncOAuthProfile(session.user);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setSession(session);
        syncOAuthProfile(session.user).then(setProfile);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (data.session) {
      setUser(data.session.user);
      setSession(data.session);
      const userProfile = await syncOAuthProfile(data.session.user);
      setProfile(userProfile);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    });
    if (error) throw new Error(error.message);
    if (data.user) await createProfile(data.user, userData);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const signInWithGoogle = async () => loginWithProvider('google');
  const signInWithSpotify = async () => loginWithProvider('spotify');

  const loginWithProvider = async (provider: 'google' | 'spotify') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw new Error(error.message);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) throw new Error(error.message);
    refreshProfile();
  };

  const completeOnboarding = async () => updateProfile({ onboarding_complete: true });
  const updateUserProfile = (userUpdate: any) => setProfile((prev) => ({ ...prev, ...userUpdate }));
  const isAdmin = () => profile?.role === 'admin';
  const checkPermission = (requiredRoles?: UserRole[]) => {
    if (!profile) return false;
    return !requiredRoles || requiredRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isLoading: loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithSpotify,
        login: signIn,
        signup: signUp,
        loginWithProvider,
        logout: signOut,
        updateProfile,
        updateUserProfile,
        refreshProfile,
        completeOnboarding,
        isAdmin,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
