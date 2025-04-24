
import React, { ReactNode, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme/ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import MiniPlayer from "../player/MiniPlayer";
import Logo from "../branding/Logo";

interface MainLayoutProps {
  children: ReactNode;
  showMiniPlayer?: boolean;
}

const MainLayout = ({ children, showMiniPlayer = false }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      href: "https://instagram.com/saemstunes",
      icon: Instagram,
      ariaLabel: "Follow us on Instagram",
    },
    {
      name: "Contact us",
      href: "mailto:contact@saemstunes.com",
      icon: Mail,
      ariaLabel: "Email us",
    },
    {
      name: "Support us",
      href: "/support",
      icon: Heart,
      ariaLabel: "Support Saem's Tunes",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="bg-card shadow-sm sticky top-0 z-40 lg:hidden">
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
                  <Logo size="md" className="mb-6" />

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
                        onClick={() => {
                          if (item.href.startsWith('http') || item.href.startsWith('mailto')) {
                            window.open(item.href, '_blank');
                          } else {
                            handleNavigation(item.href);
                          }
                        }}
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

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => navigate('/search')}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            {user ? (
              <Avatar
                className="cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
          <div className="p-6">
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
          
          <div className="px-4 pb-4 flex justify-between">
            {socialLinks.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="icon"
                className="social-link"
                onClick={() => {
                  if (item.href.startsWith('http') || item.href.startsWith('mailto')) {
                    window.open(item.href, '_blank');
                  } else {
                    handleNavigation(item.href);
                  }
                }}
                aria-label={item.ariaLabel}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <ThemeToggle />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 lg:px-6 min-h-screen pb-24 lg:pb-6">
            {children}
          </div>
          
          {/* Mobile Navigation */}
          {showMiniPlayer && <MiniPlayer {...trackData} />}
          <MobileNavigation />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
