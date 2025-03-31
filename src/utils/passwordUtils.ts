
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { toast } from 'sonner';

// Using a browser-friendly password hashing approach since bcrypt is not available in the browser
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Simple hash function for demonstration (not secure for production)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error: any) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

export const checkPassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    // For demonstration purposes - hash the plain text and compare
    const hashedInput = await hashPassword(plainTextPassword);
    return hashedInput === hashedPassword;
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
        new_password: await hashPassword(newPassword)
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
