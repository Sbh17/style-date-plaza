
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Helper functions for authentication logic
 */

/**
 * Validate a user's email address format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 * Returns an object with score (0-4) and feedback
 */
export const checkPasswordStrength = (password: string): { 
  score: number; 
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters");
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 3) {
    feedback.push("Add uppercase letters, numbers or special characters");
  }
  
  return {
    score: Math.min(score, 4),
    feedback: feedback.join(". ")
  };
};

/**
 * Get the appropriate class name for password strength indicator
 */
export const getPasswordStrengthClass = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return "bg-destructive";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

/**
 * Handle password reset request
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // First check if we have actual Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // Mock version for development
      console.warn('Using mock password reset due to missing Supabase credentials');
      toast.success(`Development mode: Password reset email sent to ${email}`);
      return true;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    toast.success("Password reset instructions sent to your email");
    return true;
  } catch (error: any) {
    console.error('Password reset request failed:', error);
    toast.error(error.message || "Failed to send password reset email");
    return false;
  }
};

/**
 * Get user profile from Supabase or mock data
 */
export const getUserProfile = async (userId: string) => {
  try {
    // First check if we have actual Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // Return mock profile for development
      console.warn('Using mock profile due to missing Supabase credentials');
      return {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        role: "user",
        profileImage: `https://ui-avatars.com/api/?name=Test+User`
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
};

/**
 * Update user's display name
 */
export const updateUserDisplayName = async (user: User, newName: string): Promise<boolean> => {
  try {
    // First check if we have actual Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // Mock version for development
      console.warn('Using mock profile update due to missing Supabase credentials');
      toast.success(`Name updated to ${newName}`);
      return true;
    }
    
    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { name: newName }
    });
    
    if (metadataError) throw metadataError;
    
    // Update profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name: newName })
      .eq('user_id', user.id);
      
    if (profileError) throw profileError;
    
    toast.success("Profile updated successfully");
    return true;
  } catch (error: any) {
    console.error('Failed to update user:', error);
    toast.error(error.message || "Failed to update profile");
    return false;
  }
};
