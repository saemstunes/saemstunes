import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SearchResult } from "@/lib/search";
import { Play, Clock } from "lucide-react";

interface TrackCardProps {
  result: SearchResult;
}

const TrackCard = ({ result }: TrackCardProps) => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={result.metadata?.cover_path || "/placeholder-track.jpg"}
              alt={result.title}
              className="w-16 h-16 rounded object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
              <Play className="h-6 w-6 text-white fill-current" />
            </button>
          </div>
          <div className="flex-1">
            <Link to={`/track/${result.metadata?.slug || result.source_id}`}>
              <h3 className="font-semibold hover:text-primary">{result.title}</h3>
            </Link>
            {result.metadata?.artist && (
              <p className="text-sm text-muted-foreground">{result.metadata.artist}</p>
            )}
            <p 
              className="text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap gap-1">
                {result.metadata?.access_level && (
                  <Badge variant={result.metadata.access_level === 'free' ? 'default' : 'outline'} className="text-xs">
                    {result.metadata.access_level}
                  </Badge>
                )}
              </div>
              {result.metadata?.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(result.metadata.duration)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
