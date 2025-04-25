
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Compass, Library, User, Bell, Users, Flask } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const hasNotifications = true;

  const handleAuthAction = () => {
    if (user) {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } else {
      navigate("/auth");
    }
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
      public: true,
      onClick: user ? undefined : handleAuthAction
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  const filteredNavigation = navigation.filter(
    item => item.public || (user && !item.public)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around">
        {filteredNavigation.map((item) => (
          <button
            key={item.name}
            onClick={() => item.onClick ? item.onClick() : navigate(item.href)}
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
    </div>
  );
};

export default MobileNavigation;
