import React, { createContext, useState, useEffect } from 'react';
import { deliveryApiService } from '../services/deliveryApi';

export const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('deliveryToken'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('deliveryToken', token);
    } else {
      localStorage.removeItem('deliveryToken');
    }
  }, [token]);

  const login = async (password) => {
    const response = await deliveryApiService.login(password);
    setToken(response.data.access_token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <DeliveryAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};
