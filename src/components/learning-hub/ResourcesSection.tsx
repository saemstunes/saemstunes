import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Bookmark, Download, Lock, FileText, Volume2, Image } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';

interface ResourcesSectionProps {
  resources: any[];
  categories: any[];
  userInteractions: Record<string, any>;
  searchTerm: string;
  categoryFilter: string;
  levelFilter: string;
  sortBy: string;
  onResourceSelect: (resourceId: string, action: string) => void;
}

const ResourcesSection = ({
  resources,
  categories,
  userInteractions,
  searchTerm,
  categoryFilter,
  levelFilter,
  sortBy,
  onResourceSelect
}: ResourcesSectionProps) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Filter and sort resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || resource.category_id === categoryFilter;
    const matchesLevel = levelFilter === 'all' || resource.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getAccessStatus = (resource: any) => {
    const requiredLevel = resource.access_level || 'free';
    const userLevel = user?.subscriptionTier || subscription?.tier || 'free';
    
    if (requiredLevel === 'free') return true;
    if (!user) return false;
    
    const accessLevels = ['free', 'basic', 'premium', 'professional'];
    return accessLevels.indexOf(userLevel) >= accessLevels.indexOf(requiredLevel);
  };

  const getResourceIcon = (resource: any) => {
    if (resource.audio_url) return Volume2;
    if (resource.thumbnail_url) return Image;
    return FileText;
  };

  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No resources found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map(resource => {
        const hasAccess = getAccessStatus(resource);
        const interaction = userInteractions[resource.id];
        const category = categories.find(c => c.id === resource.category_id);
        const ResourceIcon = getResourceIcon(resource);

        return (
          <Card key={resource.id} className="group transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-muted rounded-md relative overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80">
                  <ResourceIcon className="h-8 w-8 text-white" />
                </div>
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}
                {interaction?.bookmarked && (
                  <div className="absolute top-2 right-2">
                    <Bookmark className="h-4 w-4 text-gold fill-current" />
                  </div>
                )}
              </div>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate max-w-[70%]">{resource.title}</span>
                {resource.access_level !== 'free' && (
                  <Badge variant="secondary">
                    {resource.access_level}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="truncate">
                {resource.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                  {resource.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {category?.name || 'Uncategorized'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Download className="h-3 w-3 mr-1" />
                  <span>{resource.downloads || 0} downloads</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{interaction?.viewed ? 'Viewed' : 'New'}</span>
                </div>
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {resource.tags.slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {resource.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{resource.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Button
                className="flex-1"
                variant={hasAccess ? "default" : "outline"}
                onClick={() => onResourceSelect(resource.id, 'view')}
                disabled={!hasAccess}
              >
                {hasAccess ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </>
                ) : (
                  "Upgrade to Access"
                )}
              </Button>
              {hasAccess && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResourceSelect(resource.id, 'bookmark')}
                >
                  <Bookmark className={`h-4 w-4 ${interaction?.bookmarked ? 'fill-current text-gold' : ''}`} />
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ResourcesSection;