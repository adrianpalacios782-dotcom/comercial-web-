import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, verifySession } from '../services/api';

const AUTH_TOKEN_KEY = 'tiendita_auth_token_v1';
const AUTH_USER_KEY = 'tiendita_auth_user_v1';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (_) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Verificar la sesión al iniciar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifySession(savedToken);
        if (response && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.warn('Sesión no válida o expirada:', error.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  // Roles y permisos
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.rol === 'admin';
  const isCajero = user?.rol === 'cajero_1' || user?.rol === 'cajero_2';
  // Tanto el Administrador como los Cajeros pueden agregar y quitar productos
  const canManageProducts = isAdmin || isCajero;
  // Solo el Administrador puede ver las ganancias totales
  const canViewProfits = isAdmin;

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin,
    isCajero,
    canManageProducts,
    canViewProfits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un <AuthProvider>');
  }
  return context;
};
