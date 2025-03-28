
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Scissors, User, MapPin, Star, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';

const featuresData = [
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book appointments with your favorite salon with just a few clicks'
  },
  {
    icon: Scissors,
    title: 'Expert Stylists',
    description: 'Connect with top-rated stylists in your area'
  },
  {
    icon: Bell,
    title: 'Appointment Reminders',
    description: 'Never miss an appointment with timely notifications'
  },
  {
    icon: Star,
    title: 'Reviews & Ratings',
    description: 'Make informed decisions with authentic customer reviews'
  },
  {
    icon: MapPin,
    title: 'Find Nearby Salons',
    description: 'Discover the best salons near you with location-based search'
  }
];

const Welcome = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [features, setFeatures] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchActiveFeatures = async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .eq('status', 'active')
          .limit(5);

        if (error) throw error;
        if (data) setFeatures(data);
      } catch (error) {
        console.error('Error fetching features:', error);
      }
    };

    const fetchRecentAppointments = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id, date, start_time, status,
            salons(name, logo_url),
            services(name)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) setRecentAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchActiveFeatures();
    fetchRecentAppointments();
  }, [user?.id]);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome to BeautySpot</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your one-stop platform for all your beauty salon booking needs
          </p>
          
          {user ? (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold">
                Welcome back, {user.name || 'there'}!
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/explore')}>
                  Find Salons
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/appointments')}>
                  View Appointments
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold">
                Ready to get started?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/sign-up')}>
                  Sign Up
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/sign-in')}>
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary/10 p-3 rounded-full">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Appointments for logged in users */}
        {user && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              Recent Appointments
              <Button 
                variant="ghost" 
                className="ml-auto text-sm" 
                size="sm"
                onClick={() => navigate('/appointments')}
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </h2>
            
            {isLoadingData ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-24 animate-pulse bg-muted"></Card>
                ))}
              </div>
            ) : recentAppointments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {recentAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          {appointment.salons?.logo_url ? (
                            <img 
                              src={appointment.salons.logo_url} 
                              alt={appointment.salons.name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <Scissors className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{appointment.salons?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.services?.name} • {new Date(appointment.date).toLocaleDateString()} • {appointment.start_time}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium text-lg mb-2">No appointments yet</h3>
                  <p className="text-muted-foreground mb-4">Book your first appointment to get started</p>
                  <Button onClick={() => navigate('/explore')}>Find Salons</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Active Platform Features (from database) */}
        {features.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card key={feature.id} className={`hover:shadow-md transition-shadow duration-300 ${feature.is_premium ? 'border-amber-300' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      {feature.is_premium && (
                        <div className="absolute -top-1 -right-1">
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Premium
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{feature.name}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Beauty Experience?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have simplified their salon booking experience with BeautySpot.
          </p>
          <Button size="lg" onClick={() => navigate('/explore')}>
            Get Started Today
          </Button>
        </motion.div>

        <Separator className="my-8" />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BeautySpot. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for beautiful days</p>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;
