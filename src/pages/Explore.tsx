
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import SalonCard from '@/components/SalonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock data
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
  },
  {
    id: "5",
    name: "Glow Up Beauty Bar",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.6,
    ratingCount: 178,
    location: "Uptown",
    distance: "1.8 mi",
    specialties: ["Makeup", "Lashes", "Brows"]
  },
  {
    id: "6",
    name: "Tranquility Wellness Spa",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    rating: 4.9,
    ratingCount: 256,
    location: "Riverside",
    distance: "2.5 mi",
    specialties: ["Hot Stone Massage", "Aromatherapy", "Meditation"]
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
  const [loading, setLoading] = useState(true);
  const [salons, setSalons] = useState<typeof MOCK_SALONS>([]);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setSalons(MOCK_SALONS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
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
          {loading ? (
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
            salons.map((salon, index) => (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
