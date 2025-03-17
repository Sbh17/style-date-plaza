
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Star, Calendar, Phone } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentForm from '@/components/AppointmentForm';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock salon data
const MOCK_SALON = {
  id: "1",
  name: "Elegance Beauty Salon",
  images: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
  ],
  rating: 4.8,
  ratingCount: 243,
  address: "123 Beauty Street, Downtown",
  description: "Elegance Beauty Salon offers a wide range of services including haircuts, coloring, styling, makeup, and nail treatments. Our team of professionals is dedicated to providing you with the best beauty experience.",
  hours: {
    "Monday-Friday": "9:00 AM - 7:00 PM",
    "Saturday": "9:00 AM - 5:00 PM",
    "Sunday": "Closed"
  },
  phone: "+1 (555) 123-4567",
  services: [
    { id: "s1", name: "Haircut & Style", duration: "45 min", price: "$65" },
    { id: "s2", name: "Color & Style", duration: "2 hrs", price: "$120" },
    { id: "s3", name: "Blowout", duration: "30 min", price: "$45" },
    { id: "s4", name: "Manicure", duration: "45 min", price: "$35" },
    { id: "s5", name: "Pedicure", duration: "1 hr", price: "$50" },
    { id: "s6", name: "Facial", duration: "1 hr", price: "$85" }
  ],
  reviews: [
    { 
      id: "r1", 
      user: "Jennifer S.", 
      rating: 5, 
      date: "2 weeks ago", 
      text: "Absolutely loved my haircut and color! The staff was friendly and professional. Will definitely be coming back." 
    },
    { 
      id: "r2", 
      user: "Michael T.", 
      rating: 4, 
      date: "1 month ago", 
      text: "Great service and atmosphere. My stylist was knowledgeable and gave me exactly what I asked for." 
    },
    { 
      id: "r3", 
      user: "Sarah L.", 
      rating: 5, 
      date: "3 months ago", 
      text: "The best nail salon in town! The technicians are skilled and the place is spotlessly clean." 
    }
  ]
};

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<typeof MOCK_SALON | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Simulate fetching salon data
  useEffect(() => {
    const timer = setTimeout(() => {
      setSalon(MOCK_SALON);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleBookAppointment = (appointmentData: any) => {
    console.log('Booking appointment:', appointmentData);
    toast.success('Appointment booked successfully!', {
      description: `Your appointment at ${salon?.name} has been confirmed.`,
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-xl"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Layout>
    );
  }
  
  if (!salon) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Salon not found</h2>
          <p className="text-muted-foreground mt-2">
            The salon you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pb-4 animate-slide-up">
        <div className="flex items-center -ml-2 -mt-2">
          <Button variant="ghost" size="icon" asChild className="mr-auto">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <div className="aspect-[5/3] w-full overflow-hidden rounded-xl bg-muted">
            <img
              src={salon.images[activeImageIndex]}
              alt={salon.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          {salon.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {salon.images.map((_, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeImageIndex === idx 
                      ? "bg-white w-4" 
                      : "bg-white/60 hover:bg-white/80"
                  )}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">{salon.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm ml-1 font-medium">{salon.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({salon.ratingCount} reviews)
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{salon.address}</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="pt-4 space-y-4">
              <AppointmentForm
                salonId={salon.id}
                salonName={salon.name}
                services={salon.services}
                onSubmit={handleBookAppointment}
              />
            </TabsContent>
            
            <TabsContent value="about" className="pt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">About</h3>
                <p className="text-sm text-muted-foreground">{salon.description}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Business Hours</h3>
                <div className="space-y-1">
                  {Object.entries(salon.hours).map(([days, hours]) => (
                    <div key={days} className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="font-medium min-w-[120px]">{days}:</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Contact</h3>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span className="text-primary">{salon.phone}</span>
                </div>
              </div>
              
              <Button className="w-full mt-4" asChild>
                <a href={`tel:${salon.phone.replace(/\D/g, '')}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Salon
                </a>
              </Button>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Customer Reviews</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="font-medium">{salon.rating}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    ({salon.ratingCount})
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {salon.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.user}</h4>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center my-1">
                      {Array(5).fill(0).map((_, idx) => (
                        <Star
                          key={idx}
                          className={cn(
                            "h-3.5 w-3.5",
                            idx < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted stroke-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default SalonDetails;
