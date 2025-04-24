
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle, Music, Video, Bell, Bookmark, Award, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Community = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("discussions");

  // Sample community data
  const discussions = [
    {
      id: '1',
      title: 'Tips for improving vocal range?',
      author: "MelodyMaker",
      authorAvatar: "/placeholder.svg",
      replies: 24,
      lastActive: "2 hours ago",
      isPopular: true
    },
    {
      id: '2',
      title: 'Sheet music recommendations for intermediate piano',
      author: "PianoPlayer22",
      authorAvatar: "/placeholder.svg",
      replies: 18,
      lastActive: "5 hours ago",
      isPopular: false
    },
    {
      id: '3',
      title: 'How to overcome performance anxiety',
      author: "StageFright",
      authorAvatar: "/placeholder.svg",
      replies: 32,
      lastActive: "1 day ago",
      isPopular: true
    },
    {
      id: '4',
      title: 'Best budget microphones for home recording?',
      author: "HomeProducer",
      authorAvatar: "/placeholder.svg",
      replies: 15,
      lastActive: "2 days ago",
      isPopular: false
    }
  ];

  const events = [
    {
      id: 1,
      title: "Virtual Open Mic Night",
      date: "Fri, May 15 • 7:00 PM",
      attendees: 42,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Music Theory Workshop",
      date: "Sat, May 23 • 3:00 PM",
      attendees: 28,
      image: "/placeholder.svg"
    }
  ];
  
  const featuredArtists = [
    {
      id: 1,
      name: "Sarah Williams",
      instrument: "Violin",
      followers: 324,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "James Rodriguez",
      instrument: "Guitar",
      followers: 287,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Mia Chen",
      instrument: "Piano",
      followers: 412,
      image: "/placeholder.svg"
    }
  ];
  
  const DiscussionCard = ({ discussion }) => (
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={discussion.authorAvatar} />
            <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium hover:text-gold cursor-pointer flex items-center">
              {discussion.title}
              {discussion.isPopular && (
                <Badge variant="outline" className="ml-2 text-xs bg-gold/10">
                  Popular
                </Badge>
              )}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2 flex-wrap">
              <span>{discussion.author}</span>
              <span>•</span>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{discussion.replies}</span>
              </div>
              <span>•</span>
              <span>{discussion.lastActive}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="hidden sm:block">
          View
        </Button>
      </div>
    </div>
  );
  
  const EventCard = ({ event }) => (
    <div className="flex gap-3 items-center mb-4">
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded bg-muted overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{event.title}</h4>
        <p className="text-sm text-muted-foreground">{event.date}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Users className="h-3 w-3" />
          <span>{event.attendees} attending</span>
        </div>
      </div>
      <Button variant="outline" size="sm">
        Join
      </Button>
    </div>
  );
  
  const ArtistCard = ({ artist }) => (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={artist.image} />
        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-medium">{artist.name}</h4>
        <p className="text-xs text-muted-foreground">{artist.instrument}</p>
      </div>
      <Button variant="outline" size="sm">
        Follow
      </Button>
    </div>
  );

  return (
    <MainLayout>
      {isMobile ? (
        // Mobile Layout (Tab-based)
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold">Community</h1>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <MessageCircle className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          
          <Tabs defaultValue="discussions" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="discussions">
                <MessageCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Discussions</span>
              </TabsTrigger>
              <TabsTrigger value="events">
                <Bell className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="featured">
                <Award className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Featured</span>
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussions" className="pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-gold" />
                    Recent Discussions
                  </CardTitle>
                  <CardDescription>
                    Join conversations or start your own thread
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {discussions.map(discussion => (
                      <DiscussionCard key={discussion.id} discussion={discussion} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gold" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Join virtual and in-person music events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    
                    <Separator className="my-4" />
                    
                    <div className="text-center">
                      <Button className="bg-gold hover:bg-gold-dark text-white">
                        Browse All Events
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="featured" className="pt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold" />
                    Featured Artists
                  </CardTitle>
                  <CardDescription>
                    Connect with talented musicians in our community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featuredArtists.map(artist => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                    
                    <Separator className="my-4" />
                    
                    <div className="text-center">
                      <Button variant="outline">
                        View All Artists
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved" className="pt-2">
              <div className="text-center py-12">
                <div className="bg-muted/30 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No saved items</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Bookmark discussions, events, and featured content to access them quickly later.
                </p>
                <Button 
                  variant="outline"
                  className="border-gold text-gold"
                >
                  Browse Community
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Desktop Layout
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
                    {discussions.map(discussion => (
                      <DiscussionCard key={discussion.id} discussion={discussion} />
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
                    <Bell className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Join virtual and in-person music events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View All Events
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Featured Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {featuredArtists.map(artist => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => window.location.href = "/learning-hub"}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Beginner Music Theory
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => window.location.href = "/learning-hub"}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      Instrument Guides
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left" 
                      onClick={() => window.location.href = "/learning-hub"}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Practice Tips
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Community;
