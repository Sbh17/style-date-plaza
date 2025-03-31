
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

type UserRole = 'user' | 'admin' | 'superadmin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  goToAdmin: () => void;
  goToSuperAdmin: () => void;
  isLoading: boolean;
  requireAuth: (redirectTo?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for development - will be used as fallback if Supabase connection fails
const MOCK_USERS = [
  {
    id: '1',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=User'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Admin'
  },
  {
    id: '3',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'super123',
    role: 'superadmin' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Super+Admin'
  },
  {
    id: '4',
    name: 'Sabre Boshnaq',
    email: 'sabreboshnaq@gmail.com',
    password: 'sabre123',
    role: 'superadmin' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Sabre+Boshnaq'
  },
  {
    id: '5',
    name: 'Haneen',
    email: 'haneen@style.com',
    password: 'password123',
    role: 'user' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Haneen'
  },
  {
    id: '6',
    name: 'Hanin',
    email: 'hanin@admin.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Hanin'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          // Get user profile from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }
          
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              profileImage: profile.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`
            });
          }
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        // Fallback to localStorage if Supabase connection fails
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile after sign in
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            return;
          }
          
          if (profile) {
            const userData = {
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              profileImage: profile.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`
            };
            
            setUser(userData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('mock_user');
        }
      }
    );
    
    checkSession();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    const publicRoutes = ['/welcome', '/sign-in', '/sign-up', '/explore'];
    
    if (!isLoading) {
      // If not authenticated and not on a public route, redirect to welcome
      if (!isAuthenticated && !publicRoutes.includes(location.pathname) && location.pathname !== '/') {
        navigate('/welcome');
      }
      
      // If authenticated and on welcome page, redirect to home
      if (isAuthenticated && location.pathname === '/welcome') {
        navigate('/');
      }
      
      // If on root path, redirect appropriately
      if (location.pathname === '/') {
        if (!isAuthenticated) {
          navigate('/welcome');
        }
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // If Supabase auth fails, try mock users (for development/demo)
        console.warn('Supabase auth failed, falling back to mock users:', error.message);
        
        const foundUser = MOCK_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && 
               u.password === password
        );
        
        if (!foundUser) {
          throw new Error('Invalid credentials');
        }
        
        // Create the user object, omitting the password
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        
        // Store in localStorage for persistence
        localStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${foundUser.name}! (Using mock data)`);
      } else {
        toast.success(`Signed in successfully!`);
      }
      
      // Navigate based on role
      if (user?.role === 'superadmin') {
        navigate('/super-admin');
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Login error:', error);
      throw error; // Re-throw to handle in the sign-in component
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Register with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create a new profile in the profiles table with password for demo purposes
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            name,
            email,
            password, // Store password in profiles table
            role: 'user' // Default role for new users
          });
        
        if (profileError) throw profileError;
        
        toast.success('Account created successfully! You can now sign in.');
        navigate('/sign-in');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Also clear any mock user
      localStorage.removeItem('mock_user');
      setUser(null);
      
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const goToAdmin = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      toast.error('You need admin permissions to access this page');
    }
  };

  const goToSuperAdmin = () => {
    if (isSuperAdmin) {
      navigate('/super-admin');
    } else {
      toast.error('You need super admin permissions to access this page');
    }
  };
  
  // Helper function for components to check auth status
  const requireAuth = (redirectTo: string = '/welcome') => {
    if (isLoading) return false;
    
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      isSuperAdmin,
      login, 
      signUp,
      logout,
      goToAdmin,
      goToSuperAdmin,
      isLoading,
      requireAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
