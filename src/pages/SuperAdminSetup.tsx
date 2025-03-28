
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { setupSuperAdmin } from '@/utils/adminUtils';
import { toast } from 'sonner';

const SuperAdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const [name, setName] = useState('Super Admin');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSuperAdmin = async () => {
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const created = await setupSuperAdmin(email, password, name);
      
      if (created) {
        setSuccess(true);
        toast.success(`Superadmin created/updated successfully!`);
        toast.info(`Use these credentials to sign in: Email: ${email}, Password: ${password}`);
      } else {
        setError('Failed to create superadmin. Please try again.');
        toast.error('Failed to create superadmin');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      toast.error(error.message || 'An error occurred');
      console.error('Error creating superadmin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Create Super Admin
          </CardTitle>
          <CardDescription>
            Set up a superadmin user to manage the application and test all features
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {success ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Super Admin Created!</h3>
              <p className="text-sm text-muted-foreground">
                Your superadmin account has been successfully created.
              </p>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="text-sm"><strong>Email:</strong> {email}</p>
                <p className="text-sm"><strong>Password:</strong> {password}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Super Admin" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@example.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="text" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password123!" 
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 rounded-md flex items-start gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {success ? (
            <Button 
              className="w-full" 
              onClick={handleGoToSignIn}
            >
              Go to Sign In Page
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleCreateSuperAdmin} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Super Admin
                </>
              )}
            </Button>
          )}
          {!success && (
            <p className="text-xs text-center text-muted-foreground pt-2">
              This creates a superadmin account that you can use to access all features of the application.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuperAdminSetup;
