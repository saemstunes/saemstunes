import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle, Frown, Music, Users } from 'lucide-react';
import Logo from '@/components/branding/Logo';
import { useArtistSuggestions } from '@/hooks/useArtistSuggestions';

interface ArtistNotFoundProps {
  slug?: string;
  error?: string;
  isArtistPage?: boolean;
}

const ArtistNotFound: React.FC<ArtistNotFoundProps> = ({ 
  slug, 
  error, 
  isArtistPage = false 
}) => {
  const navigate = useNavigate();
  const { suggestedArtists, loading } = useArtistSuggestions();

  const goBack = () => {
    navigate(-1);
  };

  // Artist-specific content
  if (isArtistPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <Logo size="lg" className="mx-auto" />
          </div>
          
          <div className="mb-10">
            <div className="relative">
              <div className="text-8xl font-bold text-gold/20">404</div>
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
                <div className="flex justify-center mb-4">
                  <Frown className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Artist Not Found</h1>
                <p className="text-muted-foreground">
                  {error || `We couldn't find an artist with the URL "${slug}"`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 mb-8 max-w-lg mx-auto">
            <h3 className="font-medium mb-4 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              What happened?
            </h3>
            <ul className="text-muted-foreground text-sm space-y-2 text-left mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The artist may have changed their profile URL</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The artist might no longer be on our platform</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You might have entered an incorrect URL</span>
              </li>
            </ul>
            <Button 
              variant="link" 
              className="text-primary underline"
              onClick={() => window.location.href = "mailto:support@musicplatform.com"}
            >
              Contact Support
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
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

          {/* Suggested artists */}
          {!loading && suggestedArtists.length > 0 && (
            <div className="mt-12 w-full">
              <h3 className="text-lg font-medium mb-6 flex items-center justify-center">
                <Users className="h-5 w-5 mr-2" />
                Discover Similar Artists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {suggestedArtists.map(artist => (
                  <Link 
                    key={artist.id} 
                    to={`/artist/${artist.slug}`}
                    className="group"
                  >
                    <div className="flex flex-col items-center cursor-pointer">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border-2 border-transparent group-hover:border-gold transition-colors">
                          {artist.profile_image_url ? (
                            <img 
                              src={artist.profile_image_url} 
                              alt={artist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                              {artist.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-1">
                          <Music className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                        {artist.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // General 404 page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Logo size="lg" className="mx-auto" />
        </div>
        
        <div className="relative">
          <div className="text-8xl font-bold text-gold/20">404</div>
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
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

export default ArtistNotFound;
