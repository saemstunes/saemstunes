
import React from 'react';
import { X, MapPin, Calendar, Users, Star, Music, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: 'bio' | 'location' | 'genre' | 'stats' | 'social' | 'achievements';
}

const ArtistModal: React.FC<ArtistModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type
}) => {
  const renderContent = () => {
    switch (type) {
      case 'bio':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">About the Artist</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {data.bio || 'No biography available for this artist.'}
            </p>
            {data.verified_status && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-lg font-medium">{data.location || 'Location not specified'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Based in this location
              </p>
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
              {data.genre?.map((g: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {g}
                </Badge>
              )) || <p className="text-muted-foreground">No genres specified</p>}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.follower_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.track_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Tracks</div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Connect</h3>
            </div>
            <div className="space-y-2">
              {data.social_links && Object.keys(data.social_links).length > 0 ? (
                Object.entries(data.social_links).map(([platform, url]) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(url as string, '_blank')}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground">No social links available</p>
              )}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Achievements</h3>
            </div>
            <div className="space-y-3">
              {data.verified_status && (
                <div className="flex items-center gap-3 p-3 bg-gold/10 rounded-lg">
                  <Star className="h-5 w-5 text-gold" />
                  <div>
                    <div className="font-medium">Verified Artist</div>
                    <div className="text-sm text-muted-foreground">
                      Official verification status
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Member Since</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(data.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
              "relative bg-background border rounded-lg shadow-xl",
              "w-full max-w-md max-h-[80vh] overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="p-4 max-h-[60vh]">
              {renderContent()}
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtistModal;
