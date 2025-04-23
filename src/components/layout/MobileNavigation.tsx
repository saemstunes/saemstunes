
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Compass, Library, Search, User } from "lucide-react";

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: Home
    },
    {
      name: "Browse",
      href: "/videos",
      icon: Compass
    },
    {
      name: "Library",
      href: "/resources",
      icon: Library
    },
    {
      name: "Search",
      href: "/search",
      icon: Search
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
      <div className="flex items-center justify-around">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 w-full",
              isActive(item.href) 
                ? "text-gold" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
