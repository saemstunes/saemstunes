
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
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

    try {
      await login(data.email, data.password);
      navigate(from);
    } catch (error) {
      console.error("Login failed:", error);
      // Toast is already shown in the auth context
      form.setError("root", { 
        message: "Invalid email or password. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-gold/20 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-gold/10 p-3 rounded-full">
            <Music className="h-8 w-8 text-gold" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center font-serif">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {form.formState.errors.root.message}
              </div>
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
                      onClick={() => {
                        toast({
                          title: "Reset Password",
                          description: "This feature will be available soon!",
                        });
                      }}
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

            <Button
              type="submit"
              disabled={isSubmitting}
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
