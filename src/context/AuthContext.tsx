
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Define user roles
export type UserRole = "student" | "adult" | "parent" | "teacher" | "admin";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subscribed: boolean;
  parentId?: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - In a real app, this would come from an API
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
    subscribed: false,
  },
  {
    id: "2",
    name: "Adult Learner",
    email: "adult@example.com",
    role: "adult",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adult",
    subscribed: true,
  },
  {
    id: "3",
    name: "Parent User",
    email: "parent@example.com",
    role: "parent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent",
    subscribed: true,
  },
  {
    id: "4",
    name: "Teacher User",
    email: "teacher@example.com",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
    subscribed: true,
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    subscribed: true,
  },
];

// Create the provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem("saems_user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Mock login function - In a real app, this would call your API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === "password") { // In a real app, never hardcode passwords!
        setUser(foundUser);
        localStorage.setItem("saems_user", JSON.stringify(foundUser));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${foundUser.name}`,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function - In a real app, this would call your API
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already in use
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        subscribed: false,
      };
      
      // In a real app, this would save the user to your database
      // For now, we'll just set the user in state
      setUser(newUser);
      localStorage.setItem("saems_user", JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: `Welcome to Saem's Tunes, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("saems_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
