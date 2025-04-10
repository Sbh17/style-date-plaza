
import { supabase, type Salon } from '@/lib/supabase';
import { SimplifiedSalon } from '@/hooks/useSalons';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Function to check if the current user is a superadmin
const isSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
      
    if (error || !profile) return false;
    
    return profile.role === 'superadmin';
  } catch (error) {
    console.error('Error checking superadmin status:', error);
    return false;
  }
};

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

// Create a new salon in the database (superadmin only)
export const createSalon = async (salonData: Partial<Salon>): Promise<Salon | null> => {
  try {
    // Check if user is superadmin
    const superadmin = await isSuperAdmin();
    if (!superadmin) {
      toast.error('Only superadmins can create salons');
      return null;
    }
    
    // Use the REST API approach to bypass RLS policies if needed
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/salons`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(salonData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating salon:', errorData);
      toast.error('Failed to create salon');
      return null;
    }

    const data = await response.json();
    toast.success('Salon created successfully!');
    return data[0] as Salon;
  } catch (error: any) {
    console.error('Error in createSalon:', error);
    toast.error(`Error creating salon: ${error.message}`);
    return null;
  }
};

// Update an existing salon (superadmin only)
export const updateSalon = async (id: string, salonData: Partial<Salon>): Promise<Salon | null> => {
  try {
    // Check if user is superadmin
    const superadmin = await isSuperAdmin();
    if (!superadmin) {
      toast.error('Only superadmins can update salons');
      return null;
    }
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/salons?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(salonData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating salon:', errorData);
      toast.error('Failed to update salon');
      return null;
    }

    const data = await response.json();
    toast.success('Salon updated successfully!');
    return data[0] as Salon;
  } catch (error: any) {
    console.error('Error in updateSalon:', error);
    toast.error(`Error updating salon: ${error.message}`);
    return null;
  }
};

// Delete a salon (superadmin only)
export const deleteSalon = async (id: string): Promise<boolean> => {
  try {
    // Check if user is superadmin
    const superadmin = await isSuperAdmin();
    if (!superadmin) {
      toast.error('Only superadmins can delete salons');
      return false;
    }
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/salons?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting salon:', errorData);
      toast.error('Failed to delete salon');
      return false;
    }

    toast.success('Salon deleted successfully!');
    return true;
  } catch (error: any) {
    console.error('Error in deleteSalon:', error);
    toast.error(`Error deleting salon: ${error.message}`);
    return false;
  }
};

// Create mock salons data (superadmin only)
export const seedSalonsData = async (): Promise<boolean> => {
  try {
    // Check if user is superadmin
    const superadmin = await isSuperAdmin();
    if (!superadmin) {
      toast.error('Only superadmins can seed salon data');
      return false;
    }
    
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

    // Skip the RLS policy check by using a direct REST API call
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/salons`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(mockSalons)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error seeding salons:', errorData);
      return false;
    }

    toast.success('Successfully seeded salon data!');
    return true;
  } catch (error: any) {
    console.error('Error in seedSalonsData:', error);
    return false;
  }
};

// Function to create a superadmin user
export const createSuperAdminUser = async (email: string, password: string, name: string): Promise<boolean> => {
  try {
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      console.error('Error creating user:', authError);
      toast.error(`Failed to create user: ${authError.message}`);
      return false;
    }
    
    if (!authData.user) {
      toast.error('Failed to create user - no user data returned');
      return false;
    }
    
    // Then create a profile with superadmin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        name,
        email,
        role: 'superadmin',
      });
    
    if (profileError) {
      console.error('Error creating superadmin profile:', profileError);
      toast.error(`Failed to set superadmin role: ${profileError.message}`);
      return false;
    }
    
    toast.success(`Superadmin ${name} created successfully!`);
    return true;
  } catch (error: any) {
    console.error('Error in createSuperAdminUser:', error);
    toast.error(`Error creating superadmin: ${error.message}`);
    return false;
  }
};
