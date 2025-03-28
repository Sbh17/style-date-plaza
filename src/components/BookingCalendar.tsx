
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfDay, addHours, isBefore, isAfter, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface BookingCalendarProps {
  salonId: string;
  serviceId: string;
  stylistId?: string;
  onBookingComplete?: (appointmentId: string) => void;
}

interface TimeSlot {
  time: Date;
  available: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  salonId,
  serviceId,
  stylistId,
  onBookingComplete
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [service, setService] = useState<any>(null);
  const [salon, setSalon] = useState<any>(null);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSalonAndService = async () => {
      try {
        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();
          
        if (serviceError) throw serviceError;
        
        // Fetch salon details
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('id', salonId)
          .single();
          
        if (salonError) throw salonError;
        
        setService(serviceData);
        setSalon(salonData);
      } catch (error) {
        console.error('Error fetching service or salon:', error);
        toast.error('Could not load salon or service details');
      }
    };

    fetchSalonAndService();
  }, [salonId, serviceId]);

  useEffect(() => {
    if (!selectedDate || !service) return;
    
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        // Fetch existing appointments for the selected date
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        
        const query = supabase
          .from('appointments')
          .select('*')
          .eq('salon_id', salonId)
          .eq('date', dateString);
          
        if (stylistId) {
          query.eq('stylist_id', stylistId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setExistingAppointments(data || []);
        
        // Generate time slots
        generateTimeSlots(data || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Could not load availability');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedDate, service, salonId, stylistId]);

  const generateTimeSlots = (existingAppointments: any[]) => {
    if (!service) return;
    
    // Business hours (9 AM to 7 PM)
    const startHour = 9;
    const endHour = 19;
    
    // Service duration in hours
    const serviceDuration = service.duration / 60; // convert minutes to hours
    
    const slots: TimeSlot[] = [];
    const currentDate = new Date();
    
    // Start from 9 AM on the selected date
    const startOfSelectedDate = startOfDay(selectedDate);
    
    for (let hour = startHour; hour <= endHour - serviceDuration; hour += 0.5) {
      const slotTime = addHours(startOfSelectedDate, hour);
      
      // Skip slots in the past
      if (isBefore(slotTime, currentDate) && !isSameDay(slotTime, currentDate)) {
        continue;
      }
      
      // Check if the slot overlaps with existing appointments
      const slotEndTime = addHours(slotTime, serviceDuration);
      
      const isAvailable = !existingAppointments.some(appointment => {
        const appointmentStart = new Date(`${appointment.date}T${appointment.start_time}`);
        const appointmentEnd = new Date(`${appointment.date}T${appointment.end_time}`);
        
        // Check for overlap
        return (
          (isAfter(slotTime, appointmentStart) && isBefore(slotTime, appointmentEnd)) ||
          (isAfter(slotEndTime, appointmentStart) && isBefore(slotEndTime, appointmentEnd)) ||
          (isBefore(slotTime, appointmentStart) && isAfter(slotEndTime, appointmentEnd))
        );
      });
      
      slots.push({
        time: slotTime,
        available: isAvailable
      });
    }
    
    setTimeSlots(slots);
  };

  const handleBookAppointment = async () => {
    if (!selectedTime || !service || !user) {
      toast.error('Please select a time');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const serviceDuration = service.duration / 60; // convert minutes to hours
      const endTime = addHours(selectedTime, serviceDuration);
      
      // Format date and times for the database
      const appointmentDate = format(selectedDate, 'yyyy-MM-dd');
      const startTimeStr = format(selectedTime, 'HH:mm:ss');
      const endTimeStr = format(endTime, 'HH:mm:ss');
      
      // Create appointment in the database
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          salon_id: salonId,
          service_id: serviceId,
          stylist_id: stylistId || null,
          date: appointmentDate,
          start_time: startTimeStr,
          end_time: endTimeStr,
          status: 'pending',
          notes: ''
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Appointment booked successfully!');
      
      if (onBookingComplete && data) {
        onBookingComplete(data.id);
      }
      
      // Reset selections
      setSelectedTime(null);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to render time slots
  const renderTimeSlots = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-3 gap-2 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
      );
    }
    
    if (timeSlots.length === 0) {
      return <p className="text-center py-4 text-muted-foreground">No available time slots</p>;
    }
    
    return (
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            variant={selectedTime && isSameDay(selectedTime, slot.time) && selectedTime.getHours() === slot.time.getHours() && selectedTime.getMinutes() === slot.time.getMinutes() ? 'default' : 'outline'}
            disabled={!slot.available}
            onClick={() => setSelectedTime(slot.time)}
            className={cn(
              'h-10',
              !slot.available && 'opacity-50 cursor-not-allowed'
            )}
          >
            {format(slot.time, 'h:mm a')}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Book an Appointment
        </CardTitle>
        <CardDescription>
          {service && salon && `${service.name} at ${salon.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              disabled={(date) => 
                isBefore(date, startOfDay(new Date())) || 
                date.getDay() === 0 // Disable Sundays
              }
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-2">Select Time</h3>
            {selectedDate && renderTimeSlots()}
          </div>
        </div>
        
        {service && (
          <div className="bg-muted p-3 rounded-md flex items-start">
            <Info className="h-5 w-5 mr-2 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Service Details</h4>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">Duration: </span>
                {service.duration} minutes
              </div>
              <div className="text-sm">
                <span className="font-medium">Price: </span>
                ${service.price}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBookAppointment} 
          disabled={!selectedTime || isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingCalendar;
