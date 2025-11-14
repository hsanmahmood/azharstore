import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate token on mount
    if (token) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (password) => {
    const response = await authService.login(password);
    const newToken = response.data.access_token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
