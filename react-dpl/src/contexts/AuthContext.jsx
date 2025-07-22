import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthStore, SettingsStore } from '../services/storage';
import { API } from '../services/api';
import { Utils } from '../services/utils.jsx';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    let refreshTimer = null;

    const processAuthResponse = useCallback((response) => {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        AuthStore.setToken(newToken);
        AuthStore.setUser(newUser);
        startTokenRefresh();
        Utils.events.emit('auth:login', { user: newUser, token: newToken });
    }, []);

    const handleLogin = useCallback(async (credentials) => {
        try {
            // UI.Loading.show('Kirilmoqda...'); // Will be handled by React component
            const response = await API.auth.login(credentials);
            if (response.success) {
                processAuthResponse(response);
                // UI.Toast.success(Config.SUCCESS.LOGIN); // Will be handled by React component
                // UI.Modal.hide('loginModal'); // Will be handled by React component
                return { success: true };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            // UI.Toast.error(error.message || 'Kirish xatoligi'); // Will be handled by React component
            return { success: false, error: error.message || 'Kirish xatoligi' };
        } finally {
            // UI.Loading.hide(); // Will be handled by React component
        }
    }, [processAuthResponse]);

    const handleRegister = useCallback(async (userData) => {
        try {
            // UI.Loading.show('Ro\'yxatdan o\'tilmoqda...'); // Will be handled by React component
            const response = await API.auth.register(userData);
            if (response.success) {
                processAuthResponse(response);
                // UI.Toast.success(Config.SUCCESS.REGISTER); // Will be handled by React component
                // UI.Modal.hide('registerModal'); // Will be handled by React component
                return { success: true };
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register error:', error);
            // UI.Toast.error(error.message || 'Ro\'yxatdan o\'tish xatoligi'); // Will be handled by React component
            return { success: false, error: error.message || 'Ro\'yxatdan o\'tish xatoligi' };
        } finally {
            // UI.Loading.hide(); // Will be handled by React component
        }
    }, [processAuthResponse]);

    const handleLogout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        AuthStore.clearAuth();
        stopTokenRefresh();
        Utils.events.emit('auth:logout');
        // UI.Toast.success(Config.SUCCESS.LOGOUT); // Will be handled by React component
        navigate('/');
    }, [navigate]);

    const logout = useCallback(async () => {
        try {
            if (isAuthenticated && token) {
                await API.auth.logout();
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            handleLogout();
        }
    }, [isAuthenticated, token, handleLogout]);

    const loadUserProfile = useCallback(async () => {
        try {
            const storedToken = AuthStore.getToken();
            const storedUser = AuthStore.getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);
                startTokenRefresh();
            }

            // Verify token with API
            const response = await API.auth.me();
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                AuthStore.setUser(response.data.user);
            } else {
                throw new Error('Failed to load user profile');
            }
        } catch (error) {
            console.error('Load profile error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const refreshToken = useCallback(async () => {
        try {
            const response = await API.auth.me();
            if (response.success) {
                // Token is still valid, update user data if changed
                setUser(response.data.user);
                AuthStore.setUser(response.data.user);
                return true;
            } else {
                throw new Error('Token invalid');
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const startTokenRefresh = useCallback(() => {
        stopTokenRefresh();
        refreshTimer = setInterval(async () => {
            try {
                await refreshToken();
            } catch (error) {
                console.error('Token refresh error:', error);
                // UI.Toast.warning('Sessiya tugadi. Iltimos, qayta kiring'); // Will be handled by React component
                handleLogout();
            }
        }, 50 * 60 * 1000); // Every 50 minutes
    }, [refreshToken, handleLogout]);

    const stopTokenRefresh = useCallback(() => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }
    }, []);

    const checkAuth = useCallback(() => isAuthenticated, [isAuthenticated]);

    const requireAuth = useCallback((callback, redirectPath = '/') => {
        if (isAuthenticated) {
            callback();
        } else {
            SettingsStore.set('intended_path', redirectPath);
            // UI.Toast.warning('Bu amalni bajarish uchun tizimga kirish kerak'); // Will be handled by React component
            navigate('/login'); // Assuming a /login route will be added
        }
    }, [isAuthenticated, navigate]);

    const getCurrentUser = useCallback(() => user, [user]);
    const getToken = useCallback(() => token, [token]);

    // Initial load
    useEffect(() => {
        loadUserProfile();
        return () => stopTokenRefresh();
    }, [loadUserProfile, stopTokenRefresh]);

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login: handleLogin,
        logout,
        handleRegister,
        checkAuth,
        requireAuth,
        getCurrentUser,
        getToken,
        // Add other AuthManager methods as needed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);