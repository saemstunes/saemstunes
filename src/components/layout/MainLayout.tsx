import React, { ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  Video,
  BookOpen,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Instagram,
  Mail,
  Heart,
  Bell,
  Facebook,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme/ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import MiniPlayer from "../player/MiniPlayer";
import Logo from "../branding/Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FloatingBackButton } from "@/components/ui/floating-back-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Library } from "lucide-react";

// Custom TikTok icon as it's not available in lucide-react
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface MainLayoutProps {
  children: ReactNode;
  showMiniPlayer?: boolean;
}

const MainLayout = ({ children, showMiniPlayer = false }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backButtonPressCount, setBackButtonPressCount] = useState(0);
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle back button press
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (location.pathname === '/') {
        e.preventDefault();
        if (backButtonPressCount === 0) {
          toast({
            title: "Tap again to exit app",
            duration: 2000,
          });
          setBackButtonPressCount(1);
          window.history.pushState(null, document.title, window.location.href);
          
          // Reset count after 3 seconds
          setTimeout(() => {
            setBackButtonPressCount(0);
          }, 3000);
        } else {
          // In a real mobile app, this would exit the app
          // For web, we'll just show a notification
          toast({
            title: "Exiting application",
            description: "This would close the app on a mobile device",
          });
        }
      }
    };

    window.addEventListener('popstate', handleBackButton);
    
    // Set initial history state
    if (location.pathname === '/') {
      window.history.pushState(null, document.title, window.location.href);
    }
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [location.pathname, backButtonPressCount, toast]);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Video,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Library",
      href: "/library",
      icon: BookOpen,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Community",
      href: "/community",
      icon: Video,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Music Tools",
      href: "/music-tools",
      icon: Music,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
  ];

  const socialLinks = [
    {
      name: "Follow us",
      href: "/follow-us",
      icon: Instagram,
      ariaLabel: "Follow us on social media",
    },
    {
      name: "Contact us",
      href: "/contact-us",
      icon: Mail,
      ariaLabel: "Contact us",
    },
    {
      name: "Support us",
      href: "/support-us",
      icon: Heart,
      ariaLabel: "Support Saem's Tunes",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const filteredNavigation = navigation.filter(
    (item) => !user || (user && item.roles.includes(user.role))
  );

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  // Sample track data for the MiniPlayer
  const trackData = {
    isPlaying: false,
    title: "Example Track",
    artist: "Example Artist",
    thumbnail: "/placeholder.svg",
    onTogglePlay: () => console.log("Toggle play"),
    onExpand: () => navigate("/player"),
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header - With backdrop blur and transparency */}
      <header className={cn(
        "sticky top-0 z-40 lg:hidden transition-all duration-200",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50" 
          : "bg-transparent"
      )}>
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col gap-6">
                  <Logo size="md" className="mb-6" inMobileMenu={true} />

                  {user && (
                    <>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </div>
                      <Separator className="mb-4" />
                    </>
                  )}

                  {filteredNavigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "justify-start gap-4",
                        isActive(item.href) &&
                          "bg-muted font-medium text-foreground"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  ))}

                  {user && (
                    <Button
                      variant="ghost"
                      className="justify-start gap-4 text-destructive hover:text-destructive"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  )}

                  <Separator className="my-4" />
                  
                  <div className="flex flex-col gap-3">
                    {socialLinks.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        size="sm"
                        className="justify-start gap-3 text-muted-foreground hover:text-gold"
                        onClick={() => handleNavigation(item.href)}
                        aria-label={item.ariaLabel}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <ThemeToggle />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Logo size="md" className="ml-4" />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => navigate('/search')}
              className="ml-auto"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="cursor-pointer h-8 w-8"
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/library")}>
                      <Library className="mr-2 h-4 w-4" />
                      <span>Library</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="h-8 w-8"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar - With transparent header */}
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
          <div className={cn(
            "p-6 sticky top-0 z-40 transition-all duration-200",
            isScrolled 
              ? "bg-card/80 backdrop-blur-md" 
              : "bg-transparent"
          )}>
            <Logo size="lg" />
          </div>

          {user && (
            <>
              <div className="flex items-center gap-4 px-6 py-4">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <Separator className="mb-4" />
            </>
          )}

          <nav className="flex-1 px-4 py-2">
            {filteredNavigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 mb-1",
                  isActive(item.href) &&
                    "bg-muted font-medium text-foreground"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            ))}

            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-destructive hover:text-destructive mt-4"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            )}
          </nav>

          <Separator className="my-4" />
          
          <div className="px-4 pb-4 space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Resources</h3>
            {socialLinks.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={() => handleNavigation(item.href)}
                aria-label={item.ariaLabel}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 lg:px-6 min-h-screen pb-24 lg:pb-6">
            {children}
          </div>
          
          {/* Fixed Position Elements */}
          <FloatingBackButton />
          {showMiniPlayer && <MiniPlayer {...trackData} />}
          {isMobile && <MobileNavigation />}
        </main>
      </div>
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out from Saem's Tunes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;
