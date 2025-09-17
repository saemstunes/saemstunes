import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SearchResult } from "@/lib/search";
import { Star, DollarSign } from "lucide-react";

interface TutorCardProps {
  result: SearchResult;
}

const TutorCard = ({ result }: TutorCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <Link to={`/tutor/${result.source_id}`}>
              <h3 className="font-semibold hover:text-primary">Tutor Profile</h3>
            </Link>
            <p 
              className="text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {result.metadata?.is_verified && (
                <Badge variant="default" className="text-xs">
                  Verified
                </Badge>
              )}
              {result.metadata?.hourly_rate && (
                <Badge variant="outline" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {result.metadata.hourly_rate}/hr
                </Badge>
              )}
              {result.metadata?.average_rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {result.metadata.average_rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
