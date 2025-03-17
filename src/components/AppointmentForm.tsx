
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AppointmentFormProps {
  salonId: string;
  salonName: string;
  services: { id: string; name: string; duration: string; price: string }[];
  onSubmit: (appointment: {
    salonId: string;
    serviceId: string;
    date: Date;
    time: string;
  }) => void;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  salonId,
  salonName,
  services,
  onSubmit
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  
  const handleSubmit = () => {
    if (!date || !time || !selectedService) return;
    
    onSubmit({
      salonId,
      serviceId: selectedService,
      date,
      time
    });
  };
  
  const selectedServiceObj = services.find(s => s.id === selectedService);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Book Appointment</h2>
        <p className="text-muted-foreground text-sm">
          Choose a service, date, and time to book your appointment at {salonName}.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Select Service</h3>
          <div className="grid gap-2">
            {services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border transition-all duration-200",
                  selectedService === service.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="space-y-0.5">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.duration}</p>
                </div>
                <p className="font-medium">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  className={cn(
                    "justify-center py-2",
                    time === slot && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => setTime(slot)}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  <span className="text-xs">{slot}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!date || !time || !selectedService}
          className="w-full"
        >
          Book Appointment
          {selectedServiceObj && <span className="ml-1">• {selectedServiceObj.price}</span>}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentForm;
