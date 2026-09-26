import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Footer } from './Footer.jsx';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#407c93] text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 gap-8 relative z-10">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

