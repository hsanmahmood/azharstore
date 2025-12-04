import React from 'react';
import { Outlet } from 'react-router-dom';

const DeliveryLayout = () => {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;
