
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Music, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Toast is already shown in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
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
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-gold hover:text-gold-dark"
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-gold hover:text-gold-dark"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="text-xs text-muted-foreground text-center w-full">
          For demo purposes, you can use:
          <br />
          <code className="bg-muted px-1 py-0.5 rounded text-xs">
            student@example.com
          </code>{" "}
          or any role with password{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-xs">password</code>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
