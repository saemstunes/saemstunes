import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SearchResult } from "@/lib/search";

interface ArtistCardProps {
  result: SearchResult;
}

const ArtistCard = ({ result }: ArtistCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={result.metadata?.profile_image || "/placeholder-artist.jpg"}
            alt={result.title}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <Link to={`/artist/${result.metadata?.slug}`}>
              <h3 className="font-semibold hover:text-primary">{result.title}</h3>
            </Link>
            <p 
              className="text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {result.metadata?.genre?.slice(0, 3).map((g: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
              {result.metadata?.location && (
                <Badge variant="outline" className="text-xs">
                  {result.metadata.location}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
