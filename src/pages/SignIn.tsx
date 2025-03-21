
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
  role: z.enum(['user', 'admin'], { required_error: "Please select a role" })
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState('');
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user"
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setAuthError('');
    try {
      await login(data.email, data.password, data.role);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  // Pre-filled credentials
  const fillAdminCredentials = () => {
    form.setValue('email', 'hanin@admin.com');
    form.setValue('password', 'admin123');
    form.setValue('role', 'admin');
  };

  const fillUserCredentials = () => {
    form.setValue('email', 'haneen@style.com');
    form.setValue('password', 'password123');
    form.setValue('role', 'user');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-auto p-2" 
          onClick={() => navigate('/welcome')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Sign In</h1>
      </div>
      
      <div className="flex-1 px-4 py-6 flex flex-col">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={fillUserCredentials} className="white-accent">
            Try as Regular User
          </Button>
          <Button variant="outline" onClick={fillAdminCredentials} className="white-accent">
            Try as Admin
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sign in as</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Regular User
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Admin
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {authError && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-3 text-sm text-destructive">
                  {authError}
                </CardContent>
              </Card>
            )}
            
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
