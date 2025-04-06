import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Globe, Star, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import SalonReviewsSection from '@/components/SalonReviewsSection';

const MOCK_SALON = {
  id: "1",
  name: "Elegance Beauty Salon",
  description: "A premier beauty salon offering a wide range of services from haircuts and styling to nail care and facial treatments. Our experienced stylists are dedicated to making you look and feel your best.",
  address: "123 Main Street, Downtown",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  phone: "(212) 555-1234",
  email: "info@elegancebeauty.com",
  website: "www.elegancebeauty.com",
  rating: 4.8,
  hours: {
    monday: "9:00 AM - 7:00 PM",
    tuesday: "9:00 AM - 7:00 PM",
    wednesday: "9:00 AM - 7:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "10:00 AM - 6:00 PM",
    sunday: "Closed"
  },
  services: [
    { id: "s1", name: "Women's Haircut", duration: "45 min", price: "$65" },
    { id: "s2", name: "Men's Haircut", duration: "30 min", price: "$45" },
    { id: "s3", name: "Hair Coloring", duration: "120 min", price: "$120" },
    { id: "s4", name: "Blowout", duration: "45 min", price: "$55" },
    { id: "s5", name: "Manicure", duration: "30 min", price: "$35" },
    { id: "s6", name: "Pedicure", duration: "45 min", price: "$45" },
    { id: "s7", name: "Facial", duration: "60 min", price: "$85" },
    { id: "s8", name: "Waxing", duration: "30 min", price: "$40" }
  ],
  images: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  ],
  appointments: [
    { id: "a1", customer: "Jane Smith", customerEmail: "jane@example.com", service: "Women's Haircut", date: "2023-09-15 10:00 AM", status: "Confirmed" },
    { id: "a2", customer: "John Doe", customerEmail: "john@example.com", service: "Men's Haircut", date: "2023-09-16 2:30 PM", status: "Pending" }
  ],
  features: [
    { id: "f1", name: "Free WiFi", icon: "wifi" },
    { id: "f2", name: "Parking Available", icon: "parking" },
    { id: "f3", name: "Wheelchair Accessible", icon: "wheelchair" },
    { id: "f4", name: "Coffee & Tea", icon: "coffee" }
  ]
};

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchSalonDetails = async () => {
      if (!id) return;
      
      try {
        setTimeout(() => {
          setSalon(MOCK_SALON);
          setLoading(false);
        }, 500);
        
      } catch (error: any) {
        console.error('Error fetching salon details:', error);
        toast.error(`Failed to load salon details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalonDetails();
  }, [id]);
  
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book an appointment');
      navigate('/sign-in');
      return;
    }
    
    toast.success('Booking functionality coming soon!');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Layout>
    );
  }
  
  if (!salon) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Salon Not Found</h2>
          <p className="text-muted-foreground mb-4">The salon you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{salon.name}</h1>
        </div>
        
        <div className="relative">
          <div className="aspect-[16/9] rounded-xl overflow-hidden">
            <img 
              src={salon.images[activeImageIndex]} 
              alt={salon.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {salon.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {salon.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    salon.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm">{salon.rating} (243 reviews)</span>
          </div>
          
          <p className="text-sm text-muted-foreground">{salon.description}</p>
          
          <Button 
            className="w-full"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{salon.address}, {salon.city}, {salon.state} {salon.zipCode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Hours</p>
              <p className="text-sm text-muted-foreground">Today: {salon.hours.monday}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              View All
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{salon.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{salon.email}</p>
            </div>
          </div>
          
          {salon.website && (
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-sm text-muted-foreground">{salon.website}</p>
              </div>
            </div>
          )}
        </div>
        
        <SalonReviewsSection className="pt-2" />
        
        <Tabs defaultValue="services">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-4 pt-4">
            {salon.services && salon.services.map((service) => (
              <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{service.price}</p>
                  <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4 pt-4">
            <div>
              <h3 className="font-medium mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {salon.features.map((feature) => (
                  <Badge key={feature.id} variant="outline">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(salon.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>{hours as string}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Upcoming Appointments</h3>
              {isAuthenticated ? (
                salon.appointments.length > 0 ? (
                  <div className="space-y-2">
                    {salon.appointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{appointment.service}</p>
                          <Badge variant={appointment.status === "Confirmed" ? "default" : "outline"}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{appointment.date}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      View All Appointments
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You don't have any appointments with this salon yet.
                  </p>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to view and manage your appointments
                  </p>
                  <Button onClick={() => navigate('/sign-in')}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SalonDetails;
