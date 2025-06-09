import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { SubscriptionTier } from "@/lib/contentAccess";

// Define the User interface to match our profiles table
interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  avatar: string;
  subscribed: boolean;
  subscriptionTier?: SubscriptionTier;
}

// Define the user roles to match the frontend usage
export type UserRole = "student" | "adult" | "parent" | "teacher" | "admin";

// Define the database roles to match the actual database enum
// You need to replace these with your actual enum values from the database
type DatabaseRole = "student" | "adult_learner" | "parent" | "tutor" | "admin" | "user";

// Map frontend role to database role
const mapFrontendRole = (frontendRole: UserRole): DatabaseRole => {
  switch (frontendRole) {
    case 'adult':
      return 'adult_learner';
    case 'teacher':
      return 'tutor';
    case 'student':
      return 'student';
    case 'parent':
      return 'parent';
    case 'admin':
      return 'admin';
    default:
      return 'user'; // fallback
  }
};

// Map database role to frontend role
const mapDatabaseRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'adult_learner':
      return 'adult';
    case 'tutor':
      return 'teacher';
    case 'student':
      return 'student';
    case 'parent':
      return 'parent';
    case 'admin':
      return 'admin';
    case 'user':
    default:
      return 'student'; // fallback to student for 'user' and unknown roles
  }
};

// Define the auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => Promise<void>;
  login: (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => Promise<void>;
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
          await fetchUserProfile(session.user);
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
        
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') { // No rows returned
          console.log('Profile not found, creating new profile...');
          await createUserProfile(authUser);
          return;
        }
        
        // If other error, create a basic user object from auth data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || "User",
          role: (authUser.user_metadata?.role as UserRole) || "student",
          avatar: authUser.user_metadata?.avatar_url || "/lovable-uploads/avatar-1.png",
          subscribed: false,
          subscriptionTier: 'free',
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

      // Determine subscription tier from subscription type
      let subscriptionTier: SubscriptionTier = 'free';
      if (subscription) {
        switch (subscription.type) {
          case 'basic':
            subscriptionTier = 'basic';
            break;
          case 'premium':
            subscriptionTier = 'premium';
            break;
          case 'professional':
            subscriptionTier = 'professional';
            break;
          default:
            subscriptionTier = 'free';
        }
      }

      setUser({
        id: profile.id,
        email: profile.email || authUser.email || "",
        name: profile.display_name || profile.full_name || profile.first_name || "User",
        role: mapDatabaseRole(profile.role),
        avatar: profile.avatar_url || "/lovable-uploads/avatar-1.png",
        subscribed: !!subscription,
        subscriptionTier,
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const createUserProfile = async (authUser: SupabaseUser) => {
    try {
      // Get the role from user metadata and map it to database role
      const frontendRole = (authUser.user_metadata?.role as UserRole) || "student";
      const databaseRole = mapFrontendRole(frontendRole);
      
      // Create profile data that matches your database schema exactly
      const profileData = {
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.user_metadata?.name?.split(' ')[0] || '',
        last_name: authUser.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
        display_name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
        full_name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
        role: databaseRole, // Use the mapped database role
        avatar_url: authUser.user_metadata?.avatar_url || "/lovable-uploads/avatar-1.png",
        onboarding_complete: false,
        // Add other fields that are in your profiles table
        phone: authUser.user_metadata?.phone || null,
        bio: null,
        parent_id: null,
        last_active: new Date().toISOString(),
      };

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        // Fallback to auth user data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || "User",
          role: frontendRole,
          avatar: authUser.user_metadata?.avatar_url || "/lovable-uploads/avatar-1.png",
          subscribed: false,
          subscriptionTier: 'free',
        });
        return;
      }

      console.log('Profile created successfully:', profile);
      
      // Set user state with new profile
      setUser({
        id: profile.id,
        email: profile.email || authUser.email || "",
        name: profile.display_name || profile.full_name || "User",
        role: mapDatabaseRole(profile.role),
        avatar: profile.avatar_url || "/lovable-uploads/avatar-1.png",
        subscribed: false,
        subscriptionTier: 'free',
      });
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole, captchaToken?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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
        console.error('Signup error:', error);
        throw new Error(error.message);
      }

      console.log('Signup successful:', data);
      
      // Profile will be created automatically when the SIGNED_IN event fires
      // due to the auth state change listener
      
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, captchaToken?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken,
        },
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }

      console.log('Login successful:', data);
      
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw new Error(error.message);
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
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
