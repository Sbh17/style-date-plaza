
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const setupSuperAdmin = async (email: string, password: string, name: string) => {
  try {
    console.log("Setting up super admin with", email);
    
    // Check if table exists first
    const { data: tablesData, error: tablesError } = await supabase.rpc('check_table_exists', {
      table_name: 'profiles'
    });
    
    if (tablesError) {
      console.error("Error checking if table exists:", tablesError);
      throw new Error(`Database error: ${tablesError.message}`);
    }
    
    // Create superadmin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.user.id,
          name,
          email,
          role: 'superadmin',
          created_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      toast.success(`Super admin account created successfully for ${email}`);
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error setting up superadmin:", error);
    toast.error(`Failed to create super admin: ${error.message}`);
    throw error;
  }
};

// RPC function for checking if table exists (reference only - this should be created in Supabase)
/*
create or replace function check_table_exists(table_name text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select from information_schema.tables 
    where table_schema = 'public'
    and table_name = $1
  );
end;
$$;
*/
