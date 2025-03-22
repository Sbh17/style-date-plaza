
import { createSuperAdminUser } from '@/api/salonApi';
import { toast } from 'sonner';

// Function to create a new superadmin user
export const setupSuperAdmin = async (
  email: string, 
  password: string, 
  name: string
): Promise<boolean> => {
  try {
    toast.loading('Creating superadmin user...');
    const success = await createSuperAdminUser(email, password, name);
    
    if (success) {
      toast.success(`Superadmin ${name} created successfully! You can now log in.`);
      return true;
    } else {
      toast.error('Failed to create superadmin user');
      return false;
    }
  } catch (error: any) {
    console.error('Error setting up superadmin:', error);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};
