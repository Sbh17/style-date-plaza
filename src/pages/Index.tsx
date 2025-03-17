import React, { useState, useEffect } from 'react';
import { Search, MapPin, Locate } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  }
];

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "hair", name: "Hair" },
  { id: "nails", name: "Nails" },
  { id: "facial", name: "Facial" },
  { id: "massage", name: "Massage" },
  { id: "makeup", name: "Makeup" },
  { id: "waxing", name: "Waxing" }
];

// Function to calculate distance between two coordinates (in km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// Mock coordinates for salons
const SALON_COORDINATES = {
  "1": { lat: 40.7128, lng: -74.0060 }, // New York
  "2": { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  "3": { lat: 41.8781, lng: -87.6298 }, // Chicago
  "4": { lat: 29.7604, lng: -95.3698 }, // Houston
};

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [salons, setSalons] = useState(MOCK_SALONS);
  const { loading: geoLoading, position, error } = useGeolocation();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Find nearby salons
  const findNearbySalons = () => {
    if (!position) {
      toast({
        title: "Location not available",
        description: "Please allow location access to find nearby salons",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Sort salons by distance
    const salonsWithDistance = MOCK_SALONS.map(salon => {
      const coords = SALON_COORDINATES[salon.id as keyof typeof SALON_COORDINATES];
      if (coords && position) {
        const distance = calculateDistance(
          position.latitude, 
          position.longitude, 
          coords.lat, 
          coords.lng
        );
        return {
          ...salon,
          distance: `${distance.toFixed(1)} km`,
          distanceValue: distance
        };
      }
      return { ...salon, distanceValue: 9999 };
    });

    // Sort by distance
    const sortedSalons = salonsWithDistance.sort((a, b) => {
      return (a.distanceValue || 9999) - (b.distanceValue || 9999);
    });

    setTimeout(() => {
      setSalons(sortedSalons);
      setLoading(false);
      toast({
        title: "Nearby salons found",
        description: "Showing salons closest to your location",
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">Discover Beauty</h1>
          <p className="text-muted-foreground text-sm">
            Find and book the best beauty services near you
          </p>
        </div>
        
        <div className="relative">
          <Input
            type="search"
            placeholder="Search salons, services..."
            className="pl-10 pr-4 h-11 rounded-xl bg-secondary/50 border-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="relative -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  selectedCategory === category.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/50 text-foreground border-secondary"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Featured Salons</h2>
            <Button variant="link" className="text-sm p-0 h-auto text-primary">
              See All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {loading ? (
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[5/3] bg-muted"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              salons.slice(0, 4).map((salon) => (
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
                  className="animation-delay-100"
                />
              ))
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="font-medium">Near You</h2>
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Find Nearby Salons</p>
                <p className="text-xs text-muted-foreground">Use your current location</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="default"
              onClick={findNearbySalons}
              disabled={geoLoading}
              className="flex items-center gap-1.5"
            >
              <Locate className="h-4 w-4" />
              {geoLoading ? "Locating..." : "Locate Me"}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-2">New to StyleDate?</p>
          <div className="flex gap-2 w-full">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
