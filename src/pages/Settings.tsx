
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Bell, 
  Lock, 
  Globe, 
  Volume2, 
  User, 
  Calendar, 
  Shield, 
  Monitor, 
  Save,
  Moon,
  Sun,
  Smartphone,
  PaintBucket,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<'gold' | 'teal'>('gold');
  const [brightness, setBrightness] = useState(100);
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    newContent: true,
    events: true,
    mentions: true,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "everyone",
    allowMessages: true,
    activityVisibility: "friends",
    dataCollection: true,
  });
  
  const [syncSettings, setSyncSettings] = useState({
    googleCalendar: false,
    iCloudCalendar: false,
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    language: "english",
    theme: "system",
    fontSize: "medium",
    highContrast: false,
  });

  // Apply theme based on the selected theme color
  useEffect(() => {
    // Get the root element
    const root = document.documentElement;
    
    if (currentTheme === 'teal') {
      // Apply teal theme
      root.style.setProperty('--primary', '177 100% 22%'); // #036c5f
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', '177 54% 61%'); // #81cdc6
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--gold', '180 100% 25%'); // #008080
      root.style.setProperty('--gold-light', '177 54% 61%'); // #81cdc6
      root.style.setProperty('--gold-dark', '179 94% 16%'); // #025043
      localStorage.setItem('appThemeColor', 'teal');
    } else {
      // Default gold theme
      root.style.setProperty('--primary', '43 100% 33%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', '43 60% 45%');
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--gold', '43 100% 33%');
      root.style.setProperty('--gold-light', '43 100% 50%');
      root.style.setProperty('--gold-dark', '43 100% 25%');
      localStorage.setItem('appThemeColor', 'gold');
    }
  }, [currentTheme]);

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appThemeColor');
    if (savedTheme === 'teal') {
      setCurrentTheme('teal');
    }
    
    // Load saved brightness
    const savedBrightness = localStorage.getItem('appBrightness');
    if (savedBrightness) {
      const brightnessValue = parseInt(savedBrightness);
      setBrightness(brightnessValue);
      applyBrightness(brightnessValue);
    }
  }, []);

  // Apply brightness filter
  const applyBrightness = (value: number) => {
    document.body.style.filter = `brightness(${value}%)`;
    localStorage.setItem('appBrightness', value.toString());
  };

  // Handle brightness change
  const handleBrightnessChange = (value: number[]) => {
    const brightnessValue = value[0];
    setBrightness(brightnessValue);
    applyBrightness(brightnessValue);
  };
  
  // Form submission handler (example)
  const handleSubmit = (settingType: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${settingType} settings have been saved.`,
    });
  };

  // Theme options
  const themeOptions = [
    {
      name: "Gold",
      value: "gold",
      preview: (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-600"></div>
          <span className="text-xs mt-1">Gold</span>
        </div>
      )
    },
    {
      name: "Teal",
      value: "teal",
      preview: (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-teal-700"></div>
          <span className="text-xs mt-1">Teal</span>
        </div>
      )
    }
  ];

  // Safe access to user display name
  const userDisplayName = user ? (user.email ? user.email.split('@')[0] : 'User') : 'User';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-auto">
            <TabsTrigger value="notifications" className="text-center">
              <Bell className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-center">
              <Lock className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-center">
              <Calendar className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="display" className="text-center">
              <Monitor className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Display
            </TabsTrigger>
          </TabsList>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, email: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, push: checked})
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notify me about</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Content</Label>
                      <p className="text-sm text-muted-foreground">
                        New lessons, courses, and resources
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.newContent}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, newContent: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Events & Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Upcoming bookings and event reminders
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.events}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, events: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions & Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone mentions or replies to you
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.mentions}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, mentions: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSubmit("notification")}
                  className="bg-gold hover:bg-gold/90 text-white ml-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences and data settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select 
                      defaultValue={privacySettings.profileVisibility} 
                      onValueChange={(value) => 
                        setPrivacySettings({...privacySettings, profileVisibility: value})
                      }
                    >
                      <SelectTrigger id="profile-visibility">
                        <SelectValue placeholder="Who can see your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-messages">Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to send you direct messages
                      </p>
                    </div>
                    <Switch 
                      id="allow-messages" 
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, allowMessages: checked})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-visibility">Activity Visibility</Label>
                    <Select 
                      defaultValue={privacySettings.activityVisibility} 
                      onValueChange={(value) => 
                        setPrivacySettings({...privacySettings, activityVisibility: value})
                      }
                    >
                      <SelectTrigger id="activity-visibility">
                        <SelectValue placeholder="Who can see your activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data to improve our service
                      </p>
                    </div>
                    <Switch 
                      id="data-collection" 
                      checked={privacySettings.dataCollection}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, dataCollection: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/privacy-policy")}
                  className="mr-auto"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  View Privacy Policy
                </Button>
                <Button 
                  onClick={() => handleSubmit("privacy")}
                  className="bg-gold hover:bg-gold/90 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
                <CardDescription>
                  Synchronize Saem's Tunes with your personal calendar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Google Calendar Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect your Google Calendar to see availability and sync events
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.googleCalendar}
                      onCheckedChange={(checked) => {
                        setSyncSettings({...syncSettings, googleCalendar: checked});
                        if (checked) {
                          // This would normally trigger Google OAuth flow
                          toast({
                            title: "Google Calendar",
                            description: "You would be redirected to Google for authentication",
                          });
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">iCloud Calendar Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect your Apple iCloud Calendar to see availability and sync events
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.iCloudCalendar}
                      onCheckedChange={(checked) => {
                        setSyncSettings({...syncSettings, iCloudCalendar: checked});
                        if (checked) {
                          // This would normally trigger Apple OAuth flow
                          toast({
                            title: "iCloud Calendar",
                            description: "You would be redirected to Apple for authentication",
                          });
                        }
                      }}
                    />
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-medium mb-2">What gets synced?</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-500 rounded-full w-2 h-2 mt-1.5 mr-2"></span>
                        Your booked music lessons and tutoring sessions
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-500 rounded-full w-2 h-2 mt-1.5 mr-2"></span>
                        Community events you've registered for
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-500 rounded-full w-2 h-2 mt-1.5 mr-2"></span>
                        Instructor availability will be checked against your calendar
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSubmit("calendar")}
                  className="bg-gold hover:bg-gold/90 text-white ml-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Customize how Saem's Tunes looks and behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Colors */}
                <div className="space-y-3">
                  <Label className="text-base">Theme Color</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {themeOptions.map((theme) => (
                      <div
                        key={theme.value}
                        className={cn(
                          "relative cursor-pointer hover:scale-105 transition-transform rounded-lg p-2 border",
                          currentTheme === theme.value && "border-gold ring-1 ring-gold"
                        )}
                        onClick={() => setCurrentTheme(theme.value as 'gold' | 'teal')}
                      >
                        {theme.preview}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Brightness Control */}
                <div className="space-y-3">
                  <Label className="text-base">Screen Brightness</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Slider 
                      min={50}
                      max={150}
                      step={5}
                      value={[brightness]}
                      onValueChange={handleBrightnessChange}
                      className="flex-1"
                    />
                    <Sun className="h-6 w-6" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <RadioGroup 
                    defaultValue={displaySettings.theme} 
                    onValueChange={(value) => 
                      setDisplaySettings({...displaySettings, theme: value})
                    }
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" /> Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" /> Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" /> Use System Preference
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    defaultValue={displaySettings.language} 
                    onValueChange={(value) => 
                      setDisplaySettings({...displaySettings, language: value})
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select 
                    defaultValue={displaySettings.fontSize} 
                    onValueChange={(value) => 
                      setDisplaySettings({...displaySettings, fontSize: value})
                    }
                  >
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={displaySettings.highContrast}
                    onCheckedChange={(checked) => 
                      setDisplaySettings({...displaySettings, highContrast: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebar-display">Sidebar Display</Label>
                    <p className="text-sm text-muted-foreground">
                      Show or hide sidebar elements on desktop
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <PanelLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Collapsed</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <PanelRight className="h-4 w-4" />
                      <span className="hidden sm:inline">Expanded</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSubmit("display")}
                  className="bg-gold hover:bg-gold/90 text-white ml-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
