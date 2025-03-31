
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole, Profile } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define User type with appropriate role types
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
};

// Define the AuthContext type
interface AuthContextProps {
  user: User | null;
  session: any;
  loading: boolean;
  isLoading: boolean; // Added for SignIn and SignUp
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>; // Added for SignUp
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  fetchUserProfile: (userId: string) => Promise<any>;
  goToAdmin: () => void; // Added for navigation
  goToSuperAdmin: () => void; // Added for navigation
  requireAuth: () => boolean; // Added for authentication check
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  signUp: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  fetchUserProfile: async () => null,
  goToAdmin: () => {},
  goToSuperAdmin: () => {},
  requireAuth: () => false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    loadSession();

    // Listen for changes on auth state (login, logout, register)
    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // Cast the role to UserRole type to ensure type safety
      const userRole = data.role as UserRole;
      
      // Update user state with profile data
      setUser({
        id: userId,
        name: data.name,
        email: data.email,
        role: userRole,
        profileImage: data.profile_image
      });

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      navigate('/welcome');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add navigation functions
  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToSuperAdmin = () => {
    navigate('/super-admin');
  };

  // Add requireAuth function
  const requireAuth = (): boolean => {
    if (!user && !loading) {
      toast.error('You must be logged in to access this page');
      navigate('/sign-in');
      return false;
    }
    return true;
  };

  // Value object to be provided by the context
  const value = {
    user,
    session,
    loading,
    isLoading: loading, // Alias loading as isLoading for compatibility
    login: loginWithEmailAndPassword,
    logout,
    register: registerWithEmailAndPassword,
    signUp: registerWithEmailAndPassword, // Alias register as signUp for compatibility
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin',
    fetchUserProfile,
    goToAdmin,
    goToSuperAdmin,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
