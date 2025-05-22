
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ForgotPasswordForm from "./ForgotPasswordForm";
import SocialLoginOptions from "./SocialLoginOptions";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface LoginFormProps {
  onAdminTap?: () => void;
}

const LoginForm = ({ onAdminTap }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Get redirect path from location state or default to "/"
  const from = location.state?.from?.pathname || "/";
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: FormData) => {
    setIsSubmitting(true);

    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive",
      });
      form.setError("root", { message: "Please complete the CAPTCHA challenge." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Pass captchaToken to login function
      await login(data.email, data.password, captchaToken);
      navigate(from);
    } catch (error) {
      console.error("Login failed:", error);
      // Toast is already shown in the auth context
      form.setError("root", { 
        message: "Invalid email or password. Please try again." 
      });
      // Reset captcha on error
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <Card className="w-full border-gold/20 shadow-lg">
      <CardHeader className="space-y-1">
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={onAdminTap}
        >
          <div className="bg-gold/10 p-3 rounded-full cursor-pointer">
            <Music className="h-8 w-8 text-gold" />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <CardTitle className="text-2xl text-center font-serif">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            {form.formState.errors.root && (
              <motion.div 
                className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="h-4 w-4" />
                {form.formState.errors.root.message}
              </motion.div>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      {...field} 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs text-gold hover:text-gold-dark px-0 h-auto"
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center my-4">
              <HCaptcha
                sitekey="02409832-47f4-48c0-ac48-d98828b23724"
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                ref={captchaRef}
                theme="light"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              className="w-full bg-gold hover:bg-gold/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <SocialLoginOptions />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t pt-4">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-gold hover:text-gold/80"
            onClick={() => navigate("/auth?tab=signup")}
          >
            Sign up
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center w-full">
          Making
          <br />
          <code className="bg-muted px-1 py-0.5 rounded text-xs">
            music
          </code>{" "}
          , representing
          <code className="bg-muted px-1 py-0.5 rounded text-xs">Christ</code>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
