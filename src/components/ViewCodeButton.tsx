
import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const codeSnippets = [
  {
    id: 'app',
    name: 'App.tsx',
    code: `import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import SalonDetails from "./pages/SalonDetails";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/salon/:id" element={<SalonDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`
  },
  {
    id: 'layout',
    name: 'Layout.tsx',
    code: `import React from 'react';
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

export default Layout;`
  },
  {
    id: 'saloncard',
    name: 'SalonCard.tsx',
    code: `import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalonCardProps {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  location: string;
  distance?: string;
  specialties?: string[];
  className?: string;
}

const SalonCard: React.FC<SalonCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  ratingCount,
  location,
  distance,
  specialties,
  className
}) => {
  return (
    <Link
      to={\`/salon/\${id}\`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
    >
      <div className="aspect-[5/3] w-full overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col p-3 space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-medium line-clamp-1 text-balance">{name}</h3>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <p className="text-xs truncate">{location}</p>
          {distance && (
            <span className="text-xs ml-2">• {distance}</span>
          )}
        </div>
        
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-secondary text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2 py-0.5 bg-secondary text-xs rounded-full">
                +{specialties.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SalonCard;`
  }
];

const ViewCodeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Only show in development mode and set to false to hide it as requested
    setIsDevelopment(false);
  }, []);

  if (!isDevelopment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm shadow-md border-primary/20"
        >
          <Code className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application Code</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="app" className="w-full overflow-hidden flex flex-col flex-1">
          <TabsList className="grid grid-cols-3 w-full">
            {codeSnippets.map((snippet) => (
              <TabsTrigger key={snippet.id} value={snippet.id}>
                {snippet.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {codeSnippets.map((snippet) => (
            <TabsContent key={snippet.id} value={snippet.id} className="flex-1 overflow-auto">
              <div className="bg-secondary/30 p-4 rounded-md overflow-auto h-full">
                <pre className="text-xs md:text-sm whitespace-pre-wrap break-words font-mono">
                  {snippet.code}
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCodeButton;
