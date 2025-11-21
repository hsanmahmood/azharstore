import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { apiService } from '../services/api';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const publicDataPromises = [
        apiService.getAllProducts(),
        apiService.getAllCategories(),
      ];

      const [productsRes, categoriesRes] = await Promise.all(publicDataPromises);
      setProducts(productsRes.data);
      setCategories(categoriesRes);

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
        setError('Failed to fetch data');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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

  const updateOrder = (updatedOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const removeOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
