
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { mockTutors } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import CalendarIntegration from "@/components/booking/CalendarIntegration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookTutor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const tutor = mockTutors.find((t) => t.id === id);
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sessionType, setSessionType] = useState<string>("individual");
  const [location, setLocation] = useState<string>("online");
  const [notes, setNotes] = useState<string>("");
  
  const handleBooking = () => {
    if (!date) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a date and time for your session.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Booking Request Sent",
      description: "Your booking request has been sent to the tutor.",
    });
    
    navigate("/bookings");
  };
  
  if (!tutor) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Tutor Not Found</h2>
          <p className="text-muted-foreground mt-2">The tutor you're looking for does not exist.</p>
          <Button 
            onClick={() => navigate("/bookings")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/bookings")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book a Session with {tutor.name}</CardTitle>
              <CardDescription>
                Choose your preferred date, time, and session type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calendar Integration */}
              <CalendarIntegration
                onDateSelect={setDate}
                selectedDate={date}
                instructorAvailability={tutor.availability}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual (1-on-1)</SelectItem>
                      <SelectItem value="group">Small Group (2-5)</SelectItem>
                      <SelectItem value="workshop">Workshop (6+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Tell the tutor what you'd like to focus on in your session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBooking}
                className="bg-gold hover:bg-gold/90 text-white"
                disabled={!date}
              >
                Book Session (${tutor.hourlyRate}.00)
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tutor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={tutor.avatar} alt={tutor.name} />
                  <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{tutor.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 fill-gold text-gold mr-1" />
                    <span className="text-sm">{tutor.rating} rating</span>
                  </div>
                </div>
              </div>

              <p className="text-sm">{tutor.bio}</p>

              <div>
                <h4 className="text-sm font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-muted/50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Availability</h4>
                <div className="flex flex-wrap gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <Badge 
                      key={day} 
                      variant={tutor.availability.includes(day) ? "secondary" : "outline"}
                      className={tutor.availability.includes(day) 
                        ? "bg-gold/10 text-gold-dark" 
                        : "bg-muted/30 text-muted-foreground"
                      }
                    >
                      {day.substring(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Session Rate</h4>
                    <p className="text-2xl font-bold">${tutor.hourlyRate}</p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">60 minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookTutor;
