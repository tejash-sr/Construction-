import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/auth';

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast.success(`Welcome back, ${data.data.user.name}!`);
        
        // Redirect based on user role
        if (data.data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast.success(`Welcome, ${data.data.user.name}!`);
        
        // New users go to home page (they are never admins)
        navigate('/');
      } else {
        toast.error(data.message || 'Registration failed');
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
