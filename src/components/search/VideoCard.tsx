import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SearchResult } from "@/lib/search";
import { Play } from "lucide-react";

interface VideoCardProps {
  result: SearchResult;
}

const VideoCard = ({ result }: VideoCardProps) => {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <img
          src={result.metadata?.thumbnail_url || "/placeholder-video.jpg"}
          alt={result.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Play className="h-8 w-8 text-white fill-current" />
        </div>
        {result.metadata?.duration && (
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
            {Math.floor(result.metadata.duration / 60)}:
            {(result.metadata.duration % 60).toString().padStart(2, '0')}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link to={`/video/${result.source_id}`}>
          <h3 className="font-semibold hover:text-primary line-clamp-2">{result.title}</h3>
        </Link>
        <p 
          className="text-sm text-muted-foreground mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: result.snippet }}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {result.metadata?.category && (
            <Badge variant="secondary" className="text-xs">
              {result.metadata.category}
            </Badge>
          )}
          {result.metadata?.access_level && (
            <Badge variant={result.metadata.access_level === 'free' ? 'default' : 'outline'} className="text-xs">
              {result.metadata.access_level}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
