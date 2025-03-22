
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Store a user's password in the profiles table (for development/demo purposes only)
 * NOTE: This is NOT recommended for production applications as it stores passwords in plain text
 * In a real application, use Supabase Auth which already handles secure password storage
 */
export const storeUserPassword = async (
  userId: string,
  password: string
): Promise<boolean> => {
  try {
    if (!userId || !password) {
      console.error('Missing userId or password');
      return false;
    }
    
    // Update profile with password
    const { error } = await supabase
      .from('profiles')
      .update({ password })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Failed to store password:', error);
      return false;
    }
    
    console.log('Password stored for user:', userId);
    return true;
  } catch (error) {
    console.error('Error storing password:', error);
    return false;
  }
};

/**
 * Get a user's password from the profiles table (for development/demo purposes only)
 */
export const getUserPassword = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('password')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error('Failed to get password:', error);
      return null;
    }
    
    return data.password;
  } catch (error) {
    console.error('Error getting password:', error);
    return null;
  }
};
