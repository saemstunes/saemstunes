import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface EmailVerificationHandlerProps {
  email: string;
  onVerificationComplete?: () => void;
}

export const EmailVerificationHandler = ({ 
  email, 
  onVerificationComplete 
}: EmailVerificationHandlerProps) => {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isVerificationChecked, setIsVerificationChecked] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const { toast } = useToast();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Unified verification checker with leak detection
  const checkVerificationStatus = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // Handle expired sessions specifically
        if (error.message.includes("Invalid Refresh Token")) {
          return 'SESSION_EXPIRED';
        }
        throw error;
      }
      
      if (user?.email_confirmed_at) {
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified.",
        });
        onVerificationComplete?.();
        return 'VERIFIED';
      }
      return 'UNVERIFIED';
    } catch (error: any) {
      console.error('Verification check error:', error);
      
      // Handle leaked credentials
      if (error.message.includes("leaked credentials")) {
        toast({
          title: "Security Alert",
          description: "This password has been compromised. Please choose a different one.",
          variant: "destructive",
        });
      }
      
      return 'ERROR';
    }
  }, [toast, onVerificationComplete]);

  // Handle all user scenarios
  const handleUserScenarios = useCallback(async () => {
    const status = await checkVerificationStatus();
    
    if (status === 'VERIFIED') return;
    
    try {
      // First-time users - resend initial verification
      if (status === 'UNVERIFIED') {
        await supabase.auth.resend({
          type: 'signup',
          email,
          options: { captchaToken }
        });
      }
      
      // Returning users - magic link with OTP
      if (status === 'SESSION_EXPIRED' || status === 'ERROR') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
            shouldCreateUser: false
          }
        });
        
        if (error) throw error;
      }
      
      toast({
        title: "Verification email sent",
        description: "Please check your email inbox and spam folder.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      
      let errorMessage = "Failed to send verification email";
      let cooldownTime = 60;
      
      if (error.message?.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait before trying again.";
        cooldownTime = 3600; // Respect 4/hour project limit
      } else if (error.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in.";
      } else if (error.message?.includes("captcha")) {
        errorMessage = "Please complete the captcha verification.";
        setShowCaptcha(true);
        cooldownTime = 0;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (cooldownTime > 0) {
        setCooldown(cooldownTime);
        const timer = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } finally {
      setIsResending(false);
    }
  }, [email, checkVerificationStatus, toast]);

  // Smart verification polling
  useEffect(() => {
    const startVerificationCheck = async () => {
      const status = await checkVerificationStatus();
      
      if (status === 'VERIFIED') {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        return;
      }
      
      // Progressive backoff: 5s, 10s, 30s, 60s
      const intervals = [5000, 10000, 30000, 60000];
      const intervalIndex = Math.min(resendAttempts, intervals.length - 1);
      
      checkIntervalRef.current = setTimeout(
        startVerificationCheck, 
        intervals[intervalIndex]
      );
    };

    startVerificationCheck();
    
    return () => {
      if (checkIntervalRef.current) clearTimeout(checkIntervalRef.current);
    };
  }, [isVerificationChecked, resendAttempts, checkVerificationStatus]);

  // Handle initial verification state
  useEffect(() => {
    const initializeVerification = async () => {
      const status = await checkVerificationStatus();
      setIsVerificationChecked(true);
      
      if (status === 'UNVERIFIED' || status === 'SESSION_EXPIRED') {
        // Only auto-send for first-time users
        if (resendAttempts === 0) {
          handleUserScenarios();
        }
      }
    };

    initializeVerification();
  }, [handleUserScenarios, checkVerificationStatus]);

  const handleResendEmail = async () => {
    if (cooldown > 0 || !email) return;
    
    // Require CAPTCHA after first attempt
    if (resendAttempts >= 1 && !captchaToken) {
      setShowCaptcha(true);
      return;
    }
    
    setIsResending(true);
    await handleUserScenarios();
    
    // Update attempt count and cooldown
    if (cooldown === 0) {
      setResendAttempts(prev => prev + 1);
      
      // Progressive cooldowns: 60s, 120s, 300s
      const cooldowns = [60, 120, 300];
      const attemptIndex = Math.min(resendAttempts, cooldowns.length - 1);
      setCooldown(cooldowns[attemptIndex]);
      
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Reset CAPTCHA
    setShowCaptcha(false);
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setTimeout(handleResendEmail, 100);
  };

  // CAPTCHA handlers remain the same
  const handleCaptchaExpire = () => setCaptchaToken(null);
  const handleCaptchaError = () => {
    setCaptchaToken(null);
    toast({
      title: "Captcha Error",
      description: "There was an error with the captcha. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      {showCaptcha ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Please complete the verification to resend the email:
          </p>
          <HCaptcha
            sitekey="02409832-47f4-48c0-ac48-d98828b23724"
            onVerify={handleCaptchaVerify}
            onExpire={handleCaptchaExpire}
            onError={handleCaptchaError}
            ref={captchaRef}
            theme="light"
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setShowCaptcha(false);
              setCaptchaToken(null);
              captchaRef.current?.resetCaptcha();
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline"
          onClick={handleResendEmail}
          disabled={isResending || cooldown > 0}
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            "Resend verification email"
          )}
        </Button>
      )}
      
      {resendAttempts > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Email sent {resendAttempts} time{resendAttempts !== 1 ? 's' : ''}
          {resendAttempts >= 2 && (
            <span className="block mt-1 text-orange-500">
              Tip: Check your spam folder or contact support
            </span>
          )}
        </p>
      )}
    </div>
  );
};
