
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    latitude: number;
    longitude: number;
  } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "Geolocation is not supported by your browser",
        position: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error: error.message,
          position: null,
        });
      }
    );
  }, []);

  return state;
};
