import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  fetchUserProfile: (userId: string) => Promise<any>;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  fetchUserProfile: async () => null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // Value object to be provided by the context
  const value = {
    user,
    session,
    loading,
    login: loginWithEmailAndPassword,
    logout,
    register: registerWithEmailAndPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'superadmin',
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
