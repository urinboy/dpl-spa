import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth хукини AuthProvider ичида ишлатиш керак');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Фойдаланувчи маълумотларини текшириш
  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await ApiService.get('/user');
      setUser(response.user || response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Аутентификация текшириши хатоси:', error);
      localStorage.removeItem('auth_token');
      ApiService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  // Логин
  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Логин хатоси'
      };
    }
  };

  // Рўйхатдан ўтиш
  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Рўйхатдан ўтиш хатоси'
      };
    }
  };

  // Чиқиш
  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Чиқиш хатоси:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      ApiService.removeToken();
    }
  };

  // Фойдаланувчи ролини текшириш
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
