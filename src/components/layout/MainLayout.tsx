import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  showMiniPlayer?: boolean;
}

const MainLayout = ({ children, showMiniPlayer = false }: MainLayoutProps) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/auth") {
      // Redirect to /auth only if not already there
      navigate("/auth");
    }
  }, [user, loading, location, navigate]);

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Splash Screen */}
      {loading && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 z-40">
        <div className="flex items-center">
          <Logo variant="compact" size="sm" className="mr-4" />
          <Button variant="ghost" size="icon" onClick={toggleSearchBar}>
            <Search className="h-5 w-5" />
          </Button>
          {isSearchBarOpen && (
            <Input
              type="search"
              placeholder="Search..."
              className="ml-2 w-48 md:w-64"
            />
          )}
        </div>
        {profile && (
          <div className="font-bold">
            {profile.full_name || profile.display_name || "User"}
          </div>
        )}
      </header>

      <div className="md:flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-border h-full">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Logo variant="compact" size="sm" />
              <p className="text-sm text-muted-foreground">
                Making music, representing Christ. Join our community of learners and grow your musical talents.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/")}>
                  Home
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/discover")}>
                  Discover
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/videos")}>
                  Videos
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/tools")}>
                  Music Tools
                </Button>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/contact")}>
                  Contact Us
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/support")}>
                  Support Us
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/services")}>
                  Services
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/follow")}>
                  Follow Us
                </Button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/privacy")}>
                  Privacy Policy
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto justify-start" onClick={() => navigate("/terms")}>
                  Terms & Conditions
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Saem's Tunes. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Mini Player */}
      {showMiniPlayer && <MiniPlayer />}
    </div>
  );
};

export default MainLayout;
