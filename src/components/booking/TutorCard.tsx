
import { useState } from "react";
import { Tutor } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={tutor.avatar} alt={tutor.name} />
            <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-medium text-lg">{tutor.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-gold text-gold mr-1" />
                <span className="font-medium">{tutor.rating}</span>
              </div>
            </div>
            
            <div className="flex gap-1 flex-wrap mt-2">
              {tutor.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{tutor.bio}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">${tutor.hourlyRate}/hour</p>
              </div>
              
              <Button onClick={() => navigate(`/book/${tutor.id}`)} className="bg-gold hover:bg-gold-dark text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
