
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.styledateplaza',
  appName: 'style-date-plaza',
  webDir: 'dist',
  server: {
    url: 'https://32ba3c43-670e-41b4-8b8a-c395e79c76eb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Add any other configurations you might need
};

export default config;
