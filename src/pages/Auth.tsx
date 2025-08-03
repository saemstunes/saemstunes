
import React, { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/branding/Logo";
import { FloatingBackButton } from "@/components/ui/floating-back-button";
import { AnimatePresence, motion } from "framer-motion";
import { Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const initialForm = searchParams.get("tab") === "login" ? "login" : 
                      searchParams.get("tab") === "signup" ? "signup" : "signup";
  const [activeForm, setActiveForm] = useState<"login" | "signup" | "admin">(
    (initialForm as "login" | "signup") || "signup"
  );
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Reset admin tap count after a delay
  useEffect(() => {
    if (adminTapCount > 0) {
      const timer = setTimeout(() => setAdminTapCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [adminTapCount]);

  // Handle authentication errors from URL params and hash fragments
  useEffect(() => {
    // Check for error params in both search params and hash fragment
    const checkForErrors = () => {
      // Parse the hash fragment if it exists
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
      
      const error = searchParams.get("error") || hashParams.get("error");
      const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
      const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
      const provider = searchParams.get("provider") || hashParams.get("provider") || "google";
      
      if (error) {
        console.log("Auth error detected:", { error, errorDescription, errorCode, provider });
        
        // Handle specific error cases
        let errorMessage = errorDescription || "An authentication error occurred";
        
        // Handle provider email verification case specifically
        if (errorCode === "provider_email_needs_verification" || 
            errorMessage.includes("Unverified email")) {
          
          setAuthError(`Please verify your email address to continue.`);
          
          // Display toast notification for email verification
          toast({
            title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Email Verification Required`,
            description: "An email has been sent to your account. Please verify it to continue.",
            variant: "default",
            duration: 8000,
          });
          
          // Extract email from error description if possible
          let email = "";
          if (errorDescription) {
            const emailMatch = errorDescription.match(/email: ([^\s]+)/);
            email = emailMatch ? emailMatch[1] : "";
          }
          
          // Redirect to verification waiting page
          navigate("/verification-waiting", {
            state: { 
              email,
              provider,
              verificationError: errorMessage
            }
          });
          return;
        } else {
          setAuthError(errorMessage);
          toast({
            title: "Authentication Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    };
    
    checkForErrors();
  }, [searchParams, location.hash, toast, navigate]);
  
  // Handle secret admin section reveal
  const handleAdminTapArea = () => {
    setAdminTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        setActiveForm("admin");
        return 0;
      }
      return newCount;
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo and branding section */}
      <div
        className="relative md:flex-1 bg-gradient-to-br from-gold to-brown p-8 md:p-12 flex flex-col justify-center"
        >

        {/* Custom Back Button for Desktop */}
        <div className="absolute top-4 right-4 block">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 transition-colors"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Logo variant="full" size="lg" className="mb-8" />
          <motion.h1 
            className="text-3xl md:text-4xl font-serif text-white font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to Saem's Tunes
          </motion.h1>
          <motion.p 
            className="text-white/80 text-lg md:text-xl mb-6 whitespace-nowrap overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Making music, representing Christ
          </motion.p>
          <motion.div 
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-2">Why Join Us?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Expert music tutors and premium resources</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Personalized learning paths for your growth</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Supportive community of musicians and learners</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Auth forms section */}
      <div className="md:flex-1 p-8 flex items-center justify-center relative">
        <FloatingBackButton />
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex border-b space-x-4">
              <button
                onClick={() => setActiveForm("login")}
                className={`pb-2 px-2 ${
                  activeForm === "login"
                    ? "text-gold border-b-2 border-gold font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveForm("signup")}
                className={`pb-2 px-2 ${
                  activeForm === "signup"
                    ? "text-gold border-b-2 border-gold font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
              <AnimatePresence>
                {activeForm === "admin" && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => setActiveForm("admin")}
                    className={`pb-2 px-2 ml-auto text-sm ${
                      activeForm === "admin"
                        ? "text-gold border-b-2 border-gold font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    Admin
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Show authentication error if present */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>
                    {authError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeForm === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm onAdminTap={handleAdminTapArea} />
              </motion.div>
            )}
            {activeForm === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm />
              </motion.div>
            )}
            {activeForm === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AdminLoginForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
