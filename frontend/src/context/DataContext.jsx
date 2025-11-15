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

  const value = {
    products,
    setProducts,
    categories,
    setCategories,
    isLoading,
    error,
    refreshData: fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
