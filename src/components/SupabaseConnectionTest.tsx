
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [details, setDetails] = useState<string>('');
  const [envVars, setEnvVars] = useState<{
    url: string | null;
    keyLast4: string | null;
  }>({
    url: null,
    keyLast4: null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('loading');
    try {
      // Display environment variables (partially masked for security)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not set';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'Not set';
      
      // Only show last 4 characters of the key for security
      const keyLast4 = supabaseKey.length > 4 
        ? `...${supabaseKey.substring(supabaseKey.length - 4)}` 
        : 'Invalid key';
      
      setEnvVars({
        url: supabaseUrl,
        keyLast4
      });

      // Test the connection with a simple query to profiles table
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      // Try another table that's in the schema (services)
      let servicesTableAccessible = false;
      try {
        const { error: servicesError } = await supabase
          .from('services')
          .select('count')
          .limit(1);
        
        servicesTableAccessible = !servicesError;
      } catch (err) {
        console.log('Services table check error:', err);
      }
      
      setStatus('connected');
      setDetails(`Successfully connected to Supabase! Profiles table is accessible. ${
        servicesTableAccessible ? 'Services table is accessible.' : 'Services table not found or not accessible.'
      }`);
    } catch (error: any) {
      setStatus('error');
      setDetails(`Error connecting to Supabase: ${error.message || 'Unknown error'}`);
      console.error('Supabase connection test failed:', error);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Supabase Connection Test</h2>
      
      <div className="space-y-2">
        <p><strong>Supabase URL:</strong> {envVars.url}</p>
        <p><strong>Supabase Key:</strong> {envVars.keyLast4}</p>
      </div>
      
      {status === 'loading' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Testing Connection</AlertTitle>
          <AlertDescription>
            Checking connection to Supabase...
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'connected' && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Connection Successful</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            {details}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            {details}
          </AlertDescription>
        </Alert>
      )}
      
      <Button onClick={checkConnection} variant="outline">
        Test Connection Again
      </Button>
    </div>
  );
};

export default SupabaseConnectionTest;
