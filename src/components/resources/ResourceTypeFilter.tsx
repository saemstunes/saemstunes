// components/resources/ResourceTypeFilter.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Music, Video, Headphones, BarChart2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ResourceCategory } from "@/types/resource";

interface ResourceTypeFilterProps {
  categories: ResourceCategory[];
  selectedCategory: string | 'all';
  onSelectCategory: (categoryId: string | 'all') => void;
  vertical?: boolean;
}

const ResourceTypeFilter: React.FC<ResourceTypeFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  vertical = false
}) => {
  const getCategoryIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'play':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <BarChart2 className="h-4 w-4" />;
      case 'volume-2':
        return <Headphones className="h-4 w-4" />;
      case 'file-text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Mobile dropdown version
  const MobileFilter = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            {selectedCategory === 'all' ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                All Resources
              </>
            ) : (
              <>
                {getCategoryIcon(categories.find(c => c.id === selectedCategory)?.icon || null)}
                <span className="ml-2">{categories.find(c => c.id === selectedCategory)?.name}</span>
              </>
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem 
          onClick={() => onSelectCategory('all')}
          className={cn(selectedCategory === 'all' && "bg-muted")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>All Resources</span>
        </DropdownMenuItem>
        
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(selectedCategory === category.id && "bg-muted")}
          >
            {getCategoryIcon(category.icon)}
            <span className="ml-2">{category.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  // Vertical filter layout
  if (vertical) {
    return (
      <div className="space-y-1 w-full">
        <div className="md:hidden mb-4">
          <MobileFilter />
        </div>
        
        <div className="hidden md:flex md:flex-col gap-1 w-full">
          <Button
            variant={selectedCategory === 'all' ? "default" : "ghost"}
            className={cn(
              "justify-start",
              selectedCategory === 'all' ? "bg-gold hover:bg-gold/90 text-white" : ""
            )}
            onClick={() => onSelectCategory('all')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            All Resources
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className={cn(
                "justify-start",
                selectedCategory === category.id ? "bg-gold hover:bg-gold/90 text-white" : ""
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              {getCategoryIcon(category.icon)}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  // Horizontal filter layout (default)
  return (
    <div>
      <div className="md:hidden mb-4">
        <MobileFilter />
      </div>
      
      <div className="hidden md:flex md:flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? "default" : "outline"}
          className={cn(selectedCategory === 'all' ? "bg-gold hover:bg-gold/90 text-white" : "")}
          onClick={() => onSelectCategory('all')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={cn(selectedCategory === category.id ? "bg-gold hover:bg-gold/90 text-white" : "")}
            onClick={() => onSelectCategory(category.id)}
          >
            {getCategoryIcon(category.icon)}
            <span className="ml-2 hidden lg:inline">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ResourceTypeFilter;
