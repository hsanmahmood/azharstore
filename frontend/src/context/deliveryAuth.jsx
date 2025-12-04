import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('deliveryToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    localStorage.setItem('deliveryToken', token);
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <DeliveryAuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};
