import { supabase } from '../integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'adult_learner' | 'parent' | 'tutor' | 'admin' | 'user';
  phone: string | null;
  parent_id: string | null;
  bio: string | null;
  email: string | null;
  onboarding_complete: boolean | null;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ProfileService {
  async getProfile(userId: string): Promise<ProfileData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('Failed to fetch profile data');
    }

    return data as ProfileData;
  }

  async updateProfile(userId: string, updates: UpdateProfileData): Promise<ProfileData> {
    if (updates.first_name !== undefined || updates.last_name !== undefined) {
      const currentProfile = await this.getProfile(userId);
      const firstName = updates.first_name ?? currentProfile?.first_name ?? '';
      const lastName = updates.last_name ?? currentProfile?.last_name ?? '';
      updates.full_name = `${firstName} ${lastName}`.trim() || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    return data as ProfileData;
  }

  async updateLastActive(userId: string): Promise<void> {
    await supabase
      .from('profiles')
      .update({ 
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Failed to upload avatar image');
    }

    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    await this.updateProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  }

  async deleteOldAvatar(avatarUrl: string): Promise<void> {
    if (!avatarUrl || !avatarUrl.includes('supabase')) return;
    
    const urlParts = avatarUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;

    await supabase.storage
      .from('profiles')
      .remove([filePath]);
  }

  async changePassword(passwordData: PasswordChangeData): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new Error('Failed to update password');
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) {
      throw new Error('Failed to update email address');
    }
  }

  async completeOnboarding(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        onboarding_complete: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to complete onboarding');
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (profile?.avatar_url) {
      await this.deleteOldAvatar(profile.avatar_url);
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error('Failed to delete account');
    }
  }
}

export const profileService = new ProfileService();
