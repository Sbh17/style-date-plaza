import React, { useState } from 'react';
import { 
  Shield, Edit, Trash, Plus, Settings, MapPin, Clock, Phone, 
  Image as ImageIcon, CalendarCheck, Calendar, Bell, CheckCheck, X as XIcon,
  ImagePlus, PlusCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewsPromoForm from '@/components/NewsPromoForm';
import NewsPromoCard from '@/components/NewsPromoCard';
import { Salon } from '@/lib/supabase';

// Updated MOCK_SALON to include all fields required by the Salon type
const MOCK_SALON: Salon = {
  id: "1",
  name: "Elegance Beauty Salon",
  description: "Elegance Beauty Salon offers a wide range of services including haircuts, coloring, styling, makeup, and nail treatments. Our team of professionals is dedicated to providing you with the best beauty experience.",
  address: "123 Beauty Street, Downtown",
  city: "New York",
  state: "NY",
  zip_code: "10001",
  phone: "+1 (555) 123-4567",
  email: "info@elegancebeauty.com",
  website: "www.elegancebeauty.com",
  rating: 4.8,
  logo_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Fsb24lMjBsb2dvfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60",
  cover_image_url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  // Adding these non-type properties for the mock data
  hours: {
    "Monday-Friday": "9:00 AM - 7:00 PM",
    "Saturday": "9:00 AM - 5:00 PM",
    "Sunday": "Closed"
  },
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
    { id: "a1", customer: "Jennifer Smith", customerEmail: "jennifer@example.com", service: "Haircut & Style", date: "2023-10-15T10:00:00", status: "completed" },
    { id: "a2", customer: "Michael Brown", customerEmail: "michael@example.com", service: "Color & Style", date: "2023-10-16T14:00:00", status: "pending" },
    { id: "a3", customer: "Sarah Johnson", customerEmail: "sarah@example.com", service: "Manicure", date: "2023-10-17T11:30:00", status: "pending" },
    { id: "a4", customer: "David Wilson", customerEmail: "david@example.com", service: "Facial", date: "2023-10-15T13:00:00", status: "pending" },
    { id: "a5", customer: "Emily Davis", customerEmail: "emily@example.com", service: "Pedicure", date: "2023-10-15T15:30:00", status: "pending" }
  ],
  features: [
    { id: "f1", name: "Free WiFi", icon: "wifi" },
    { id: "f2", name: "Complimentary Beverages", icon: "coffee" },
    { id: "f3", name: "Parking Available", icon: "parking" }
  ]
};

