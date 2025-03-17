
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import ViewCodeButton from './ViewCodeButton';
import { Button } from './ui/button';
import { LogIn, UserPlus, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Animation based on route change
  React.useEffect(() => {
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
        </div>
        <div className="flex items-center gap-2">
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
