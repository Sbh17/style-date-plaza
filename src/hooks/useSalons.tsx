
import { useQuery } from '@tanstack/react-query';
import { getSalons, seedSalonsData } from '@/api/salonApi';
import { toast } from 'sonner';

export type SimplifiedSalon = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  location: string;
  distance?: string;
  specialties?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

interface UseSalonsOptions {
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}

export const useSalons = (options?: UseSalonsOptions) => {
  const { latitude, longitude, maxDistance = 50 } = options || {};
  
  return useQuery({
    queryKey: ['salons', { latitude, longitude, maxDistance }],
    queryFn: async (): Promise<SimplifiedSalon[]> => {
      try {
        let salons = await getSalons();
        console.log("Fetched salons data:", salons);
        
        // If we have user's location, add distance to each salon and filter by maxDistance
        if (latitude && longitude) {
          salons = salons.map(salon => {
            // Skip if salon doesn't have coordinates
            if (!salon.coordinates) return salon;
            
            const distance = calculateDistance(
              latitude,
              longitude,
              salon.coordinates.latitude,
              salon.coordinates.longitude
            );
            
            return {
              ...salon,
              distance: `${distance.toFixed(1)} mi`
            };
          }).filter(salon => {
            if (!salon.distance) return true; // Keep salons without distance info
            const distanceValue = parseFloat(salon.distance);
            return !isNaN(distanceValue) && distanceValue <= maxDistance;
          });
          
          // Sort by distance
          salons.sort((a, b) => {
            const distA = a.distance ? parseFloat(a.distance) : Infinity;
            const distB = b.distance ? parseFloat(b.distance) : Infinity;
            return distA - distB;
          });
        }
        
        return salons;
      } catch (error: any) {
        console.error('Error fetching salons:', error);
        toast.error(`Failed to fetch salons: ${error.message}`);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Function to seed the database with initial salon data
export const seedSalons = async (): Promise<boolean> => {
  try {
    toast.loading('Seeding salon data...', { id: 'seeding-toast' });
    const seeded = await seedSalonsData();
    
    if (seeded) {
      toast.success('Salon data has been successfully seeded!', { id: 'seeding-toast' });
    } else {
      toast.error('Failed to seed salon data. Check console for details.', { id: 'seeding-toast' });
    }
    
    return seeded;
  } catch (error: any) {
    console.error('Error seeding salons:', error);
    toast.error(`Error seeding salons: ${error.message}`, { id: 'seeding-toast' });
    return false;
  }
};
