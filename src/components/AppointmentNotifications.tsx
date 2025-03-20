import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Bell, Calendar, Clock, CheckCircle2, RefreshCw, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { toast } from 'sonner';
import { 
  checkAndSendUpcomingAppointmentReminders, 
  sendManualAppointmentReminders,
  sendTestAppointmentReminder 
} from '@/lib/authUtils';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import type { Appointment } from '@/lib/supabase';

interface AppointmentWithDetails extends Appointment {
  salon_name?: string;
  service_name?: string;
  customer_name?: string;
  customer_email?: string;
}

interface TestReminderFormValues {
  email: string;
  phoneNumber?: string;
  senderPhone?: string;
}

const AppointmentNotifications: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithDetails[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isAutomatedRunning, setIsAutomatedRunning] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  
  const testForm = useForm<TestReminderFormValues>({
    defaultValues: {
      email: 'sabreboshnaq@icloud.com',
      phoneNumber: '0549331362',
      senderPhone: '0543923543'
    }
  });

  const fetchUpcomingAppointments = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const todayString = today.toISOString().split('T')[0];
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          start_time,
          end_time,
          status,
          salon_id,
          service_id,
          user_id,
          created_at,
          updated_at
        `)
        .in('date', [todayString, tomorrowString])
        .in('status', ['pending', 'confirmed']);
      
      if (error) throw error;
      
      if (data) {
        const appointmentsWithDetails = await Promise.all(
          data.map(async (appointment) => {
            let salon_name = '';
            let service_name = '';
            let customer_name = '';
            let customer_email = '';
            
            const { data: salonData } = await supabase
              .from('salons')
              .select('name')
              .eq('id', appointment.salon_id)
              .single();
              
            if (salonData) salon_name = salonData.name;
            
            const { data: serviceData } = await supabase
              .from('services')
              .select('name')
              .eq('id', appointment.service_id)
              .single();
              
            if (serviceData) service_name = serviceData.name;
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('user_id', appointment.user_id)
              .single();
              
            if (profileData) {
              customer_name = profileData.name;
              customer_email = profileData.email;
            }
            
            return {
              ...appointment,
              salon_name,
              service_name,
              customer_name,
              customer_email
            } as AppointmentWithDetails;
          })
        );
        
        setUpcomingAppointments(appointmentsWithDetails);
      }
    } catch (error: any) {
      console.error('Error fetching upcoming appointments:', error);
      toast.error(`Failed to load appointments: ${error.message || 'Unknown error'}`);
      
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const mockData: AppointmentWithDetails[] = [
          {
            id: '1',
            salon_id: 'salon-1',
            service_id: 'service-1',
            user_id: 'user-1',
            date: '2025-03-21',
            start_time: '10:00',
            end_time: '11:00',
            status: 'confirmed',
            created_at: '2025-03-20',
            updated_at: '2025-03-20',
            salon_name: 'Beautiful Salon',
            service_name: 'Haircut',
            customer_name: 'John Doe',
            customer_email: 'john@example.com'
          },
          {
            id: '2',
            salon_id: 'salon-2',
            service_id: 'service-2',
            user_id: 'user-2',
            date: '2025-03-21',
            start_time: '14:30',
            end_time: '15:30',
            status: 'pending',
            created_at: '2025-03-20',
            updated_at: '2025-03-20',
            salon_name: 'Style Masters',
            service_name: 'Manicure',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com'
          }
        ];
        setUpcomingAppointments(mockData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const handleSelectAppointment = (appointmentId: string) => {
    setSelectedAppointments((prev) => 
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === upcomingAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(upcomingAppointments.map(app => app.id));
    }
  };

  const handleRunAutomatedReminders = async () => {
    setIsAutomatedRunning(true);
    try {
      const success = await checkAndSendUpcomingAppointmentReminders();
      if (success) {
        toast.success('Automated reminders processed successfully');
      }
    } catch (error: any) {
      console.error('Error running automated reminders:', error);
      toast.error(`Failed to run automated reminders: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAutomatedRunning(false);
    }
  };

  const handleSendManualReminders = async () => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select at least one appointment');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await sendManualAppointmentReminders(selectedAppointments);
      if (success) {
        toast.success(`Reminders sent for ${selectedAppointments.length} appointments`);
        setSelectedAppointments([]);
      }
    } catch (error: any) {
      console.error('Error sending manual reminders:', error);
      toast.error(`Failed to send reminders: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendTestReminder = async (data: TestReminderFormValues) => {
    setIsSendingTest(true);
    try {
      console.log('Sending test reminder to:', data.email, data.phoneNumber);
      console.log('Sender phone:', data.senderPhone);
      
      const success = await sendTestAppointmentReminder(data.email, data.phoneNumber);
      if (success) {
        toast.success('Test reminder sent successfully');
        toast.info(`Email sent to: ${data.email}`);
        if (data.phoneNumber) {
          toast.info(`SMS sent to: ${data.phoneNumber}`);
        }
        setShowTestForm(false);
      }
    } catch (error: any) {
      console.error('Error sending test reminder:', error);
      toast.error(`Failed to send test reminder: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointment Notifications</h2>
          <p className="text-muted-foreground">
            Manage automatic and manual reminders for upcoming appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchUpcomingAppointments}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            onClick={handleRunAutomatedReminders}
            disabled={isAutomatedRunning}
          >
            <Bell className="h-4 w-4 mr-2" />
            Run Automated Reminders
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Appointment Reminder</CardTitle>
          <CardDescription>
            Send a test appointment reminder to verify your notification setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showTestForm ? (
            <Form {...testForm}>
              <form onSubmit={testForm.handleSubmit(handleSendTestReminder)} className="space-y-4">
                <FormField
                  control={testForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>The email address to send the test reminder to</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={testForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0549331362" {...field} />
                      </FormControl>
                      <FormDescription>Phone number to receive SMS reminder</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={testForm.control}
                  name="senderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Phone Number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="0543923543" {...field} />
                      </FormControl>
                      <FormDescription>Phone number to send SMS from (ILS)</FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSendingTest}>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    {isSendingTest ? 'Sending...' : 'Send Test Reminder'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowTestForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Send a test reminder to verify your notification system is working correctly.
              </p>
              <Button onClick={() => setShowTestForm(true)}>
                <Bell className="h-4 w-4 mr-2" />
                Set Up Test Reminder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Select appointments to send manual reminders
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={
                  upcomingAppointments.length > 0 && 
                  selectedAppointments.length === upcomingAppointments.length
                }
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm">Select All</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming appointments found
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox 
                    id={`appointment-${appointment.id}`}
                    checked={selectedAppointments.includes(appointment.id)}
                    onCheckedChange={() => handleSelectAppointment(appointment.id)}
                    className="mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium truncate">
                          {appointment.customer_name || 'Unknown Customer'}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {appointment.customer_email || 'No email available'}
                        </p>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {appointment.start_time} - {appointment.end_time}
                      </div>
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="text-muted-foreground mr-1">Service:</span>
                      {appointment.service_name || 'Unknown Service'}
                      <span className="mx-2">•</span>
                      <span className="text-muted-foreground mr-1">Salon:</span>
                      {appointment.salon_name || 'Unknown Salon'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t p-4">
          <div className="text-sm text-muted-foreground">
            {selectedAppointments.length} of {upcomingAppointments.length} selected
          </div>
          <Button
            onClick={handleSendManualReminders}
            disabled={selectedAppointments.length === 0 || isLoading}
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Automatic Reminder Settings</CardTitle>
          <CardDescription>
            Configure when automatic reminders are sent to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">24-Hour Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic reminders are sent 24 hours before each appointment. 
                  This helps reduce no-shows and gives customers time to reschedule if needed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Manual Override</h3>
                <p className="text-sm text-muted-foreground">
                  You can also send manual reminders at any time by selecting appointments 
                  from the list above. This is useful for last-minute schedule changes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentNotifications;
