
import React, { useState } from 'react';
import { MapPin, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface LocationPanelProps {
  onLocationChange?: (lat: number, lng: number) => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ onLocationChange }) => {
  const [distance, setDistance] = useState<number>(5); // 5 miles by default
  const { position, loading, error, getPosition } = useGeolocation({ autoRequest: false });
  const { isAuthenticated, isSuperAdmin } = useAuth();

  const handleGetLocation = async () => {
    try {
      if (!isAuthenticated) {
        toast.info('Sign in to enable personalized location features');
      }
      
      await getPosition();
    } catch (error) {
      toast.error('Failed to get your location. Please check your browser permissions.');
    }
  };

  React.useEffect(() => {
    if (position && onLocationChange) {
      onLocationChange(position.latitude, position.longitude);
    }
  }, [position, onLocationChange]);

  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${position ? 'bg-primary/10' : 'bg-muted'}`}>
          <MapPin className={`h-5 w-5 ${position ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <p className="text-sm font-medium">
            {position ? 'Current Location' : 'Location not detected'}
          </p>
          <p className="text-xs text-muted-foreground">
            {position 
              ? `Within ${distance} miles` 
              : 'Enable location for nearby salons'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link to="/setup-superadmin">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center"
          >
            <Shield className="h-4 w-4 mr-1" />
            Setup Admin
          </Button>
        </Link>
        <Button 
          size="sm" 
          variant={position ? "outline" : "default"}
          onClick={handleGetLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Detecting...
            </>
          ) : position ? (
            'Change'
          ) : (
            'Detect'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationPanel;
