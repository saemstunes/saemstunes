
// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  Music, 
  Calendar, 
  Settings, 
  BarChart3, 
  Bell, 
  FileText,
  User,
  LogOut,
  Search,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/branding/Logo";
import AdminUpload from "@/components/admin/AdminUpload";

// Mock data for the dashboard
const RECENT_USERS = [
  { id: 1, name: "Alex Johnson", role: "student", email: "alex@example.com", joined: "2024-04-20" },
  { id: 2, name: "Maria Garcia", role: "teacher", email: "maria@example.com", joined: "2024-04-18" },
  { id: 3, name: "Sam Taylor", role: "student", email: "sam@example.com", joined: "2024-04-15" },
  { id: 4, name: "Leslie Wong", role: "parent", email: "leslie@example.com", joined: "2024-04-12" },
];

const RECENT_CONTENT = [
  { id: 1, title: "Beginner Piano Lesson 1", type: "video", views: 234, created: "2024-04-22" },
  { id: 2, title: "Jazz Theory Fundamentals", type: "course", enrollments: 45, created: "2024-04-19" },
  { id: 3, title: "Voice Training Exercises", type: "audio", plays: 156, created: "2024-04-17" },
  { id: 4, title: "Guitar Chord Progressions", type: "sheet", downloads: 89, created: "2024-04-15" },
];

// Navigation items
const NAV_ITEMS = [
  { icon: BarChart3, label: "Dashboard", value: "dashboard" },
  { icon: Users, label: "Users", value: "users" },
  { icon: Music, label: "Content", value: "content" },
  { icon: Calendar, label: "Schedule", value: "schedule" },
  { icon: Bell, label: "Notifications", value: "notifications" },
  { icon: FileText, label: "Reports", value: "reports" },
  { icon: Settings, label: "Settings", value: "settings" },
];

// Admin credentials - stored as constants for this implementation
const ADMIN_CREDENTIALS = {
  email: 'saemstunes@gmail.com',
  password: 'ilovetosing123'
};

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Check if user is authenticated on component mount
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (
      loginForm.email === ADMIN_CREDENTIALS.email &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setLoginError('Invalid credentials. Please check your username and password.');
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('adminAuth');
      setIsAuthenticated(false);
      setLoginForm({ email: '', password: '' });
      if (user) {
        await logout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-white"
              >
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div className="hidden md:block bg-gold/10 text-gold px-2 py-1 rounded text-xs font-semibold">
              ADMIN
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-xs hidden md:block">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-8 bg-background border-muted"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Administrator</p>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-background border-r p-4">
          <nav className="space-y-1">
            {[...NAV_ITEMS, { icon: Upload, label: "Upload", value: "upload" }].map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.value ? "bg-gold/10 text-gold hover:bg-gold/20" : ""
                }`}
                onClick={() => setActiveTab(item.value)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t mt-6">
            <div className="text-xs text-muted-foreground">
              <p>Saem's Tunes Admin</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </aside>
        
        {/* Mobile navigation */}
        <div className="md:hidden w-full border-b bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto justify-start py-1 h-auto">
              {[...NAV_ITEMS, { icon: Upload, label: "Upload", value: "upload" }].map((item) => (
                <TabsTrigger key={item.value} value={item.value} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Tabs value={activeTab} className="w-full">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Last updated: Today at 10:30 AM</p>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,468</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,892</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Content Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14,589</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +22% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,834</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +18% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent users and content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>
                      Users who joined in the last 2 weeks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-xs text-muted-foreground font-medium">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3 hidden md:table-cell">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_USERS.map((user) => (
                          <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="p-3">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3 hidden md:table-cell text-sm">
                              {new Date(user.joined).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardFooter className="border-t p-3">
                    <Button variant="link" className="text-gold h-auto p-0">View all users</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Content</CardTitle>
                    <CardDescription>
                      Content created in the last 2 weeks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-xs text-muted-foreground font-medium">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3 hidden md:table-cell">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_CONTENT.map((content) => (
                          <tr key={content.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="p-3">
                              <div className="font-medium">{content.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {content.views ? `${content.views} views` : 
                                 content.enrollments ? `${content.enrollments} enrollments` :
                                 content.plays ? `${content.plays} plays` :
                                 content.downloads ? `${content.downloads} downloads` : ''}
                                </div>
                            </td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">
                                {content.type}
                              </span>
                            </td>
                            <td className="p-3 hidden md:table-cell text-sm">
                              {new Date(content.created).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardFooter className="border-t p-3">
                    <Button variant="link" className="text-gold h-auto p-0">View all content</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">User Management</h1>
                  <Button className="bg-gold hover:bg-gold/90 text-white">
                    Add New User
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                          Manage and monitor all registered users
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Search users..." 
                          className="w-64" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-xs text-muted-foreground font-medium">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3">Joined</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...RECENT_USERS, ...RECENT_USERS].map((user, index) => (
                          <tr key={`${user.id}-${index}`} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="p-3 font-medium">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              {new Date(user.joined).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardFooter className="border-t p-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing 8 of 2,468 users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent value="content">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Content Management</h1>
                  <Button className="bg-gold hover:bg-gold/90 text-white">
                    Add New Content
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>All Content</CardTitle>
                        <CardDescription>
                          Manage lessons, music, and educational materials
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Search content..." 
                          className="w-64" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-xs text-muted-foreground font-medium">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3">Engagement</th>
                          <th className="text-left p-3">Created</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...RECENT_CONTENT, ...RECENT_CONTENT].map((content, index) => (
                          <tr key={`${content.id}-${index}`} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="p-3 font-medium">{content.title}</td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">
                                {content.type}
                              </span>
                            </td>
                            <td className="p-3">
                              {content.views ? `${content.views} views` : 
                               content.enrollments ? `${content.enrollments} enrollments` :
                               content.plays ? `${content.plays} plays` :
                               content.downloads ? `${content.downloads} downloads` : ''}
                            </td>
                            <td className="p-3">
                              {new Date(content.created).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardFooter className="border-t p-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing 8 of 342 content items
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Content Upload</h1>
                <p className="text-sm text-muted-foreground">Upload new content to the platform</p>
              </div>
              
              <AdminUpload />
            </TabsContent>
            
            {/* Placeholder for other tabs */}
            {['schedule', 'notifications', 'reports', 'settings'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    {tab === 'schedule' && <Calendar className="h-8 w-8 text-gold" />}
                    {tab === 'notifications' && <Bell className="h-8 w-8 text-gold" />}
                    {tab === 'reports' && <FileText className="h-8 w-8 text-gold" />}
                    {tab === 'settings' && <Settings className="h-8 w-8 text-gold" />}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 capitalize">{tab}</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    This section is currently under development. Check back soon for updates!
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Admin;
