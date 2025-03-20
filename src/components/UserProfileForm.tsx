import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Mail, MapPin, Briefcase, FileText, Save, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define form schema with Zod
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters." }).optional(),
  profile_image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const BUCKET_NAME = 'avatars';

const UserProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.profileImage);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      occupation: '',
      bio: '',
      profile_image: user?.profileImage,
    },
  });

  // Fetch extended profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // Don't show error toast here, just log it
          return;
        }
        
        if (data) {
          // Update form with retrieved data
          form.reset({
            name: data.name || user.name,
            email: data.email || user.email,
            phone: data.phone || '',
            address: data.address || '',
            occupation: data.occupation || '',
            bio: data.bio || '',
            profile_image: data.profile_image || user.profileImage,
          });
          
          // Update avatar URL
          setAvatarUrl(data.profile_image || user.profileImage);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Silently fail - we'll just use the default values
      }
    };
    
    fetchProfileData();
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // If we're using local fallback storage, store the profile image URL in the form values
      if (useLocalStorage && values.profile_image && values.profile_image.startsWith('data:')) {
        // The image is already stored as a data URL in profile_image
        toast.success('Profile image saved locally');
      }
      
      // Try to update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          occupation: values.occupation,
          bio: values.bio,
          profile_image: values.profile_image,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Database update error:', error);
        toast.error('Profile updated locally, but couldn\'t sync with the server');
        return;
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // File upload handler for profile image 
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setIsLoading(true);
    setStorageError(null);
    
    try {
      // First try to upload using Supabase
      if (!useLocalStorage) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          // Upload image to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw uploadError;
          }
          
          // Get public URL
          const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
          
          if (data && data.publicUrl) {
            // Update form with new image URL
            form.setValue('profile_image', data.publicUrl);
            setAvatarUrl(data.publicUrl);
            toast.success('Profile image uploaded to server');
            return;
          }
        } catch (error) {
          console.error('Supabase storage error:', error);
          // If we get here, Supabase storage failed
          setStorageError('Cloud storage unavailable. Using local storage instead.');
          setUseLocalStorage(true);
          // Continue to local storage fallback
        }
      }
      
      // Fallback: Use local storage via data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          form.setValue('profile_image', dataUrl);
          setAvatarUrl(dataUrl);
          toast.success('Profile image saved locally');
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error('Error processing image:', error);
      toast.error(error.message || 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your personal profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {storageError && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{storageError}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              <div>
                <Input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('profile_image')?.click()}
                >
                  Change Picture
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                      <Input 
                        placeholder="your.email@example.com" 
                        type="email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. +1 (555) 123-4567" 
                        type="tel" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      For appointment reminders and notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your address" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your occupation" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a little about yourself" 
                      {...field} 
                      value={field.value || ''}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Share a brief description about yourself (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "Saving..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
