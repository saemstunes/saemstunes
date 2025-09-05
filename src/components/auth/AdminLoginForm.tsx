import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";
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
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminCode: z.string().min(1, "Admin code is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AdminLoginFormProps {
  onClose?: () => void;
}

// Fixed admin credentials - same as in Admin.tsx
const FIXED_ADMIN_CREDENTIALS = {
  username: 'saemstunes',
  password: 'ilovetosing123'
};

const AdminLoginForm = ({ onClose = () => {} }: AdminLoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      adminCode: "",
    },
  });

  const handleAdminLogin = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Verify admin code first
      if (data.adminCode !== "ST-ADMIN-2024") {
        form.setError("adminCode", { 
          message: "Invalid admin code" 
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if credentials match fixed admin
      if (
        data.email === FIXED_ADMIN_CREDENTIALS.username && 
        data.password === FIXED_ADMIN_CREDENTIALS.password
      ) {
        // Fixed admin authentication
        sessionStorage.setItem('adminAuth', 'true');
        navigate("/admin");
        onClose();
        return;
      }
      
      // Regular user authentication
      await login(data.email, data.password);
      
      // Set admin access for regular user
      sessionStorage.setItem('adminAuth', 'true');
      navigate("/admin");
      onClose();
    } catch (error) {
      console.error("Admin login failed:", error);
      form.setError("root", { 
        message: "Authentication failed. Please verify your credentials." 
      });
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
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="admin@example.com or saemstunes" 
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
        
        <FormField
          control={form.control}
          name="adminCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Code</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Enter admin verification code"
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

export default AdminLoginForm;
