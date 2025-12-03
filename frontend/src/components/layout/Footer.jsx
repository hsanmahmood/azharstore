import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black/20 border-t border-brand-border py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <img src="/logo.png" alt="AzharStore Logo" className="h-16 mx-auto mb-4" />
        <p className="text-brand-secondary text-sm">&copy; {new Date().getFullYear()} AzharStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
