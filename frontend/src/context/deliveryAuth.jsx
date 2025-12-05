import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('deliveryToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('deliveryToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setToken(token);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('deliveryToken');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('deliveryToken');
        setToken(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('deliveryToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('deliveryToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <DeliveryAuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};
