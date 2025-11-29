import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DeliveryAuthContext } from '../../context/deliveryAuth.jsx';
import LoadingScreen from './LoadingScreen';

const DeliveryProtectedRoute = () => {
  const { token, isLoading } = useContext(DeliveryAuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default DeliveryProtectedRoute;
