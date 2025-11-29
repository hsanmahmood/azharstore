import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AddToCartDialog from '../modals/AddToCartDialog';

const ProductGrid = ({ products = [] }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`)}
          className="bg-white rounded-xl border border-border-gray shadow-sm hover:shadow-lg hover:border-brand-purple hover:scale-[1.02] transition-all duration-200 overflow-hidden cursor-pointer"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-200">
            {product.primary_image_url ? (
              <img
                src={product.primary_image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-xs">لم يتم رفع أي صور بعد</span></div>';
                }}
              />
            ) : product.product_images?.length > 0 ? (
              <img
                src={
                  product.product_images.find(img => img.is_primary)?.image_url ||
                  product.product_images[0]?.image_url
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-xs">لم يتم رفع أي صور بعد</span></div>';
                }}
              />
            ) : product.images?.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-xs">لم يتم رفع أي صور بعد</span></div>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">لم يتم رفع أي صور بعد</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-brand-purple">
                {product.price} د.ب
              </span>

              <button
                onClick={(e) => handleAddToCartClick(e, product)}
                className="h-8 w-8 p-0 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90 hover:scale-110 transition-all duration-200 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {selectedProduct && (
        <AddToCartDialog
          isOpen={!!selectedProduct}
          onClose={closeDialog}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default ProductGrid;
