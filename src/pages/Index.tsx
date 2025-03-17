
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';

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

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
              MOCK_SALONS.map((salon) => (
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
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-xs text-muted-foreground">12 salons nearby</p>
              </div>
            </div>
            <Button size="sm" variant="default">
              View Map
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
