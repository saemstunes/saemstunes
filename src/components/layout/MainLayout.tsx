
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
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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
      name: "Videos",
      href: "/videos",
      icon: Video,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Resources",
      href: "/resources",
      icon: BookOpen,
      roles: ["student", "adult", "parent", "teacher", "admin"],
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: Calendar,
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
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="h-6 w-6 text-gold" />
                    <h3 className="font-serif text-xl font-bold">Saem's Tunes</h3>
                  </div>

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

            <div className="flex items-center gap-2 ml-4">
              <Music className="h-6 w-6 text-gold" />
              <h1 className="font-serif text-xl font-bold">
                Saem's <span className="text-gold">Tunes</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2 p-6">
            <Music className="h-6 w-6 text-gold" />
            <h1 className="font-serif text-xl font-bold">
              Saem's <span className="text-gold">Tunes</span>
            </h1>
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

          <div className="p-4 mt-auto">
            <ThemeToggle />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 lg:px-6 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
