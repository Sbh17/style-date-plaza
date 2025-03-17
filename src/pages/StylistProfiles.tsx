
import React, { useState } from 'react';
import { 
  Users, Star, Calendar, Scissors, Mail, Phone, Plus, Edit, Trash, Instagram, Facebook, Twitter
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock stylist data
const MOCK_STYLISTS = [
  {
    id: "s1",
    name: "Jessica Williams",
    position: "Senior Stylist",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    bio: "Jessica has over 10 years of experience specializing in color treatments and precision cuts. Her work has been featured in several fashion magazines.",
    specialties: ["Color Treatments", "Precision Cuts", "Bridal Styling"],
    availability: {
      "Monday": "9:00 AM - 5:00 PM",
      "Tuesday": "9:00 AM - 5:00 PM",
      "Wednesday": "9:00 AM - 5:00 PM",
      "Thursday": "9:00 AM - 5:00 PM",
      "Friday": "9:00 AM - 5:00 PM",
      "Saturday": "10:00 AM - 4:00 PM",
      "Sunday": "Closed"
    },
    contact: {
      email: "jessica@elegancebeauty.com",
      phone: "+1 (555) 123-4567"
    },
    portfolio: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    rating: 4.9,
    reviewCount: 124,
    social: {
      instagram: "@jessicahair",
      facebook: "jessicawilliamshair",
      twitter: "@jessica_styles"
    }
  },
  {
    id: "s2",
    name: "Michael Chen",
    position: "Creative Director",
    avatar: "https://i.pravatar.cc/150?u=michael",
    bio: "Michael is our creative director with over 15 years in the industry. He's known for his innovative approach to hair styling and has worked with celebrities.",
    specialties: ["Avant-garde Styling", "Men's Cuts", "Hair Extensions"],
    availability: {
      "Monday": "10:00 AM - 6:00 PM",
      "Tuesday": "10:00 AM - 6:00 PM",
      "Wednesday": "10:00 AM - 6:00 PM",
      "Thursday": "10:00 AM - 6:00 PM",
      "Friday": "10:00 AM - 6:00 PM",
      "Saturday": "10:00 AM - 4:00 PM",
      "Sunday": "Closed"
    },
    contact: {
      email: "michael@elegancebeauty.com",
      phone: "+1 (555) 234-5678"
    },
    portfolio: [
      "https://images.unsplash.com/photo-1622296089990-5d74141292b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1416&q=80",
      "https://images.unsplash.com/photo-1593702288056-f17f6c1c0935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    rating: 4.8,
    reviewCount: 98,
    social: {
      instagram: "@michaelchen_hair",
      facebook: "michaelchenhair",
      twitter: "@michael_styles"
    }
  },
  {
    id: "s3",
    name: "Sophia Rodriguez",
    position: "Color Specialist",
    avatar: "https://i.pravatar.cc/150?u=sophia",
    bio: "Sophia specializes in creating vibrant, personalized color transformations. She's passionate about helping clients express themselves through their hair.",
    specialties: ["Balayage", "Ombre", "Fashion Colors"],
    availability: {
      "Monday": "9:00 AM - 5:00 PM",
      "Tuesday": "9:00 AM - 5:00 PM",
      "Wednesday": "12:00 PM - 8:00 PM",
      "Thursday": "12:00 PM - 8:00 PM",
      "Friday": "9:00 AM - 5:00 PM",
      "Saturday": "10:00 AM - 4:00 PM",
      "Sunday": "Closed"
    },
    contact: {
      email: "sophia@elegancebeauty.com",
      phone: "+1 (555) 345-6789"
    },
    portfolio: [
      "https://images.unsplash.com/photo-1612208695882-02f2322b7fee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    rating: 4.7,
    reviewCount: 87,
    social: {
      instagram: "@sophiacolors",
      facebook: "sophiacolorist",
      twitter: "@sophia_colors"
    }
  }
];

const StylistProfiles: React.FC = () => {
  const [stylists, setStylists] = useState(MOCK_STYLISTS);
  const [isAddingStyleStylist, setIsAddingStylist] = useState(false);
  const [newStylist, setNewStylist] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    phone: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });
  const [selectedStylist, setSelectedStylist] = useState<any>(null);
  const [showStylistDetails, setShowStylistDetails] = useState(false);

  const handleAddStylist = () => {
    if (!newStylist.name || !newStylist.position) {
      toast.error('Please enter the name and position');
      return;
    }
    
    const stylistToAdd = {
      id: `s${stylists.length + 1}`,
      name: newStylist.name,
      position: newStylist.position,
      avatar: `https://i.pravatar.cc/150?u=${newStylist.name.toLowerCase().replace(/\s/g, '')}`,
      bio: newStylist.bio || 'No bio available yet.',
      specialties: [],
      availability: {
        "Monday": "9:00 AM - 5:00 PM",
        "Tuesday": "9:00 AM - 5:00 PM",
        "Wednesday": "9:00 AM - 5:00 PM",
        "Thursday": "9:00 AM - 5:00 PM",
        "Friday": "9:00 AM - 5:00 PM",
        "Saturday": "Closed",
        "Sunday": "Closed"
      },
      contact: {
        email: newStylist.email || 'contact@elegancebeauty.com',
        phone: newStylist.phone || '+1 (555) 123-4567'
      },
      portfolio: [],
      rating: 0,
      reviewCount: 0,
      social: {
        instagram: newStylist.instagram || '',
        facebook: newStylist.facebook || '',
        twitter: newStylist.twitter || ''
      }
    };
    
    setStylists([...stylists, stylistToAdd]);
    setNewStylist({
      name: '',
      position: '',
      bio: '',
      email: '',
      phone: '',
      instagram: '',
      facebook: '',
      twitter: ''
    });
    setIsAddingStylist(false);
    toast.success('Stylist added successfully!');
  };

  const handleDeleteStylist = (stylistId: string) => {
    const updatedStylists = stylists.filter(stylist => stylist.id !== stylistId);
    setStylists(updatedStylists);
    toast.success('Stylist removed successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Stylist Profiles
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your salon's stylists and showcase their work
            </p>
          </div>
          <Dialog open={isAddingStyleStylist} onOpenChange={setIsAddingStylist}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Stylist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Stylist</DialogTitle>
                <DialogDescription>
                  Create a profile for a new stylist at your salon
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newStylist.name} 
                    onChange={e => setNewStylist({...newStylist, name: e.target.value})}
                    placeholder="Full Name" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    value={newStylist.position} 
                    onChange={e => setNewStylist({...newStylist, position: e.target.value})}
                    placeholder="e.g. Senior Stylist" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={newStylist.bio} 
                    onChange={e => setNewStylist({...newStylist, bio: e.target.value})}
                    placeholder="Brief description of experience and expertise" 
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={newStylist.email} 
                      onChange={e => setNewStylist({...newStylist, email: e.target.value})}
                      placeholder="Email address" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={newStylist.phone} 
                      onChange={e => setNewStylist({...newStylist, phone: e.target.value})}
                      placeholder="Phone number" 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Social Media (optional)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={newStylist.instagram} 
                        onChange={e => setNewStylist({...newStylist, instagram: e.target.value})}
                        placeholder="Instagram handle" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={newStylist.facebook} 
                        onChange={e => setNewStylist({...newStylist, facebook: e.target.value})}
                        placeholder="Facebook username" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={newStylist.twitter} 
                        onChange={e => setNewStylist({...newStylist, twitter: e.target.value})}
                        placeholder="Twitter handle" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingStylist(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStylist}>
                  Add Stylist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stylists.map((stylist) => (
            <Card key={stylist.id} className="overflow-hidden">
              <CardHeader className="relative p-0">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40"></div>
                <div className="absolute -bottom-10 left-4 ring-4 ring-background">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={stylist.avatar} alt={stylist.name} />
                    <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="pt-12 px-6">
                <div className="space-y-1.5 mb-3">
                  <CardTitle>{stylist.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Scissors className="h-3 w-3 mr-1" />
                    {stylist.position}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  <Star className={`h-4 w-4 ${stylist.rating > 0 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{stylist.rating > 0 ? stylist.rating.toFixed(1) : "New"}</span>
                  {stylist.reviewCount > 0 && (
                    <span className="text-sm text-muted-foreground">({stylist.reviewCount} reviews)</span>
                  )}
                </div>
                <div className="line-clamp-2 text-sm text-muted-foreground mb-4">
                  {stylist.bio}
                </div>
                <div className="space-y-2">
                  {stylist.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {stylist.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/5">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedStylist(stylist);
                  setShowStylistDetails(true);
                }}>
                  View Profile
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteStylist(stylist.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Dialog open={showStylistDetails} onOpenChange={setShowStylistDetails}>
          <DialogContent className="sm:max-w-[700px]">
            {selectedStylist && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedStylist.avatar} alt={selectedStylist.name} />
                      <AvatarFallback>{selectedStylist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{selectedStylist.name}</DialogTitle>
                      <DialogDescription className="flex items-center mt-1">
                        {selectedStylist.position}
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                          <span>{selectedStylist.rating.toFixed(1)}</span>
                        </div>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <Tabs defaultValue="about">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Bio</h4>
                        <p className="text-sm text-muted-foreground">{selectedStylist.bio}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Specialties</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedStylist.specialties.map((specialty: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-primary/5">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Contact</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedStylist.contact.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedStylist.contact.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Social Media</h4>
                        <div className="flex gap-3">
                          {selectedStylist.social.instagram && (
                            <Button variant="outline" size="sm" className="h-8 gap-1.5">
                              <Instagram className="h-4 w-4" />
                              {selectedStylist.social.instagram}
                            </Button>
                          )}
                          {selectedStylist.social.facebook && (
                            <Button variant="outline" size="sm" className="h-8 gap-1.5">
                              <Facebook className="h-4 w-4" />
                              {selectedStylist.social.facebook}
                            </Button>
                          )}
                          {selectedStylist.social.twitter && (
                            <Button variant="outline" size="sm" className="h-8 gap-1.5">
                              <Twitter className="h-4 w-4" />
                              {selectedStylist.social.twitter}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="portfolio" className="space-y-4 pt-4">
                    {selectedStylist.portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedStylist.portfolio.map((image: string, index: number) => (
                          <div key={index} className="aspect-square rounded-md overflow-hidden">
                            <img 
                              src={image} 
                              alt={`${selectedStylist.name}'s work`} 
                              className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No portfolio images available yet
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Weekly Schedule</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedStylist.availability).map(([day, hours]) => (
                          <div key={day} className="flex">
                            <span className="w-28 font-medium">{day}</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default StylistProfiles;
