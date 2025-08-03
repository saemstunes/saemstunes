
import { useState, useRef } from 'react';
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
  const captchaRef = useRef<HCaptcha>(null);
  const { toast } = useToast();

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified.",
        });
        onVerificationComplete?.();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  };

  const handleResendEmail = async () => {
    if (cooldown > 0 || !email) return;
    
    // Show captcha after first attempt
    if (resendAttempts > 0 && !captchaToken) {
      setShowCaptcha(true);
      return;
    }
    
    setIsResending(true);
    
    try {
      // Check if already verified first
      const isVerified = await checkVerificationStatus();
      if (isVerified) return;

      const resendOptions: any = {
        type: 'signup',
        email: email,
        options: {}
      };
      
      // Include captcha token if we have one
      if (captchaToken) {
        resendOptions.options.captchaToken = captchaToken;
      }
      
      const { error } = await supabase.auth.resend(resendOptions);
      
      if (error) {
        throw error;
      }
      
      setResendAttempts(prev => prev + 1);
      
      toast({
        title: "Verification email sent",
        description: "Please check your email inbox and spam folder.",
      });
      
      // Set progressive cooldown
      const cooldownTime = resendAttempts === 0 ? 60 : 120;
      setCooldown(cooldownTime);
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setShowCaptcha(false);
      setCaptchaToken(null);
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
      
    } catch (error: any) {
      console.error('Resend error:', error);
      
      let errorMessage = "Failed to resend verification email";
      let cooldownTime = 60;
      
      if (error.message?.includes("Email rate limit exceeded") || error.message?.includes("rate limit")) {
        errorMessage = "Too many emails sent. Please wait before requesting another.";
        cooldownTime = 300; // 5 minute cooldown for rate limit
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "This email is already registered. Try logging in instead.";
      } else if (error.message?.includes("captcha")) {
        errorMessage = "Please complete the captcha verification.";
        setShowCaptcha(true);
        cooldownTime = 0;
      }
      
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
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
      setCaptchaToken(null);
    } finally {
      setIsResending(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    // Auto-proceed with resend after captcha is verified
    setTimeout(() => {
      handleResendEmail();
    }, 100);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

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
              if (captchaRef.current) {
                captchaRef.current.resetCaptcha();
              }
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
        </p>
      )}
    </div>
  );
};

export default EmailVerificationHandler;
