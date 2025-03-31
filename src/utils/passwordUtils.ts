
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { toast } from 'sonner';
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const SALT_ROUNDS = 10;
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error: any) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

export const checkPassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error: any) {
    console.error('Error checking password:', error);
    return false;
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    // Update auth.users password via the Supabase Auth API
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (authError) throw authError;
    
    // If you're storing a hashed password in profiles for development/demo purposes
    try {
      const { error: profileError } = await supabase.rpc('update_profile_password', {
        user_id: userId,
        new_password: newPassword
      });
      
      if (profileError) {
        console.warn('Could not update profile password, but auth password was updated:', profileError);
      }
    } catch (e) {
      console.warn('Failed to update profile password (RPC may not exist), but auth password was updated');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error updating password:', error);
    toast.error(error.message || 'Failed to update password');
    return false;
  }
};

// RPC function for updating password in profiles (reference only - this should be created in Supabase)
/*
create or replace function update_profile_password(user_id uuid, new_password text)
returns void
language plpgsql
security definer
as $$
begin
  update profiles 
  set password = new_password
  where user_id = $1;
end;
$$;
*/
