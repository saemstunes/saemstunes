
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Music, User, Mail, Phone, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface UserDetailsForm {
  firstName: string;
  lastName: string;
  phone: string;
}

const UserDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<UserDetailsForm>();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  const onSubmit = async (data: UserDetailsForm) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          email: user.email,
          full_name: `${data.firstName} ${data.lastName}`,
          display_name: data.firstName,
          onboarding_complete: true
        });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your information has been saved successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;
    
    setIsSkipping(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          onboarding_complete: true
        });

      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      console.error("Skip onboarding error:", error);
      navigate("/"); // Navigate anyway if there's an error
    } finally {
      setIsSkipping(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-gold/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Music className="h-8 w-8 text-gold" />
            </div>
            <CardTitle className="text-2xl font-serif">Welcome to Saem's Tunes!</CardTitle>
            <CardDescription>
              Help us personalize your experience by sharing a few details about yourself.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gold" />
                  <span>First Name</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters"
                    }
                  })}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters"
                    }
                  })}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gold" />
                  <span>Phone Number (Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phone", {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={handleSkip}
                  disabled={isSkipping}
                >
                  {isSkipping ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Skipping...
                    </>
                  ) : (
                    "Skip for now"
                  )}
                </Button>
              </div>
            </form>

            <div className="text-xs text-center text-muted-foreground space-y-2">
              <p>
                <Mail className="h-3 w-3 inline mr-1" />
                Email: {user.email}
              </p>
              <p>
                This information helps us send you relevant updates and personalize your experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserDetails;
