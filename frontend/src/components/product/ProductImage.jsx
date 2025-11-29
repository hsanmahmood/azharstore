import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import TransformedImage from './TransformedImage';
import ImageActionMenu from '../forms/ImageActionMenu';

const ProductImage = ({ image, isPrimary, onRemove, onSetPrimary, onView, onDownload }) => {
  const { t } = useTranslation();
  const imageUrl = image.file ? URL.createObjectURL(image.file) : image.image_url;

  return (
    <div className="relative group aspect-square">
      <div className="w-full h-full rounded-lg overflow-hidden border border-soft-border">
        <TransformedImage
          url={imageUrl}
          alt={t('productManagement.imageAlt')}
          className="w-full h-full object-cover"
        />
      </div>
      <ImageActionMenu
        isPrimary={isPrimary}
        onRemove={() => onRemove(image)}
        onSetPrimary={() => onSetPrimary(image)}
        onView={() => onView(imageUrl)}
        onDownload={() => onDownload(image)}
      />
      {isPrimary && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-brand-purple text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          <CheckCircle size={14} />
          <span>{t('productManagement.primaryBadge')}</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
