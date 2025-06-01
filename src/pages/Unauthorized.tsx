
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldAlert, ArrowLeft, Home, Music } from "lucide-react";
import { motion } from "framer-motion";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles as string[] | undefined;
  
  const formattedRoles = requiredRoles 
    ? requiredRoles.map(r => r.replace('_', ' ')).join(' or ').toLowerCase()
    : "appropriate";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
              {user ? (
                <ShieldAlert className="h-12 w-12 text-red-600" />
              ) : (
                <Lock className="h-12 w-12 text-red-600" />
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Access Denied
            </span>
          </motion.h1>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl mb-8"
          >
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Music className="h-5 w-5 text-gold" />
                  <span className="font-medium text-gold">Saem's Tunes</span>
                </div>
                <p className="text-lg mb-2">
                  Your current role <span className="font-bold text-gold bg-gold/10 px-2 py-1 rounded-md">
                    {(user as any).role?.replace('_', ' ') || 'User'}
                  </span> doesn't have permission to access this area.
                </p>
                <p className="text-muted-foreground mb-6">
                  This section requires {requiredRoles ? formattedRoles : 'different'} permissions. 
                  Please contact support if you believe this is an error.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Music className="h-5 w-5 text-gold" />
                  <span className="font-medium text-gold">Saem's Tunes</span>
                </div>
                <p className="text-lg mb-2">
                  Authentication required to access this page.
                </p>
                <p className="text-muted-foreground mb-6">
                  Please sign in with an account that has {formattedRoles} permissions to continue.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              {!user && (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-gold to-yellow-600 hover:from-gold/90 hover:to-yellow-600/90 text-white shadow-lg"
                >
                  Sign In
                </Button>
              )}
              
              <Button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            <p>Need help? <Button variant="link" className="p-0 h-auto text-gold" onClick={() => navigate("/contact")}>Contact Support</Button></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
