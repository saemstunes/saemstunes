
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, UserPlus } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export interface SignupFormProps {
  onSignupComplete?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Setting the default role to "student" when signing up
      await signUp(data.email, data.password, data.name, "student");
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
      });
      
      if (onSignupComplete) {
        onSignupComplete();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      form.setError("root", { 
        message: "There was an error signing up. Please try again." 
      });
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
            <UserPlus className="h-8 w-8 text-gold" />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <CardTitle className="text-2xl text-center font-serif">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join our community of music enthusiasts
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t pt-4">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-gold hover:text-gold/80"
            onClick={() => navigate("/auth?tab=login")}
          >
            Log in
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center w-full">
          By signing up, you agree to our{" "}
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs text-muted-foreground underline"
            onClick={() => navigate("/terms")}
          >
            Terms of Service
          </Button>{" "}
          and{" "}
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs text-muted-foreground underline"
            onClick={() => navigate("/privacy")}
          >
            Privacy Policy
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
