import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2 } from 'lucide-react';

const ImageUploader = ({ onUpload, preview, uploading, multiple = false, size = 'h-32' }) => {
  const { t } = useTranslation();

  return (
    <label className={`flex justify-center items-center w-full ${size} border-2 border-brand-border border-dashed rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors`}>
      {uploading ? (
        <Loader2 className="animate-spin text-brand-primary" />
      ) : preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-8 w-8 text-brand-secondary" />
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
