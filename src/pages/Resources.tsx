// src/pages/Resources.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceTypeFilter from "@/components/resources/ResourceTypeFilter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader } from "lucide-react";
import { resourcesService } from "@/lib/supabase/resources";
import { Resource, ResourceCategory } from "@/types/resource";
import { useSubscription } from "@/context/SubscriptionContext";

const Resources = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [subjectCategories, setSubjectCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourcesData, categoriesData] = await Promise.all([
        resourcesService.getResources(),
        resourcesService.getCategories()
      ]);
      
      setResources(resourcesData);
      setCategories(categoriesData);
      
      // Extract unique subject categories
      const subjects = ["all", ...new Set(resourcesData.map(res => res.subject_category).filter(Boolean))];
      setSubjectCategories(subjects as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error loading resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (categoryFilter !== "all") filters.category = categoryFilter;
      if (subjectFilter !== "all") filters.subject_category = subjectFilter;
      if (levelFilter !== "all") filters.level = levelFilter;
      
      const results = await resourcesService.searchResources(searchTerm, filters);
      setResources(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      console.error("Error searching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search term, category, and level
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || resource.category_id === categoryFilter;
    
    const matchesLevel = 
      levelFilter === "all" || resource.level === levelFilter;
    
    const matchesSubject = 
      subjectFilter === "all" || resource.subject_category === subjectFilter;

    // Show locked content only if user has appropriate access
    const hasAccess = !resource.is_locked || 
      (user && 
        ((resource.access_level === 'auth' && user.id) ||
         (resource.access_level === 'basic' && subscription?.tier === 'basic') ||
         (resource.access_level === 'premium' && subscription?.tier === 'premium') ||
         (resource.access_level === 'professional' && subscription?.tier === 'professional')));
    
    return matchesSearch && matchesCategory && matchesLevel && matchesSubject && hasAccess;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12 text-red-500">
          <h3 className="text-lg font-medium">Error loading resources</h3>
          <p className="mt-2">{error}</p>
          <Button onClick={loadData} className="mt-4">
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-gold hover:bg-gold/90 text-white">
            Search
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <div className="w-full md:w-64">
            <ResourceTypeFilter
              categories={categories}
              selectedCategory={categoryFilter}
              onSelectCategory={setCategoryFilter}
              vertical
            />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Skill Level</h3>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Subject</h3>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjectCategories.filter(sc => sc !== "all").map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Resources grid */}
          <div className="flex-1">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={loadData} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
