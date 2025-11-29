import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2 } from 'lucide-react';

const ImageUploader = ({ onUpload, preview, uploading, multiple = false, size = 'h-32' }) => {
  const { t } = useTranslation();

  return (
    <label className={`relative flex justify-center items-center aspect-square ${size} border-2 border-soft-border border-dashed rounded-lg cursor-pointer hover:border-brand-purple/50 transition-colors overflow-hidden bg-gray-50`}>
      {uploading ? (
        <Loader2 className="animate-spin text-brand-purple" />
      ) : preview ? (
        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-8 w-8 text-text-light" />
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
