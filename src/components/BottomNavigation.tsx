
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/'
    },
    {
      label: 'Explore',
      icon: MapPin,
      href: '/explore',
      active: pathname === '/explore'
    },
    {
      label: 'Appointments',
      icon: Calendar,
      href: '/appointments',
      active: pathname === '/appointments'
    },
    {
      label: 'Profile',
      icon: User,
      href: '/profile',
      active: pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-background/95 border-t border-secondary shadow-lg">
      <nav className="flex justify-around py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "bottom-nav-item w-full py-1",
              item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} className={cn(
              "mb-1 transition-transform duration-200",
              item.active ? "scale-110" : ""
            )} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
