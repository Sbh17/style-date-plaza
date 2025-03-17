
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type UserRole = 'user' | 'admin';

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
  login: (email: string, password: string) => void;
  logout: () => void;
  goToAdmin: () => void;
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
  // Mock users - in a real app, this would come from a database
  const mockUsers = [
    {
      id: '1',
      name: 'Emma Johnson',
      email: 'emma@example.com',
      password: 'password123',
      role: 'user' as UserRole,
      profileImage: 'https://i.pravatar.cc/300',
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin' as UserRole,
      profileImage: 'https://i.pravatar.cc/300?img=68',
    }
  ];

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('salonUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  const login = (email: string, password: string) => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Don't store password in state or localStorage
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('salonUser', JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome back, ${foundUser.name}!`);
      navigate(foundUser.role === 'admin' ? '/admin' : '/profile');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('salonUser');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const goToAdmin = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      toast.error('You need admin permissions to access this page');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout,
      goToAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
