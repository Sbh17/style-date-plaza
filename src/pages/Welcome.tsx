
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, ChevronRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">StyleDate Plaza</h1>
          <p className="text-muted-foreground">Discover and book the best beauty services near you</p>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/sign-in')}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/sign-up')}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create Account
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full flex justify-between items-center"
            onClick={() => navigate('/explore')}
          >
            <span>Continue as guest</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} StyleDate Plaza. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
