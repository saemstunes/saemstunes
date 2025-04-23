
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockTutors, mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { Calendar, Mail, Music, Video, Star, MapPin } from "lucide-react";

const ArtistProfile = () => {
  const { id } = useParams();
  
  // Find tutor with matching id from mockData
  // In a real app, you would fetch this from your API
  const tutor = mockTutors.find(tutor => tutor.id === id) || mockTutors[0];
  
  // Filter videos for this tutor
  const tutorVideos = mockVideos.slice(0, 4);
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Artist Banner */}
        <div className="relative rounded-lg bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative z-10 p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                <AvatarImage src={tutor.avatar} alt={tutor.name} />
                <AvatarFallback>{tutor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">{tutor.name}</h1>
                <p className="text-muted-foreground mt-1">{tutor.specialties.join(', ')}</p>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-1 text-sm">(4.0)</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-gold hover:bg-gold-dark text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Lesson
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artist Info & Content */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium mb-4">Biography</h2>
                <p className="text-muted-foreground">
                  {tutor.bio || `${tutor.name} is a talented music instructor with years of experience in teaching 
                  ${tutor.specialties.join(', ')}. They are passionate about helping students reach their 
                  musical potential through personalized instruction and engaging learning experiences.`}
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Expertise</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  {tutor.specialties.map((specialty, i) => (
                    <li key={i}>{specialty}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="font-medium mb-4">Quick Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm">Location</p>
                        <p className="text-sm font-medium">Nairobi, Kenya</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Music className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm">Experience</p>
                        <p className="text-sm font-medium">5+ years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Video className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm">Lessons</p>
                        <p className="text-sm font-medium">In-person & Virtual</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Star className="h-4 w-4 text-muted-foreground mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm">Rating</p>
                        <p className="text-sm font-medium">4.0 out of 5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lessons" className="p-4">
            <h2 className="text-xl font-medium mb-4">Featured Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tutorVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="p-4">
            <div className="text-center py-16">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Courses Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                This instructor hasn't published any courses yet. Check back soon!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="p-4">
            <div className="text-center py-16">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Schedule a Lesson</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Book a private or group session with this instructor
              </p>
              <Button 
                onClick={() => window.location.href = `/book/${tutor.id}`}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                View Available Times
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ArtistProfile;
