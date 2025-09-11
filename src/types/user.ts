// types/user.ts
export type UserRole = 'student' | 'adult_learner' | 'tutor' | 'parent' | 'user' | 'admin' | 'teacher';

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  role: UserRole;
  subscription_tier: 'free' | 'basic' | 'premium' | 'professional';
  onboarding_complete: boolean;
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
