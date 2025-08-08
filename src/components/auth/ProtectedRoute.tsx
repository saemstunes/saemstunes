
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { UserRole } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectPath?: string;
  allowWalletAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles,
  redirectPath = "/auth",
  allowWalletAuth = true
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isConnected } = useWallet();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-gold animate-spin mb-4" />
        <p className="text-muted-foreground">Verifying your credentials...</p>
      </div>
    );
  }

  // Check if user is authenticated via traditional auth OR wallet
  const isAuthenticated = user || (allowWalletAuth && isConnected);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Role-based access control (only applies to traditional auth users)
  if (requiredRoles && user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location, requiredRoles }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
