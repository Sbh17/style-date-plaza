
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, UserPlus, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { sendOTPVerification, verifyOTP, isSupabaseConfigured } from '@/lib/authUtils';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const [email, setEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // Store email for OTP verification
      setEmail(data.email);
      
      // Use our authUtils function instead of direct Supabase call
      const success = await sendOTPVerification(data.email);
      
      if (success) {
        // Move to verification step
        setStep('verification');
        
        // If in development mode with no Supabase, show a more helpful message
        if (!isSupabaseConfigured()) {
          toast.info("Development mode: Enter any 6-digit code to continue");
        } else {
          toast.success("We've sent a verification code to your email");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
      console.error("Verification request error:", error);
    }
  };
  
  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }
    
    try {
      setVerifying(true);
      
      // Use our authUtils function
      const success = await verifyOTP(email, otpValue);
      
      if (success) {
        // Now complete the sign up with the form data
        const formData = form.getValues();
        await signUp(formData.email, formData.password, formData.name);
        
        toast.success("Email verified successfully!");
        navigate('/sign-in');
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
      console.error("Verification error:", error);
    } finally {
      setVerifying(false);
    }
  };
  
  const handleResendOTP = async () => {
    try {
      setResending(true);
      
      // Use our authUtils function
      const success = await sendOTPVerification(email);
      
      if (success) {
        // If in development mode with no Supabase, show a more helpful message
        if (!isSupabaseConfigured()) {
          toast.info("Development mode: Enter any 6-digit code to continue");
        } else {
          toast.success("A new verification code has been sent to your email");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-auto p-2" 
          onClick={() => step === 'verification' ? setStep('details') : navigate('/welcome')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">
          {step === 'details' ? 'Sign Up' : 'Verify Email'}
        </h1>
      </div>
      
      <div className="flex-1 px-4 py-6 flex flex-col">
        {step === 'details' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Email Verification
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Mail className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold">Verify your email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit code to {email}
              </p>
              {!isSupabaseConfigured() && (
                <p className="text-sm font-medium text-amber-500">
                  Development mode: Enter any 6 digits to verify
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <FormLabel>Verification Code</FormLabel>
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full" 
                size="lg"
                disabled={verifying || otpValue.length !== 6}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify & Create Account
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={handleResendOTP}
                    disabled={resending}
                  >
                    {resending ? "Sending..." : "Resend"}
                  </Button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
