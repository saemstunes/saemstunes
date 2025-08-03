
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { Search, Filter, X, Bookmark, Clock, History, TrendingUp } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { userPreferences } from "@/lib/animation-utils";

const SearchPage = () => {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    "Piano basics", "Guitar chords", "Vocal warm-ups", "Music theory", "Saxophone lessons"
  ]);
  
  // Update search history
  useEffect(() => {
    // Load recent searches from local storage
    const savedSearches = userPreferences.load<string[]>('recent-searches', []);
    setRecentSearches(savedSearches);
  }, []);
  
  // Save search to history when performed
  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    userPreferences.save('recent-searches', updatedSearches);
  };
  
  // Clear input and results
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Perform search when enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery) {
      saveSearchToHistory(searchQuery);
    }
  };
  
  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    saveSearchToHistory(suggestion);
  };
  
  // Simple search function to filter mock data
  const searchResults = mockVideos.filter((video) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      video.title.toLowerCase().includes(query) || 
      video.description.toLowerCase().includes(query) ||
      video.instructor.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query));
      
    if (activeTab === "all") return matchesQuery;
    if (activeTab === "beginner") return matchesQuery && video.level === "beginner";
    if (activeTab === "intermediate") return matchesQuery && video.level === "intermediate";
    if (activeTab === "advanced") return matchesQuery && video.level === "advanced";
    
    return false;
  });
  
  // Extract all tags from search results for filtering
  const allTags = Array.from(
    new Set(searchResults.flatMap(video => video.tags))
  );

  return (
    <MainLayout>
      <h1 className="text-3xl font-serif font-bold mb-6">Search</h1>
      
      <div className="relative mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for videos, resources, tutors..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search suggestions when input is focused but empty */}
        {!searchQuery && (
          <div className="absolute top-full left-0 right-0 bg-background shadow-lg rounded-md mt-1 p-4 z-20 border">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Recent Searches
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto py-1 px-2 text-xs"
                    onClick={() => {
                      setRecentSearches([]);
                      userPreferences.save('recent-searches', []);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <History className="mr-1 h-3 w-3" />
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters area */}
      {showFilters && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSuggestionClick(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {searchQuery ? (
            <>
              <p className="text-muted-foreground mb-4">
                {searchResults.length} results for "{searchQuery}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map(video => (
                  <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
                ))}
              </div>
              
              {searchResults.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-xl font-medium">No results found</h2>
                  <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Enter search terms to find videos, resources, tutors and more
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="beginner" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No beginner results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="intermediate" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No intermediate results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(video => (
              <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
            ))}
          </div>
          
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium">No advanced results found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SearchPage;
