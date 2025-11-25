import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Star, Download, Trash2, CheckCircle } from 'lucide-react';
import TransformedImage from './TransformedImage';

const ProductImage = ({ image, isPrimary, onRemove, onSetPrimary, onView, onDownload }) => {
  const { t } = useTranslation();
  const imageUrl = image.file ? URL.createObjectURL(image.file) : image.image_url;

  return (
    <div className="relative group border border-soft-border rounded-lg overflow-hidden aspect-square">
      <TransformedImage
        url={imageUrl}
        alt={t('productManagement.imageAlt')}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <button
          onClick={() => onView(imageUrl)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          title={t('productManagement.tooltips.viewImage')}
        >
          <Eye size={18} />
        </button>
        {!isPrimary && (
          <button
            onClick={() => onSetPrimary(image)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title={t('productManagement.tooltips.setAsPrimary')}
          >
            <Star size={18} />
          </button>
        )}
        <button
          onClick={() => onDownload(image)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          title={t('productManagement.tooltips.downloadImage')}
        >
          <Download size={18} />
        </button>
        <button
          onClick={() => onRemove(image)}
          className="p-2 rounded-full bg-red-500/50 hover:bg-red-500/80 text-white transition-colors"
          title={t('productManagement.tooltips.removeImage')}
        >
          <Trash2 size={18} />
        </button>
      </div>
      {isPrimary && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-brand-purple text-white text-xs font-semibold px-2 py-1 rounded-full">
          <CheckCircle size={14} />
          <span>{t('productManagement.primaryBadge')}</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
