import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SearchResult } from "@/lib/search";
import { Star, Users, Clock } from "lucide-react";

interface CourseCardProps {
  result: SearchResult;
}

const CourseCard = ({ result }: CourseCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Link to={`/course/${result.source_id}`}>
          <h3 className="font-semibold hover:text-primary">{result.title}</h3>
        </Link>
        <p 
          className="text-sm text-muted-foreground mt-1"
          dangerouslySetInnerHTML={{ __html: result.snippet }}
        />
        
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {result.metadata?.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{result.metadata.average_rating.toFixed(1)}</span>
            </div>
          )}
          
          {result.metadata?.enrollment_count > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{result.metadata.enrollment_count}</span>
            </div>
          )}
          
          {result.metadata?.estimated_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{result.metadata.estimated_time}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {result.metadata?.level && (
            <Badge variant="secondary" className="text-xs">
              {result.metadata.level}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
