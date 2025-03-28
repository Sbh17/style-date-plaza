
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key';

// For development only - check for environment variables
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using fallback values for development only.');
  console.info('If this is a production environment, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection and log the result
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Define types for database schema
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  password?: string; // Added password field as optional
  role: 'user' | 'admin' | 'superadmin';
  profile_image: string | null;
  created_at: string;
  phone?: string;
  address?: string;
  occupation?: string;
  bio?: string;
}

export type Salon = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  rating?: number;
  logo_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  
  // Extended properties for UI functionality
  hours?: {
    [key: string]: string;
  };
  services?: {
    id: string;
    name: string;
    duration: string;
    price: string;
  }[];
  images?: string[];
  appointments?: {
    id: string;
    customer: string;
    customerEmail: string;
    service: string;
    date: string;
    status: string;
  }[];
  features?: {
    id: string;
    name: string;
    icon: string;
  }[];
}

export type Service = {
  id: string;
  salon_id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type Stylist = {
  id: string;
  salon_id: string;
  name: string;
  bio: string;
  specialties: string[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type Appointment = {
  id: string;
  user_id: string;
  salon_id: string;
  service_id: string;
  stylist_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  user_id: string;
  salon_id: string;
  appointment_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// News/Promotions type
export type News = {
  id: string;
  salon_id: string;
  title: string;
  content: string;
  image_url?: string;
  starts_at: string;
  ends_at: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Current authenticated user's type
export type AuthUser = {
  id: string;
  email: string;
}

// Feature type with properly typed status
export type Feature = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'in_development';
  created_at: string;
  updated_at?: string;
  is_premium: boolean;
}

// Feature suggestion type with properly typed status
export type FeatureSuggestion = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  updated_at?: string;
  user_id?: string;
  submitted_by: string;
}
