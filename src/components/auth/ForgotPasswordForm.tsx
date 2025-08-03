
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LockKeyhole, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        captchaToken,
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      form.setError("root", {
        message: error.message || "Failed to send reset email. Please try again.",
      });
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-gold/20 shadow-lg">
      <CardHeader className="space-y-1">
        <motion.div
          className="flex justify-center mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gold/10 p-3 rounded-full">
            <LockKeyhole className="h-8 w-8 text-gold" />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <CardTitle className="text-2xl text-center font-serif">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center">
            {resetSent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        {resetSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="bg-primary/10 text-primary rounded-md p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>Reset link sent! Check your inbox and spam folder.</p>
            </div>
            <Button
              className="mt-4 w-full bg-gold hover:bg-gold/90 text-white"
              onClick={() => navigate("/auth?tab=login")}
            >
              Return to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {form.formState.errors.root && (
                <motion.div
                  className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
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

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !captchaToken}
                  className="flex-1 bg-gold hover:bg-gold/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
