
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Compass, 
  Library, 
  Users, 
  Music, 
  BookOpen, 
  Settings,
  Bell,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      name: "Videos",
      href: "/videos",
      icon: Music,
      public: true
    },
    {
      name: "Library",
      href: "/library",
      icon: Library,
      public: true
    },
    {
      name: "Learning",
      href: "/learning",
      icon: BookOpen,
      public: true
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
      public: true
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: CreditCard,
      public: true
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      public: false
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      public: false
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
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {filteredNavigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive(item.href) 
                  ? "bg-gold/10 text-gold hover:bg-gold/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};
