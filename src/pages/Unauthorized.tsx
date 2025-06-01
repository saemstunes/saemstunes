
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldAlert, ArrowLeft, Home } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles as string[] | undefined;
  
  const formattedRoles = requiredRoles 
    ? requiredRoles.map(r => r.replace('_', ' ')).join(' or ').toLowerCase()
    : "appropriate";

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-2xl mx-auto">
        <div className="bg-destructive/10 p-5 rounded-full mb-6">
          {user ? (
            <ShieldAlert className="h-12 w-12 text-destructive" />
          ) : (
            <Lock className="h-12 w-12 text-destructive" />
          )}
        </div>
        
        <h1 className="text-4xl font-serif font-bold mb-4 gold-gradient-text">
          Access Denied
        </h1>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg mb-8">
          {user ? (
            <>
              <p className="text-lg mb-2">
                Your current role (<span className="font-medium text-gold">{user.role.replace('_', ' ')}</span>) 
                doesn't have permission to access this page.
              </p>
              <p className="text-muted-foreground mb-4">
                This area requires {requiredRoles ? formattedRoles : 'different'} permissions.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">
                You need to sign in to access this page.
              </p>
              <p className="text-muted-foreground mb-4">
                Please log in with an account that has {formattedRoles} permissions.
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            {!user && (
              <Button 
                onClick={() => navigate("/login")}
                className="bg-gold hover:bg-gold/80 text-white"
              >
                Sign In
              </Button>
            )}
            
            <Button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
