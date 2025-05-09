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

// Define RollbackAction type for the history component
export type RollbackAction = {
  id: string;
  timestamp: Date;
  description: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
};

// Mock functions for rollback functionality until we implement the real versions
export const getRollbackHistory = (): RollbackAction[] => {
  // For now, return empty array or mock data
  return [];
};

export const rollbackAction = async (actionId: string): Promise<boolean> => {
  // Mock implementation
  console.log(`Rollback requested for action: ${actionId}`);
  toast.success('Rollback operation would occur here');
  return true;
};

export const clearRollbackHistory = (): void => {
  // Mock implementation
  console.log('Clear rollback history requested');
  toast.success('History cleared');
};

export const rollbackWebsiteToDate = async (date: Date): Promise<boolean> => {
  // Mock implementation
  console.log(`Rollback to date requested: ${date.toISOString()}`);
  toast.success(`Website would be rolled back to ${date.toLocaleString()}`);
  return true;
};

// Type-safe table name for getTableData
type TableName = 'profiles' | 'salons' | 'services' | 'stylists' | 
                'appointments' | 'reviews' | 'news' | 'features' | 
                'feature_suggestions' | 'user_settings';

// Other utility functions to query and manage data safely
export const getTableData = async (tableName: TableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error fetching data from ${tableName}:`, error);
    toast.error(`Failed to fetch ${tableName}: ${error.message}`);
    return null;
  }
};

// Check if a database table exists
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: tableName
    });
    
    if (error) throw error;
    return !!data;
  } catch (error: any) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Get average rating for a salon
export const getSalonRating = async (salonId: string): Promise<{ rating: number, count: number } | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('salon_id', salonId);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      const total = data.reduce((sum, review) => sum + review.rating, 0);
      const average = Number((total / data.length).toFixed(1));
      return { rating: average, count: data.length };
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error fetching salon rating:`, error);
    return null;
  }
};

// Update salon rating in the salons table
export const updateSalonRating = async (salonId: string): Promise<boolean> => {
  try {
    const ratingData = await getSalonRating(salonId);
    
    if (ratingData) {
      const { error } = await supabase
        .from('salons')
        .update({ rating: ratingData.rating })
        .eq('id', salonId);
        
      if (error) throw error;
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error(`Error updating salon rating:`, error);
    toast.error(`Failed to update salon rating: ${error.message}`);
    return false;
  }
};