const AdminDashboard: React.FC = () => {
  const [salon, setSalon] = useState(MOCK_SALON);
  const [newService, setNewService] = useState({ name: '', duration: '', price: '' });
  const [newFeature, setNewFeature] = useState({ name: '', icon: '' });
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [editedSalon, setEditedSalon] = useState(salon);
  const [messageText, setMessageText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = salon.appointments.filter(
    appointment => appointment.date.startsWith(today)
  );

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

  const handleAddFeature = () => {
    if (!newFeature.name) {
      toast.error('Please enter a feature name');
      return;
    }
    
    const updatedSalon = {
      ...salon,
      features: [
        ...salon.features,
        { 
          id: `f${salon.features.length + 1}`, 
          name: newFeature.name, 
          icon: newFeature.icon || 'star' 
        }
      ]
    };
    
    setSalon(updatedSalon);
    setNewFeature({ name: '', icon: '' });
    setIsAddingFeature(false);
    toast.success('Feature added successfully!');
  };

  const handleDeleteFeature = (featureId: string) => {
    const updatedFeatures = salon.features.filter(feature => feature.id !== featureId);
    setSalon({
      ...salon,
      features: updatedFeatures
    });
    toast.success('Feature removed successfully!');
  };

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    const updatedAppointments = salon.appointments.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: newStatus } 
        : appointment
    );
    
    setSalon({
      ...salon,
      appointments: updatedAppointments
    });
    
    toast.success(`Appointment ${newStatus}`);
    setSelectedAppointment(null);
  };

  const handleSendNotification = () => {
    if (!messageText) {
      toast.error('Please enter a message');
      return;
    }
    
    console.log(`Sending message to ${selectedAppointment.customer}: ${messageText}`);
    
    toast.success(`Notification sent to ${selectedAppointment.customer}`);
    setMessageText('');
    setIsNotificationDialogOpen(false);
  };

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast.error('Please enter an image URL');
      return;
    }
    
    try {
      new URL(newImageUrl);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    const updatedSalon = {
      ...salon,
      images: [...salon.images, newImageUrl]
    };
    
    setSalon(updatedSalon);
    setNewImageUrl('');
    setIsAddingImage(false);
    toast.success('Image added successfully!');
  };

  const handleDeleteImage = (imageIndex: number) => {
    const updatedImages = salon.images.filter((_, index) => index !== imageIndex);
    setSalon({
      ...salon,
      images: updatedImages
    });
    toast.success('Image removed successfully!');
  };

  const formatAppointmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
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
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
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
                      <Textarea 
                        id="description" 
                        value={editedSalon.description} 
                        onChange={e => setEditedSalon({...editedSalon, description: e.target.value})}
                        rows={4}
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Salon Gallery
                  </CardTitle>
                  <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <ImagePlus className="h-4 w-4 mr-1" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Gallery Image</DialogTitle>
                        <DialogDescription>
                          Add a new image to showcase your salon's work
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input 
                            id="imageUrl" 
                            value={newImageUrl} 
                            onChange={e => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg" 
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the URL of the image you want to add to your gallery.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingImage(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddImage}>
                          Add Image
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Showcase your salon's work with high-quality images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {salon.images.map((image, index) => (
                    <div key={index} className="relative group aspect-[4/3]">
                      <img 
                        src={image} 
                        alt={`Salon image ${index + 1}`} 
                        className="h-full w-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(index)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
                    <DialogTrigger asChild>
                      <div className="aspect-[4/3] border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center text-muted-foreground">
                          <ImagePlus className="h-6 w-6" />
                          <span className="text-xs mt-1">Add Image</span>
                        </div>
                      </div>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Showcase your salon's best work. Images should be high quality and represent your services.
                </p>
              </CardFooter>
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
                        <PlusCircle className="h-4 w-4 mr-1" />
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
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Add all the services your salon offers to make them available for booking.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Salon Features</CardTitle>
                  <Dialog open={isAddingFeature} onOpenChange={setIsAddingFeature}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Feature</DialogTitle>
                        <DialogDescription>
                          Add a new feature or amenity to your salon
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="featureName">Feature Name</Label>
                          <Input 
                            id="featureName" 
                            value={newFeature.name} 
                            onChange={e => setNewFeature({...newFeature, name: e.target.value})}
                            placeholder="e.g. Free WiFi" 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="featureIcon">Icon (optional)</Label>
                          <Select
                            value={newFeature.icon}
                            onValueChange={(value) => setNewFeature({...newFeature, icon: value})}
                          >
                            <SelectTrigger id="featureIcon">
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wifi">WiFi</SelectItem>
                              <SelectItem value="coffee">Coffee</SelectItem>
                              <SelectItem value="parking">Parking</SelectItem>
                              <SelectItem value="music">Music</SelectItem>
                              <SelectItem value="card">Payment Card</SelectItem>
                              <SelectItem value="star">Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingFeature(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddFeature}>
                          Add Feature
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Manage your salon's features and amenities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salon.features.map((feature) => (
                    <div 
                      key={feature.id} 
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                          <span className="text-primary">{feature.icon}</span>
                        </div>
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteFeature(feature.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>
                  Manage appointments scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaysAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {new Date(appointment.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">{appointment.customer}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            <Badge className={`${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : appointment.status === 'pending'
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                  : appointment.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-green-600"
                                    onClick={() => handleAppointmentStatusChange(appointment.id, 'approved')}
                                  >
                                    <CheckCheck className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsNotificationDialogOpen(true);
                                }}
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  All Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  View and manage all upcoming appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salon.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {formatAppointmentDate(appointment.date)}
                        </TableCell>
                        <TableCell className="font-medium">{appointment.customer}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            appointment.status === 'completed' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : appointment.status === 'pending'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                : appointment.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                  : 'bg-green-100 text-green-800'
                          }`}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => handleAppointmentStatusChange(appointment.id, 'approved')}
                                >
                                  <CheckCheck className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setIsNotificationDialogOpen(true);
                              }}
                            >
                              <Bell className="h-4 w-4" />
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
          
          <TabsContent value="promotions" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Salon Promotions</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Promotion
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Promotion</DialogTitle>
                        <DialogDescription>
                          Add a new promotion for your salon. It will be sent for approval to the super admin.
                        </DialogDescription>
                      </DialogHeader>
                      <NewsPromoForm 
                        salonId={salon.id} 
                        onSuccess={() => {
                          toast.success('Promotion created and sent for approval');
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Create and manage promotional content for your salon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <NewsPromoCard 
                    news={{
                      id: '1',
                      salon_id: salon.id,
                      title: 'Summer Special Offer',
                      content: '20% off on all hair services this summer!',
                      starts_at: new Date().toISOString(),
                      ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                      is_approved: true,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }}
                    salon={salon}
                  />
                  <NewsPromoCard 
                    news={{
                      id: '2',
                      salon_id: salon.id,
                      title: 'New Client Discount',
                      content: 'First-time clients get 15% off any service!',
                      starts_at: new Date().toISOString(),
                      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                      is_approved: false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }}
                    salon={salon}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send a notification to {selectedAppointment?.customer} about their appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input 
                id="recipient" 
                value={selectedAppointment?.customer} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment">Appointment</Label>
              <Input 
                id="appointment" 
                value={selectedAppointment ? `${selectedAppointment.service} - ${formatAppointmentDate(selectedAppointment.date)}` : ''} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Enter your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              <Bell className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
