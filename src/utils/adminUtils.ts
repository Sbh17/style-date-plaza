
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { isSupabaseConfigured } from '@/lib/authUtils';

/**
 * Setup a super admin user for quick demo purposes
 * @param email The email for the super admin
 * @param password The password for the super admin
 * @param name The name for the super admin
 * @returns Promise resolving to success status
 */
export const setupSuperAdmin = async (
  email: string,
  password: string,
  name: string
): Promise<boolean> => {
  try {
    console.log(`Setting up superadmin: ${name} (${email})`);
    
    // Check if we are running in development mode (no Supabase credentials)
    if (!isSupabaseConfigured()) {
      console.log('Dev mode: Creating mock superadmin');
      // Create a mock user in localStorage
      const mockUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role: 'superadmin',
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      };
      
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      toast.success(`Superadmin created (dev mode): ${email} / ${password}`);
      return true;
    }
    
    // Check if user already exists
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
      
    if (userCheckError) {
      console.error('Error checking for existing user:', userCheckError);
      // Continue anyway
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Superadmin already exists, logging in');
      toast.success(`Superadmin already exists: ${email} / ${password}`);
      return true;
    }
    
    // Create user in auth
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'superadmin'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error creating superadmin auth:', signUpError);
      throw signUpError;
    }
    
    if (!userData.user) {
      throw new Error('Failed to create superadmin user');
    }
    
    // Create the profile with superadmin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userData.user.id,
        name,
        email,
        password, // Store password in profiles table
        role: 'superadmin',
        profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      });
    
    if (profileError) {
      console.error('Error creating superadmin profile:', profileError);
      throw profileError;
    }
    
    toast.success(`Superadmin created: ${email} / ${password}`);
    return true;
  } catch (error: any) {
    console.error('Error setting up superadmin:', error);
    toast.error(error.message || 'Failed to create superadmin');
    return false;
  }
};
