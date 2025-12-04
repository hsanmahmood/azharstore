import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DeliveryAuthContext } from '../../context/deliveryAuth';
import LoadingScreen from './LoadingScreen';

const DeliveryProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(DeliveryAuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default DeliveryProtectedRoute;
