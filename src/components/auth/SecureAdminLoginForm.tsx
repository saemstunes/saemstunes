import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { userRoleService } from "@/services/userRoleService";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface SecureAdminLoginFormProps {
  onClose?: () => void;
}

const SecureAdminLoginForm = ({ onClose = () => {} }: SecureAdminLoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAdminLogin = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Attempt authentication with Supabase
      await login(data.email, data.password);
      
      // Check if user has admin role
      const isAdmin = await userRoleService.isCurrentUserAdmin();
      
      if (!isAdmin) {
        form.setError("root", { 
          message: "Access denied. Admin privileges required." 
        });
        return;
      }
      
      // Success - redirect to admin page
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin panel.",
      });
      
      navigate("/admin");
      onClose();
      
    } catch (error: any) {
      console.error("Admin login failed:", error);
      
      // Handle specific auth errors
      if (error?.message?.includes("Invalid login credentials")) {
        form.setError("root", { 
          message: "Invalid email or password." 
        });
      } else if (error?.message?.includes("Email not confirmed")) {
        form.setError("root", { 
          message: "Please verify your email address before logging in." 
        });
      } else {
        form.setError("root", { 
          message: "Authentication failed. Please try again." 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-4 py-4">
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
              <FormLabel>Admin Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="admin@example.com" 
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
              <FormLabel>Password</FormLabel>
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

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Access Admin
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SecureAdminLoginForm;