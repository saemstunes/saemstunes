
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-destructive/10 p-4 rounded-full mb-6">
          <Lock className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {user 
            ? `Sorry, your current role (${user.role}) doesn't have permission to access this page.`
            : "Please log in to access this page."}
        </p>
        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="bg-gold hover:bg-gold-dark text-white"
          >
            Go Home
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
