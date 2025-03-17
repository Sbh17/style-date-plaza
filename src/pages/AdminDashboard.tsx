
import React, { useState } from 'react';
import { Shield, Edit, Trash, Plus, Settings, MapPin, Clock, Phone, Image as ImageIcon, CalendarCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Mock salon data - would come from database in real implementation
const MOCK_SALON = {
  id: "1",
  name: "Elegance Beauty Salon",
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
  images: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
  ],
  appointments: [
    { id: "a1", customer: "Jennifer Smith", service: "Haircut & Style", date: "2023-10-15T10:00:00", status: "completed" },
    { id: "a2", customer: "Michael Brown", service: "Color & Style", date: "2023-10-16T14:00:00", status: "upcoming" },
    { id: "a3", customer: "Sarah Johnson", service: "Manicure", date: "2023-10-17T11:30:00", status: "upcoming" }
  ]
};

const AdminDashboard: React.FC = () => {
  const [salon, setSalon] = useState(MOCK_SALON);
  const [newService, setNewService] = useState({ name: '', duration: '', price: '' });
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedSalon, setEditedSalon] = useState(salon);

  const handleUpdateProfile = () => {
    setSalon(editedSalon);
    setIsEditingProfile(false);
    toast.success('Salon profile updated successfully!');
  };

  const handleAddService = () => {
    if (!newService.name || !newService.duration || !newService.price) {
      toast.error('Please fill all service details');
      return;
    }
    
    const updatedSalon = {
      ...salon,
      services: [
        ...salon.services,
        { 
          id: `s${salon.services.length + 1}`, 
          name: newService.name, 
          duration: newService.duration, 
          price: newService.price 
        }
      ]
    };
    
    setSalon(updatedSalon);
    setNewService({ name: '', duration: '', price: '' });
    setIsAddingService(false);
    toast.success('Service added successfully!');
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = salon.services.filter(service => service.id !== serviceId);
    setSalon({
      ...salon,
      services: updatedServices
    });
    toast.success('Service removed successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Salon Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your salon profile, services and appointments
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Salon Profile
                </CardTitle>
                <CardDescription>
                  Manage your salon's basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Salon Name</Label>
                      <Input 
                        id="name" 
                        value={editedSalon.name} 
                        onChange={e => setEditedSalon({...editedSalon, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={editedSalon.address} 
                        onChange={e => setEditedSalon({...editedSalon, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={editedSalon.phone} 
                        onChange={e => setEditedSalon({...editedSalon, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        value={editedSalon.description} 
                        onChange={e => setEditedSalon({...editedSalon, description: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <div className="text-sm font-medium">Salon Name</div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{salon.name}</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <div className="text-sm font-medium">Address</div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{salon.address}</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <div className="text-sm font-medium">Phone</div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{salon.phone}</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <div className="text-sm font-medium">Description</div>
                      <p className="text-sm text-muted-foreground">{salon.description}</p>
                    </div>
                    
                    <div className="grid gap-1">
                      <div className="text-sm font-medium">Business Hours</div>
                      <div className="space-y-1">
                        {Object.entries(salon.hours).map(([days, hours]) => (
                          <div key={days} className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium min-w-[120px]">{days}:</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isEditingProfile ? (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Salon Images
                </CardTitle>
                <CardDescription>
                  Manage your salon's photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {salon.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Salon image ${index + 1}`} 
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                        <Button variant="destructive" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="h-32 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Plus className="h-6 w-6" />
                      <span className="text-xs mt-1">Add Image</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Services</CardTitle>
                  <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                          Add a new service to your salon menu
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Service Name</Label>
                          <Input 
                            id="name" 
                            value={newService.name} 
                            onChange={e => setNewService({...newService, name: e.target.value})}
                            placeholder="e.g. Haircut & Style" 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input 
                            id="duration" 
                            value={newService.duration} 
                            onChange={e => setNewService({...newService, duration: e.target.value})}
                            placeholder="e.g. 45 min" 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price</Label>
                          <Input 
                            id="price" 
                            value={newService.price} 
                            onChange={e => setNewService({...newService, price: e.target.value})}
                            placeholder="e.g. $65" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingService(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddService}>
                          Add Service
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Manage your salon's service offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salon.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell>{service.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Manage your salon's appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salon.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.customer}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          {new Date(appointment.date).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
