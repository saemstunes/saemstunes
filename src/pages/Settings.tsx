import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Settings as SettingsIcon, User, Mail, Phone, Book, CheckCheck } from "lucide-react";

const Settings = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || profile?.display_name || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [role, setRole] = useState(profile?.role || 'student');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        display_name: displayName,
        phone: phone,
        bio: bio,
        role: role,
      });
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Account Settings
              </div>
            </CardTitle>
            <CardDescription>
              Manage your basic account information such as name, email, and profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile?.full_name || profile?.display_name || ''}
                    placeholder="Enter your full name"
                    className="mt-1"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile?.display_name || ''}
                    placeholder="Enter your display name"
                    className="mt-1"
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    placeholder="Enter your email"
                    className="mt-1"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile?.phone || ''}
                    placeholder="Enter your phone number"
                    className="mt-1"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile?.bio || ''}
                    placeholder="Write a short bio about yourself"
                    className="mt-1"
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={profile?.role || 'student'} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="adult_learner">Adult Learner</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
