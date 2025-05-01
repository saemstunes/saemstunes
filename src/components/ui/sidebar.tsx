
// Import the correct icon
import { Flask } from "@/components/icons";
import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-screen border-r border-border bg-card",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

interface SidebarHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const SidebarHeader = ({ className, children }: SidebarHeaderProps) => {
  return (
    <div className={cn("flex items-center px-6 py-4", className)}>
      <Link to="/" className="flex items-center gap-2">
        <Flask className="h-6 w-6 text-gold" />
        <span className="font-bold text-lg font-proxima">Saem's Tunes</span>
      </Link>
      {children}
    </div>
  );
};

interface SidebarNavProps {
  className?: string;
  children?: React.ReactNode;
}

const SidebarNav = ({ className, children }: SidebarNavProps) => {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <nav className="grid gap-1 px-2">{children}</nav>
    </div>
  );
};

interface SidebarNavItemProps {
  className?: string;
  children?: React.ReactNode;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
}

const SidebarNavItem = ({
  className,
  children,
  active,
  icon: Icon,
  href,
}: SidebarNavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        active ? "bg-accent text-accent-foreground" : "transparent",
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </Link>
  );
};

interface SidebarSectionProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

const SidebarSection = ({
  className,
  children,
  title,
}: SidebarSectionProps) => {
  return (
    <div className={cn("py-2", className)}>
      {title && (
        <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

interface SidebarFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const SidebarFooter = ({ className, children }: SidebarFooterProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 border-t border-border mt-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarSection,
  SidebarFooter,
};
