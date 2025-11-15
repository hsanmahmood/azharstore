import React, { createContext, useState, useEffect, useCallback } from 'react';
import { productService, categoryService } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes);
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

  const value = {
    products,
    setProducts, // Keep for direct manipulation if needed, e.g., during delete failure recovery
    categories,
    setCategories,
    isLoading,
    error,
    refreshData: fetchData,
    addProduct,
    updateProduct,
    removeProduct,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
