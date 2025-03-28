import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Lightbulb } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

// Define type for Feature
type Feature = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'in_development';
  created_at: string;
  is_premium: boolean;
};

// Define type for FeatureSuggestion
type FeatureSuggestion = {
  id: string;
  title: string;
  description: string;
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
};

// Mock data for features with explicit status typing
const MOCK_FEATURES: Feature[] = [
  {
    id: '1',
    name: 'Online Booking',
    description: 'Allow users to book appointments online',
    status: 'active',
    created_at: new Date().toISOString(),
    is_premium: true,
  },
  {
    id: '2',
    name: 'Loyalty Points',
    description: 'Users earn points for each booking and can redeem them for discounts',
    status: 'in_development',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    is_premium: true,
  },
  {
    id: '3',
    name: 'Email Notifications',
    description: 'Send email reminders for upcoming appointments',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    is_premium: false,
  }
];

// Mock data for feature suggestions with explicit status typing
const MOCK_SUGGESTIONS: FeatureSuggestion[] = [
  {
    id: '1',
    title: 'Mobile App Integration',
    description: 'Create a mobile app for iOS and Android for a better mobile experience',
    submitted_by: 'admin@example.com',
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'under_review',
  },
  {
    id: '2',
    title: 'Social Media Sharing',
    description: 'Allow users to share their favorite salons and stylists on social media',
    submitted_by: 'user@example.com',
    submitted_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    status: 'approved',
  }
];

const FeatureManagement: React.FC = () => {
  // State management with proper typing
  const [features, setFeatures] = useState<Feature[]>(MOCK_FEATURES);
  const [suggestions, setSuggestions] = useState<FeatureSuggestion[]>(MOCK_SUGGESTIONS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<FeatureSuggestion | null>(null);
  
  // Form state with proper typing
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    status: Feature['status'];
    is_premium: boolean;
  }>({
    name: '',
    description: '',
    status: 'inactive',
    is_premium: false,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_premium: checked,
    });
  };
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      status: e.target.value as Feature['status'],
    });
  };
  
  // Open edit dialog
  const openEditDialog = (feature: Feature) => {
    setSelectedFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description,
      status: feature.status,
      is_premium: feature.is_premium,
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDeleteDialogOpen(true);
  };
  
  // Open suggestion dialog
  const openSuggestionDialog = (suggestion: FeatureSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsSuggestionDialogOpen(true);
  };
  
  // Add new feature
  const addFeature = () => {
    const newFeature: Feature = {
      id: crypto.randomUUID(),
      name: formData.name,
      description: formData.description,
      status: formData.status,
      created_at: new Date().toISOString(),
      is_premium: formData.is_premium,
    };
    
    setFeatures([newFeature, ...features]);
    toast.success(`Feature "${formData.name}" added successfully`);
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  // Update feature
  const updateFeature = () => {
    if (!selectedFeature) return;
    
    const updatedFeatures = features.map(f => 
      f.id === selectedFeature.id 
        ? { ...f, name: formData.name, description: formData.description, status: formData.status, is_premium: formData.is_premium }
        : f
    );
    
    setFeatures(updatedFeatures);
    toast.success(`Feature "${formData.name}" updated successfully`);
    setIsEditDialogOpen(false);
    resetForm();
  };
  
  // Delete feature
  const deleteFeature = () => {
    if (!selectedFeature) return;
    
    const filteredFeatures = features.filter(f => f.id !== selectedFeature.id);
    setFeatures(filteredFeatures);
    toast.success(`Feature "${selectedFeature.name}" deleted`);
    setIsDeleteDialogOpen(false);
    setSelectedFeature(null);
  };
  
  // Update suggestion status
  const updateSuggestionStatus = (status: FeatureSuggestion['status']) => {
    if (!selectedSuggestion) return;
    
    const updatedSuggestions = suggestions.map(s => 
      s.id === selectedSuggestion.id ? { ...s, status } : s
    );
    
    setSuggestions(updatedSuggestions);
    toast.success(`Suggestion status updated to ${status}`);
    setIsSuggestionDialogOpen(false);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'inactive',
      is_premium: false,
    });
    setSelectedFeature(null);
  };
  
  // Render status badge
  const renderStatusBadge = (status: Feature['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'in_development':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Development</Badge>;
      default:
        return null;
    }
  };
  
  // Render suggestion status badge
  const renderSuggestionStatusBadge = (status: FeatureSuggestion['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Features management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Feature Management</CardTitle>
            <CardDescription>
              Add, edit, and manage platform features
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No features found. Add your first feature to get started.
                  </TableCell>
                </TableRow>
              ) : (
                features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-medium">{feature.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{feature.description}</TableCell>
                    <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                    <TableCell>
                      {feature.is_premium ? (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">Premium</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Free</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(feature.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(feature)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDeleteDialog(feature)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Feature suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Suggestions</CardTitle>
          <CardDescription>
            Review and manage feature suggestions from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No feature suggestions found.
                  </TableCell>
                </TableRow>
              ) : (
                suggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell className="font-medium">{suggestion.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{suggestion.description}</TableCell>
                    <TableCell>{suggestion.submitted_by}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(suggestion.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{renderSuggestionStatusBadge(suggestion.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openSuggestionDialog(suggestion)}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Feature Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Feature</DialogTitle>
            <DialogDescription>
              Create a new feature for the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Enter feature name" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Describe this feature"
                rows={3} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleStatusChange} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
                <option value="in_development">In Development</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_premium" 
                checked={formData.is_premium} 
                onCheckedChange={handleSwitchChange} 
              />
              <Label htmlFor="is_premium">Premium Feature</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addFeature}>Add Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Feature Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Feature</DialogTitle>
            <DialogDescription>
              Update feature details and settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Feature Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select 
                id="edit-status" 
                name="status" 
                value={formData.status} 
                onChange={handleStatusChange} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
                <option value="in_development">In Development</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-is-premium" 
                checked={formData.is_premium} 
                onCheckedChange={handleSwitchChange} 
              />
              <Label htmlFor="edit-is-premium">Premium Feature</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateFeature}>Update Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Feature Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feature</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feature? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeature && (
            <div className="py-4">
              <p className="font-medium">{selectedFeature.name}</p>
              <p className="text-sm text-muted-foreground">{selectedFeature.description}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteFeature}>Delete Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Review Feature Suggestion Dialog */}
      <Dialog open={isSuggestionDialogOpen} onOpenChange={setIsSuggestionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Feature Suggestion</DialogTitle>
            <DialogDescription>
              Review and update the status of this feature suggestion.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">Title</h3>
                <p>{selectedSuggestion.title}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm">{selectedSuggestion.description}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Submitted By</h3>
                <p>{selectedSuggestion.submitted_by}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Date Submitted</h3>
                <p>{new Date(selectedSuggestion.submitted_at).toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Current Status</h3>
                <div>{renderSuggestionStatusBadge(selectedSuggestion.status)}</div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="sm:ml-auto" 
              onClick={() => setIsSuggestionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => updateSuggestionStatus('under_review')}
            >
              Mark as Under Review
            </Button>
            <Button 
              variant="default" 
              onClick={() => updateSuggestionStatus('approved')}
            >
              Approve
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => updateSuggestionStatus('rejected')}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeatureManagement;
