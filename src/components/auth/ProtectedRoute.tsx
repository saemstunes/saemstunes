import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/EnhancedAuthContext"; // Updated context
import { Loader2 } from "lucide-react";

// Updated UserRole type to reflect latest roles in the database
export type UserRole = 'student' | 'parent' | 'admin' | 'user' | 'adult_learner' | 'tutor';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  adminOnly?: boolean; // Added for compatibility with App.tsx
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  requiredRoles,
  adminOnly = false,
  redirectPath = "/login"
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth(); // Updated from `isLoading` to `loading`, and added `profile`
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-gold animate-spin mb-4" />
        <p className="text-muted-foreground">Verifying your credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Admin-only protection
  if (adminOnly && profile?.role !== 'admin') {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location, requiredRoles: ['admin'] }}
        replace
      />
    );
  }

  // Role-based protection
  if (requiredRoles && profile && !requiredRoles.includes(profile.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location, requiredRoles }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
