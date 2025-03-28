
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  sortOptions: FilterOption[];
  filterCategories: FilterOption[];
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedFilters: string[];
  toggleFilter: (value: string) => void;
  clearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  sortOptions,
  filterCategories,
  sortBy,
  setSortBy,
  selectedFilters,
  toggleFilter,
  clearFilters,
}) => {
  return (
    <div className="glass rounded-xl p-4 space-y-4 animate-slide-down">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Sort by</h3>
          <Button variant="ghost" className="h-7 px-2 text-xs" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(option => (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full px-3 py-1 h-8 text-xs",
                sortBy === option.value 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/60"
              )}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Services</h3>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map(category => (
            <Button
              key={category.value}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full px-3 py-1 h-8 text-xs",
                selectedFilters.includes(category.value) 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/60"
              )}
              onClick={() => toggleFilter(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterPanel;
