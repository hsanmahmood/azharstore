import React from 'react';
import { Edit, Trash2, Package, ImageIcon } from 'lucide-react';
import TransformedImage from '../../../components/product/TransformedImage';

const ProductCard = ({ product, onEdit, onDelete, optimistic }) => {
  // Find the primary image or use the first available image
  const primaryImage = product.primary_image_url ||
    product.product_images?.find(img => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url;

  // Calculate total stock: if variants exist, sum their quantities; otherwise use product stock
  const totalStock = product.product_variants && product.product_variants.length > 0
    ? product.product_variants.reduce((sum, variant) => sum + (variant.stock_quantity || 0), 0)
    : product.stock_quantity || 0;

  const cardClasses = `
    bg-card-background border border-soft-border rounded-2xl p-4 flex flex-col
    transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-1
    ${optimistic ? 'opacity-50 animate-pulse' : ''}
  `;

  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        {primaryImage ? (
          <TransformedImage
            url={primaryImage}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="text-text-light" size={48} />
          </div>
        )}
        <div className="flex justify-between items-start gap-2 mt-3">
          <h3 className="text-lg font-bold text-text-dark flex-1 break-words">{product.name}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(product)} className="text-text-light hover:text-brand-purple transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(product.id)} className="text-text-light hover:text-stock-red transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-text-light mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-text-light">
            <span>{product.price} د.ب</span>
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <Package size={14} />
            <span>المخزون: {totalStock}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
