
import React from 'react';
import Layout from '@/components/Layout';
import SupabaseConnectionTest from '@/components/SupabaseConnectionTest';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EnvTest: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Environment Test</h1>
        </div>
        
        <div className="space-y-8">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <p className="text-muted-foreground mb-4">
              This page tests if your environment variables are correctly loaded and if the connection to Supabase is working.
            </p>
            
            <SupabaseConnectionTest />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EnvTest;
