
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Scissors, Star, Plus, Edit, Trash, Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for stylists
const MOCK_STYLISTS = [
  {
    id: 1,
    name: "Emma Rodriguez",
    role: "Senior Stylist",
    specialties: ["Haircuts", "Coloring", "Styling"],
    bio: "With over 8 years of experience, Emma specializes in creative coloring and precision cuts. Her approach to hair is artistic and personalized, ensuring every client leaves the chair feeling confident and beautiful.",
    rating: 4.9,
    reviewCount: 126,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    social: {
      instagram: "emma_styles",
      facebook: "emmastylist",
      twitter: "emmahair"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Texture Specialist",
    specialties: ["Curly Hair", "Balayage", "Hair Treatments"],
    bio: "Michael is known for his expertise in working with textured hair and creating beautiful, natural-looking balayage. He takes pride in helping clients embrace their natural hair while elevating their look.",
    rating: 4.8,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    social: {
      instagram: "chen_styles",
      facebook: "michaelchenhair",
      twitter: ""
    }
  },
  {
    id: 3,
    name: "Sophia Williams",
    role: "Color Expert",
    specialties: ["Vivid Colors", "Highlights", "Color Correction"],
    bio: "Sophia's passion for vibrant, expressive hair color has made her a favorite among clients looking for something unique. Her technical skill in color correction is unmatched, helping clients achieve their dream color safely.",
    rating: 4.7,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    social: {
      instagram: "sophia_colorist",
      facebook: "",
      twitter: "sophiahairart"
    }
  }
];

const StylistProfiles: React.FC = () => {
  const [stylists, setStylists] = useState(MOCK_STYLISTS);
  const [isAddingStylist, setIsAddingStylist] = useState(false);
  const [editingStylist, setEditingStylist] = useState<null | {
    id: number;
    name: string;
    role: string;
    specialties: string[];
    bio: string;
    image: string;
    rating: number;
    reviewCount: number;
    social: {
      instagram: string;
      facebook: string;
      twitter: string;
    }
  }>(null);
  
  const [newStylist, setNewStylist] = useState({
    name: '',
    role: '',
    specialties: '',
    bio: '',
    image: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });

  const handleAddStylist = () => {
    if (!newStylist.name || !newStylist.role) {
      toast.error('Name and role are required');
      return;
    }
    
    const stylistToAdd = {
      id: stylists.length > 0 ? Math.max(...stylists.map(s => s.id)) + 1 : 1,
      name: newStylist.name,
      role: newStylist.role,
      specialties: newStylist.specialties.split(',').map(s => s.trim()),
      bio: newStylist.bio,
      rating: 0,
      reviewCount: 0,
      image: newStylist.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
      social: {
        instagram: newStylist.instagram,
        facebook: newStylist.facebook,
        twitter: newStylist.twitter
      }
    };
    
    setStylists([...stylists, stylistToAdd]);
    setNewStylist({
      name: '',
      role: '',
      specialties: '',
      bio: '',
      image: '',
      instagram: '',
      facebook: '',
      twitter: ''
    });
    setIsAddingStylist(false);
    toast.success('Stylist added successfully');
  };

  const handleUpdateStylist = () => {
    if (!editingStylist) return;
    
    const updatedStylists = stylists.map(stylist => 
      stylist.id === editingStylist.id ? editingStylist : stylist
    );
    
    setStylists(updatedStylists);
    setEditingStylist(null);
    toast.success('Stylist updated successfully');
  };

  const handleDeleteStylist = (id: number) => {
    const updatedStylists = stylists.filter(stylist => stylist.id !== id);
    setStylists(updatedStylists);
    toast.success('Stylist removed');
  };

  const updateEditingStylistField = (field: string, value: string) => {
    if (!editingStylist) return;
    
    if (field === 'specialties') {
      setEditingStylist({
        ...editingStylist,
        specialties: value.split(',').map(s => s.trim())
      });
    } else if (field.startsWith('social.')) {
      const socialField = field.split('.')[1];
      setEditingStylist({
        ...editingStylist,
        social: {
          ...editingStylist.social,
          [socialField]: value
        }
      });
    } else {
      setEditingStylist({
        ...editingStylist,
        [field]: value
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Stylist Profiles</h1>
            <p className="text-muted-foreground text-sm">
              Meet our talented team of professional stylists
            </p>
          </div>
          <Dialog open={isAddingStylist} onOpenChange={setIsAddingStylist}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Stylist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stylist</DialogTitle>
                <DialogDescription>
                  Create a profile for a new stylist in your salon
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newStylist.name} 
                    onChange={(e) => setNewStylist({...newStylist, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    value={newStylist.role} 
                    onChange={(e) => setNewStylist({...newStylist, role: e.target.value})}
                    placeholder="e.g. Senior Stylist, Color Expert"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialties">Specialties</Label>
                  <Input 
                    id="specialties" 
                    value={newStylist.specialties} 
                    onChange={(e) => setNewStylist({...newStylist, specialties: e.target.value})}
                    placeholder="e.g. Haircuts, Coloring, Styling (comma separated)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={newStylist.bio} 
                    onChange={(e) => setNewStylist({...newStylist, bio: e.target.value})}
                    placeholder="Brief description of the stylist's experience and approach"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input 
                    id="image" 
                    value={newStylist.image} 
                    onChange={(e) => setNewStylist({...newStylist, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram" 
                      value={newStylist.instagram} 
                      onChange={(e) => setNewStylist({...newStylist, instagram: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input 
                      id="facebook" 
                      value={newStylist.facebook} 
                      onChange={(e) => setNewStylist({...newStylist, facebook: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input 
                      id="twitter" 
                      value={newStylist.twitter} 
                      onChange={(e) => setNewStylist({...newStylist, twitter: e.target.value})}
                      placeholder="username"
                    />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((stylist) => (
            <Card key={stylist.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <img 
                  src={stylist.image} 
                  alt={stylist.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                    onClick={() => {
                      setEditingStylist({
                        ...stylist,
                        specialties: [...stylist.specialties]
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm text-destructive"
                    onClick={() => handleDeleteStylist(stylist.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{stylist.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Scissors className="h-3 w-3 mr-1" />
                      {stylist.role}
                    </CardDescription>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span>{stylist.rating}</span>
                    <span className="text-muted-foreground ml-1">({stylist.reviewCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {stylist.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stylist.bio}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  {stylist.social.instagram && (
                    <a 
                      href={`https://instagram.com/${stylist.social.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {stylist.social.facebook && (
                    <a 
                      href={`https://facebook.com/${stylist.social.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {stylist.social.twitter && (
                    <a 
                      href={`https://twitter.com/${stylist.social.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={editingStylist !== null} onOpenChange={(open) => !open && setEditingStylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stylist</DialogTitle>
            <DialogDescription>
              Update information for this stylist
            </DialogDescription>
          </DialogHeader>
          {editingStylist && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingStylist.name} 
                  onChange={(e) => updateEditingStylistField('name', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input 
                  id="edit-role" 
                  value={editingStylist.role} 
                  onChange={(e) => updateEditingStylistField('role', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specialties">Specialties</Label>
                <Input 
                  id="edit-specialties" 
                  value={editingStylist.specialties.join(', ')} 
                  onChange={(e) => updateEditingStylistField('specialties', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea 
                  id="edit-bio" 
                  value={editingStylist.bio} 
                  onChange={(e) => updateEditingStylistField('bio', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Profile Image URL</Label>
                <Input 
                  id="edit-image" 
                  value={editingStylist.image} 
                  onChange={(e) => updateEditingStylistField('image', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-instagram">Instagram</Label>
                  <Input 
                    id="edit-instagram" 
                    value={editingStylist.social.instagram} 
                    onChange={(e) => updateEditingStylistField('social.instagram', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-facebook">Facebook</Label>
                  <Input 
                    id="edit-facebook" 
                    value={editingStylist.social.facebook} 
                    onChange={(e) => updateEditingStylistField('social.facebook', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-twitter">Twitter</Label>
                  <Input 
                    id="edit-twitter" 
                    value={editingStylist.social.twitter} 
                    onChange={(e) => updateEditingStylistField('social.twitter', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStylist(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStylist}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StylistProfiles;
