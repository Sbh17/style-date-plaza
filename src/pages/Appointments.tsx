
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock appointments data
const MOCK_APPOINTMENTS = [
  {
    id: "a1",
    status: "upcoming",
    salonId: "1",
    salonName: "Elegance Beauty Salon",
    salonImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    service: "Haircut & Style",
    price: "$65",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: "11:00 AM",
    address: "123 Beauty Street, Downtown"
  },
  {
    id: "a2",
    status: "upcoming",
    salonId: "2",
    salonName: "Pure Bliss Spa & Salon",
    salonImage: "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    service: "Facial",
    price: "$85",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: "2:30 PM",
    address: "456 Spa Avenue, Westside"
  },
  {
    id: "a3",
    status: "past",
    salonId: "4",
    salonName: "Serenity Nail Spa",
    salonImage: "https://images.unsplash.com/photo-1610992235683-e39abc5e4fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    service: "Manicure & Pedicure",
    price: "$75",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    time: "10:00 AM",
    address: "789 Nail Street, Eastside"
  }
];

interface AppointmentCardProps {
  appointment: typeof MOCK_APPOINTMENTS[0];
  onCancel: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel }) => {
  const isUpcoming = appointment.status === "upcoming";
  
  return (
    <div className={cn(
      "rounded-xl border border-border p-4 transition-all animate-scale-in",
      isUpcoming ? "glass" : "bg-secondary/20"
    )}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-md overflow-hidden shrink-0">
          <img 
            src={appointment.salonImage} 
            alt={appointment.salonName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{appointment.salonName}</h3>
          <p className="text-sm text-primary font-medium">{appointment.service}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{appointment.address}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-sm">{format(appointment.date, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-sm">{appointment.time}</span>
          </div>
        </div>
        
        {isUpcoming ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => onCancel(appointment.id)}
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancel
          </Button>
        ) : (
          <div className="flex items-center">
            <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
            <span className="text-sm">Completed</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<typeof MOCK_APPOINTMENTS>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate loading appointments
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(MOCK_APPOINTMENTS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const upcomingAppointments = appointments.filter(app => app.status === "upcoming");
  const pastAppointments = appointments.filter(app => app.status === "past");
  
  const handleCancelAppointment = (id: string) => {
    // In a real app, this would be an API call
    console.log(`Cancelling appointment ${id}`);
    
    // Update local state
    setAppointments(prev => 
      prev.filter(appointment => appointment.id !== id)
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">My Appointments</h1>
          <p className="text-muted-foreground text-sm">
            Manage your upcoming and past appointments
          </p>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="pt-4 space-y-4">
            {loading ? (
              Array(2).fill(0).map((_, idx) => (
                <div key={idx} className="rounded-xl border border-border p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-md bg-muted"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No upcoming appointments</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any upcoming appointments scheduled.
                </p>
                <Button asChild className="mt-4">
                  <a href="/">Book an Appointment</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="pt-4 space-y-4">
            {loading ? (
              Array(1).fill(0).map((_, idx) => (
                <div key={idx} className="rounded-xl border border-border p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-md bg-muted"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No past appointments</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any past appointment history.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Appointments;
