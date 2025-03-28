
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Star, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  BarChart as Chart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface UserDashboardProps {
  userId?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    favoriteSalons: 0,
    averageRating: 0
  });
  const [appointmentsByMonth, setAppointmentsByMonth] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Get total appointments count
        const { count: totalCount, error: totalError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUserId);
          
        if (totalError) throw totalError;
        
        // Get upcoming appointments count
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUserId)
          .gte('date', new Date().toISOString().split('T')[0])
          .in('status', ['pending', 'confirmed']);
          
        if (upcomingError) throw upcomingError;
        
        // Get completed appointments count
        const { count: completedCount, error: completedError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUserId)
          .eq('status', 'completed');
          
        if (completedError) throw completedError;
        
        // Get unique salons count
        const { data: salonsData, error: salonsError } = await supabase
          .from('appointments')
          .select('salon_id')
          .eq('user_id', currentUserId);
          
        if (salonsError) throw salonsError;
        
        const uniqueSalons = new Set(salonsData.map(item => item.salon_id)).size;
        
        // Get average rating from user reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('user_id', currentUserId);
          
        if (reviewsError) throw reviewsError;
        
        let avgRating = 0;
        if (reviewsData.length > 0) {
          const sumRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          avgRating = parseFloat((sumRatings / reviewsData.length).toFixed(1));
        }
        
        // Get appointments per month for the chart
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('date, status')
          .eq('user_id', currentUserId)
          .order('date', { ascending: true });
          
        if (appointmentsError) throw appointmentsError;
        
        // Process data for the chart
        const monthData: Record<string, { month: string, appointments: number, completed: number }> = {};
        
        appointmentsData.forEach(appointment => {
          const date = new Date(appointment.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          if (!monthData[monthKey]) {
            monthData[monthKey] = {
              month: monthName,
              appointments: 0,
              completed: 0
            };
          }
          
          monthData[monthKey].appointments++;
          
          if (appointment.status === 'completed') {
            monthData[monthKey].completed++;
          }
        });
        
        // Update state with all fetched data
        setStats({
          totalAppointments: totalCount || 0,
          upcomingAppointments: upcomingCount || 0,
          completedAppointments: completedCount || 0,
          favoriteSalons: uniqueSalons,
          averageRating: avgRating
        });
        
        setAppointmentsByMonth(Object.values(monthData).slice(-6)); // Last 6 months
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUserId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted"></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/appointments')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Appointments
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalAppointments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.upcomingAppointments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.completedAppointments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Salons Visited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.favoriteSalons}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating Given
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.averageRating}</span>
              <span className="text-muted-foreground ml-1">/5</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activity Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {stats.totalAppointments > 0 ? 'Active' : 'New'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Chart */}
      {appointmentsByMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <Chart data={appointmentsByMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="hsl(var(--primary))" name="All Appointments" />
                  <Bar dataKey="completed" fill="hsl(var(--primary) / 0.3)" name="Completed" />
                </Chart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;
