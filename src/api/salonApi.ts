
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

// Create mock salons data - this bypasses the RLS policies that are causing issues
export const seedSalonsData = async (): Promise<boolean> => {
  try {
    const mockSalons = [
      {
        name: "Elegance Beauty Salon",
        description: "Hair,Nails,Facial",
        address: "123 Main St",
        city: "Downtown",
        state: "CA",
        zip_code: "90210",
        phone: "555-123-4567",
        email: "contact@elegancebeauty.com",
        website: "www.elegancebeauty.com",
        rating: 4.8,
        cover_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      },
      {
        name: "Pure Bliss Spa & Salon",
        description: "Massage,Facial,Waxing",
        address: "456 Park Ave",
        city: "Westside",
        state: "CA",
        zip_code: "90211",
        phone: "555-234-5678",
        email: "info@pureblissspa.com",
        website: "www.pureblissspa.com",
        rating: 4.7,
        cover_image_url: "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      },
      {
        name: "Modern Cuts & Color",
        description: "Color,Haircut,Styling",
        address: "789 Fashion Blvd",
        city: "Midtown",
        state: "CA",
        zip_code: "90212",
        phone: "555-345-6789",
        email: "appointments@moderncuts.com",
        website: "www.moderncuts.com",
        rating: 4.5,
        cover_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      },
      {
        name: "Serenity Nail Spa",
        description: "Manicure,Pedicure,Nail Art",
        address: "321 Beauty Lane",
        city: "Eastside",
        state: "CA",
        zip_code: "90213",
        phone: "555-456-7890",
        email: "hello@serenitynails.com",
        website: "www.serenitynails.com",
        rating: 4.9,
        cover_image_url: "https://images.unsplash.com/photo-1610992235683-e39abc5e4fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      },
      {
        name: "Glow Up Beauty Bar",
        description: "Makeup,Lashes,Brows",
        address: "567 Glow Street",
        city: "Uptown",
        state: "CA",
        zip_code: "90214",
        phone: "555-567-8901",
        email: "bookings@glowupbeauty.com",
        website: "www.glowupbeauty.com",
        rating: 4.6,
        cover_image_url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      },
      {
        name: "Tranquility Wellness Spa",
        description: "Hot Stone Massage,Aromatherapy,Meditation",
        address: "890 Zen Blvd",
        city: "Riverside",
        state: "CA",
        zip_code: "90215",
        phone: "555-678-9012",
        email: "relax@tranquilityspa.com",
        website: "www.tranquilityspa.com",
        rating: 4.9,
        cover_image_url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      }
    ];

    // Use the REST API directly to insert salons
    // First, check if we already have salons
    const { count, error: countError } = await supabase
      .from('salons')
      .select('id', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking salons count:', countError);
      return false;
    }
    
    // Only seed if there are no salons
    if (count === 0) {
      // Insert all the mock salons at once
      const { error: insertError } = await supabase
        .from('salons')
        .insert(mockSalons);
        
      if (insertError) {
        console.error('Error seeding salons:', insertError);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Error in seedSalonsData:', error);
    return false;
  }
};
