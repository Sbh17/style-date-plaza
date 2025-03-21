import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { Bell, Globe, Lock, Shield, Check, Sun, Moon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import UserProfileForm from '@/components/UserProfileForm';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [language, setLanguage] = React.useState('english');
  const [changesMade, setChangesMade] = React.useState(false);

  // Create a ref for directions based on language
  const isRtl = language === 'hebrew' || language === 'arabic';
  
  const handleSaveChanges = () => {
    toast.success('Settings saved successfully');
    setChangesMade(false);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setChangesMade(true);
    toast.success(`Language changed to ${value.charAt(0).toUpperCase() + value.slice(1)}`);
    
    // Apply RTL direction if needed
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
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
                onCheckedChange={setNotificationsEnabled} 
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
              <Switch defaultChecked={true} />
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

        <div className="sticky bottom-20 bg-background z-10 pt-4 mt-8 border-t flex justify-end">
          <Button 
            onClick={handleSaveChanges} 
            disabled={!changesMade}
            className="px-6"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
