import React, { useEffect } from 'react';
import { 
  X, MapPin, Calendar, Users, Star, Music, Award, 
  Info, Heart, ExternalLink, Guitar, Mic2, Book, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ModalType = 
  | 'bio' | 'location' | 'genre' | 'stats' | 'social' 
  | 'fun_facts' | 'awards' | 'influences' | 'instruments'
  | 'achievements';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: ModalType;
}

const ArtistModal: React.FC<ArtistModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const renderContent = () => {
    switch (type) {
      case 'bio':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Artist Biography</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {data?.bio || 'No biography available for this artist.'}
            </p>
            {data?.verified_status && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mt-4">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Verified Artist
                </span>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <p className="text-lg font-medium">{data?.location || 'Location not specified'}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Where {data?.name} creates and performs
                </p>
              </div>
            </div>
          </div>
        );

      case 'genre':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Musical Style</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.genre?.map((g: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {g}
                </Badge>
              )) || <p className="text-muted-foreground">No genres specified</p>}
            </div>
            
            {data?.specialties && data.specialties.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {data.specialties.map((s: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                      {s}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Artist Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data?.follower_count?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data?.rating?.toFixed(1) || '4.0'}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data?.songs_count || 24}
                </div>
                <div className="text-sm text-muted-foreground">Songs</div>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data?.awards?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Awards</div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Connect with {data?.name}</h3>
            </div>
            <div className="space-y-2">
              {data?.social_links && Object.keys(data.social_links).length > 0 ? (
                Object.entries(data.social_links).map(([platform, url]) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(url as string, '_blank')}
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No social links available
                </p>
              )}
            </div>
          </div>
        );

      case 'fun_facts':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-pink-500" />
              <h3 className="text-lg font-semibold">Fun Facts</h3>
            </div>
            <div className="space-y-3">
              {data?.fun_facts?.length ? (
                data.fun_facts.map((fact: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{fact}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No fun facts available yet
                </p>
              )}
            </div>
          </div>
        );

      case 'awards':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">Awards & Recognition</h3>
            </div>
            <div className="space-y-3">
              {data?.awards?.length ? (
                data.awards.map((award: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                    <Award className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{award}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No awards yet
                </p>
              )}
            </div>
          </div>
        );

      case 'influences':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Musical Influences</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.influences?.length ? (
                data.influences.map((influence: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                    {influence}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No influences specified
                </p>
              )}
            </div>
          </div>
        );

      case 'instruments':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Guitar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Favorite Instruments</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {data?.favorite_instruments?.length ? (
                data.favorite_instruments.map((instrument: string, i: number) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                    <Guitar className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">{instrument}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-4">
                  No instruments specified
                </p>
              )}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Career Highlights</h3>
            </div>
            <div className="space-y-3">
              {data?.verified_status && (
                <div className="flex items-center gap-3 p-3 bg-gold/10 rounded-lg">
                  <Star className="h-5 w-5 text-gold" />
                  <div>
                    <div className="font-medium">Verified Artist</div>
                    <div className="text-sm text-muted-foreground">
                      Officially verified status
                    </div>
                  </div>
                </div>
              )}
              
              {data?.years_active && (
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Years Active</div>
                    <div className="text-sm text-muted-foreground">
                      {data.years_active} years in the industry
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Member Since</div>
                  <div className="text-sm text-muted-foreground">
                    {data?.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              {data?.collaborations && data.collaborations.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Notable Collaborations</div>
                    <div className="text-sm text-muted-foreground">
                      {data.collaborations.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Content not available</p>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'bio': return <Info className="h-5 w-5" />;
      case 'location': return <MapPin className="h-5 w-5" />;
      case 'genre': return <Music className="h-5 w-5" />;
      case 'stats': return <Users className="h-5 w-5" />;
      case 'social': return <ExternalLink className="h-5 w-5" />;
      case 'fun_facts': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'awards': return <Award className="h-5 w-5 text-gold" />;
      case 'influences': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'instruments': return <Guitar className="h-5 w-5" />;
      case 'achievements': return <Award className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={cn(
              "relative bg-background border rounded-xl shadow-2xl",
              "w-full max-w-full sm:max-w-md",
              "max-h-[90dvh] overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  {getIcon()}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="h-[50dvh] sm:h-[60vh] p-4 sm:p-5" type="auto">
              {renderContent()}
            </ScrollArea>
            
            {/* Footer */}
            <div className="p-4 border-t flex justify-end">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="rounded-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtistModal;
