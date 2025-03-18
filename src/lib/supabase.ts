
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for environment variables - with clearer error message
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please make sure your Supabase connection is properly set up.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Define types for database schema
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile_image: string | null;
  created_at: string;
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

// Current authenticated user's type
export type AuthUser = {
  id: string;
  email: string;
}
