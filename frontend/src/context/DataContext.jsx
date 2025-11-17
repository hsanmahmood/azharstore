import React, { createContext, useState, useEffect, useCallback } from 'react';
import { productService, categoryService, customerService } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, customersRes] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        customerService.getAllCustomers(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes);
      setCustomers(customersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const value = {
    products,
    setProducts,
    categories,
    setCategories,
    customers,
    setCustomers,
    isLoading,
    error,
    refreshData: fetchData,
    addProduct,
    updateProduct,
    removeProduct,
    addCustomer,
    updateCustomer,
    removeCustomer,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
