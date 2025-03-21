
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { Bell, Globe, Lock, Shield, Check, Sun, Moon, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import UserProfileForm from '@/components/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('english');
  const [dataSharing, setDataSharing] = useState(true);
  const [changesMade, setChangesMade] = useState(false);
  const { user } = useAuth();

  // Create a ref for directions based on language
  const isRtl = language === 'hebrew' || language === 'arabic';
  
  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('notifications_enabled, preferred_language, data_sharing')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setNotificationsEnabled(data.notifications_enabled);
          if (data.preferred_language) setLanguage(data.preferred_language);
          if (data.data_sharing !== undefined) setDataSharing(data.data_sharing);
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
      // Save settings to database
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications_enabled: notificationsEnabled,
          preferred_language: language,
          data_sharing: dataSharing,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
        
      toast.success('Settings saved successfully');
      setChangesMade(false);
      
      // Apply RTL direction if needed
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setChangesMade(true);
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    setChangesMade(true);
  };
  
  const handleDataSharingChange = (checked: boolean) => {
    setDataSharing(checked);
    setChangesMade(true);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto pb-24">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your application preferences and personal information
          </p>
        </div>

        <UserProfileForm />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <Moon className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the application looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </div>
              </div>
              <ThemeToggle variant="pill" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications about your appointments and updates
                </div>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationsChange} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language and regional settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Language</div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="hebrew">Hebrew</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
              
              {isRtl && (
                <div className="mt-2 flex items-center text-sm text-amber-600 dark:text-amber-500">
                  <Check className="h-4 w-4 mr-1" />
                  <span>RTL writing direction will be applied on save</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy settings and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Data Sharing</div>
                <div className="text-sm text-muted-foreground">
                  Share usage data to help improve our services
                </div>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={handleDataSharingChange} 
              />
            </div>
            
            <Separator className="my-2" />
            
            <Button variant="outline" className="w-full">
              Privacy Policy
            </Button>
            
            <Button variant="outline" className="w-full">
              Terms of Service
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Save Changes Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-t flex justify-end max-w-2xl mx-auto">
        <Button 
          onClick={handleSaveChanges} 
          disabled={!changesMade}
          className="px-6"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </Layout>
  );
};

export default Settings;
