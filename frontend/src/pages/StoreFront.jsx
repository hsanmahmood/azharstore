import React from 'react';
import CategorySlider from '../components/CategorySlider';
import ProductGrid from '../components/ProductGrid';

const StoreFront = () => {
  return (
    <div className="container mx-auto px-4">
      <CategorySlider />
      <div className="mt-8">
        <ProductGrid />
      </div>
    </div>
  );
};

export default StoreFront;
