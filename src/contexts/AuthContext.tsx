
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

// Mock user data for development
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
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would communicate with Supabase
      // For this example, we'll just check our mock users
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create the user object, omitting the password
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      toast.success(`Welcome back, ${foundUser.name}!`);
      
      // Navigate based on role
      if (foundUser.role === 'superadmin') {
        navigate('/super-admin');
      } else if (foundUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
      
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
      
      // In a real app, this would communicate with Supabase
      // For this example, we'll just check if the email exists
      const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        throw new Error('Email already in use');
      }
      
      toast.success('Account created successfully! You can now sign in.');
      navigate('/sign-in');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    // In a real app, this would communicate with Supabase
    setUser(null);
    
    toast.success('Logged out successfully');
    navigate('/');
    
    setIsLoading(false);
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
