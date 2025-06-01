import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["student", "adult_learner", "parent", "tutor", "admin", "user"]),
  onboarding_complete: z.boolean().default(false),
});

const UserDetails = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      display_name: profile?.display_name || "",
      email: profile?.email || "",
      role: profile?.role || "student",
      onboarding_complete: profile?.onboarding_complete || false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        full_name: profile.full_name || "",
        display_name: profile.display_name || "",
        email: profile.email || "",
        role: profile.role || "student",
        onboarding_complete: profile.onboarding_complete || false,
      });
    }
  }, [profile, profileForm]);

  const handleUpdateProfile = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      await updateProfile({
        full_name: values.full_name,
        display_name: values.display_name,
        email: values.email,
        role: values.role,
        onboarding_complete: values.onboarding_complete,
      });
      toast({
        title: "Profile updated successfully!",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              View and manage your profile details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Display Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="adult_learner">Adult Learner</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="tutor">Tutor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold leading-none">
                        Onboarding Complete
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Set to true once the user has completed the onboarding
                        process.
                      </p>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="onboarding_complete"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Profile</Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || profile?.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{profile?.full_name || profile?.display_name || 'User'}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={profile?.full_name || ""}
                    className="mt-1"
                    readOnly
                  />
                </div>

                <div>
                  <Label>Display Name</Label>
                  <Input
                    type="text"
                    value={profile?.display_name || ""}
                    className="mt-1"
                    readOnly
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile?.email || ""}
                    className="mt-1"
                    readOnly
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <Input
                    type="text"
                    value={profile?.role || ""}
                    className="mt-1 capitalize"
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none">
                      Onboarding Complete
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Set to true once the user has completed the onboarding
                      process.
                    </p>
                  </div>
                  <Switch
                    checked={profile?.onboarding_complete || false}
                    disabled
                  />
                </div>

                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserDetails;
