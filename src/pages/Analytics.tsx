
import React, { useState } from 'react';
import { 
  BarChart, LineChart, PieChart, Calendar, Users, Scissors, DollarSign,
  TrendingUp, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for charts
const DAILY_REVENUE_DATA = [
  { name: 'Monday', revenue: 450 },
  { name: 'Tuesday', revenue: 380 },
  { name: 'Wednesday', revenue: 520 },
  { name: 'Thursday', revenue: 490 },
  { name: 'Friday', revenue: 780 },
  { name: 'Saturday', revenue: 900 },
  { name: 'Sunday', revenue: 380 },
];

const MONTHLY_REVENUE_DATA = [
  { name: 'Jan', revenue: 4500 },
  { name: 'Feb', revenue: 3800 },
  { name: 'Mar', revenue: 5200 },
  { name: 'Apr', revenue: 4900 },
  { name: 'May', revenue: 7800 },
  { name: 'Jun', revenue: 9000 },
  { name: 'Jul', revenue: 8500 },
  { name: 'Aug', revenue: 7900 },
  { name: 'Sep', revenue: 8200 },
  { name: 'Oct', revenue: 8800 },
  { name: 'Nov', revenue: 9200 },
  { name: 'Dec', revenue: 11000 },
];

const SERVICE_BREAKDOWN = [
  { name: 'Haircut & Style', value: 35 },
  { name: 'Color & Style', value: 25 },
  { name: 'Manicure', value: 15 },
  { name: 'Pedicure', value: 10 },
  { name: 'Facial', value: 10 },
  { name: 'Other', value: 5 },
];

const CUSTOMER_ACTIVITY_DATA = [
  { name: 'Week 1', new: 24, returning: 18 },
  { name: 'Week 2', new: 20, returning: 22 },
  { name: 'Week 3', new: 27, returning: 26 },
  { name: 'Week 4', new: 32, returning: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Salon Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Track your salon's performance with detailed insights
            </p>
          </div>
          <div>
            <Select 
              defaultValue={timeRange} 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-bold">$3,890</h3>
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-bold">42</h3>
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-bold">18</h3>
                    <span className="text-xs font-medium text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      3%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Popular Service</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-bold">Haircut</h3>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  {timeRange === 'daily' && 'Today\'s revenue by hour'}
                  {timeRange === 'weekly' && 'This week\'s revenue by day'}
                  {timeRange === 'monthly' && 'This month\'s revenue by day'}
                  {timeRange === 'yearly' && 'This year\'s revenue by month'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={timeRange === 'yearly' ? MONTHLY_REVENUE_DATA : DAILY_REVENUE_DATA}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Service Category</CardTitle>
                  <CardDescription>
                    Breakdown of revenue by service type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={SERVICE_BREAKDOWN}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {SERVICE_BREAKDOWN.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>
                    Compare revenue with previous periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={MONTHLY_REVENUE_DATA}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Popularity</CardTitle>
                <CardDescription>
                  Most booked services by percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={SERVICE_BREAKDOWN}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {SERVICE_BREAKDOWN.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Services by Revenue</CardTitle>
                  <CardDescription>
                    Services generating the most revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SERVICE_BREAKDOWN.slice(0, 5).map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{service.name}</span>
                        </div>
                        <span className="font-medium">${(service.value * 100).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Service Booking Times</CardTitle>
                  <CardDescription>
                    Most popular times for service bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          { time: '9AM', bookings: 5 },
                          { time: '10AM', bookings: 8 },
                          { time: '11AM', bookings: 12 },
                          { time: '12PM', bookings: 10 },
                          { time: '1PM', bookings: 7 },
                          { time: '2PM', bookings: 9 },
                          { time: '3PM', bookings: 11 },
                          { time: '4PM', bookings: 14 },
                          { time: '5PM', bookings: 10 },
                          { time: '6PM', bookings: 6 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#82ca9d" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>
                  New vs. returning customer appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={CUSTOMER_ACTIVITY_DATA}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="new" stackId="a" fill="#8884d8" name="New Customers" />
                      <Bar dataKey="returning" stackId="a" fill="#82ca9d" name="Returning Customers" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>
                    Percentage of returning customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">68%</span>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Returning', value: 68 },
                              { name: 'One-time', value: 32 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#8884d8" />
                            <Cell fill="#EFEFEF" />
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                        <span className="text-sm">Returning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#EFEFEF] mr-2"></div>
                        <span className="text-sm">One-time</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Demographics</CardTitle>
                  <CardDescription>
                    Age distribution of customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          { age: '18-24', count: 18 },
                          { age: '25-34', count: 32 },
                          { age: '35-44', count: 25 },
                          { age: '45-54', count: 15 },
                          { age: '55+', count: 10 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#FF8042" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
