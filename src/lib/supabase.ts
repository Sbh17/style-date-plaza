
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
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

// Current authenticated user's type
export type AuthUser = {
  id: string;
  email: string;
}
