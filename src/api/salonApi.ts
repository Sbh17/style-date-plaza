
import { supabase, type Salon } from '@/lib/supabase';
import { SimplifiedSalon } from '@/hooks/useSalons';

// Get all salons
export const getSalons = async (): Promise<SimplifiedSalon[]> => {
  const { data, error } = await supabase
    .from('salons')
    .select('id, name, cover_image_url, rating, city, description')
    .order('name');
    
  if (error) {
    throw error;
  }
  
  // Transform the data to match our UI needs
  const transformedData: SimplifiedSalon[] = data.map(salon => ({
    id: salon.id,
    name: salon.name,
    imageUrl: salon.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    rating: salon.rating || 4.5,
    ratingCount: Math.floor(Math.random() * 300) + 50, // Placeholder for now
    location: salon.city || 'Local area',
    distance: `${(Math.random() * 5).toFixed(1)} mi`, // Placeholder for now
    specialties: salon.description ? salon.description.split(',').slice(0, 3) : ['Hair', 'Nails', 'Spa'],
  }));
  
  return transformedData;
};

// Get a single salon by ID
export const getSalonById = async (id: string): Promise<Salon | null> => {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching salon:', error);
    return null;
  }
  
  return data as Salon;
};
