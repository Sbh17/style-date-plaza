
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

/**
 * Rollback history object to track recent changes
 */
export interface RollbackAction {
  id: string;
  timestamp: number;
  type: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  previousData: any;
  newData?: any;
  description: string;
}

// In-memory store of recent actions that can be rolled back
// In a production app, you might want to store this in a database
const actionHistory: RollbackAction[] = [];
const MAX_HISTORY_ITEMS = 50;

/**
 * Add an action to the rollback history
 */
export const trackAction = (action: Omit<RollbackAction, 'id' | 'timestamp'>) => {
  // Add the action to the history
  const newAction: RollbackAction = {
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  actionHistory.unshift(newAction);
  
  // Limit the history size
  if (actionHistory.length > MAX_HISTORY_ITEMS) {
    actionHistory.pop();
  }
  
  console.log('Action tracked for rollback:', newAction);
  return newAction.id;
};

/**
 * Get the rollback history
 */
export const getRollbackHistory = () => {
  return [...actionHistory];
};

/**
 * Rollback a specific action
 */
export const rollbackAction = async (actionId: string): Promise<boolean> => {
  try {
    // Find the action in the history
    const actionIndex = actionHistory.findIndex(a => a.id === actionId);
    if (actionIndex === -1) {
      toast.error('Action not found in history');
      return false;
    }
    
    const action = actionHistory[actionIndex];
    console.log('Rolling back action:', action);
    
    // Check if we are running in development mode
    if (!isSupabaseConfigured()) {
      // Mock rollback in dev mode
      toast.success(`Rolled back: ${action.description}`);
      actionHistory.splice(actionIndex, 1);
      return true;
    }
    
    // Perform the rollback based on the action type
    switch (action.type) {
      case 'create':
        // If it was a create action, delete the record
        const { error: deleteError } = await supabase
          .from(action.table)
          .delete()
          .eq('id', action.recordId);
          
        if (deleteError) {
          throw deleteError;
        }
        break;
        
      case 'update':
        // If it was an update action, restore the previous data
        const { error: updateError } = await supabase
          .from(action.table)
          .update(action.previousData)
          .eq('id', action.recordId);
          
        if (updateError) {
          throw updateError;
        }
        break;
        
      case 'delete':
        // If it was a delete action, recreate the record
        const { error: insertError } = await supabase
          .from(action.table)
          .insert(action.previousData);
          
        if (insertError) {
          throw insertError;
        }
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
    
    // Remove the action from the history
    actionHistory.splice(actionIndex, 1);
    
    toast.success(`Rolled back: ${action.description}`);
    return true;
  } catch (error: any) {
    console.error('Error rolling back action:', error);
    toast.error(error.message || 'Failed to rollback action');
    return false;
  }
};

/**
 * Clear all rollback history
 */
export const clearRollbackHistory = () => {
  actionHistory.length = 0;
  console.log('Rollback history cleared');
};

