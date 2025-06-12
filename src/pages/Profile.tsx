import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ModeToggle } from '@/components/layout/ModeToggle';

interface ProfileForm {
  name: string;
  email: string;
  role: UserRole;
}

const Profile = () => {
  const { user, updateUser, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || UserRole.USER,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || UserRole.USER,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      data: {
        name: profile.name,
      },
      email: profile.email,
    });
    setIsEditMode(false);
  };

  const roleLabels: Record<UserRole, string> = {
    [UserRole.USER]: 'Member',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.MODERATOR]: 'Moderator'
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={roleLabels[profile.role]}
                disabled
              />
            </div>
            <div className="flex justify-between">
              {isEditMode ? (
                <div className="flex gap-2">
                  <Button type="submit" onClick={handleSubmit}>Save</Button>
                  <Button variant="secondary" onClick={() => setIsEditMode(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditMode(true)}>Edit Profile</Button>
              )}
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
        <div className="max-w-md mx-auto mt-4">
          <Button variant="destructive" onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
