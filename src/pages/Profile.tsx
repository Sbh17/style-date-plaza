
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
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) {
        console.log("No user ID available for fetching settings");
        return;
      }
      
      try {
        console.log("Fetching user settings for user ID:", user.id);
        
        // Check if user_settings table exists
        const { error: tableCheckError } = await supabase
          .from('user_settings')
          .select('count')
          .limit(1);
          
        if (tableCheckError) {
          console.error("Table check error:", tableCheckError);
          console.log("user_settings table may not exist yet");
          return;
        }
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('notifications_enabled')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            console.log("No settings found for user, will create on first save");
          } else {
            console.error('Error fetching user settings:', error);
            toast.error("Couldn't load your settings. Please try again later.");
          }
          return;
        }
        
        if (data) {
          console.log("User settings loaded:", data);
          setNotificationsEnabled(data.notifications_enabled);
        }
      } catch (err) {
        console.error('Exception in fetching user settings:', err);
        toast.error("An unexpected error occurred while loading settings");
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setIsSaving(true);
    
    try {
      console.log("Saving user settings:", {
        user_id: user.id,
        notifications_enabled: notificationsEnabled
      });
      
      // Check if user_settings table exists and create it if not
      const { error: tableCheckError } = await supabase
        .from('user_settings')
        .select('count')
        .limit(1);
        
      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        toast.error(`Database error: ${tableCheckError.message}. Please contact support.`);
        setIsSaving(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications_enabled: notificationsEnabled,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error when saving settings:', error);
        toast.error(error.message || 'Failed to save profile settings');
        return;
      }
        
      console.log("Settings saved successfully:", data);
      toast.success('Profile settings saved successfully');
      setChangesMade(false);
    } catch (error: any) {
      console.error('Exception when saving profile settings:', error);
      toast.error(error.message || 'An unexpected error occurred while saving settings');
    } finally {
      setIsSaving(false);
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

      {changesMade ? (
        <div className="fixed bottom-20 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-t">
          <Button 
            onClick={handleSaveChanges} 
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      ) : null}
    </Layout>
  );
};

export default Profile;
