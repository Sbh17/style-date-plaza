
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase, type Profile, type AuthUser } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  // Function to map Supabase user and profile to our app's User type
  const mapUser = async (session: Session | null): Promise<User | null> => {
    if (!session?.user) return null;
    
    try {
      // Get profile information from our profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile', error);
        return null;
      }
      
      return {
        id: session.user.id,
        name: profile?.name || 'User',
        email: session.user.email || '',
        role: profile?.role || 'user',
        profileImage: profile?.profile_image || undefined,
      };
    } catch (err) {
      console.error('Error in mapUser function:', err);
      return null;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    setIsLoading(true);
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          setIsLoading(false);
          return;
        }
        
        const userData = await mapUser(session);
        setUser(userData);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      const userData = await mapUser(session);
      setUser(userData);
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const userData = await mapUser(data.session);
      setUser(userData);
      
      toast.success(`Welcome back, ${userData?.name || 'User'}!`);
      navigate(userData?.role === 'admin' ? '/admin' : '/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');
      
      // 2. Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            email,
            name,
            role: 'user',
          }
        ]);
      
      if (profileError) throw profileError;
      
      toast.success('Account created successfully! Please check your email to confirm your account.');
      navigate('/sign-in');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
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
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
