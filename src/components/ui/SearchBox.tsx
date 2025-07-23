
import React, { useState, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { userPreferences } from '@/lib/animation-utils';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange
}) => {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load recent searches from local storage
    const savedSearches = userPreferences.load<string[]>('recent-searches', [
      "Piano lessons", "Guitar chords", "Music theory", "Vocal techniques"
    ]);
    
    setRecentSearches(savedSearches);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save search to recent searches
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    userPreferences.save('recent-searches', updatedSearches);
    
    // Update search term
    onSearchChange(query);
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        id="search"
        name="search"
        placeholder="Search for music, courses, artists..." 
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-card shadow-lg rounded-md mt-1 p-2 z-10">
          <div className="text-xs text-muted-foreground mb-2">Recent searches</div>
          {recentSearches.map((search, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              onClick={() => handleSearch(search)}
            >
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>{search}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
