import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useLoading } from './context/LoadingContext';
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
import Translations from './pages/admin/Translations';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const { isLoading } = useLoading();

  const isAdminSite = React.useMemo(() => {
    return (
      window.location.hostname.startsWith('admin') ||
      (window.location.hostname.includes('localhost') && location.pathname.startsWith('/admin')) ||
      (window.location.hostname.includes('127.0.0.1') && location.pathname.startsWith('/admin'))
    );
  }, [location.pathname]);

  useEffect(() => {
    document.title = isAdminSite ? 'AzharStore Admin' : 'AzharStore';
  }, [location, isAdminSite]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAdminSite) {
    return (
      <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/admin" /> : <Login />} />
          <Route path="/admin/login" element={token ? <Navigate to="/admin" /> : <Login />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="translations" element={<Translations />} />
            </Route>
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="translations" element={<Translations />} />
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
