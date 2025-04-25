import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

// Import FlaskConical instead of Flask
import { Lock, Mail, User, Eye, EyeOff, BookOpen, FlaskConical } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = React.useState(tab);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "You have been successfully logged in",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast({
        title: "Signup successful",
        description: "Your account has been created.",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Failed to create an account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {activeTab === "login"
              ? "Enter your email and password to login"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {activeTab === "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@saemstunes.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              >
                {isPasswordVisible ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
          {activeTab === "login" ? (
            <Button disabled={isLoading} onClick={handleSignIn}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
          ) : (
            <Button disabled={isLoading} onClick={handleSignUp}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          )}
        </CardContent>
        <div className="px-6 py-4">
          {activeTab === "login" ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => setActiveTab("signup")}
                className="text-gold"
              >
                Sign Up
              </Button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => setActiveTab("login")}
                className="text-gold"
              >
                Login
              </Button>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
