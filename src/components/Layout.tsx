import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 pt-20 pb-20 md:pb-12 px-4 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default Layout;