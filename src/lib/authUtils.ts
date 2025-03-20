
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
    console.log('Sending OTP to:', email);
    const { error, data } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allow creating new users with OTP
      }
    });
    
    if (error) throw error;
    
    console.log('OTP response:', data);
    toast.success(`Verification code sent to ${email}`);
    toast.info('Please check your inbox and spam folder');
    
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

/**
 * Send appointment reminder to user
 * @param email User's email address
 * @param appointmentDetails Details about the appointment
 * @returns Promise resolving to success status
 */
export const sendAppointmentReminder = async (
  email: string, 
  appointmentDetails: {
    salonName: string;
    serviceName: string;
    date: string;
    time: string;
  },
  phoneNumber?: string
): Promise<boolean> => {
  try {
    const { salonName, serviceName, date, time } = appointmentDetails;
    
    console.log('Sending appointment reminder to:', email, appointmentDetails);
    console.log('Phone number (if provided):', phoneNumber);
    
    // Check if we have proper Supabase credentials
    if (!isSupabaseConfigured()) {
      console.warn('Using mock notification due to missing Supabase credentials');
      toast.success(`Development mode: Reminder would be sent to ${email}`);
      if (phoneNumber) {
        toast.success(`Development mode: SMS would be sent to ${phoneNumber}`);
      }
      return true;
    }
    
    // Use Supabase to send the email notification
    // In a real implementation, you would use a server function or a service like SendGrid
    const { error } = await supabase.functions.invoke('send-appointment-reminder', {
      body: {
        email,
        phoneNumber,
        salonName,
        serviceName,
        date,
        time
      }
    });
    
    if (error) throw error;
    
    toast.success(`Appointment reminder sent to ${email}`);
    if (phoneNumber) {
      toast.success(`SMS reminder sent to ${phoneNumber}`);
    }
    return true;
  } catch (error: any) {
    console.error('Failed to send appointment reminder:', error);
    toast.error(`Failed to send reminder: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Check for upcoming appointments and send reminders if needed
 * This function would typically be called by a cron job or scheduled task
 * @returns Promise resolving to success status
 */
export const checkAndSendUpcomingAppointmentReminders = async (): Promise<boolean> => {
  try {
    console.log('Checking for upcoming appointments...');
    
    // Check if we have proper Supabase credentials
    if (!isSupabaseConfigured()) {
      console.warn('Using mock reminders due to missing Supabase credentials');
      toast.info('Development mode: Would check for upcoming appointments');
      return true;
    }
    
    // Get tomorrow's date in ISO format (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    // Get all appointments scheduled for tomorrow
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, 
        date, 
        start_time,
        services(name),
        salons(name),
        profiles(email, phone)
      `)
      .eq('date', tomorrowDate)
      .eq('status', 'confirmed');
    
    if (error) throw error;
    
    if (!appointments || appointments.length === 0) {
      console.log('No upcoming appointments found for tomorrow');
      return true;
    }
    
    console.log(`Found ${appointments.length} appointments for tomorrow`);
    
    // Send reminders for each appointment
    for (const appointment of appointments) {
      const profileEmail = appointment.profiles?.email;
      const profilePhone = appointment.profiles?.phone;
      
      if (profileEmail) {
        await sendAppointmentReminder(
          profileEmail,
          {
            salonName: appointment.salons?.name || 'the salon',
            serviceName: appointment.services?.name || 'your service',
            date: new Date(appointment.date).toLocaleDateString(),
            time: appointment.start_time
          },
          profilePhone
        );
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Failed to check upcoming appointments:', error);
    toast.error(`Failed to check upcoming appointments: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Admin function to manually send reminders for selected appointments
 * @param appointmentIds Array of appointment IDs to send reminders for
 * @returns Promise resolving to success status
 */
export const sendManualAppointmentReminders = async (appointmentIds: string[]): Promise<boolean> => {
  try {
    console.log('Sending manual reminders for appointments:', appointmentIds);
    
    // Check if we have proper Supabase credentials
    if (!isSupabaseConfigured()) {
      console.warn('Using mock reminders due to missing Supabase credentials');
      toast.success(`Development mode: Would send reminders for ${appointmentIds.length} appointments`);
      return true;
    }
    
    // Get details for the specified appointments
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, 
        date, 
        start_time,
        services(name),
        salons(name),
        profiles(email, phone)
      `)
      .in('id', appointmentIds);
    
    if (error) throw error;
    
    if (!appointments || appointments.length === 0) {
      toast.error('No appointment details found');
      return false;
    }
    
    // Send reminders for each appointment
    for (const appointment of appointments) {
      const profileEmail = appointment.profiles?.email;
      const profilePhone = appointment.profiles?.phone;
      
      if (profileEmail) {
        await sendAppointmentReminder(
          profileEmail,
          {
            salonName: appointment.salons?.name || 'the salon',
            serviceName: appointment.services?.name || 'your service',
            date: new Date(appointment.date).toLocaleDateString(),
            time: appointment.start_time
          },
          profilePhone
        );
      }
    }
    
    toast.success(`Sent reminders for ${appointments.length} appointments`);
    return true;
  } catch (error: any) {
    console.error('Failed to send manual reminders:', error);
    toast.error(`Failed to send reminders: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Send a test appointment reminder
 * @param email Email address to send the reminder to
 * @param phoneNumber Optional phone number to send SMS reminder to
 * @returns Promise resolving to success status
 */
export const sendTestAppointmentReminder = async (
  email: string,
  phoneNumber?: string
): Promise<boolean> => {
  try {
    console.log('Sending test appointment reminder to:', email);
    if (phoneNumber) {
      console.log('Also sending SMS reminder to:', phoneNumber);
    }
    
    // Create test appointment details
    const testAppointmentDetails = {
      salonName: 'Beautiful Salon',
      serviceName: 'Haircut',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(), // Tomorrow
      time: '14:30'
    };
    
    return await sendAppointmentReminder(email, testAppointmentDetails, phoneNumber);
    
  } catch (error: any) {
    console.error('Failed to send test reminder:', error);
    toast.error(`Failed to send test reminder: ${error.message || 'Unknown error'}`);
    return false;
  }
};
