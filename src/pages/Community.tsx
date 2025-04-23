
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle, Music, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Community = () => {
  const { user } = useAuth();

  // Sample community data
  const communitySpaces = [
    {
      id: 1,
      title: "Beginner's Corner",
      description: "A supportive space for those just starting their musical journey",
      members: 542,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Vocal Techniques",
      description: "Share tips and get feedback on vocal exercises and performances",
      members: 328,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Piano Maestros",
      description: "Connect with fellow pianists and keyboard enthusiasts",
      members: 267,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Music Theory",
      description: "Discuss the theoretical aspects of music and composition",
      members: 189,
      image: "/placeholder.svg"
    }
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: "Tips for improving vocal range?",
      author: "MelodyMaker",
      replies: 24,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      title: "Sheet music recommendations for intermediate piano",
      author: "PianoPlayer22",
      replies: 18,
      lastActive: "5 hours ago"
    },
    {
      id: 3,
      title: "How to overcome performance anxiety",
      author: "StageFright",
      replies: 32,
      lastActive: "1 day ago"
    }
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold">Community</h1>
          <Button className="bg-gold hover:bg-gold-dark text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            New Discussion
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Recent Discussions
                </CardTitle>
                <CardDescription>
                  Join the conversation or start your own thread
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDiscussions.map(discussion => (
                    <div key={discussion.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium hover:text-gold cursor-pointer">{discussion.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>By {discussion.author}</span>
                            <span className="mx-2">•</span>
                            <span>{discussion.replies} replies</span>
                            <span className="mx-2">•</span>
                            <span>Active {discussion.lastActive}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Discussions
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="mr-2 h-5 w-5" />
                  Student Showcases
                </CardTitle>
                <CardDescription>
                  Recent performances and progress from fellow students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-border rounded-lg p-4 flex items-center">
                    <div className="aspect-square w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                      <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">First Piano Recital</h4>
                      <p className="text-sm text-muted-foreground">By SarahKeys • 2 days ago</p>
                      <p className="text-sm mt-1">Sharing my progress after 3 months of lessons!</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View More Showcases
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Community Spaces
                </CardTitle>
                <CardDescription>
                  Join groups based on your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communitySpaces.map(space => (
                    <div key={space.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={space.image} />
                          <AvatarFallback>{space.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{space.title}</h4>
                          <p className="text-xs text-muted-foreground">{space.members} members</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming community events</p>
                  <Button className="mt-4 bg-gold hover:bg-gold-dark text-white">
                    Create Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
