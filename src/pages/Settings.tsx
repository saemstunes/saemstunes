
import React, { useState } from "react";
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
  Moon
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

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  
  // Form submission handler (example)
  const handleSubmit = (settingType: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${settingType} settings have been saved.`,
    });
  };

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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how Saem's Tunes looks and behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup 
                      defaultValue={displaySettings.theme} 
                      onValueChange={(value) => 
                        setDisplaySettings({...displaySettings, theme: value})
                      }
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">Use System Preference</Label>
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
