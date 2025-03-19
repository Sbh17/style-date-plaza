
import { supabase } from './supabase';
import { toast } from 'sonner';

/**
 * Send OTP verification email
 * @param email User's email address
 * @returns Promise resolving to success status
 */
export const sendOTPVerification = async (email: string): Promise<boolean> => {
  try {
    // Check if we have proper Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Using mock authentication due to missing Supabase credentials');
      // Simulate successful OTP send for development purposes
      toast.success(`Development mode: Verification code sent to ${email}`);
      toast.info('In development mode, any 6-digit code will work for verification');
      return true;
    }
    
    // Changed to allow new user creation
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allow creating new users with OTP
      }
    });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    // More descriptive error message
    const errorMessage = error.message || 'Failed to connect to authentication service';
    toast.error(errorMessage);
    
    // Special case for connection errors
    if (error.message?.includes('fetch failed') || error.message?.includes('network')) {
      toast.error('Connection to Supabase failed. Please check your internet connection or try again later.');
    }
    
    return false;
  }
};

/**
 * Verify OTP code from email
 * @param email User's email address
 * @param otp The OTP code to verify
 * @returns Promise resolving to success status
 */
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    // Check if we have proper Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Using mock authentication due to missing Supabase credentials');
      // For development, accept any 6-digit code
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        toast.success('Development mode: Email verified successfully');
        return true;
      } else {
        throw new Error('Invalid verification code format. In development mode, use any 6 digits.');
      }
    }
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('OTP verification failed:', error);
    
    // More descriptive error messages
    const errorMessage = error.message || 'Invalid verification code';
    toast.error(errorMessage);
    
    // Special case for connection errors
    if (error.message?.includes('fetch failed') || error.message?.includes('network')) {
      toast.error('Connection to Supabase failed. Please check your internet connection or try again later.');
    }
    
    return false;
  }
};

/**
 * Helper to check if Supabase is properly configured
 * @returns Boolean indicating if Supabase credentials are set
 */
export const isSupabaseConfigured = (): boolean => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};
