
import { useState } from "react";
import { Infographic } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface InfographicCardProps {
  infographic: Infographic;
}

const InfographicCard = ({ infographic }: InfographicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (infographic.isLocked && (!user || !user.subscribed)) {
      toast({
        title: "Premium Content",
        description: "Please subscribe to access this resource.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/resources/${infographic.id}`);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={infographic.imageUrl} 
          alt={infographic.title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-105"
          )} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-14 w-14 rounded-full bg-black/50 backdrop-blur-sm hover:bg-gold hover:text-white transition-all"
            onClick={handleClick}
          >
            {infographic.isLocked && (!user || !user.subscribed) ? (
              <Lock className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {infographic.isLocked && (!user || !user.subscribed) && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gold text-white">Premium</Badge>
          </div>
        )}
        
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white capitalize">
            {infographic.level}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-3">
        <h3 className="font-medium line-clamp-1">{infographic.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {infographic.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfographicCard;
