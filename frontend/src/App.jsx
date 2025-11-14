import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));

const App = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'AzharStore';
  }, [location, t]);

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col font-arabic">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/admin/products" /> : <Login />} />

        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="products" />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
