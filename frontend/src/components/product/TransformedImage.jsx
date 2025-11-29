import React from 'react';

const TransformedImage = ({ url, alt, ...props }) => {
  return <img src={url} alt={alt} {...props} />;
};

export default TransformedImage;
