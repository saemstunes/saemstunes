import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import VideoCard from "@/components/videos/VideoCard";
import { mockVideos } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { canAccessContent } from "@/lib/contentAccess";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LearningHubVideos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const categories = ["all", ...new Set(mockVideos.map((video) => video.category))];
  const levels = ["all", ...new Set(mockVideos.map((video) => video.level))];

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || video.level === levelFilter;
    const userSubscriptionTier = user?.subscriptionTier || 'free';
    const hasAccess = canAccessContent(video.accessLevel, user, userSubscriptionTier);
    
    return matchesSearch && matchesCategory && matchesLevel && hasAccess;
  });

  const handleVideoClick = (id: string) => {
    navigate(`/learning-hub/videos/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-serif font-bold text-gold-dark">Video Lessons</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              isPremium={video.accessLevel !== 'free'} 
              onClick={() => handleVideoClick(video.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-cream/50 rounded-xl">
          <h3 className="text-lg font-medium text-gold-dark">No videos found</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            variant="gold" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setLevelFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LearningHubVideos;
