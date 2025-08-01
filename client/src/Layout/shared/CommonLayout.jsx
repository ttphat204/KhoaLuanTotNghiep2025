import React from 'react';
import Header from './Header';
import Footer from '../../components/Footer';

const CommonLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout; 