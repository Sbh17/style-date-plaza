
import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

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
