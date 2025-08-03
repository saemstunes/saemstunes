
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles,
  redirectPath = "/login"
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
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

  if (requiredRoles && user.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location, requiredRoles }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
