import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { apiService, getAllTranslations } from '../services/api';
import { AuthContext } from './AuthContext';
import { useLoading } from './LoadingContext';
import i18n from '../i18n/config';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const { showLoading, hideLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [appSettings, setAppSettings] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const updateI18nResources = (translationsData) => {
    const resources = {
      ar: { translation: {} },
    };
    translationsData.forEach(t => {
      if (t.lang === 'ar') {
        const keys = t.key.split('.');
        let currentLevel = resources.ar.translation;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            currentLevel[key] = t.value;
          } else {
            currentLevel[key] = currentLevel[key] || {};
            currentLevel = currentLevel[key];
          }
        });
      }
    });
    i18n.addResourceBundle('ar', 'translation', resources.ar.translation, true, true);
    i18n.changeLanguage('ar');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    showLoading();
    try {
      const publicDataPromises = [
        apiService.getAllProducts(),
        apiService.getAllCategories(),
        getAllTranslations(),
      ];

      const [productsRes, categoriesRes, translationsRes] = await Promise.all(publicDataPromises);
      setProducts(productsRes.data);
      setCategories(categoriesRes);
      setTranslations(translationsRes);
      updateI18nResources(translationsRes);

      if (token) {
        const [customersRes, ordersRes, deliveryAreasRes, appSettingsRes] = await Promise.all([
          apiService.getAllCustomers(),
          apiService.getAllOrders(),
          apiService.getAllDeliveryAreas(),
          apiService.getAppSettings(),
        ]);
        setCustomers(customersRes.data);
        setOrders(ordersRes.data);
        setDeliveryAreas(deliveryAreasRes.data);
        setAppSettings(appSettingsRes.data);
      } else {
        setCustomers([]);
        setOrders([]);
        setDeliveryAreas([]);
        setAppSettings({});
      }

      setError('');
    } catch (err) {
      if (err.response && err.response.status !== 401) {
        console.error("Error response from server:", err.response);
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch data';
        setError(errorMsg);
      } else {
        console.error("An unexpected error occurred:", err);
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [token, showLoading, hideLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProduct = (product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const removeProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addCustomer = (customer) => {
    setCustomers(prev => [customer, ...prev]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const removeCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (updatedOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const removeOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const addCategory = (category) => {
    setCategories(prev => [category, ...prev]);
  };

  const updateCategory = (updatedCategory) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addDeliveryArea = (area) => {
    setDeliveryAreas(prev => [area, ...prev]);
  };

  const updateDeliveryArea = (updatedArea) => {
    setDeliveryAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
  };

  const deleteDeliveryArea = (id) => {
    setDeliveryAreas(prev => prev.filter(a => a.id !== id));
  };

  const updateAppSettings = (settings) => {
    setAppSettings(settings);
  };

  const updateTranslation = (updatedTranslation) => {
    setTranslations(prev => {
      const newTranslations = prev.map(t => t.id === updatedTranslation.id ? updatedTranslation : t);
      updateI18nResources(newTranslations);
      return newTranslations;
    });
  };

  const addTranslation = (translation) => {
    setTranslations(prev => {
      const newTranslations = [translation, ...prev];
      updateI18nResources(newTranslations);
      return newTranslations;
    });
  };

  const value = {
    products,
    setProducts,
    categories,
    setCategories,
    customers,
    setCustomers,
    orders,
    setOrders,
    deliveryAreas,
    setDeliveryAreas,
    appSettings,
    setAppSettings,
    translations,
    setTranslations,
    isLoading,
    error,
    refreshData: fetchData,
    addProduct,
    updateProduct,
    removeProduct,
    addCustomer,
    updateCustomer,
    removeCustomer,
    updateOrder,
    removeOrder,
    addOrder,
    addCategory,
    updateCategory,
    deleteCategory,
    addDeliveryArea,
    updateDeliveryArea,
    deleteDeliveryArea,
    updateAppSettings,
    updateTranslation,
    addTranslation,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
