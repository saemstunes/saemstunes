
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Compass, Library, User, Bell, Users, Music, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const hasNotifications = true;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      setShowLogoutConfirm(true);
    } else {
      navigate("/auth");
    }
  };

  const handleConfirmLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      public: true
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Compass,
      public: true
    },
    {
      name: "Library",
      href: "/library",
      icon: Library,
      public: true
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
      public: true
    },
    {
      name: user ? "Profile" : "Sign In",
      href: user ? "/profile" : "/auth",
      icon: User,
      public: true
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  const filteredNavigation = navigation.filter(
    item => item.public || (user && !item.public)
  );

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
        <div className="flex items-center justify-around">
          {filteredNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Profile" && user) {
                  navigate(item.href);
                } else if (item.name === "Sign In") {
                  handleAuthAction();
                } else {
                  // If clicking on home while already on home, scroll to top
                  if (item.href === "/" && location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate(item.href);
                  }
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-4 w-full",
                isActive(item.href) 
                  ? "text-gold" 
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.name === "Profile" && hasNotifications && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

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
              onClick={handleConfirmLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileNavigation;
