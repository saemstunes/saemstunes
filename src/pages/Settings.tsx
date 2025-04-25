
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  BellRing, 
  User, 
  Shield, 
  Palette, 
  Globe, 
  Type, 
  Eye, 
  Sidebar as SidebarIcon,
  Laptop,
  Moon,
  SunMedium
} from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme, highContrast, toggleHighContrast } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");
  const [language, setLanguage] = useState("english");
  const [fontSize, setFontSize] = useState("medium");
  const [sidebarDisplay, setSidebarDisplay] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };
  
  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "german", label: "Deutsch" },
    { value: "japanese", label: "日本語" },
    { value: "chinese", label: "中文" },
  ];
  
  const fontSizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "xlarge", label: "Extra Large" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5">
            <TabsTrigger value="appearance" className="text-xs md:text-sm">
              <Palette className="h-4 w-4 mr-2 hidden sm:inline" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="text-xs md:text-sm">
              <Eye className="h-4 w-4 mr-2 hidden sm:inline" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">
              <BellRing className="h-4 w-4 mr-2 hidden sm:inline" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs md:text-sm">
              <User className="h-4 w-4 mr-2 hidden sm:inline" />
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs md:text-sm hidden md:flex">
              <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme Options</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${theme === 'gold' ? 'ring-2 ring-gold border-gold' : ''}`}
                        onClick={() => setTheme('gold')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                          <span className="font-medium">Gold</span>
                        </div>
                        <div className="mt-2 h-6 bg-gradient-to-r from-amber-500 to-amber-700 rounded"></div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${theme === 'teal' ? 'ring-2 ring-teal-500 border-teal-500' : ''}`}
                        onClick={() => setTheme('teal')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-500"></div>
                          <span className="font-medium">Teal</span>
                        </div>
                        <div className="mt-2 h-6 bg-gradient-to-r from-teal-500 to-teal-700 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sidebar-toggle">Sidebar Display</Label>
                        <p className="text-sm text-muted-foreground">
                          Show or hide the sidebar navigation
                        </p>
                      </div>
                      <Switch
                        id="sidebar-toggle"
                        checked={sidebarDisplay}
                        onCheckedChange={setSidebarDisplay}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>
                  Configure settings to improve accessibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-select">Language</Label>
                    <Select
                      value={language}
                      onValueChange={setLanguage}
                    >
                      <SelectTrigger id="language-select" className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size-select">Font Size</Label>
                    <Select
                      value={fontSize}
                      onValueChange={setFontSize}
                    >
                      <SelectTrigger id="font-size-select" className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {fontSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better readability
                      </p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={highContrast}
                      onCheckedChange={toggleHighContrast}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications from the app
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                {notificationsEnabled && (
                  <>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in the app
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Notify me about:</h3>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="notify-new-music" className="rounded border-gray-300" defaultChecked />
                          <label htmlFor="notify-new-music" className="text-sm">New music releases</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="notify-lessons" className="rounded border-gray-300" defaultChecked />
                          <label htmlFor="notify-lessons" className="text-sm">Upcoming lessons and events</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="notify-comments" className="rounded border-gray-300" defaultChecked />
                          <label htmlFor="notify-comments" className="text-sm">Comments and mentions</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="notify-promotions" className="rounded border-gray-300" />
                          <label htmlFor="notify-promotions" className="text-sm">Promotions and special offers</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 rounded-md border"
                      defaultValue={user?.displayName || ""}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 rounded-md border bg-gray-100"
                      defaultValue={user?.email || ""}
                      placeholder="Your email"
                      disabled
                    />
                  </div>

                  <Button variant="secondary" className="w-full mt-4">Change Password</Button>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-3">Subscription Plan</h3>
                    {user?.subscribed ? (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Premium Plan</p>
                            <p className="text-sm text-muted-foreground">Active until December 31, 2023</p>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Free Plan</p>
                            <p className="text-sm text-muted-foreground">Limited access to content</p>
                          </div>
                          <Button className="bg-gold hover:bg-gold-dark" size="sm">Upgrade</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Actions that can't be undone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of anonymous usage data
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="personalization">Personalization</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive personalized content recommendations
                    </p>
                  </div>
                  <Switch id="personalization" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Profile Visibility</h3>
                  <RadioGroup defaultValue="friends">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public - Anyone can see your profile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends" id="friends" />
                      <Label htmlFor="friends">Members Only - Only other members can see your profile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private - Only you can see your profile</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-gold hover:bg-gold-dark">
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
