import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI } from '../services/api';
import { STORAGE_KEYS } from '../config/constants';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    toast.success('Berhasil logout');
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        console.log('🔄 InitAuth - Token:', storedToken ? 'Found' : 'Not found');
        console.log('🔄 InitAuth - User:', storedUser ? 'Found' : 'Not found');

        if (storedToken && storedUser) {
          // Set state immediately from localStorage
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setLoading(false); // Set loading false immediately
          
          // Verify token in background (don't block UI)
          authAPI.getCurrentUser()
            .then((response) => {
              console.log('✅ Background token verification:', response);
              if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
                console.log('✅ User updated from server');
              }
            })
            .catch((error) => {
              console.error('⚠️ Background token verification failed:', error);
              // Don't logout immediately, token might still be valid
            });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { access_token, user: userData } = response.data;
        
        setToken(access_token);
        setUser(userData);
        
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        
        toast.success(`Selamat datang, ${userData.username}! 💕`);
        return true;
      } else {
        toast.error(response.message || 'Login gagal');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      toast.error(errorMessage);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};