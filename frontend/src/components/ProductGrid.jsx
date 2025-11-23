import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-brand-white rounded-lg shadow-card overflow-hidden">
          <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-text-dark">{product.name}</h3>
            <p className="text-text-light mt-2">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
