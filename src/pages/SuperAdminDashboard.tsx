import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Profile, type Salon, type News } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, User, Scissors, RefreshCw, Check, X, Megaphone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import FeatureManagement from '@/components/admin/FeatureManagement';

const MOCK_NEWS: (News & { salon_name: string })[] = [
  {
    id: '1',
    salon_id: '1',
    salon_name: 'Elegance Beauty Salon',
    title: '50% Off on All Hair Services',
    content: 'Enjoy half price on all haircuts, coloring, and styling this week. Book now to secure your spot!',
    starts_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
    ends_at: new Date(Date.now() + 604800000).toISOString(), // a week from now
    is_approved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    salon_id: '2',
    salon_name: 'Pure Bliss Spa & Salon',
    title: 'New Customer Special',
    content: 'First-time customers receive a complimentary deep conditioning treatment with any service.',
    starts_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    ends_at: new Date(Date.now() + 604800000 * 2).toISOString(), // 2 weeks from now
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    salon_id: '3',
    salon_name: 'Modern Cuts & Color',
    title: 'Summer Package Deal',
    content: 'Book our summer package and get a manicure, pedicure, and facial for only $99.',
    starts_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    ends_at: new Date(Date.now() + 604800000 * 4).toISOString(), // 4 weeks from now
    is_approved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const SuperAdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [news, setNews] = useState<(News & { salon_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'superadmin'>('user');
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<(News & { salon_name: string }) | null>(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied. Super Admin permissions required.");
      navigate('/');
    }
  }, [isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) throw profilesError;
        
        if (profilesData) {
          const typedProfiles = profilesData.map(profile => ({
            ...profile,
            role: profile.role as Profile['role']
          }));
          setUsers(typedProfiles);
        }
        
        const { data: salonsData, error: salonsError } = await supabase
          .from('salons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (salonsError) throw salonsError;
        
        if (salonsData) {
          setSalons(salonsData);
        }

        setTimeout(() => {
          setNews(MOCK_NEWS);
        }, 500);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      toast.success(`${selectedUser.name}'s role updated to ${newRole}`);
      setShowRoleDialog(false);
    } catch (error: any) {
      console.error('Error updating role:', error.message);
      toast.error(`Failed to update role: ${error.message}`);
    }
  };

  const openRoleDialog = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  const handleNewsApproval = async (newsId: string, isApproved: boolean) => {
    try {
      setNews(news.map(item => 
        item.id === newsId ? { ...item, is_approved: isApproved } : item
      ));
      
      toast.success(`Promotion ${isApproved ? 'approved' : 'rejected'} successfully`);
      setShowNewsDialog(false);
    } catch (error: any) {
      console.error('Error updating news:', error.message);
      toast.error(`Failed to update promotion: ${error.message}`);
    }
  };

  const openNewsDialog = (newsItem: (News & { salon_name: string })) => {
    setSelectedNews(newsItem);
    setShowNewsDialog(true);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      const { data: salonsData, error: salonsError } = await supabase
        .from('salons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (salonsError) throw salonsError;
      
      setUsers(profilesData || []);
      setSalons(salonsData || []);
      setNews(MOCK_NEWS);
      toast.success('Data refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing data:', error.message);
      toast.error(`Failed to refresh data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all users, salons, and system-wide settings
            </p>
          </div>
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="gap-2">
                <User className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="salons" className="gap-2">
                <Scissors className="h-4 w-4" />
                Salons
              </TabsTrigger>
              <TabsTrigger value="promotions" className="gap-2">
                <Megaphone className="h-4 w-4" />
                Promotions
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2">
                <Settings className="h-4 w-4" />
                Features
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell>{profile.name}</TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                profile.role === 'superadmin' 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                  : profile.role === 'admin' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                                {profile.role}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(profile.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openRoleDialog(profile)}
                                disabled={user?.id === profile.user_id}
                              >
                                Change Role
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="salons" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Salon Management</CardTitle>
                  <CardDescription>
                    Manage salons across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                              No salons found. Add a salon to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          salons.map((salon) => (
                            <TableRow key={salon.id}>
                              <TableCell className="font-medium">{salon.name}</TableCell>
                              <TableCell>{salon.city}, {salon.state}</TableCell>
                              <TableCell>{salon.phone}</TableCell>
                              <TableCell>
                                {new Date(salon.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/salon/${salon.id}`)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotions" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Promotions Management</CardTitle>
                  <CardDescription>
                    Review and approve salon promotions and news
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Salon</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {news.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                              No promotions found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          news.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.salon_name}</TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  <p>Start: {new Date(item.starts_at).toLocaleDateString()}</p>
                                  <p>End: {new Date(item.ends_at).toLocaleDateString()}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {item.is_approved ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    Pending Approval
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openNewsDialog(item)}
                                  >
                                    Review
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 pt-4">
              <FeatureManagement />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.name}. This will affect their permissions across the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="role-user" 
                  checked={newRole === 'user'}
                  onCheckedChange={() => setNewRole('user')}
                />
                <label htmlFor="role-user" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  User - Regular user with basic permissions
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-admin" 
                  checked={newRole === 'admin'}
                  onCheckedChange={() => setNewRole('admin')}
                />
                <label htmlFor="role-admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Admin - Can manage salon, services and appointments
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-superadmin" 
                  checked={newRole === 'superadmin'}
                  onCheckedChange={() => setNewRole('superadmin')}
                />
                <label htmlFor="role-superadmin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Super Admin - Full system access and management
                </label>
              </div>
            </div>
            
            {newRole === 'superadmin' && (
              <Alert>
                <AlertTitle className="flex items-center gap-2 text-amber-600">
                  <Shield className="h-4 w-4" />
                  Warning
                </AlertTitle>
                <AlertDescription className="text-amber-600">
                  Super Admin has unrestricted access to the entire system. Grant this role with caution.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Promotion</DialogTitle>
            <DialogDescription>
              Review the promotion details before approving or rejecting.
            </DialogDescription>
          </DialogHeader>
          
          {selectedNews && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">Promotion Title</h3>
                <p>{selectedNews.title}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Salon</h3>
                <p>{selectedNews.salon_name}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Content</h3>
                <p className="text-sm">{selectedNews.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">Start Date</h3>
                  <p>{new Date(selectedNews.starts_at).toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium">End Date</h3>
                  <p>{new Date(selectedNews.ends_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedNews.image_url && (
                <div className="space-y-1">
                  <h3 className="font-medium">Image</h3>
                  <div className="rounded-md overflow-hidden border">
                    <img 
                      src={selectedNews.image_url} 
                      alt={selectedNews.title}
                      className="w-full h-auto max-h-40 object-cover" 
                    />
                  </div>
                </div>
              )}
              
              <Alert variant={selectedNews.is_approved ? "default" : "destructive"}>
                <AlertTitle>
                  {selectedNews.is_approved ? "Currently Approved" : "Awaiting Approval"}
                </AlertTitle>
                <AlertDescription>
                  {selectedNews.is_approved 
                    ? "This promotion is currently visible to users." 
                    : "This promotion is not visible to users until approved."}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            {selectedNews && (
              selectedNews.is_approved ? (
                <Button 
                  variant="destructive" 
                  onClick={() => handleNewsApproval(selectedNews.id, false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject Promotion
                </Button>
              ) : (
                <div className="flex w-full justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewsDialog(false)}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleNewsApproval(selectedNews.id, false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => handleNewsApproval(selectedNews.id, true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SuperAdminDashboard;
