
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-gold hover:underline">
          Go back home
        </Link>
      </div>
    </MainLayout>
  );
}
