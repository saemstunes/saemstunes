
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SignupForm from "@/components/auth/SignupForm";
import { Music } from "lucide-react";

const Signup = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate("/")} role="button">
          <Music className="h-6 w-6 text-gold" />
          <h1 className="font-serif text-xl font-bold">
            Saem's <span className="text-gold">Tunes</span>
          </h1>
        </div>
      </header>

      {/* Background with music pattern */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30 relative">
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        <div className="relative z-10 w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
