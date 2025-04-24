import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Library as LibraryIcon, BookOpen, Bookmark, Clock, Music, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Library = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");

  // Sample saved content data (would come from API in a real app)
  const savedVideos = mockVideos.slice(0, 4);
  const saemOfferings = mockVideos.slice(4, 8).map(video => ({...video, isExclusive: true}));
  
  // Sample courses data
  const courses = [
    {
      id: "course1",
      title: "Beginner Piano Masterclass",
      description: "Learn piano fundamentals from scratch",
      instructor: "Saem Khalid",
      duration: "8 weeks",
      level: "beginner",
      thumbnail: "/placeholder.svg",
      enrolled: true,
      progress: 35
    },
    {
      id: "course2",
      title: "Vocal Development for Pop Music",
      description: "Discover your unique voice and expand your range",
      instructor: "Lisa Wong",
      duration: "6 weeks",
      level: "intermediate",
      thumbnail: "/placeholder.svg",
      enrolled: true,
      progress: 72
    },
    {
      id: "course3",
      title: "Music Production Fundamentals",
      description: "Learn to produce professional tracks from home",
      instructor: "James Rodriguez",
      duration: "10 weeks",
      level: "beginner",
      thumbnail: "/placeholder.svg",
      enrolled: false,
      progress: 0
    },
    {
      id: "course4",
      title: "Advanced Guitar Techniques",
      description: "Take your guitar skills to the next level",
      instructor: "Saem Khalid",
      duration: "12 weeks",
      level: "advanced",
      thumbnail: "/placeholder.svg",
      enrolled: false,
      progress: 0
    }
  ];
  
  const EmptyState = ({ title, description, icon: Icon }) => (
    <div className="text-center py-16">
      <div className="bg-muted/30 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      <Button 
        onClick={() => window.location.href = "/discover"}
        className="bg-gold hover:bg-gold-dark text-white"
      >
        Explore Content
      </Button>
    </div>
  );

  const CourseCard = ({ course }) => (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className={course.enrolled ? "bg-green-600" : "bg-gold"}>
            {course.enrolled ? "Enrolled" : "Premium"}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white capitalize">
            {course.level}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Instructor: {course.instructor}</span>
          <span>{course.duration}</span>
        </div>
        {course.enrolled && (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground mb-1 flex justify-between">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <Button 
          className={cn("w-full", course.enrolled ? "bg-gold hover:bg-gold-dark" : "bg-muted-foreground")}
        >
          {course.enrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </div>
    </Card>
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-proxima font-bold">Saem's Library</h1>
            <p className="text-muted-foreground mt-1">
              Exclusive content created by Saem's Tunes instructors
            </p>
          </div>
          {user && (
            <Button
              variant="outline"
              onClick={() => window.location.href = "/discover"}
              className="hidden sm:flex"
            >
              <Music className="mr-2 h-4 w-4" />
              Discover More
            </Button>
          )}
        </div>
        
        {/* Featured Saem's content */}
        <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-gold/70 to-brown/70 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
          <img 
            src="/placeholder.svg" 
            alt="Featured Saem's content" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-end">
            <div className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit">
              EXCLUSIVE
            </div>
            <h3 className="text-xl md:text-2xl font-proxima text-white font-bold mb-1">
              Master Class: Advanced Guitar Techniques
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Learn advanced techniques from Saem's top instructor
            </p>
          </div>
        </div>
        
        {/* Music Courses Section */}
        <div className="mb-8">
          <h2 className="text-xl font-proxima font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 text-gold mr-2" />
            Music Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
        
        {/* Saem's exclusive content */}
        <div className="mb-8">
          <h2 className="text-xl font-proxima font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 text-gold mr-2" />
            Exclusive Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {saemOfferings.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="saved">
              <Bookmark className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="playlists">
              <LibraryIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Playlists</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="pt-4">
            {savedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Saved Content" 
                description="Start saving videos, lessons, and resources to access them quickly in your library."
                icon={Bookmark}
              />
            )}
          </TabsContent>
          
          <TabsContent value="courses" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courses.filter(course => course.enrolled).map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <EmptyState 
              title="No Viewing History" 
              description="Your recently watched Saem's content will appear here."
              icon={Clock}
            />
          </TabsContent>
          
          <TabsContent value="playlists" className="pt-4">
            <EmptyState 
              title="No Playlists" 
              description="Create playlists to organize your favorite Saem's content."
              icon={LibraryIcon}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Library;
