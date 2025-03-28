
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xlaqlmkkualtcnpggrtx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYXFsbWtrdWFsdGNucGdncnR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzk0NTAsImV4cCI6MjA1NzkxNTQ1MH0.p_v6JJixHv_GAfGpYhV7TvHuXVdPHVhsqVkuoaBc6IU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Explicitly disable URL detection to prevent issue with localhost redirects
  }
});
