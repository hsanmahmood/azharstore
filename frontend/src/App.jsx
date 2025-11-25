import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import StoreFront from './pages/StoreFront';
import ProductDetail from './pages/ProductDetail';
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

  // Dual routing: support both hostname-based (admin.azhar.store) and path-based (localhost/admin)
  const isAdminSite = React.useMemo(() => {
    return (
      window.location.hostname.startsWith('admin') || // Production: admin.azhar.store
      (window.location.hostname.includes('localhost') && location.pathname.startsWith('/admin')) || // Local dev
      (window.location.hostname.includes('127.0.0.1') && location.pathname.startsWith('/admin')) // Local dev alternative
    );
  }, [location.pathname]);

  const { t } = useTranslation();

  useEffect(() => {
    document.title = isAdminSite ? 'AzharStore Admin' : 'AzharStore';
  }, [location, t, isAdminSite]);

  if (isAdminSite) {
    return (
      <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/admin" /> : <Login />} />
          <Route path="/admin/login" element={token ? <Navigate to="/admin" /> : <Login />} />

          {/* Admin routes with /admin prefix for local development */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin routes at root for admin.azhar.store */}
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

          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
        <Routes>
          <Route path="/" element={<StoreFront />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/admin/*" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;
