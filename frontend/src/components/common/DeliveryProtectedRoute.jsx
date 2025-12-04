import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DeliveryAuthContext } from '../context/deliveryAuth';

const DeliveryProtectedRoute = () => {
  const { isAuthenticated } = useContext(DeliveryAuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default DeliveryProtectedRoute;
