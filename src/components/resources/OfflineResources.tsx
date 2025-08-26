// components/resources/OfflineResources.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DownloadCloud, Search, Trash2, WifiOff } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types/resource";

interface OfflineResourcesProps {
  resources: Resource[];
  onRemove?: (resourceId: string) => void;
}

const OfflineResources: React.FC<OfflineResourcesProps> = ({ 
  resources = [],
  onRemove
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  const totalStorageUsed = resources.reduce((acc, resource) => {
    // Estimate storage based on resource type
    let size = 0;
    switch (resource.category_name) {
      case "videos":
        size = 100; // MB estimate
        break;
      case "infographics":
        size = 5; // MB estimate
        break;
      case "audios":
        size = 20; // MB estimate
        break;
      case "documents":
        size = 2; // MB estimate
        break;
      default:
        size = 5; // MB estimate
    }
    return acc + size;
  }, 0);
  
  const availableStorage = 500; // 500 MB total storage
  const storagePercentage = (totalStorageUsed / availableStorage) * 100;
  
  const handleRemove = (resource: Resource) => {
    setIsDeleting(true);
    
    // Simulate removal process
    setTimeout(() => {
      if (onRemove) {
        onRemove(resource.id);
      }
      
      toast({
        title: "Resource Removed",
        description: `${resource.title} has been removed from offline storage.`,
      });
      
      setIsDeleting(false);
    }, 500);
  };
  
  if (resources.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="bg-muted/50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No Offline Resources</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
            Save resources to access them when you're offline. Downloaded resources will appear here.
          </p>
          <Button 
            className="bg-gold hover:bg-gold/90 text-white"
            onClick={() => window.location.href = "/resources"}
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Browse Resources
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Offline Resources</h2>
          <p className="text-muted-foreground">Access your saved music resources without internet</p>
        </div>
        
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search offline resources"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Storage Usage</CardTitle>
          <CardDescription>
            {totalStorageUsed.toFixed(1)} MB used of {availableStorage} MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={storagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            You can download more resources if you need by visiting our Resources page
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard 
              key={resource.id}
              resource={resource}
              onBookmark={() => handleRemove(resource)}
              isBookmarked={true}
            />
          ))
        ) : (
          <div className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">
              No offline resources match your search. Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineResources;
