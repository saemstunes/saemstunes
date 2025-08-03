
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import EmailVerificationHandler from "@/components/auth/EmailVerificationHandler";

const VerificationWaiting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state
  const email = location.state?.email || "";
  const provider = location.state?.provider || "";
  const verificationError = location.state?.verificationError || "";
  
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  // Redirect to auth if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/auth?tab=signup", { replace: true });
      return;
    }

    // Show toast if there's a verification error from OAuth provider
    if (verificationError) {
      toast({
        title: "Email verification required",
        description: verificationError,
        variant: "destructive",
      });
    }
  }, [email, navigate, verificationError, toast]);

  // Check verification status periodically
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email_confirmed_at) {
          setIsVerified(true);
          toast({
            title: "Email verified!",
            description: "Your account has been successfully verified.",
          });
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/auth?tab=login", { 
              state: { email, verified: true } 
            });
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    // Check immediately and then every 5 seconds
    checkVerificationStatus();
    const interval = setInterval(checkVerificationStatus, 5000);

    return () => clearInterval(interval);
  }, [navigate, email, toast]);

  const handleCheckVerification = async () => {
    setIsCheckingVerification(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        setIsVerified(true);
        toast({
          title: "Email verified!",
          description: "Redirecting you to login...",
        });
        setTimeout(() => {
          navigate("/auth?tab=login", { 
            state: { email, verified: true } 
          });
        }, 1500);
      } else {
        toast({
          title: "Not verified yet",
          description: "Please click the verification link in your email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check verification status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const handleGoBack = () => {
    navigate("/auth?tab=signup", { state: { email } });
  };

  const handleOpenEmailApp = () => {
    // Try to open default email app
    window.location.href = "mailto:";
  };

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setTimeout(() => {
      navigate("/auth?tab=login", { 
        state: { email, verified: true } 
      });
    }, 1500);
  };

  // Don't render if no email
  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="border-gold/20 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="flex justify-center mb-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`p-4 rounded-full transition-colors duration-300 ${
                isVerified ? 'bg-green-100' : 'bg-gold/10'
              }`}>
                {isVerified ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Mail className="h-8 w-8 text-gold" />
                )}
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-serif">
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4">
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <p className="text-green-600 mb-4">
                    Your email has been successfully verified!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to login...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Show provider-specific message if applicable */}
                  {provider && (
                    <Alert className="mb-4 border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle className="text-amber-800">
                        {provider === "spotify" ? "Spotify Email Verification" : `${provider} Email Verification`}
                      </AlertTitle>
                      <AlertDescription className="text-amber-700">
                        {provider === "spotify" 
                          ? "A verification email has been sent to your Spotify email address. You must verify this email before you can sign in with Spotify."
                          : `A verification email has been sent to your ${provider} email address.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Show custom error alert if provided */}
                  {verificationError && !provider && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertTitle className="text-red-800">
                        Email Verification Required
                      </AlertTitle>
                      <AlertDescription className="text-red-700">
                        {verificationError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="mb-6">
                    <p className="text-center mb-2">
                      We've sent a verification email to:
                    </p>
                    <p className="text-center font-medium bg-muted p-2 rounded-md break-all">
                      {email}
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-2">
                          Please check your email inbox and click the verification link to complete your registration.
                        </p>
                        <p>
                          If you don't see the email, check your spam/junk folder.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gold hover:bg-gold/90 text-white"
                      onClick={handleCheckVerification}
                      disabled={isCheckingVerification}
                    >
                      {isCheckingVerification ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          I've verified my email
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleOpenEmailApp}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Email App
                    </Button>
                    
                    <EmailVerificationHandler 
                      email={email}
                      onVerificationComplete={handleVerificationComplete}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerificationWaiting;
