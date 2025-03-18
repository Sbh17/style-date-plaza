
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import ViewCodeButton from './ViewCodeButton';
import { Button } from './ui/button';
import { 
  LogIn, 
  UserPlus, 
  Shield, 
  User, 
  LogOut, 
  Settings as SettingsIcon, 
  Moon, 
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const { user, isAuthenticated, isAdmin, isSuperAdmin, logout, goToAdmin, goToSuperAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Animation based on route change
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.add('page-enter');
      
      const timer = setTimeout(() => {
        mainContent.classList.remove('page-enter');
      }, 300);
      
      return () => {
        clearTimeout(timer);
        mainContent.classList.add('page-exit');
      };
    }
  }, [pathname]);

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                asChild
              >
                <Link to="/sign-in">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-1.5"
                asChild
              >
                <Link to="/sign-up">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback>
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={goToAdmin} className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
                {isSuperAdmin && (
                  <DropdownMenuItem onClick={goToSuperAdmin} className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Super Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && !isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
              asChild
            >
              <Link to="/admin">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <ViewCodeButton />
        </div>
      </div>
      <main id="main-content" className="flex-1 flex flex-col overflow-auto pb-16">
        <div className="px-4 pt-4 pb-20 md:px-6 md:pt-6 h-full">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
