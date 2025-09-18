// NotFound.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Logo from '@/components/branding/Logo';
import { handle404 } from '@/api/404-message.ts';
import { checkRoute } from '@/utils/routeSuggestions'; // Add this import

const SUPPORT_EMAIL = 'contact@saemstunes.com';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [message, setMessage] = useState<string>('We couldn\'t find the page you were looking for. It might have been moved or deleted.');
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestion, setSuggestion] = useState<string | null>(null); // Add state for suggestion

  const goBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`404 encountered: ${pathname}`)}&body=${encodeURIComponent(`I hit a 404 on ${pathname}. Please describe what you were trying to do:`)}`;

  useEffect(() => {
    const process404 = async () => {
      try {
        const result = await handle404(
          pathname,
          search,
          document.referrer || '',
          navigator.userAgent
        );
        setMessage(result.message);
        
        // Check for route suggestion
        const routeSuggestion = checkRoute(pathname);
        setSuggestion(routeSuggestion);
      } catch (error) {
        console.error('Failed to process 404:', error);
        setMessage(`We couldn't find the page ${pathname}. It might have been moved or deleted.`);
        
        // Check for route suggestion even on error
        const routeSuggestion = checkRoute(pathname);
        setSuggestion(routeSuggestion);
      } finally {
        setLoading(false);
      }
    };

    process404();
  }, [pathname, search]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <section aria-labelledby="notfound-title" className="max-w-md w-full text-center relative" role="article">
    
        <header className="mb-8">
          <Logo size="lg" className="mx-auto" />
        </header>

        <div className="relative">
          <div aria-hidden="true" className="text-8xl font-bold text-gold/20 select-none">404</div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4">
            <h1 id="notfound-title" className="text-2xl font-proxima font-bold mb-2">Page not found</h1>
            <p className="text-muted-foreground mb-6">
              {loading ? 'Loading...' : message}
            </p>

            {/* Display suggestion if available */}
            {suggestion && (
              <p className="text-blue-600 dark:text-blue-400 mb-4 text-sm">
                {suggestion}
              </p>
            )}

            <p className="text-[11px] font-mono text-muted-foreground/80 select-all break-all mb-6 text-center"> 
              {pathname}              
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
          <Button
            asChild
            className="bg-gold hover:bg-gold/90 text-white flex items-center justify-center gap-2"
            aria-label="Go home"
            title="Go home"
          >
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
          <Link to="/contact-us" className="underline hover:opacity-90">contact support</Link>{' '}
          or email{' '}
          <a href={mailtoHref} className="underline hover:opacity-90">{SUPPORT_EMAIL}</a>.
        </p>

      </section>
    </main>
  );
};

export default NotFound;
