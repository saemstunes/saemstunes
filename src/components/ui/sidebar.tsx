"use client"

import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import Logo from "../branding/Logo";
import {
  Music,
  Home,
  Library,
  Compass,
  Headphones,
  Search,
  Users,
  BookOpen,
  MessageSquare,
  Bookmark,
  CalendarDays,
  Heart,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  AlignJustify,
  X,
  Globe,
  Mail,
  ShieldCheck,
  Music2,
  Palette,
  FlaskConical
} from "lucide-react";
import { Dialog, DialogContent } from "./dialog";
import { ScrollArea } from "./scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps {
  className?: string;
  sections: NavSection[];
}

export function Sidebar({ className, sections }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter out links that require authentication if not logged in
  const filteredSections = user ? sections : sections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.disabled || item.href === '/login')
  }));

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed left-4 top-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <AlignJustify className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Mobile Menu */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[300px] p-0 left-0 top-0 translate-x-0 translate-y-0 h-screen rounded-none">
          <div className="flex flex-col h-full bg-background">
            <div className="p-4 flex items-center justify-between border-b">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {filteredSections.map((section, i) => (
                <div key={i} className="mb-6">
                  {section.title && (
                    <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
                      {section.title}
                    </h3>
                  )}
                  {section.items.map((item, j) => (
                    <Button
                      key={j}
                      variant={location.pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => {
                        setIsOpen(false);
                        if (item.disabled && !user) {
                          navigate("/auth");
                        } else if (item.external) {
                          window.open(item.href, "_blank");
                        } else {
                          navigate(item.href);
                        }
                      }}
                      disabled={item.disabled && !user}
                    >
                      {item.icon && (
                        <item.icon className="mr-2 h-4 w-4" />
                      )}
                      {item.title}
                      {item.label && (
                        <span className="ml-auto text-xs bg-primary px-1.5 py-0.5 rounded-md">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t">
              {user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/auth");
                  }}
                >
                  Login / Register
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30", className)}>
        <div className="flex flex-col h-full py-4 bg-background border-r">
          <div className="px-4 mb-4">
            <Logo />
          </div>
          <div className="flex-1 px-2 space-y-6">
            {filteredSections.map((section, i) => (
              <div key={i} className="space-y-1">
                {section.title && (
                  <h3 className="px-4 text-sm font-semibold tracking-tight text-muted-foreground">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item, j) => (
                  <Button
                    key={j}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      if (item.disabled && !user) {
                        navigate("/auth");
                      } else if (item.external) {
                        window.open(item.href, "_blank");
                      } else {
                        navigate(item.href);
                      }
                    }}
                    disabled={item.disabled && !user}
                  >
                    {item.icon && (
                      <item.icon className="mr-2 h-4 w-4" />
                    )}
                    {item.title}
                    {item.label && (
                      <span className="ml-auto text-xs bg-primary px-1.5 py-0.5 rounded-md">
                        {item.label}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <div className="px-2 mt-4">
            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Login / Register
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
      <div className="flex flex-col h-full py-4 bg-background border-r">
        <div className="px-4 mb-8">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 px-2 space-y-6">
          {Array.from({ length: 3 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              <Skeleton className="h-4 w-20 mx-4" />
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <Skeleton key={itemIndex} className="h-10 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const defaultSections: NavSection[] = [
  {
    items: [
      {
        title: "Home",
        href: "/",
        icon: Home,
      },
      {
        title: "Discover",
        href: "/discover",
        icon: Compass,
      },
      {
        title: "Library",
        href: "/library",
        icon: Library,
      },
      {
        title: "Music Lab",
        href: "/music-tools",
        icon: FlaskConical,
      },
      {
        title: "Community",
        href: "/community",
        icon: Users,
      }
    ]
  },
  {
    title: "Resources",
    items: [
      {
        title: "Learning Hub",
        href: "/learning-hub",
        icon: BookOpen,
      },
      {
        title: "Resources",
        href: "/resources",
        icon: Bookmark,
      },
      {
        title: "Bookings",
        href: "/bookings",
        icon: CalendarDays,
        disabled: true,
      },
    ]
  },
  {
    title: "Connect",
    items: [
      {
        title: "Follow Us",
        href: "/follow-us",
        icon: Heart,
      },
      {
        title: "Contact Us",
        href: "/contact-us",
        icon: Mail,
      },
      {
        title: "Support Us",
        href: "/support-us",
        icon: ShieldCheck,
      },
    ]
  },
  {
    title: "Account",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Help",
        href: "/help",
        icon: HelpCircle,
        external: true,
      },
    ]
  }
];
