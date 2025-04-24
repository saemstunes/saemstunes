
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Compass, Search, Music, Mic, User, BookOpen } from "lucide-react";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { useNavigate } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Discover = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("music");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState([
    "Piano lessons", "Guitar chords", "Music theory", "Vocal techniques"
  ]);
  
  const handleFeaturedClick = () => {
    navigate("/learning-hub/advanced-guitar-techniques");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-proxima font-bold">Discover</h1>
            <p className="text-muted-foreground mt-1">
              Explore curated content from across the musical world
            </p>
          </div>
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for music, courses, artists..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => navigate('/search', { state: { initialQuery: searchQuery }})}
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-card shadow-lg rounded-md mt-1 p-2 z-10">
                <div className="text-xs text-muted-foreground mb-2">Recent searches</div>
                {recentSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => {
                      setSearchQuery(search);
                      navigate('/search', { state: { initialQuery: search }});
                    }}
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Featured content banner - Now clickable */}
        <div 
          className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-gold/30 to-gold-dark/30 mb-8 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleFeaturedClick}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
          <img 
            src="/placeholder.svg" 
            alt="Featured content" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-end">
            <div className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit">
              FEATURED
            </div>
            <h3 className="text-xl md:text-2xl font-proxima text-white font-bold mb-1">
              Discover Top Music Schools Around the World
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Explore the institutions that have produced the world's greatest musicians
            </p>
          </div>
        </div>
        
        {/* Category Navigation */}
        <NavigationMenu className="max-w-none w-full justify-start mb-6">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-muted/50">Instruments</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {["Piano", "Guitar", "Drums", "Violin", "Saxophone", "Flute", "Bass", "Trumpet"].map((item) => (
                    <li key={item}>
                      <NavigationMenuLink asChild>
                        <a
                          href={`#${item.toLowerCase()}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Discover {item.toLowerCase()} lessons, techniques, and performances
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-muted/50">Genres</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {["Classical", "Jazz", "Rock", "Pop", "Hip Hop", "R&B", "Electronic", "Folk"].map((item) => (
                    <li key={item}>
                      <NavigationMenuLink asChild>
                        <a
                          href={`#${item.toLowerCase().replace(" ", "-")}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explore {item.toLowerCase()} music theory, history, and performances
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#skills"
                  className={cn(navigationMenuTriggerStyle(), "bg-muted/50")}
                >
                  Skills
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <Tabs defaultValue="music" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="music">
              <Music className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="artists">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Artists</span>
            </TabsTrigger>
            <TabsTrigger value="courses">
              <Mic className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">External Courses</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="music" className="pt-4">
            <h2 className="text-xl font-proxima font-semibold mb-4">Popular Music Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.slice(0, 8).map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => navigate(`/videos/${video.id}`)}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/videos')}
                className="border-gold text-gold hover:bg-gold/10"
              >
                View All Music
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="artists" className="pt-4">
            <h2 className="text-xl font-proxima font-semibold mb-4">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Artist cards */}
              <ArtistCard 
                name="John Williams"
                role="Film Composer"
                imageSrc="/placeholder.svg"
                onClick={() => navigate('/artist/john-williams')}
              />
              <ArtistCard 
                name="Alicia Keys"
                role="Singer-Songwriter"
                imageSrc="/placeholder.svg"
                onClick={() => navigate('/artist/alicia-keys')}
              />
              <ArtistCard 
                name="Hans Zimmer"
                role="Composer"
                imageSrc="/placeholder.svg"
                onClick={() => navigate('/artist/hans-zimmer')}
              />
              <ArtistCard 
                name="Yo-Yo Ma"
                role="Cellist"
                imageSrc="/placeholder.svg"
                onClick={() => navigate('/artist/yo-yo-ma')}
              />
            </div>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/artists')}
                className="border-gold text-gold hover:bg-gold/10"
              >
                View All Artists
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="pt-4">
            <h2 className="text-xl font-proxima font-semibold mb-4">External Educational Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.filter(v => v.category === "Vocal Development").slice(0, 4).map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => navigate(`/videos/${video.id}`)}
                  isPremium
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses')}
                className="border-gold text-gold hover:bg-gold/10"
              >
                View All Courses
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Recommendation Section */}
        <div className="mt-12">
          <h2 className="text-xl font-proxima font-semibold mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white/80" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Getting Started with Music Theory</h3>
                <p className="text-sm text-muted-foreground">Perfect for beginners looking to understand the fundamentals of music.</p>
                <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Explore</Button>
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="h-12 w-12 text-white/80" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Top 10 Easy Guitar Songs</h3>
                <p className="text-sm text-muted-foreground">Learn these popular songs to impress your friends and family.</p>
                <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Start Learning</Button>
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img src="/placeholder.svg" alt="Recommended content" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="h-12 w-12 text-white/80" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Vocal Warm-up Techniques</h3>
                <p className="text-sm text-muted-foreground">Protect your voice and improve your vocal range with these exercises.</p>
                <Button className="mt-3 w-full bg-gold hover:bg-gold-dark">Watch Tutorial</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper component for artist cards
const ArtistCard = ({ name, role, imageSrc, onClick }) => (
  <div 
    className="rounded-lg overflow-hidden shadow-md bg-card cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
    <img src={imageSrc} alt={name} className="w-full aspect-square object-cover" />
    <div className="p-3">
      <h3 className="font-bold">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
);

// Add missing import
import { Clock } from "lucide-react";

export default Discover;
