import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const LearningHubClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const upcomingClasses = [
    {
      id: "vocal-warmup",
      title: "Daily Vocal Warmup",
      description: "Start your day with proper vocal exercises",
      date: "Today",
      time: "10:00 AM",
      duration: "45 min",
      instructor: "Sarah K.",
      attendees: 24,
      maxAttendees: 30
    },
    {
      id: "piano-chords",
      title: "Piano Chord Progressions",
      description: "Learn essential chord patterns for popular songs",
      date: "Tomorrow",
      time: "2:00 PM",
      duration: "60 min",
      instructor: "Michael T.",
      attendees: 18,
      maxAttendees: 25
    },
    {
      id: "songwriting",
      title: "Songwriting Workshop",
      description: "Collaborative session for songwriters",
      date: "June 15",
      time: "4:00 PM",
      duration: "90 min",
      instructor: "Lisa G.",
      attendees: 12,
      maxAttendees: 20
    }
  ];
  
  const recordedClasses = [
    {
      id: "breathing-techniques",
      title: "Breathing Techniques",
      description: "Master diaphragmatic breathing for better vocals",
      date: "May 20, 2024",
      duration: "52 min",
      instructor: "Sarah K.",
      rating: 4.8
    },
    {
      id: "music-theory",
      title: "Music Theory Fundamentals",
      description: "Understand scales, keys, and harmony",
      date: "May 12, 2024",
      duration: "48 min",
      instructor: "David M.",
      rating: 4.7
    },
    {
      id: "guitar-basics",
      title: "Guitar for Beginners",
      description: "Learn your first chords and strumming patterns",
      date: "April 30, 2024",
      duration: "65 min",
      instructor: "Carlos R.",
      rating: 4.9
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-gold-dark mb-4">Live Classes</h2>
        <p className="text-muted-foreground mb-6">
          Join interactive live sessions with our expert instructors
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[300px] mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingClasses.map((cls) => (
                <Card key={cls.id} className="group transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{cls.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gold" />
                        <span>{cls.date} at {cls.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gold" />
                        <span>{cls.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gold" />
                        <span>{cls.attendees}/{cls.maxAttendees} spots left</span>
                      </div>
                      <div className="pt-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(cls.attendees / cls.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="gold" 
                      className="w-full"
                      onClick={() => navigate(`/book/${cls.id}`)}
                    >
                      Join Class
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recorded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recordedClasses.map((cls) => (
                <Card key={cls.id} className="group transition-all hover:shadow-lg">
                  <div className="aspect-video bg-muted rounded-t-xl relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{cls.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gold" />
                        <span>{cls.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gold" />
                        <span>{cls.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gold" />
                        <span>Instructor: {cls.instructor}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-gold group-hover:text-white"
                      onClick={() => navigate(`/learning-hub/videos/${cls.id}`)}
                    >
                      Watch Recording
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-gradient-to-r from-gold/10 to-transparent p-6 rounded-xl mb-6">
        <h3 className="text-xl font-serif font-bold text-gold-dark mb-4">Schedule Private Lessons</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Get personalized 1:1 instruction with our expert teachers. Tailored to your goals and schedule.
        </p>
        <Button 
          variant="gold" 
          onClick={() => navigate("/book-tutor")}
        >
          Book a Private Lesson
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningHubClasses;
