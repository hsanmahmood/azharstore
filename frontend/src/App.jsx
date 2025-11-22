import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Settings from './pages/admin/Settings';

const App = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const isAdminSite = window.location.hostname.startsWith('admin');
  const { t } = useTranslation();

  useEffect(() => {
    document.title = isAdminSite ? 'AzharStore Admin' : 'AzharStore';
  }, [location, t, isAdminSite]);

  if (isAdminSite) {
    return (
      <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/admin/*" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
