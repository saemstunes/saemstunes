import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { mockSubscriptionPlans } from "@/data/mockData";
import AvatarEditor from "@/components/profile/AvatarEditor";
import { Link } from "react-router-dom";
import { ExternalLink, LogOut, Lock, Mail } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { usePasswordChange } from "@/hooks/usePasswordChange";
import { useEmailUpdate } from "@/hooks/useEmailUpdate";
import { validateProfileForm, sanitizeInput, hasProfileChanges } from "@/utils/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { profile, loading, updateProfile, refetch } = useProfile();
  const { uploadAvatar, uploading } = useAvatarUpload();
  const { changePassword, loading: changingPassword } = usePasswordChange();
  const { updateEmail, loading: updatingEmail } = useEmailUpdate();

  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        display_name: profile.display_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const changes = hasProfileChanges(
        {
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          display_name: profile.display_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
        },
        formData
      );
      setHasChanges(changes);
    }
  }, [formData, profile]);

  const roleMapping: Record<string, string> = {
    student: "Student",
    adult: "Adult Learner",
    parent: "Parent/Guardian",
    teacher: "Teacher",
    admin: "Administrator",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      const errorsObj = validation.errors.reduce((acc, error) => {
        const fieldMatch = error.match(/(first name|last name|display name|email|phone|bio)/i);
        if (fieldMatch) {
          const field = fieldMatch[0].toLowerCase().replace(' ', '_');
          acc[field] = error;
        }
        return acc;
      }, {} as Record<string, string>);
      setFormErrors(errorsObj);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
      };
      await updateProfile(updates);
      if (formData.email !== profile?.email) {
        setNewEmail(formData.email);
        setEmailDialogOpen(true);
      }
      refetch();
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleAvatarSave = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl && user) {
        updateUserProfile({ ...user, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Avatar save error:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const success = await changePassword(passwordData);
      if (success) {
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  const handleChangeEmail = async () => {
    try {
      const success = await updateEmail(newEmail);
      if (success) {
        setEmailDialogOpen(false);
        setFormData(prev => ({ ...prev, email: newEmail }));
      }
    } catch (error) {
      console.error("Email update error:", error);
    }
  };

  const currentPlan = user?.subscribed 
    ? mockSubscriptionPlans.find(plan => plan.isPopular) || mockSubscriptionPlans[0]
    : null;

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Please log in to view your profile</h2>
        </div>
      </MainLayout>
    );
  }

  if (loading || !profile) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-serif font-bold">Your Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <Avatar 
                      className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setAvatarEditorOpen(true)}
                    >
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="link" 
                      className="text-gold hover:text-gold-dark mt-2"
                      onClick={() => setAvatarEditorOpen(true)}
                    >
                      Change Avatar
                    </Button>
                    {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className={formErrors.first_name ? "border-destructive" : ""}
                        />
                        {formErrors.first_name && (
                          <p className="text-destructive text-sm">{formErrors.first_name}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className={formErrors.last_name ? "border-destructive" : ""}
                        />
                        {formErrors.last_name && (
                          <p className="text-destructive text-sm">{formErrors.last_name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="display_name">Display Name (Optional)</Label>
                      <Input
                          id="display_name"
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleInputChange}
                          className={formErrors.display_name ? "border-destructive" : ""}
                        />
                        {formErrors.display_name && (
                          <p className="text-destructive text-sm">{formErrors.display_name}</p>
                        )}
                      <p className="text-xs text-muted-foreground">
                        This name will be visible to other users
                      </p>
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? "border-destructive" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-destructive text-sm">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className={formErrors.phone ? "border-destructive" : ""}
                      />
                      {formErrors.phone && (
                        <p className="text-destructive text-sm">{formErrors.phone}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="bio">Bio (Optional)</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          formErrors.bio ? "border-destructive" : ""
                        }`}
                      />
                      <div className="flex justify-between">
                        {formErrors.bio ? (
                          <p className="text-destructive text-sm">{formErrors.bio}</p>
                        ) : (
                          <div></div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formData.bio.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile} 
                  className="bg-gold hover:bg-gold-dark text-white"
                  disabled={!hasChanges}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    value={roleMapping[user.role] || user.role}
                    disabled
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label>Password</Label>
                  <div className="flex gap-4">
                    <Input
                      value="••••••••"
                      disabled
                    />
                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and set a new one.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-1.5">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                            />
                            <p className="text-xs text-muted-foreground">
                              Must be at least 8 characters with uppercase, lowercase, number, and special character
                            </p>
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                          >
                            {changingPassword ? "Changing..." : "Change Password"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPlan ? (
                  <>
                    <div className="bg-gold/10 rounded-md p-4 mb-4">
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-2xl font-bold mt-1">{currentPlan.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${currentPlan.price}/{currentPlan.interval}
                      </p>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      Manage Subscription
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-muted rounded-md p-4 mb-4">
                      <h3 className="font-medium">Free Plan</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You are currently on the free plan with limited access.
                      </p>
                    </div>
                    
                    <Button className="w-full bg-gold hover:bg-gold-dark text-white">
                      Upgrade to Premium
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Account Activity</CardTitle>
                <Link to="/user-details" className="text-sm text-gold hover:underline flex items-center">
                  <span>View Details</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Last Login</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Member Since</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    logout();
                    toast({
                      title: "Logged out",
                      description: "You have been successfully logged out"
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AvatarEditor 
        currentAvatar={user.avatar}
        username={user.name}
        onSave={handleAvatarSave}
        open={avatarEditorOpen}
        onOpenChange={setAvatarEditorOpen}
      />

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Change</DialogTitle>
            <DialogDescription>
              You're changing your email from <span className="font-medium">{profile.email}</span> to <span className="font-medium">{newEmail}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              We'll send a confirmation link to your new email address. Your email will be updated once you click the confirmation link.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleChangeEmail}
              disabled={updatingEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              {updatingEmail ? "Sending..." : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Profile;
