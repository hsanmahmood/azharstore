import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifier = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const notify = (message, type = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
    </NotificationContext.Provider>
  );
};
