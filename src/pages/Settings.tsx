import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut 
} from "lucide-react";

const Settings = () => {
  // Get user from auth context
  const { user, signOut } = useAuth();
  
  // Assuming you want to use user.name or user.email as a fallback
  const displayName = user?.name || user?.email || "User";

  return (
    <MainLayout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user?.email || ""} disabled />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={user?.phone || ""} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gold hover:bg-gold-dark text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gold hover:bg-gold-dark text-white">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control what notifications you receive from Saem's Tunes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new content and updates via email.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Lessons</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new lessons are published.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Live Events</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about upcoming live events and workshops.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional emails and special offers.
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gold hover:bg-gold-dark text-white">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow other users to see your profile and activity.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Collection</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect data to improve your experience.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Course Progress Sharing</h4>
                      <p className="text-sm text-muted-foreground">
                        Share your course progress with instructors.
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gold hover:bg-gold-dark text-white">
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">
                          {user?.subscribed ? "Premium Plan" : "Free Plan"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.subscribed 
                            ? "Your subscription renews on January 1, 2024" 
                            : "Upgrade to access premium content"}
                        </p>
                      </div>
                      {user?.subscribed ? (
                        <Button variant="outline">Manage</Button>
                      ) : (
                        <Button className="bg-gold hover:bg-gold-dark text-white">
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {user?.subscribed && (
                    <div className="pt-4 space-y-4">
                      <h4 className="font-medium">Payment Method</h4>
                      <div className="p-4 border rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-slate-800 rounded mr-3 flex items-center justify-center text-white text-xs">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      
                      <div className="pt-4">
                        <h4 className="font-medium mb-2">Billing History</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr className="text-left text-sm">
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t">
                                <td className="p-3">Jan 1, 2024</td>
                                <td className="p-3">$19.99</td>
                                <td className="p-3">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Paid
                                  </span>
                                </td>
                                <td className="p-3">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                              <tr className="border-t">
                                <td className="p-3">Dec 1, 2023</td>
                                <td className="p-3">$19.99</td>
                                <td className="p-3">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Paid
                                  </span>
                                </td>
                                <td className="p-3">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => {
              if (signOut) signOut();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
