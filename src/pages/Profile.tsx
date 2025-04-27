
import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { mockSubscriptionPlans } from "@/data/mockData";
import AvatarEditor from "@/components/profile/AvatarEditor";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAvatarSave = (avatarUrl: string) => {
    // In a real app, would call an API to update the user's avatar
    console.log("Avatar updated:", avatarUrl);
    // For now just show a toast message
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been changed successfully.",
    });
  };

  const roleMapping: Record<UserRole, string> = {
    student: "Student",
    adult: "Adult Learner",
    parent: "Parent/Guardian",
    teacher: "Teacher",
    admin: "Administrator",
  };

  // Find the user's current subscription plan
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
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-4">
                    <Input
                      id="password"
                      type="password"
                      value="********"
                      disabled
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
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
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
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar editor dialog */}
      <AvatarEditor 
        currentAvatar={user.avatar}
        username={user.name}
        onSave={handleAvatarSave}
        open={avatarEditorOpen}
        onOpenChange={setAvatarEditorOpen}
      />
    </MainLayout>
  );
};

export default Profile;
