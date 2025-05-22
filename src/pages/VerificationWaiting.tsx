
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const VerificationWaiting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state
  const email = location.state?.email || "";
  
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [redirectCounter, setRedirectCounter] = useState(3);
  const [showRedirectNotice, setShowRedirectNotice] = useState(true);

  // Handle redirect countdown on initial load
  useEffect(() => {
    if (showRedirectNotice && redirectCounter > 0) {
      const timer = setTimeout(() => {
        setRedirectCounter(redirectCounter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showRedirectNotice && redirectCounter === 0) {
      setShowRedirectNotice(false);
    }
  }, [redirectCounter, showRedirectNotice]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email inbox.",
      });
      
      // Set cooldown to 60 seconds
      setCooldown(60);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/auth", { state: { email } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
      
      {/* Redirect notification */}
      {showRedirectNotice && (
        <motion.div 
          className="fixed top-4 right-4 bg-background shadow-lg border border-border rounded-lg p-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center">
            <span>Redirecting you to the verification page in {redirectCounter} seconds</span>
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="border-gold/20 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="flex justify-center mb-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gold/10 p-4 rounded-full">
                <Mail className="h-8 w-8 text-gold" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-serif">Verify Your Email</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="mb-6">
              <p className="text-center mb-2">
                We've sent a verification email to:
              </p>
              <p className="text-center font-medium bg-muted p-2 rounded-md">
                {email || "your email address"}
              </p>
            </div>
            
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Please check your email inbox and click the verification link to complete your registration. 
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleResendEmail}
                disabled={isResending || cooldown > 0}
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend verification email"}
              </Button>
              
              {cooldown > 0 && (
                <Progress value={(60 - cooldown) / 60 * 100} className="h-1" />
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 border-t pt-4">
            <div className="w-full">
              <Button 
                variant="ghost"
                className="w-full flex items-center gap-2"
                onClick={handleGoBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign up
              </Button>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              Having trouble? Contact our support team for assistance.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerificationWaiting;
