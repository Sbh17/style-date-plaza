
import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSalons, seedSalons, type SimplifiedSalon } from '@/hooks/useSalons';
import { toast } from 'sonner';

import SearchBar from '@/components/explore/SearchBar';
import FilterPanel from '@/components/explore/FilterPanel';
import LocationPanel from '@/components/explore/LocationPanel';
import SalonList from '@/components/explore/SalonList';

const MOCK_SALONS = [
  {
    id: "1",
    name: "Elegance Beauty Salon",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.8,
    ratingCount: 243,
    location: "Downtown",
    distance: "1.2 mi",
    specialties: ["Hair", "Nails", "Facial"]
  },
  {
    id: "2",
    name: "Pure Bliss Spa & Salon",
    imageUrl: "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.7,
    ratingCount: 189,
    location: "Westside",
    distance: "0.8 mi",
    specialties: ["Massage", "Facial", "Waxing"]
  },
  {
    id: "3",
    name: "Modern Cuts & Color",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.5,
    ratingCount: 156,
    location: "Midtown",
    distance: "1.5 mi",
    specialties: ["Color", "Haircut", "Styling"]
  },
  {
    id: "4",
    name: "Serenity Nail Spa",
    imageUrl: "https://images.unsplash.com/photo-1610992235683-e39abc5e4fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.9,
    ratingCount: 201,
    location: "Eastside",
    distance: "2.1 mi",
    specialties: ["Manicure", "Pedicure", "Nail Art"]
  }
];

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
  const [displaySalons, setDisplaySalons] = useState<SimplifiedSalon[]>(MOCK_SALONS);
  const [isSeeding, setIsSeeding] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const { data: salons = [], isLoading, error, refetch } = useSalons(
    userLocation ? {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      maxDistance: 50 // 50 miles max distance
    } : undefined
  );
  
  useEffect(() => {
    const initializeData = async () => {
      if (salons.length > 0) {
        setDisplaySalons(salons);
        return;
      }
      
      if (salons.length === 0 && !isLoading && !error && !isSeeding) {
        setIsSeeding(true);
        const seeded = await seedSalons();
        setIsSeeding(false);
        
        if (seeded) {
          toast.success("Salon data has been initialized");
          refetch();
        } else {
          toast.error("Failed to initialize salon data. Using mock data instead.");
        }
      }
    };
    
    initializeData();
  }, [salons, isLoading, error, refetch, isSeeding]);
  
  const handleLocationChange = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    toast.success("Location updated! Finding salons near you...");
  };
  
  const filteredSalons = React.useMemo(() => {
    let result = [...displaySalons];
    
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
  }, [displaySalons, searchQuery, selectedFilters, sortBy]);
  
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
  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedFilters([]);
  };
  
  const manualSeedData = async () => {
    setIsSeeding(true);
    const seeded = await seedSalons();
    setIsSeeding(false);
    
    if (seeded) {
      toast.success("Salon data has been seeded successfully!");
      refetch();
    } else {
      toast.error("Failed to seed salon data.");
    }
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
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
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
          <FilterPanel
            sortOptions={SORT_OPTIONS}
            filterCategories={FILTER_CATEGORIES}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />
        )}
        
        <LocationPanel onLocationChange={handleLocationChange} />
        
        <div className="space-y-4">
          <SalonList
            salons={filteredSalons}
            isLoading={isLoading}
            isSeeding={isSeeding}
            error={error}
            manualSeedData={manualSeedData}
            resetFilters={resetFilters}
            hasActiveFilters={searchQuery.length > 0 || selectedFilters.length > 0}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
