
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
        toast.error(`Error fetching salons: ${error.message}`);
        console.error('Error fetching salons:', error);
        return [];
      }
    },
  });
};

// Function to seed the database with initial salon data
export const seedSalons = async () => {
  try {
    const seeded = await seedSalonsData();
    return seeded;
  } catch (error: any) {
    console.error('Error seeding salons:', error);
    return false;
  }
};
