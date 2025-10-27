import type { FC } from 'react';

const LoadingScreen: FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-brand-primary">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
