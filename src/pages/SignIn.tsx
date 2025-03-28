
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { sendOTPVerification } from '@/lib/authUtils';

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" })
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

type SignInFormValues = z.infer<typeof signInSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [resetSent, setResetSent] = useState(false);
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormValues) => {
    try {
      // Using the OTP verification as a password reset mechanism
      const success = await sendOTPVerification(data.email);
      if (success) {
        setResetSent(true);
        toast.success("Password reset link sent! Check your email");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    }
  };

  // Pre-filled credentials
  const fillAdminCredentials = () => {
    form.setValue('email', 'hanin@admin.com');
    form.setValue('password', 'admin123');
  };

  const fillUserCredentials = () => {
    form.setValue('email', 'haneen@style.com');
    form.setValue('password', 'password123');
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
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Account Access</h1>
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

        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="reset">Reset Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
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
          </TabsContent>
          
          <TabsContent value="reset">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Check Your Email</h3>
                <p className="text-muted-foreground">
                  We've sent a password reset link to your email address.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("signin")}>
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <Button type="submit" className="w-full" variant="default">
                    Send Reset Link
                  </Button>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
        
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
