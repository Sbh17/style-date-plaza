
import React, { useState } from 'react';
import { User, LogOut, Settings, CreditCard, Heart, Bell } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    icon: Settings,
    label: 'Account Settings',
    href: '#',
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
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // Mock user data
  const user = {
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    profileImage: 'https://i.pravatar.cc/300',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold antialiased">My Profile</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences
          </p>
        </div>
        
        <div className="glass rounded-xl p-4 flex flex-col items-center text-center animate-slide-up">
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 font-semibold text-lg">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Button variant="outline" className="mt-3">
            Edit Profile
          </Button>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-medium">Settings</h2>
          
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border",
                  "hover:border-primary/50 transition-all duration-200"
                )}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              </a>
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
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>Dark Mode</span>
              </div>
              <Switch 
                checked={darkModeEnabled} 
                onCheckedChange={setDarkModeEnabled} 
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
