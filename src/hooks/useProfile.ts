import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService, ProfileData, UpdateProfileData, PasswordChangeData } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateProfileData): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setError(null);
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      setUploading(true);
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully'
      });
      
      return avatarUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading
  };
};

export const usePasswordChange = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const changePassword = async (passwordData: PasswordChangeData): Promise<boolean> => {
    try {
      setLoading(true);
      await profileService.changePassword(passwordData);
      
      toast({
        title: 'Success',
        description: 'Password changed successfully'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading
  };
};

export const useEmailUpdate = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateEmail = async (newEmail: string): Promise<boolean> => {
    try {
      setLoading(true);
      await profileService.updateEmail(newEmail);
      
      toast({
        title: 'Success',
        description: 'Verification email sent to your new address'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update email';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateEmail,
    loading
  };
};
