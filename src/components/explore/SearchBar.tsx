
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <Input
        type="search"
        placeholder="Search salons..."
        className="pl-10 pr-4 h-11 rounded-xl bg-secondary/50 border-secondary"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export default SearchBar;
