
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface AdminLoginFormProps {
  onClose: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Admin credentials - in a real app, these would be checked securely on a backend
  // This is just for demo purposes
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'saem2025';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin panel",
        });
        onClose();
        navigate('/admin');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="bg-muted/50 p-4 rounded-md mb-4 flex items-center gap-3">
        <Shield className="text-gold h-5 w-5" />
        <p className="text-sm text-muted-foreground">This area is restricted to authorized administrators only.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      
      <div className="flex justify-between items-center pt-2">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onClose} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gold hover:bg-gold-dark"
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Login as Admin"}
        </Button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
