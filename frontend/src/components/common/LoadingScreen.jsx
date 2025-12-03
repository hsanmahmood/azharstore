import React from 'react';

const LoadingScreen = ({ fullScreen = true }) => {
  const wrapperClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-brand-background z-50'
    : 'flex items-center justify-center py-20';

  return (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="Loading..." className="h-32 object-contain mb-4" />
        <div className="h-16 w-16 rounded-full border-4 border-brand-border border-t-brand-primary animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
