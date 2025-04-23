
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Music, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup(name, email, password, role);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
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
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="adult">Adult Learner</SelectItem>
                  <SelectItem value="parent">Parent/Guardian</SelectItem>
                  <SelectItem value="teacher">Music Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-gold hover:text-gold-dark"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
