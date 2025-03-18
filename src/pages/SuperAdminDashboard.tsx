
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Profile, type Salon } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, User, Scissors, RefreshCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const SuperAdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'superadmin'>('user');

  // Check if the user is a superadmin, redirect if not
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied. Super Admin permissions required.");
      navigate('/');
    }
  }, [isSuperAdmin, navigate]);

  // Fetch users and salons
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) throw profilesError;
        
        // Fetch all salons
        const { data: salonsData, error: salonsError } = await supabase
          .from('salons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (salonsError) throw salonsError;
        
        setUsers(profilesData || []);
        setSalons(salonsData || []);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to handle role changes
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      // Update local state
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

  // Function to open the role change dialog
  const openRoleDialog = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  // Function to refresh the data
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users" className="gap-2">
                <User className="h-4 w-4" />
                Users Management
              </TabsTrigger>
              <TabsTrigger value="salons" className="gap-2">
                <Scissors className="h-4 w-4" />
                Salons Management
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
                                disabled={user?.id === profile.user_id} // Can't change own role
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
          </Tabs>
        )}
      </div>

      {/* Role Change Dialog */}
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
    </Layout>
  );
};

export default SuperAdminDashboard;
