
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Logo from '@/components/branding/Logo';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Logo size="lg" className="mx-auto" />
        </div>
        
        <div className="relative">
          <div className="text-8xl font-bold text-gold/20">404</div>
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <h1 className="text-2xl font-proxima font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-16">
          <Button 
            onClick={goBack}
            variant="outline" 
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            asChild
            className="bg-gold hover:bg-gold/90 text-white flex items-center justify-center gap-2"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
          >
            <Link to="/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Link>
          </Button>
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
          >
            <Link to="/contact-us" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Get Help
            </Link>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-10">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
