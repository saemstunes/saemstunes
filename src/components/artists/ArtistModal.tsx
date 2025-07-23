
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
  type: string;
}

const ArtistModal: React.FC<ArtistModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  type
}) => {
  const renderContent = () => {
    switch (type) {
      case 'bio':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {content || 'No biography available for this artist.'}
            </p>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">{content || 'Location not specified'}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is where the artist is based and creates their music.
            </p>
          </div>
        );
      
      case 'genre':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Array.isArray(content) ? content.map((genre, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {genre}
                </Badge>
              )) : (
                <Badge variant="secondary">Genre not specified</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              These genres represent the artist's musical style and influences.
            </p>
          </div>
        );
      
      case 'social':
        return (
          <div className="space-y-4">
            {content && typeof content === 'object' && Object.keys(content).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(content).map(([platform, url]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium capitalize">{platform}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={url as string} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No social links available for this artist.</p>
            )}
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Followers</span>
                </div>
                <p className="text-2xl font-bold">{content?.followers || 0}</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="font-medium">Verified</span>
                </div>
                <p className="text-2xl font-bold">{content?.verified ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {content?.joinDate && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Joined</span>
                </div>
                <p className="text-lg font-semibold">
                  {new Date(content.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Content not available</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistModal;
