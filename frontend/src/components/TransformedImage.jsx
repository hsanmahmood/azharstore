import React from 'react';

const TransformedImage = ({ url, alt, ...props }) => {
  const getTransformedImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    try {
      const urlObject = new URL(imageUrl);
      if (urlObject.hostname.endsWith('supabase.co') && urlObject.pathname.includes('/storage/v1/')) {
        if (urlObject.pathname.includes('/render/image/')) {
          return imageUrl;
        }
        if (urlObject.pathname.includes('/object/public/')) {
          urlObject.pathname = urlObject.pathname.replace('/object/public/', '/render/image/');
          urlObject.searchParams.set('width', '1080');
          urlObject.searchParams.set('height', '1080');
          urlObject.searchParams.set('resize', 'cover');
          return urlObject.toString();
        }
      }
      return imageUrl;
    } catch (error) {
      console.error("Failed to transform image URL:", error);
      return imageUrl;
    }
  };

  return <img src={getTransformedImageUrl(url)} alt={alt} {...props} />;
};

export default TransformedImage;
