import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import LogRocket from 'logrocket';
import { jwtDecode } from "jwt-decode";
import { useLoading } from './LoadingContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const validateToken = () => {
      showLoading();
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Token is expired
            logout();
          }
        } catch (error) {
          // Invalid token
          logout();
        }
      }
      hideLoading();
    };

    validateToken();
  }, [token, showLoading, hideLoading]);

  const login = async (password) => {
    const response = await authService.login(password);
    const newToken = response.data.access_token;
    const decodedToken = jwtDecode(newToken);
    LogRocket.identify(decodedToken.sub, {
      email: decodedToken.sub,
    });
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
