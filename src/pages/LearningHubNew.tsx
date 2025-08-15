import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, BookOpen, Play, Music, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningHubNew = () => {
  const navigate = useNavigate();
  
  const newReleases = [
    {
      id: "african-rhythms",
      title: "African Rhythms Masterclass",
      description: "Explore traditional and contemporary African drum patterns",
      type: "course",
      level: "Intermediate",
      duration: "3 weeks",
      instructor: "Kwame O.",
      rating: 4.9,
      new: true
    },
    {
      id: "vocal-effects",
      title: "Advanced Vocal Effects",
      description: "Learn distortion, growls, and other vocal techniques",
      type: "course",
      level: "Advanced",
      duration: "2 weeks",
      instructor: "Sarah K.",
      rating: 4.8,
      new: true
    },
    {
      id: "producing-beats",
      title: "Beat Production Workshop",
      description: "Create professional beats from scratch",
      type: "video",
      duration: "45 min",
      instructor: "DJ Malik",
      rating: 4.7
    },
    {
      id: "guitar-solos",
      title: "Expressive Guitar Solos",
      description: "Techniques for emotive solo performances",
      type: "course",
      level: "Intermediate",
      duration: "4 weeks",
      instructor: "Carlos R.",
      rating: 4.8,
      new: true
    }
  ];
  
  const upcomingContent = [
    {
      id: "music-business",
      title: "Music Business Fundamentals",
      description: "Navigating the industry as an independent artist",
      release: "June 25"
    },
    {
      id: "live-performance",
      title: "Live Performance Techniques",
      description: "Captivate audiences with stage presence",
      release: "July 2"
    },
    {
      id: "sound-design",
      title: "Electronic Sound Design",
      description: "Create unique synth sounds and textures",
      release: "July 10"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-gold-dark mb-6">New Releases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-serif font-bold text-gold-dark mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-gold" />
              Recently Added
            </h3>
            
            <div className="space-y-6">
              {newReleases.map((item) => (
                <Card 
                  key={item.id} 
                  className={`group transition-all hover:shadow-lg ${item.new ? 'border-gold' : ''}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {item.title}
                          {item.new && (
                            <span className="ml-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                              NEW
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center ml-4">
                        <Star className="h-4 w-4 text-gold fill-current mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.type === "course" ? (
                          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <Play className="h-4 w-4 mr-2 text-purple-500" />
                        )}
                        <span className="text-sm">
                          {item.type === "course" ? 
                            `${item.level} • ${item.duration}` : 
                            `Video • ${item.duration}`
                          }
                        </span>
                      </div>
                      <span className="text-sm font-medium">{item.instructor}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-gold group-hover:text-white"
                      onClick={() => navigate(`/learning-hub/${item.id}`)}
                    >
                      {item.type === "course" ? "View Course" : "Watch Video"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-gradient-to-br from-gold/10 to-blue-500/10 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-serif font-bold text-gold-dark mb-4">Featured Course</h3>
              <div className="flex items-start mb-4">
                <Award className="h-6 w-6 mr-2 text-gold flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold">Music Production Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    12-week intensive program with industry experts
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Music className="h-4 w-4 mr-2 text-gold" />
                  <span>Comprehensive DAW training</span>
                </li>
                <li className="flex items-center">
                  <Music className="h-4 w-4 mr-2 text-gold" />
                  <span>Mixing and mastering techniques</span>
                </li>
                <li className="flex items-center">
                  <Music className="h-4 w-4 mr-2 text-gold" />
                  <span>Industry guest lectures</span>
                </li>
              </ul>
              <Button variant="gold" className="w-full">
                Learn More
              </Button>
            </div>
            
            <h3 className="text-xl font-serif font-bold text-gold-dark mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gold" />
              Coming Soon
            </h3>
            
            <div className="space-y-4">
              {upcomingContent.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg p-4 transition-all hover:bg-muted/50"
                >
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      Available {item.release}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gold"
                      onClick={() => navigate(`/coming-soon`)}
                    >
                      Notify Me
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            variant="gold" 
            className="mx-auto"
            onClick={() => navigate("/learning-hub/courses")}
          >
            Browse All Courses
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningHubNew;
