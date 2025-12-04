import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DataContext } from './context/DataContext';
import { useLoading } from './context/LoadingContext';
import StoreFront from './features/storefront/pages/StoreFront';
import ProductDetail from './features/storefront/pages/ProductDetail';
import Login from './features/storefront/pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './features/admin/pages/AdminLayout';
import ProductManagement from './features/admin/pages/ProductManagement';
import CategoryManagement from './features/admin/pages/CategoryManagement';
import CustomerManagement from './features/admin/pages/CustomerManagement';
import OrderManagement from './features/admin/pages/OrderManagement';
import Settings from './features/admin/pages/Settings';
import Translations from './features/admin/pages/Translations';
import LoadingScreen from './components/common/LoadingScreen';
import DeliveryLogin from './features/delivery/pages/LoginPage';
import DeliveryLayout from './features/delivery/pages/DeliveryLayout';
import DeliveryOrdersPage from './features/delivery/pages/OrdersPage';
import { DeliveryAuthProvider } from './context/deliveryAuth';
import DeliveryProtectedRoute from './components/common/DeliveryProtectedRoute';
import { SearchProvider } from './context/SearchContext';

const App = () => {
  const { token } = useContext(AuthContext);
  const { isLoading: isDataLoading } = useLoading();
  const location = useLocation();

  const isAdminSite = React.useMemo(() => {
    return (
      window.location.hostname.startsWith('admin') ||
      (window.location.hostname.includes('localhost') && location.pathname.startsWith('/admin')) ||
      (window.location.hostname.includes('127.0.0.1') && location.pathname.startsWith('/admin'))
    );
  }, [location.pathname]);

  const isDeliverySite = React.useMemo(() => {
    return (
      window.location.hostname.startsWith('delivery') ||
      (window.location.hostname.includes('localhost') && location.pathname.startsWith('/delivery')) ||
      (window.location.hostname.includes('127.0.0.1') && location.pathname.startsWith('/delivery'))
    );
  }, [location.pathname]);

  useEffect(() => {
    if (isAdminSite) {
      document.title = 'AzharStore Admin';
    } else if (isDeliverySite) {
      document.title = 'AzharStore Delivery';
    } else {
      document.title = 'AzharStore';
    }
  }, [location, isAdminSite, isDeliverySite]);

  if (isDataLoading) {
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

  if (isDeliverySite) {
    return (
      <DeliveryAuthProvider>
        <SearchProvider>
          <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col">
            <Routes>
              <Route path="/login" element={<DeliveryLogin />} />
              <Route path="/" element={<DeliveryProtectedRoute />}>
                <Route element={<DeliveryLayout />}>
                  <Route index element={<DeliveryOrdersPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </SearchProvider>
      </DeliveryAuthProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col animate-fadeIn">
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
