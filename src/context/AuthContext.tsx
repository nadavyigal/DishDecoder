import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - would be replaced with actual API call
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email,
          photoURL: 'https://source.unsplash.com/random/100x100/?portrait',
          bio: 'Food enthusiast and amateur chef',
          dietaryPreferences: ['vegetarian'],
          favorites: [],
          followers: 42
        };
        
        // Save user to local storage
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      if (name && email && password) {
        const mockUser: User = {
          id: '1',
          name,
          email,
          photoURL: 'https://source.unsplash.com/random/100x100/?portrait',
          bio: '',
          dietaryPreferences: [],
          favorites: [],
          followers: 0
        };
        
        // Save user to local storage
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error('Invalid registration details');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user from local storage
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock reset password function
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      // In a real app, this would trigger a password reset email
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock update user profile function
  const updateUserProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        
        // Save updated user to local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        throw new Error('No user logged in');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock send email verification function
  const sendEmailVerification = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // In a real app, this would send a verification email
      console.log(`Verification email sent to ${user.email}`);
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock social login functions
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock successful Google login
      const mockUser: User = {
        id: '2',
        name: 'Google User',
        email: 'google.user@example.com',
        photoURL: 'https://source.unsplash.com/random/100x100/?portrait',
        bio: 'Food lover using Google login',
        dietaryPreferences: [],
        favorites: [],
        followers: 5
      };
      
      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock successful Facebook login
      const mockUser: User = {
        id: '3',
        name: 'Facebook User',
        email: 'facebook.user@example.com',
        photoURL: 'https://source.unsplash.com/random/100x100/?portrait',
        bio: 'Food enthusiast using Facebook login',
        dietaryPreferences: [],
        favorites: [],
        followers: 8
      };
      
      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    sendEmailVerification,
    loginWithGoogle,
    loginWithFacebook
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};