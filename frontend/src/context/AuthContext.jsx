import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import LogRocket from 'logrocket';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const adminUser = { name: 'Admin', email: 'admin@azhar.store' };
      setUser(adminUser);
      LogRocket.identify('admin_user', {
        name: adminUser.name,
        email: adminUser.email,
        subscriptionType: 'pro',
      });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
