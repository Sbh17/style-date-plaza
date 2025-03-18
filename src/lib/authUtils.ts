
import { supabase } from './supabase';
import { toast } from 'sonner';

/**
 * Send OTP verification email
 * @param email User's email address
 * @returns Promise resolving to success status
 */
export const sendOTPVerification = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    toast.error(error.message || 'Failed to send verification code');
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
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('OTP verification failed:', error);
    toast.error(error.message || 'Invalid verification code');
    return false;
  }
};
