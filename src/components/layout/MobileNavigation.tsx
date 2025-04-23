
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Compass, Library, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MobileNavigation = () => {
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
      name: "Browse",
      href: "/videos",
      icon: Compass,
      public: true
    },
    {
      name: "Library",
      href: "/resources",
      icon: Library,
      public: true
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
      public: true
    },
    {
      name: "Profile",
      href: user ? "/profile" : "/login",
      icon: User,
      public: true
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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
      <div className="flex items-center justify-around">
        {filteredNavigation.map((item) => (
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
