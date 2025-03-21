
import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, CreditCard, Heart, Bell, ChevronRight, Save } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const menuItems = [
  {
    icon: Settings,
    label: 'Account Settings',
    href: '/settings',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    href: '#',
  },
  {
    icon: Heart,
    label: 'Favorite Salons',
    href: '#',
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '#',
  },
];

const Profile: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [changesMade, setChangesMade] = useState(false);
  const { isAdmin, user, logout, goToAdmin } = useAuth();
  
  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('notifications_enabled')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setNotificationsEnabled(data.notifications_enabled);
        }
      } catch (err) {
        console.error('Error in fetching user settings:', err);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      // Save notification preferences to database
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications_enabled: notificationsEnabled,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
        
      toast.success('Profile settings saved successfully');
      setChangesMade(false);
    } catch (error: any) {
      console.error('Error saving profile settings:', error);
      toast.error(error.message || 'Failed to save profile settings');
    }
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    setChangesMade(true);
  };
  
  return (
    <Layout>
      <div className="space-y-6 pb-24">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">My Profile</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences
          </p>
        </div>
        
        <div className="glass rounded-xl p-4 flex flex-col items-center text-center animate-slide-up">
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 font-semibold text-lg">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" asChild>
              <Link to="/settings">Edit Profile</Link>
            </Button>
            {isAdmin && (
              <Button variant="default" onClick={goToAdmin}>
                Admin Dashboard
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-medium">Settings</h2>
          
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border",
                  "hover:border-primary/50 transition-all duration-200"
                )}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>Push Notifications</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationsChange} 
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>Dark Mode</span>
              </div>
              <ThemeToggle variant="pill" />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Button 
          variant="outline" 
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Fixed Save Changes Button */}
      {changesMade ? (
        <div className="fixed bottom-20 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-t">
          <Button 
            onClick={handleSaveChanges} 
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      ) : null}
    </Layout>
  );
};

export default Profile;
