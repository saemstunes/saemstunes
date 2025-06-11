
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Saem's Tunes</h1>
        {user ? (
          <p>Hello, {user.name}! Welcome back to your music journey.</p>
        ) : (
          <p>Discover amazing music and learn with expert tutors.</p>
        )}
      </div>
    </MainLayout>
  );
}
