import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import SalonCard from '@/components/SalonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSalons, seedSalons, type SimplifiedSalon } from '@/hooks/useSalons';
import { toast } from 'sonner';

const SORT_OPTIONS = [
  { label: "Distance", value: "distance" },
  { label: "Rating", value: "rating" },
  { label: "Popularity", value: "popularity" }
];

const FILTER_CATEGORIES = [
  { label: "Hair", value: "hair" },
  { label: "Nails", value: "nails" },
  { label: "Facial", value: "facial" },
  { label: "Massage", value: "massage" },
  { label: "Makeup", value: "makeup" },
  { label: "Waxing", value: "waxing" }
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: salons = [], isLoading, error, refetch } = useSalons();
  
  useEffect(() => {
    const initializeData = async () => {
      if (salons.length === 0 && !isLoading && !error) {
        const seeded = await seedSalons();
        if (seeded) {
          toast.success("Salon data has been initialized");
          refetch();
        }
      }
    };
    
    initializeData();
  }, [salons, isLoading, error, refetch]);
  
  const filteredSalons = React.useMemo(() => {
    let result = [...salons];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(salon => 
        salon.name.toLowerCase().includes(query) || 
        salon.location.toLowerCase().includes(query) ||
        (salon.specialties && salon.specialties.some(s => s.toLowerCase().includes(query)))
      );
    }
    
    if (selectedFilters.length > 0) {
      result = result.filter(salon => 
        salon.specialties && salon.specialties.some(specialty => 
          selectedFilters.some(filter => 
            specialty.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
    
    if (sortBy === "distance") {
      result.sort((a, b) => {
        const distanceA = a.distance ? parseFloat(a.distance.split(" ")[0]) : 0;
        const distanceB = b.distance ? parseFloat(b.distance.split(" ")[0]) : 0;
        return distanceA - distanceB;
      });
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      result.sort((a, b) => b.ratingCount - a.ratingCount);
    }
    
    return result;
  }, [salons, searchQuery, selectedFilters, sortBy]);
  
  const toggleFilter = (value: string) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter(f => f !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
  };
  
  const clearFilters = () => {
    setSelectedFilters([]);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">Explore Salons</h1>
          <p className="text-muted-foreground text-sm">
            Discover beauty salons near you
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search salons..."
              className="pl-10 pr-4 h-11 rounded-xl bg-secondary/50 border-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-11 px-3 rounded-xl border-border", 
              showFilters && "bg-primary/10 border-primary"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
        
        {showFilters && (
          <div className="glass rounded-xl p-4 space-y-4 animate-slide-down">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Sort by</h3>
                <Button variant="ghost" className="h-7 px-2 text-xs" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(option => (
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
                {FILTER_CATEGORIES.map(category => (
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
        )}
        
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Current Location</p>
              <p className="text-xs text-muted-foreground">Within 5 miles</p>
            </div>
          </div>
          <Button size="sm" variant="default">
            Change
          </Button>
        </div>
        
        <div className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
              <p>Error loading salons: {error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {isLoading ? (
            Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[5/3] bg-muted"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            filteredSalons.length > 0 ? (
              filteredSalons.map((salon, index) => (
                <SalonCard
                  key={salon.id}
                  id={salon.id}
                  name={salon.name}
                  imageUrl={salon.imageUrl}
                  rating={salon.rating}
                  ratingCount={salon.ratingCount}
                  location={salon.location}
                  distance={salon.distance}
                  specialties={salon.specialties}
                  className={`animation-delay-${index % 3}00`}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No salons found matching your criteria</p>
                {(searchQuery || selectedFilters.length > 0) && (
                  <Button variant="outline" className="mt-2" onClick={() => {
                    setSearchQuery("");
                    setSelectedFilters([]);
                  }}>
                    Clear filters
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
