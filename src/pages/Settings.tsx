
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { Bell, Globe, Lock, Shield, Check, Sun, Moon, Save, Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import UserProfileForm from '@/components/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/contexts/TranslationContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/utils/translationUtils';
import Translate from '@/components/Translate';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [changesMade, setChangesMade] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { 
    language, 
    setLanguage: setContextLanguage,
    translateApiKey,
    setTranslateApiKey: setContextTranslateApiKey 
  } = useTranslation();
  
  const [localTranslateApiKey, setLocalTranslateApiKey] = useState(translateApiKey);
  
  // Create a ref for directions based on language
  const isRtl = language === 'hebrew' || language === 'arabic';
  
  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) {
        console.log("No user ID available for fetching settings");
        return;
      }
      
      try {
        console.log("Fetching user settings for user ID:", user.id);
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('notifications_enabled, preferred_language, data_sharing, translate_api_key')
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
          if (data.translate_api_key) {
            setLocalTranslateApiKey(data.translate_api_key);
          }
          if (data.data_sharing !== undefined) setDataSharing(data.data_sharing);
        }
      } catch (err) {
        console.error('Exception in fetching user settings:', err);
        toast.error("An unexpected error occurred while loading settings");
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  useEffect(() => {
    // Update state when context values change
    setLocalTranslateApiKey(translateApiKey);
  }, [translateApiKey]);
  
  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setIsSaving(true);
    
    try {
      console.log("Saving user settings:", {
        user_id: user.id,
        notifications_enabled: notificationsEnabled,
        preferred_language: language,
        data_sharing: dataSharing,
        translate_api_key: localTranslateApiKey
      });
      
      // Check if the user_settings table exists
      const { error: tableCheckError } = await supabase
        .from('user_settings')
        .select('count')
        .limit(1);
        
      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        toast.error(`Database error: ${tableCheckError.message}. Please contact support.`);
        return;
      }
      
      // Save settings to database
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications_enabled: notificationsEnabled,
          preferred_language: language,
          data_sharing: dataSharing,
          translate_api_key: localTranslateApiKey,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error when saving settings:', error);
        toast.error(error.message || 'Failed to save settings');
        return;
      }
        
      console.log("Settings saved successfully:", data);
      
      // Update context with new values
      setContextTranslateApiKey(localTranslateApiKey);
      
      toast.success('Settings saved successfully');
      setChangesMade(false);
      
      // Apply RTL direction if needed
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    } catch (error: any) {
      console.error('Exception when saving settings:', error);
      toast.error(error.message || 'An unexpected error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setContextLanguage(value as SupportedLanguage);
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
  
  const handleTranslateApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTranslateApiKey(e.target.value);
    setChangesMade(true);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto pb-24">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">
            <Translate>Settings</Translate>
          </h1>
          <p className="text-muted-foreground text-sm">
            <Translate>
              Manage your application preferences and personal information
            </Translate>
          </p>
        </div>

        <UserProfileForm />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <Moon className="h-5 w-5" />
              <Translate>Appearance</Translate>
            </CardTitle>
            <CardDescription>
              <Translate>
                Customize how the application looks and feels
              </Translate>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">
                  <Translate>Dark Mode</Translate>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Translate>
                    Switch between light and dark theme
                  </Translate>
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
              <Translate>Notifications</Translate>
            </CardTitle>
            <CardDescription>
              <Translate>
                Configure how you receive notifications
              </Translate>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">
                  <Translate>Push Notifications</Translate>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Translate>
                    Receive notifications about your appointments and updates
                  </Translate>
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
              <Languages className="h-5 w-5" />
              <Translate>Language & Translation</Translate>
            </CardTitle>
            <CardDescription>
              <Translate>
                Set your preferred language and translation settings
              </Translate>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">
                <Translate>Language</Translate>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder={<Translate>Select language</Translate>} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                    <SelectItem key={key} value={key}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {isRtl && (
                <div className="mt-2 flex items-center text-sm text-amber-600 dark:text-amber-500">
                  <Check className="h-4 w-4 mr-1" />
                  <span>
                    <Translate>
                      RTL writing direction will be applied on save
                    </Translate>
                  </span>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="font-medium">
                <Translate>Google Translate API Key</Translate>
              </div>
              <Input
                type="password"
                value={localTranslateApiKey}
                onChange={handleTranslateApiKeyChange}
                placeholder="Enter your Google Translate API key"
              />
              <p className="text-xs text-muted-foreground">
                <Translate>
                  This key is required for automatic translation of content.
                  You can get a key from the Google Cloud Console.
                </Translate>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <Translate>Privacy & Security</Translate>
            </CardTitle>
            <CardDescription>
              <Translate>
                Manage your privacy settings and security preferences
              </Translate>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">
                  <Translate>Data Sharing</Translate>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Translate>
                    Share usage data to help improve our services
                  </Translate>
                </div>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={handleDataSharingChange} 
              />
            </div>
            
            <Separator className="my-2" />
            
            <Button variant="outline" className="w-full">
              <Translate>Privacy Policy</Translate>
            </Button>
            
            <Button variant="outline" className="w-full">
              <Translate>Terms of Service</Translate>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-t flex justify-end max-w-2xl mx-auto">
        <Button 
          onClick={handleSaveChanges} 
          disabled={!changesMade || isSaving}
          className="px-6"
        >
          {isSaving ? (
            <Translate>Saving...</Translate>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              <Translate>Save Changes</Translate>
            </>
          )}
        </Button>
      </div>
    </Layout>
  );
};

export default Settings;
