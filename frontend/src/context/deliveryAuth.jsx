import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('deliveryToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
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
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('deliveryToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('deliveryToken');
    setToken(null);
  };

  return (
    <DeliveryAuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};
