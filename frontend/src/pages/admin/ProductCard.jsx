import React from 'react';
import { Edit, Trash2, DollarSign, Package } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, optimistic }) => {
  const getTransformedImageUrl = (url) => {
    if (!url) return '';
    // Assuming the URL is a Supabase Storage URL
    const transformOptions = 'width=1080,height=1080,resize=fill,quality=100';
    return `${url}?transform=${encodeURIComponent(transformOptions)}`;
  };

  const cardClasses = `
    bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col
    transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1
    ${optimistic ? 'opacity-50 animate-pulse' : ''}
  `;
  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        {product.product_images?.[0] && (
          <div className="w-full aspect-square flex-shrink-0">
            <img
              src={getTransformedImageUrl(product.product_images[0].image_url)}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-between items-start gap-2 mt-3">
          <h3 className="text-lg font-bold text-brand-primary flex-1 break-words">{product.name}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(product)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(product.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-brand-secondary mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{product.price} د.ب</span>
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <Package size={14} />
            <span>المخزون: {product.stock_quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
