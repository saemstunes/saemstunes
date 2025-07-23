
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Track {
  id: string;
  title: string;
  artist?: string;
  audio_path: string;
  cover_path?: string;
  description?: string;
  created_at: string;
}

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  instructor: string;
  level: string;
  category: string;
  isLocked?: boolean;
}

interface RecommendationSectionProps {
  videos: VideoContent[];
  tracks: Track[];
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  videos,
  tracks
}) => {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: '1',
      title: 'Trending Now',
      description: 'Most popular content this week',
      icon: TrendingUp,
      items: [...videos.slice(0, 3), ...tracks.slice(0, 2)],
      color: 'text-red-500'
    },
    {
      id: '2',
      title: 'Recommended for You',
      description: 'Based on your listening history',
      icon: Sparkles,
      items: [...tracks.slice(0, 3), ...videos.slice(0, 2)],
      color: 'text-primary'
    },
    {
      id: '3',
      title: 'Recently Added',
      description: 'Fresh content just for you',
      icon: Clock,
      items: [...videos.slice(0, 2), ...tracks.slice(0, 3)],
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Recommendations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((section) => (
          <Card key={section.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <section.icon className={`h-5 w-5 ${section.color}`} />
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {'thumbnail_url' in item ? (
                        <img 
                          src={item.thumbnail_url} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img 
                          src={item.cover_path || '/placeholder.svg'} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {'instructor' in item ? item.instructor : item.artist}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {'duration' in item ? item.duration : 'Track'}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => navigate(`/${section.id === '1' ? 'videos' : section.id === '2' ? 'tracks' : 'resources'}`)}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
