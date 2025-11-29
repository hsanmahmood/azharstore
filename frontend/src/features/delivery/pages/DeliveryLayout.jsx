import React from 'react';
import { Outlet } from 'react-router-dom';

const DeliveryLayout = () => {
  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 bg-primary-background/80 backdrop-blur-lg flex items-center justify-between">
        <div className="p-4">
          <h1 className="text-xl font-bold">Delivery Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;
