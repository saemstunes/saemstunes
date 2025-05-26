
import { useState } from "react";
import { useAuth } from "@/context/EnhancedAuthContext";
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
import { ExternalLink, LogOut } from "lucide-react";

const Profile = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || "",
    display_name: profile?.display_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: profileForm.full_name,
        display_name: profileForm.display_name,
        phone: profileForm.phone,
        bio: profileForm.bio,
      });
    } catch (error) {
      // Error is already handled in updateProfile
    }
  };

  const handleAvatarSave = async (avatarUrl: string) => {
    try {
      await updateProfile({ avatar_url: avatarUrl });
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been changed successfully.",
      });
    } catch (error) {
      // Error is already handled in updateProfile
    }
  };

  const roleMapping: Record<string, string> = {
    student: "Student",
    adult: "Adult Learner", 
    parent: "Parent/Guardian",
    teacher: "Teacher",
    admin: "Administrator",
  };

  // Find the user's current subscription plan
  const currentPlan = user ? mockSubscriptionPlans.find(plan => plan.isPopular) || mockSubscriptionPlans[0] : null;

  if (!user || !profile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Please log in to view your profile</h2>
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
                  Update your personal information and how we can contact you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <Avatar 
                      className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setAvatarEditorOpen(true)}
                    >
                      <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                      <AvatarFallback>{profile.display_name?.charAt(0) || profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="link" 
                      className="text-gold hover:text-gold-dark mt-2"
                      onClick={() => setAvatarEditorOpen(true)}
                    >
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      />
                    </div>

                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
                    </div>

                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} className="bg-gold hover:bg-gold-dark text-white">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    value={roleMapping[profile.role] || profile.role}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      profile.onboarding_complete 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {profile.onboarding_complete ? 'Complete' : 'Setup Needed'}
                    </span>
                  </div>
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-4">
                    <Input
                      id="password"
                      type="password"
                      value="********"
                      disabled
                      className="bg-muted"
                    />
                    <Button variant="outline">
                      Change Password
                    </Button>
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

                  <div>
                    <h3 className="text-sm font-medium">Profile Completion</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.onboarding_complete ? 'Complete' : 'Incomplete - Please complete your profile'}
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
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar editor dialog */}
      <AvatarEditor 
        currentAvatar={profile.avatar_url}
        username={profile.display_name || profile.full_name || 'User'}
        onSave={handleAvatarSave}
        open={avatarEditorOpen}
        onOpenChange={setAvatarEditorOpen}
      />
    </MainLayout>
  );
};

export default Profile;
