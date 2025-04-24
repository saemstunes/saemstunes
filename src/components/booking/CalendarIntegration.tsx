
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, XCircle, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CalendarIntegrationProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
  instructorAvailability?: string[]; // Days of the week the instructor is available
  bookedDates?: Date[]; // Dates that are already booked
  className?: string;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const CalendarIntegration = ({
  onDateSelect,
  selectedDate,
  instructorAvailability = ["Monday", "Wednesday", "Friday"],
  bookedDates = [],
  className,
}: CalendarIntegrationProps) => {
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [calendarConnected, setCalendarConnected] = useState<boolean>(false);

  // Check if a date is already booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate()
    );
  };

  // Function to connect to external calendars
  const connectCalendar = (service: "google" | "apple") => {
    // This would typically involve OAuth flow
    toast({
      title: `Connect to ${service === "google" ? "Google" : "Apple"} Calendar`,
      description: "Calendar connected successfully. Your availability has been synced.",
    });
    setCalendarConnected(true);
  };

  // Mock data for booked time slots
  const bookedTimeSlots = ["10:00 AM", "3:00 PM"];

  // Check if time slot is available
  const isTimeSlotAvailable = (slot: string) => {
    return !bookedTimeSlots.includes(slot);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-proxima">Calendar</CardTitle>
          <CardDescription>
            Select a date and time for your session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar Connection */}
          {!calendarConnected && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium mb-2">Connect your calendar</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your personal calendar to see your availability alongside instructor availability.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => connectCalendar("google")}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="h-4 w-4" alt="Google Calendar" />
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  size="sm" 
                  className="gap-2"
                  onClick={() => connectCalendar("apple")}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Apple Calendar
                </Button>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <div className="mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-gold" />
              <h3 className="font-medium">Select Date</h3>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateSelect}
                  disabled={(date) => {
                    // Disable past dates
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    
                    // Disable dates that don't match instructor availability
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    if (!instructorAvailability.includes(dayName)) return true;
                    
                    // Disable dates that are fully booked
                    return isDateBooked(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="mt-2">
              <div className="flex gap-x-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  Available
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted"></span>
                  Unavailable
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Selected
                </div>
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <div className="mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gold" />
                <h3 className="font-medium">Select Time</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const available = isTimeSlotAvailable(slot);
                  return (
                    <Button
                      key={slot}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      className={cn(
                        "justify-center",
                        selectedTimeSlot === slot && "bg-gold hover:bg-gold/90",
                        !available && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={!available}
                      onClick={() => setSelectedTimeSlot(available ? slot : null)}
                    >
                      {slot}
                      {!available && <XCircle className="ml-1 h-3 w-3" />}
                      {selectedTimeSlot === slot && <Check className="ml-1 h-3 w-3" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Schedule Summary */}
          {selectedDate && selectedTimeSlot && (
            <div className="bg-muted/30 p-4 rounded-lg mt-4 border border-border">
              <h4 className="font-medium mb-2">Selected Session</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <Badge variant="outline" className="bg-gold/10 text-gold">
                  {selectedTimeSlot}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            onDateSelect(undefined);
            setSelectedTimeSlot(null);
          }}>
            Clear
          </Button>
          <Button 
            className="bg-gold hover:bg-gold/90 text-white"
            disabled={!selectedDate || !selectedTimeSlot}
            onClick={() => {
              toast({
                title: "Session Scheduled",
                description: `Your session has been scheduled for ${format(selectedDate!, "PPP")} at ${selectedTimeSlot}.`,
              });
            }}
          >
            Confirm Schedule
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CalendarIntegration;
