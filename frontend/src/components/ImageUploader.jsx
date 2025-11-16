import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2 } from 'lucide-react';

const ImageUploader = ({ onUpload, preview, uploading, multiple = false }) => {
  const { t } = useTranslation();

  return (
    <label className="flex justify-center items-center w-full h-32 px-6 border-2 border-brand-border border-dashed rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
      {uploading ? (
        <Loader2 className="animate-spin text-brand-primary" />
      ) : preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-10 w-10 text-brand-secondary" />
          <p className="text-sm text-brand-secondary">
            {t('productManagement.form.clickToUpload')}
          </p>
        </div>
      )}
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={onUpload}
        className="sr-only"
        disabled={uploading}
      />
    </label>
  );
};

export default ImageUploader;
