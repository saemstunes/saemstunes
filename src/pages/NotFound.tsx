import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle, ExternalLink } from 'lucide-react';
import Logo from '@/components/branding/Logo';
import { handle404 } from '@/api/404-message.ts';

const SUPPORT_EMAIL = 'contact@saemstunes.com';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [message, setMessage] = useState<string>('We couldn\'t find the page you were looking for. It might have been moved or deleted.');
  const [loading, setLoading] = useState<boolean>(true);
  const [bestMatch, setBestMatch] = useState<string | null>(null);
  const [messageWithLinks, setMessageWithLinks] = useState<React.ReactNode>('');

  const goBack = useCallback(() => {
    if (window.history.length > 3) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`404 encountered: ${pathname}`)}&body=${encodeURIComponent(`Hello Support,

I ran into a 404 error while visiting:

${window.location.href}

Details:
- Path: ${pathname}
- Referrer: ${document.referrer || "N/A"}
- User Agent: ${navigator.userAgent}
- Time (local): ${new Date().toLocaleString()}

I was trying to: [please describe what you were doing]

Thanks,
[Your Name]`)}`;

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
        setBestMatch(result.bestMatch);
        
        // Create message with clickable links
        if (result.bestMatch && result.message.includes(result.bestMatch)) {
          const parts = result.message.split(result.bestMatch);
          const messageWithLink = (
            <>
              {parts[0]}
              <Link to={result.bestMatch} className="text-gold underline hover:opacity-90">
                {result.bestMatch}
              </Link>
              {parts[1]}
            </>
          );
          setMessageWithLinks(messageWithLink);
        } else {
          setMessageWithLinks(result.message);
        }
      } catch (error) {
        console.error('Failed to process 404:', error);
        const errorMessage = `We couldn't find the page ${pathname}. It might have been moved or deleted.`;
        setMessage(errorMessage);
        setMessageWithLinks(errorMessage);
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
            <div className="text-muted-foreground mb-4">
              {loading ? 'Loading...' : messageWithLinks}
            </div>

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
