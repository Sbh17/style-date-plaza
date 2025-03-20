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
    
    // If verification is successful, ensure user has a profile
    if (data?.user) {
      console.log('User verified:', data.user);
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
      
      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('Error checking profile:', profileError);
      }
      
      // If no profile exists, create one
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: email.split('@')[0], // Default name from email
            email: email,
            role: 'user' // Default role
          });
        
        if (insertError) {
          console.error('Failed to create profile:', insertError);
          // Continue anyway as the auth was successful
        } else {
          console.log('Created new profile for user');
        }
      }
    }
    
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
        services:service_id(name),
        salons:salon_id(name),
        profiles:user_id(email, phone)
      `)
      .eq('date', tomorrowDate)
      .eq('status', 'confirmed');
    
    if (error) throw error;
    
    if (!appointments || appointments.length === 0) {
      console.log('No upcoming appointments found for tomorrow');
      return true;
    }
    
    console.log(`Found ${appointments.length} appointments for tomorrow`);
    
    // Process each appointment correctly
    for (const appointment of appointments || []) {
      // Access profile data correctly by getting the first item if it's an array
      const profileData = Array.isArray(appointment.profiles) 
        ? appointment.profiles[0] 
        : (appointment.profiles as unknown as { email: string; phone: string });
      
      if (profileData) {
        const profileEmail = profileData.email;
        const profilePhone = profileData.phone;
        
        if (profileEmail) {
          // Access salon and service data correctly by getting the first item if it's an array
          const salonData = Array.isArray(appointment.salons) 
            ? appointment.salons[0] 
            : (appointment.salons as unknown as { name: string });
          
          const serviceData = Array.isArray(appointment.services) 
            ? appointment.services[0] 
            : (appointment.services as unknown as { name: string });
          
          await sendAppointmentReminder(
            profileEmail,
            {
              salonName: salonData?.name || 'the salon',
              serviceName: serviceData?.name || 'your service',
              date: new Date(appointment.date).toLocaleDateString(),
              time: appointment.start_time
            },
            profilePhone
          );
        }
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
    
    // Get details for the specified appointments and process them correctly
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, 
        date, 
        start_time,
        services:service_id(name),
        salons:salon_id(name),
        profiles:user_id(email, phone)
      `)
      .in('id', appointmentIds);
    
    if (error) throw error;
    
    if (!appointments || appointments.length === 0) {
      toast.error('No appointment details found');
      return false;
    }
    
    // Send reminders for each appointment
    for (const appointment of appointments || []) {
      // Access profile data correctly by getting the first item if it's an array
      const profileData = Array.isArray(appointment.profiles) 
        ? appointment.profiles[0] 
        : (appointment.profiles as unknown as { email: string; phone: string });
      
      if (profileData) {
        const profileEmail = profileData.email;
        const profilePhone = profileData.phone;
        
        if (profileEmail) {
          // Access salon and service data correctly by getting the first item if it's an array
          const salonData = Array.isArray(appointment.salons) 
            ? appointment.salons[0] 
            : (appointment.salons as unknown as { name: string });
          
          const serviceData = Array.isArray(appointment.services) 
            ? appointment.services[0] 
            : (appointment.services as unknown as { name: string });
          
          await sendAppointmentReminder(
            profileEmail,
            {
              salonName: salonData?.name || 'the salon',
              serviceName: serviceData?.name || 'your service',
              date: new Date(appointment.date).toLocaleDateString(),
              time: appointment.start_time
            },
            profilePhone
          );
        }
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

/**
 * Helper function to create a new user directly (for admin use)
 * @param email User's email address
 * @param password User's password
 * @param name User's name
 * @param role User's role (default: 'user')
 * @returns Promise resolving to success status and user object
 */
export const createNewUser = async (
  email: string,
  password: string,
  name: string,
  role: 'user' | 'admin' | 'superadmin' = 'user'
): Promise<{success: boolean, userId?: string, error?: string}> => {
  try {
    console.log('Creating new user:', email, name, role);
    
    // Check if we have proper Supabase credentials
    if (!isSupabaseConfigured()) {
      console.warn('Using mock user creation due to missing Supabase credentials');
      toast.success(`Development mode: Would create user ${name} (${email}) with role ${role}`);
      return { 
        success: true, 
        userId: crypto.randomUUID() // Mock UUID
      };
    }
    
    // 1. Create user in auth system
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });
    
    if (authError) {
      console.error('Auth creation error:', authError);
      return { 
        success: false, 
        error: authError.message 
      };
    }
    
    if (!authData.user?.id) {
      return { 
        success: false, 
        error: 'Failed to get user ID after creation' 
      };
    }
    
    // 2. Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        name,
        email,
        role
      });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Even if profile creation fails, the auth user was created
      return { 
        success: true, 
        userId: authData.user.id,
        error: `User created but profile creation failed: ${profileError.message}`
      };
    }
    
    toast.success(`User ${name} created successfully with role: ${role}`);
    return { 
      success: true, 
      userId: authData.user.id 
    };
    
  } catch (error: any) {
    console.error('Failed to create new user:', error);
    toast.error(`Failed to create user: ${error.message || 'Unknown error'}`);
    return { 
      success: false, 
      error: error.message || 'Unknown error creating user'
    };
  }
};
