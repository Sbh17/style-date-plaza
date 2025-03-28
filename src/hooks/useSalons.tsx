
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
};

export const useSalons = () => {
  return useQuery({
    queryKey: ['salons'],
    queryFn: async (): Promise<SimplifiedSalon[]> => {
      try {
        const salons = await getSalons();
        return salons;
      } catch (error: any) {
        console.error('Error fetching salons:', error);
        throw error;
      }
    },
    retry: 1,
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
