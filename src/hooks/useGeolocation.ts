
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    latitude: number;
    longitude: number;
  } | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

export const useGeolocation = (options: GeolocationOptions = { autoRequest: true }) => {
  const [state, setState] = useState<GeolocationState>({
    loading: options.autoRequest ? true : false,
    error: null,
    position: null,
  });

  const getPosition = () => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "Geolocation is not supported by your browser",
        position: null,
      });
      return Promise.reject("Geolocation is not supported by your browser");
    }

    setState(prev => ({ ...prev, loading: true }));

    return new Promise<GeolocationPosition>((resolve, reject) => {
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
          resolve(position);
        },
        (error) => {
          setState({
            loading: false,
            error: error.message,
            position: null,
          });
          reject(error);
        },
        {
          enableHighAccuracy: options.enableHighAccuracy || false,
          timeout: options.timeout || 10000,
          maximumAge: options.maximumAge || 0,
        }
      );
    });
  };

  useEffect(() => {
    if (options.autoRequest) {
      getPosition().catch(() => {/* Error is already handled in state */});
    }
  }, []);

  return { ...state, getPosition };
};
