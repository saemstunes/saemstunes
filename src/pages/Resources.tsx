
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import InfographicCard from "@/components/resources/InfographicCard";
import { mockInfographics } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const Resources = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Get unique categories from infographics
  const categories = ["all", ...new Set(mockInfographics.map((info) => info.category))];

  // Get unique levels from infographics
  const levels = ["all", ...new Set(mockInfographics.map((info) => info.level))];

  // Filter infographics based on search term, category, and level
  const filteredInfographics = mockInfographics.filter((info) => {
    const matchesSearch = info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || info.category === categoryFilter;
    
    const matchesLevel = levelFilter === "all" || info.level === levelFilter;

    // Show locked content only if user has access (using profile.role as proxy for subscription)
    const accessibleToUser = !info.isLocked || (profile && (profile.role === 'admin' || profile.role === 'tutor'));
    
    return matchesSearch && matchesCategory && matchesLevel && accessibleToUser;
  });

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-serif font-bold mb-6">Music Resources</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Level" />
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
        
        {filteredInfographics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfographics.map((infographic) => (
              <InfographicCard key={infographic.id} infographic={infographic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No resources found</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Resources;
