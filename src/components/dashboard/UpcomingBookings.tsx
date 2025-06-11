
import { useAuth } from "@/context/AuthContext";
import { mockBookings, mockTutors } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface UpcomingBookingsProps {
  limit?: number;
}

const UpcomingBookings = ({ limit = 3 }: UpcomingBookingsProps) => {
  const { user } = useAuth();

  // Get user's bookings and filter for upcoming ones
  const getUserBookings = () => {
    // If not logged in or no user, return empty array
    if (!user) return [];

    const now = new Date();
    let userBookings = mockBookings
      .filter((booking) => {
        const bookingDate = new Date(`${booking.date}T${booking.time}`);
        return (
          // For regular users - find bookings they booked
          (user.role === "user" && booking.studentId === user.id) ||
          // For moderators and admins - they can see relevant bookings
          (user.role === "moderator" && booking.tutorId === user.id) ||
          // Admins can see all bookings
          user.role === "admin"
        );
      })
      .filter((booking) => {
        const bookingDate = new Date(`${booking.date}T${booking.time}`);
        return bookingDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

    return userBookings.slice(0, limit);
  };

  const bookings = getUserBookings();

  // Function to get tutor details for a booking
  const getTutorDetails = (tutorId: string) => {
    return mockTutors.find((tutor) => tutor.id === tutorId);
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted" />
            <h3 className="mt-4 text-lg font-medium">No Upcoming Bookings</h3>
            <p className="text-muted-foreground text-sm mt-2">
              You have no scheduled lessons at the moment.
            </p>
            <Button className="mt-4 bg-gold hover:bg-gold-dark text-white">
              Book a Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const tutor = getTutorDetails(booking.tutorId);
        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-gold/10 p-3 rounded-full">
                  {booking.location === "online" ? (
                    <Video className="h-6 w-6 text-gold" />
                  ) : (
                    <Calendar className="h-6 w-6 text-gold" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-medium">
                        {booking.type === "individual" 
                          ? "Private Session" 
                          : booking.type === "group" 
                            ? "Group Class" 
                            : "Workshop"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(`${booking.date}T${booking.time}`))}
                      </p>
                    </div>
                    
                    {tutor && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{tutor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tutor.specialties[0]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>1 hour</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{booking.location}</span>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        className={booking.location === "online" 
                          ? "bg-gold hover:bg-gold-dark text-white" 
                          : "bg-muted hover:bg-muted/80"
                        }
                      >
                        {booking.location === "online" ? "Join" : "Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UpcomingBookings;
