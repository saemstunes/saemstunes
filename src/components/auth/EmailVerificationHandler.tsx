import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, ShieldAlert, MailCheck, Key, UserPlus, MagicWand, Lock, AlertCircle } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type VerificationType = 
  | 'signup' 
  | 'invite' 
  | 'magiclink' 
  | 'email_change' 
  | 'recovery' 
  | 'reauthentication';

interface EmailVerificationHandlerProps {
  email: string;
  verificationType: VerificationType;
  onVerificationComplete?: (session?: any) => void;
  redirectPath?: string;
  newEmail?: string;
  actionDescription?: string;
  initialCheck?: boolean;
}

export const EmailVerificationHandler = ({ 
  email, 
  verificationType = 'signup',
  onVerificationComplete,
  redirectPath = '/dashboard',
  newEmail,
  actionDescription = "perform a security-sensitive action",
  initialCheck = true
}: EmailVerificationHandlerProps) => {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [status, setStatus] = useState<'checking' | 'unverified' | 'verified' | 'expired'>('checking');
  const [actionState, setActionState] = useState<'idle' | 'processing' | 'completed'>('idle');
  const captchaRef = useRef<HCaptcha>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Unified verification status checker
  const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        if (error.message.includes("Invalid Refresh Token")) return false;
        throw error;
      }
      
      // Enhanced security: Check email mismatch
      if (user?.email && user.email !== email && verificationType !== 'email_change') {
        toast({
          title: "Email mismatch",
          description: "The logged in email doesn't match this verification request",
          variant: "destructive",
        });
        return false;
      }

      switch(verificationType) {
        case 'signup':
          if (user?.email_confirmed_at) return true;
          break;
          
        case 'email_change':
          if (user?.email === newEmail) return true;
          break;
          
        case 'recovery':
          if (user?.recovery_sent_at) {
            const { data } = await supabase.auth.getUser();
            if (data.user?.last_sign_in_at && data.user?.updated_at) return true;
          }
          break;
          
        case 'reauthentication':
          if (user?.reauthenticated_at) return true;
          break;
          
        case 'magiclink':
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) return true;
          break;
          
        case 'invite':
          if (user?.invited_at && user?.email_confirmed_at) return true;
          break;
          
        default:
          if (user?.email_confirmed_at) return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Verification check error:', error);
      
      if (error.message?.includes("leaked credentials")) {
        toast({
          title: "Security Alert",
          description: "This password has been compromised. Please choose a different one.",
          variant: "destructive",
        });
      }
      else if (error.message?.includes("Invalid token")) {
        setStatus('expired');
        toast({
          title: "Verification expired",
          description: "Your verification link has expired. Please request a new one.",
          variant: "destructive",
        });
      }
      
      return false;
    }
  }, [email, verificationType, newEmail, toast]);

  // Handle verification completion
  const completeVerification = useCallback(async () => {
    setActionState('processing');
    
    try {
      const isVerified = await checkVerificationStatus();
      
      if (isVerified) {
        const { data } = await supabase.auth.getSession();
        setStatus('verified');
        
        // Type-specific success handling
        const successMessages = {
          recovery: {
            title: "Password Reset",
            description: "Please set your new password"
          },
          email_change: {
            title: "Email Updated",
            description: `Your email has been changed to ${newEmail}`
          },
          invite: {
            title: "Invitation Accepted",
            description: "Your account setup is complete"
          },
          reauthentication: {
            title: "Identity Verified",
            description: "You may now proceed with sensitive actions"
          },
          magiclink: {
            title: "Login Successful",
            description: "You've been securely logged in"
          },
          signup: {
            title: "Email Verified",
            description: "Your account is now active"
          }
        };
        
        const message = successMessages[verificationType] || successMessages.signup;
        toast(message);
        
        onVerificationComplete?.(data.session);
        if (redirectPath) {
          router.push(redirectPath);
        }
      }
    } catch (error) {
      console.error('Completion error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to complete verification process",
        variant: "destructive",
      });
    } finally {
      setActionState('completed');
    }
  }, [checkVerificationStatus, onVerificationComplete, redirectPath, router, toast, verificationType, newEmail]);

  // Initialize verification check
  useEffect(() => {
    const initializeVerification = async () => {
      const verified = await checkVerificationStatus();
      if (verified) {
        setStatus('verified');
        completeVerification();
      } else {
        setStatus('unverified');
      }
    };

    if (initialCheck) {
      initializeVerification();
      startVerificationPolling();
    }
    
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [initialCheck, checkVerificationStatus, completeVerification]);

  // Smart verification polling with progressive backoff
  const startVerificationPolling = useCallback(() => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    
    // Progressive intervals: 5s, 10s, 30s, 60s
    const intervals = [5000, 10000, 30000, 60000];
    const intervalIndex = Math.min(resendAttempts, intervals.length - 1);
    
    checkIntervalRef.current = setInterval(async () => {
      const verified = await checkVerificationStatus();
      if (verified) {
        clearInterval(checkIntervalRef.current!);
        completeVerification();
      }
    }, intervals[intervalIndex]);
  }, [resendAttempts, checkVerificationStatus, completeVerification]);

  // Resend email with enhanced scenario handling
  const handleResendEmail = async () => {
    if (cooldown > 0 || !email) return;
    
    // Require CAPTCHA after first attempt
    if (resendAttempts >= 1 && !captchaToken) {
      setShowCaptcha(true);
      return;
    }
    
    setIsResending(true);
    
    try {
      // Check if already verified before resending
      if (await checkVerificationStatus()) {
        completeVerification();
        return;
      }

      // Auto-detect scenario based on user state
      let resendType: 'signup' | 'email_change' | 'magiclink' | 'recovery' | 'reauthentication' | 'invite' = verificationType;
      let resendOptions: any = { email, options: {} };

      // Special handling for email change
      if (verificationType === 'email_change' && newEmail) {
        resendOptions.options.email_redirect_to = `${window.location.origin}/update-email`;
      }

      // Handle magic link and invite differently
      if (verificationType === 'magiclink' || verificationType === 'invite') {
        resendOptions.options.emailRedirectTo = `${window.location.origin}/auth/callback`;
        resendOptions.options.shouldCreateUser = verificationType === 'invite';
        
        const { error } = await supabase.auth.signInWithOtp(resendOptions);
        if (error) throw error;
      } else {
        // Include CAPTCHA token
        if (captchaToken) {
          resendOptions.options.captchaToken = captchaToken;
        }
        
        const { error } = await supabase.auth.resend(resendOptions);
        if (error) throw error;
      }
      
      setResendAttempts(prev => prev + 1);
      
      toast({
        title: "Email Sent",
        description: "Please check your email inbox and spam folder",
      });
      
      // Set progressive cooldown
      const cooldownTimes = {
        signup: [60, 120, 300],
        invite: [120, 300],
        magiclink: [60, 120],
        email_change: [120, 300],
        recovery: [60, 120],
        reauthentication: [60]
      };
      
      const typeTimes = cooldownTimes[verificationType] || [60, 120];
      const cooldownTime = typeTimes[Math.min(resendAttempts, typeTimes.length - 1)];
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
      
      // Reset CAPTCHA and restart polling
      setShowCaptcha(false);
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
      startVerificationPolling();
      
    } catch (error: any) {
      console.error('Resend error:', error);
      
      let errorMessage = "Failed to send email";
      let cooldownTime = 60;
      
      if (error.message?.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait before retrying";
        cooldownTime = 300;
      } 
      else if (error.message?.includes("already confirmed")) {
        errorMessage = "Email already verified";
        setStatus('verified');
      }
      else if (error.message?.includes("captcha")) {
        errorMessage = "Please complete the captcha verification";
        setShowCaptcha(true);
        cooldownTime = 0;
      }
      else if (error.message?.includes("User already registered")) {
        errorMessage = "This email is already registered";
      }
      else if (error.message?.includes("invalid")) {
        errorMessage = "Invalid email address";
      }
      else if (error.message?.includes("expired")) {
        errorMessage = "Verification link expired";
        setStatus('expired');
      }
      else if (error.message?.includes("not found")) {
        errorMessage = "No account found with this email";
      }
      
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
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setTimeout(handleResendEmail, 100);
  };

  const handleCaptchaExpire = () => setCaptchaToken(null);

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    toast({
      title: "Captcha Error",
      description: "Verification failed. Please try again.",
      variant: "destructive",
    });
  };

  // Get UI content based on verification type
  const getStatusContent = () => {
    const common = {
      signup: {
        icon: <MailCheck className="h-12 w-12 text-blue-500" />,
        title: "Confirm Your Email",
        description: "We've sent a confirmation link to your email",
        resendText: "Resend verification email",
        successTitle: "Email Verified!",
        successDescription: "Your account is now active",
        expiredTitle: "Link Expired",
        expiredDescription: "The verification link has expired. Please request a new one."
      },
      invite: {
        icon: <UserPlus className="h-12 w-12 text-purple-500" />,
        title: "Accept Your Invitation",
        description: "Complete your account setup via email",
        resendText: "Resend invitation",
        successTitle: "Invitation Accepted!",
        successDescription: "Your account setup is complete",
        expiredTitle: "Invitation Expired",
        expiredDescription: "This invitation has expired. Please request a new one."
      },
      magiclink: {
        icon: <MagicWand className="h-12 w-12 text-indigo-500" />,
        title: "Magic Link Sent",
        description: "Check your email for the login link",
        resendText: "Resend magic link",
        successTitle: "Login Successful!",
        successDescription: "You've been securely logged in",
        expiredTitle: "Link Expired",
        expiredDescription: "The magic link has expired. Please request a new one."
      },
      email_change: {
        icon: <MailCheck className="h-12 w-12 text-amber-500" />,
        title: "Confirm Email Change",
        description: "Verify your new email address to complete the change",
        resendText: "Resend confirmation",
        successTitle: "Email Updated!",
        successDescription: "Your email has been successfully changed",
        expiredTitle: "Link Expired",
        expiredDescription: "The confirmation link has expired. Please request a new one."
      },
      recovery: {
        icon: <Key className="h-12 w-12 text-green-500" />,
        title: "Reset Your Password",
        description: "Check your email for the password reset link",
        resendText: "Resend reset email",
        successTitle: "Password Reset!",
        successDescription: "Please set your new password",
        expiredTitle: "Link Expired",
        expiredDescription: "The reset link has expired. Please request a new one."
      },
      reauthentication: {
        icon: <Lock className="h-12 w-12 text-red-500" />,
        title: "Security Verification",
        description: `Reauthentication required to ${actionDescription}`,
        resendText: "Resend verification",
        successTitle: "Identity Verified!",
        successDescription: "You may now proceed with sensitive actions",
        expiredTitle: "Verification Expired",
        expiredDescription: "The verification request has expired. Please start over."
      }
    };
    
    return common[verificationType] || common.signup;
  };

  const statusContent = getStatusContent();

  // Render status indicator UI
  const renderStatusIndicator = () => {
    if (status === 'verified') {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-5 w-5" />
          <span>Email verified successfully</span>
        </div>
      );
    }
    
    if (status === 'expired') {
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>Verification link expired</span>
        </div>
      );
    }
    
    return (
      <div className="text-sm text-muted-foreground mb-4">
        <p className="mb-2">{statusContent.description}</p>
        <p className="font-medium text-foreground">{email}</p>
        <p className="mt-2">Can't find it? Check your spam folder.</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {status === 'verified' ? (
        <div className="text-center p-6 border rounded-lg bg-green-50">
          {statusContent.icon}
          <h3 className="font-semibold text-xl mt-4">{statusContent.successTitle}</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            {statusContent.successDescription}
          </p>
          <Button 
            variant="default"
            onClick={() => redirectPath ? router.push(redirectPath) : onVerificationComplete?.()}
            className="w-full"
          >
            {actionState === 'processing' 
              ? "Finalizing..." 
              : "Continue to Dashboard"}
          </Button>
        </div>
      ) : status === 'expired' ? (
        <div className="text-center p-6 border rounded-lg bg-yellow-50">
          <ShieldAlert className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="font-semibold text-xl mt-4">{statusContent.expiredTitle}</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            {statusContent.expiredDescription}
          </p>
          <Button 
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
              "Send New Link"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {renderStatusIndicator()}
          
          <div className="space-y-4">
            {showCaptcha ? (
              <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  Complete security verification to continue
                </p>
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "02409832-47f4-48c0-ac48-d98828b23724"}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                  onError={handleCaptchaError}
                  ref={captchaRef}
                  theme="light"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCaptcha(false)}
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
                  statusContent.resendText
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
        </div>
      )}
      
      {verificationType === 'email_change' && newEmail && status !== 'verified' && (
        <div className="bg-blue-50 rounded-lg p-3 text-left">
          <p className="font-medium">Changing email to:</p>
          <p className="font-semibold text-blue-700">{newEmail}</p>
        </div>
      )}
      
      {verificationType === 'reauthentication' && status !== 'verified' && (
        <div className="text-xs p-3 bg-blue-50 rounded-lg text-blue-700">
          <ShieldAlert className="inline h-4 w-4 mr-1" />
          This extra security step helps protect your account
        </div>
      )}
    </div>
  );
};
