
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { isSupabaseConfigured } from '@/lib/authUtils';
import { createNewUser } from '@/lib/authUtils';

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
    
    // Check if user already exists with this email
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
      
    if (userCheckError) {
      console.error('Error checking for existing user:', userCheckError);
      // Continue anyway
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('User with this email already exists, updating role to superadmin');
      
      // Update the existing user's role to superadmin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'superadmin' })
        .eq('email', email);
        
      if (updateError) {
        console.error('Error updating user role:', updateError);
        throw updateError;
      }
      
      toast.success(`${email} updated to superadmin role. You can now sign in.`);
      return true;
    }
    
    // If the user doesn't exist, create a new superadmin user
    const result = await createNewUser(email, password, name, 'superadmin');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create superadmin');
    }
    
    toast.success(`Superadmin created successfully: ${email}`);
    return true;
  } catch (error: any) {
    console.error('Error setting up superadmin:', error);
    toast.error(error.message || 'Failed to create superadmin');
    return false;
  }
};
