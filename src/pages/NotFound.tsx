import React, { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Logo from '@/components/branding/Logo';

const SUPPORT_EMAIL = 'support@yourdomain.com'; // <- change to your support address

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goBack = useCallback(() => {
    // fallback: if there is no meaningful history, send user home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `404 encountered: ${pathname}`
  )}&body=${encodeURIComponent(
    `I hit a 404 on ${pathname}. Please describe what you were trying to do:`
  )}`;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <section
        aria-labelledby="notfound-title"
        className="max-w-md w-full text-center"
        role="article"
      >
        <header className="mb-8">
          <Logo size="lg" className="mx-auto" />
        </header>

        <div className="relative">
          <div
            aria-hidden="true"
            className="text-8xl font-bold text-gold/20 select-none"
          >
            404
          </div>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4">
            <h1 id="notfound-title" className="text-2xl font-proxima font-bold mb-2">
              Page not found
            </h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>

            {/* show attempted path for debugging / context */}
            <p className="text-xs text-muted-foreground mb-6">
              <span className="font-mono text-[11px]">{pathname}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-16">
          <Button
            onClick={goBack}
            variant="outline"
            className="flex items-center justify-center gap-2"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          {/* Using asChild (if your Button supports it) so Link receives correct semantics */}
          <Button asChild className="bg-gold hover:bg-gold/90 text-white flex items-center justify-center gap-2" aria-label="Go home" title="Go home">
            <Link to="/" className="w-full flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <Button asChild variant="ghost" size="sm" aria-label="Search">
            <Link to="/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" aria-label="Contact support">
            <Link to="/contact-us" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Get help
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          If you believe this is an error, please{' '}
          <Link to="/contact-us" className="underline hover:opacity-90">
            contact support
          </Link>
          {' '}or email{' '}
          <a href={mailtoHref} className="underline hover:opacity-90">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  );
};

export default NotFound;
