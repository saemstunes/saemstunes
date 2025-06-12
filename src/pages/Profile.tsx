import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Helmet } from 'react-helmet';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [role, setRole] = useState<UserRole>(user?.role || UserRole.USER);
  const [subscribed, setSubscribed] = useState(user?.subscribed || false);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
      setRole(user.role || UserRole.USER);
      setSubscribed(user.subscribed || false);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        name,
        avatar,
        role,
        subscribed,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    [UserRole.USER]: 'User',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.MODERATOR]: 'Moderator',
    [UserRole.STUDENT]: 'Student',
    [UserRole.TEACHER]: 'Teacher',
    [UserRole.PARENT]: 'Parent',
    [UserRole.ADULT]: 'Adult'
  };

  return (
    <>
      <Helmet>
        <title>Profile - Saem's Tunes</title>
        <meta name="description" content="Manage your profile settings" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            {user ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    type="text"
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={!isEditing}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key as UserRole}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subscribed">Subscribed</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subscribed"
                      checked={subscribed}
                      onCheckedChange={(checked) => setSubscribed(checked)}
                      disabled={!isEditing}
                    />
                    <span>{subscribed ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>Save</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </div>
            ) : (
              <p>Please log in to view your profile.</p>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
