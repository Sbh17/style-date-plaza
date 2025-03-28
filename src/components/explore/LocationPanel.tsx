
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationPanel: React.FC = () => {
  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Current Location</p>
          <p className="text-xs text-muted-foreground">Within 5 miles</p>
        </div>
      </div>
      <Button size="sm" variant="default">
        Change
      </Button>
    </div>
  );
};

export default LocationPanel;
