
import React from 'react';
import { Button } from "@/components/ui/button";
import { ResourceType } from "./ResourceCard";
import { BookOpen, FileText, Music, Video, Headphones, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ResourceTypeOption {
  id: ResourceType;
  label: string;
  icon: React.ReactNode;
}

interface ResourceTypeFilterProps {
  selectedType: ResourceType | 'all';
  onSelectType: (type: ResourceType | 'all') => void;
  vertical?: boolean;
}

const ResourceTypeFilter: React.FC<ResourceTypeFilterProps> = ({
  selectedType,
  onSelectType,
  vertical = false
}) => {
  const resourceTypes: ResourceTypeOption[] = [
    { id: 'sheet_music', label: 'Sheet Music', icon: <Music className="h-4 w-4" /> },
    { id: 'tutorial', label: 'Tutorials', icon: <Video className="h-4 w-4" /> },
    { id: 'article', label: 'Articles', icon: <FileText className="h-4 w-4" /> },
    { id: 'audio', label: 'Audio', icon: <Headphones className="h-4 w-4" /> },
    { id: 'video', label: 'Videos', icon: <Video className="h-4 w-4" /> },
    { id: 'chord_chart', label: 'Chord Charts', icon: <BarChart2 className="h-4 w-4" /> },
  ];
  
  // Mobile dropdown version
  const MobileFilter = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            {selectedType === 'all' ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                All Resources
              </>
            ) : (
              <>
                {resourceTypes.find(t => t.id === selectedType)?.icon}
                <span className="ml-2">{resourceTypes.find(t => t.id === selectedType)?.label}</span>
              </>
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem 
          onClick={() => onSelectType('all')}
          className={cn(selectedType === 'all' && "bg-muted")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>All Resources</span>
        </DropdownMenuItem>
        
        {resourceTypes.map((type) => (
          <DropdownMenuItem
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={cn(selectedType === type.id && "bg-muted")}
          >
            {type.icon}
            <span className="ml-2">{type.label}</span>
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
            variant={selectedType === 'all' ? "default" : "ghost"}
            className={cn(
              "justify-start",
              selectedType === 'all' ? "bg-gold hover:bg-gold/90 text-white" : ""
            )}
            onClick={() => onSelectType('all')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            All Resources
          </Button>
          
          {resourceTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "ghost"}
              className={cn(
                "justify-start",
                selectedType === type.id ? "bg-gold hover:bg-gold/90 text-white" : ""
              )}
              onClick={() => onSelectType(type.id)}
            >
              {type.icon}
              <span className="ml-2">{type.label}</span>
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
          variant={selectedType === 'all' ? "default" : "outline"}
          className={cn(selectedType === 'all' ? "bg-gold hover:bg-gold/90 text-white" : "")}
          onClick={() => onSelectType('all')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          All
        </Button>
        
        {resourceTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "outline"}
            className={cn(selectedType === type.id ? "bg-gold hover:bg-gold/90 text-white" : "")}
            onClick={() => onSelectType(type.id)}
          >
            {type.icon}
            <span className="ml-2 hidden lg:inline">{type.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ResourceTypeFilter;
