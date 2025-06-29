import React, { useState } from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, active, onSelect }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f6fbff] to-[#e9eafc] font-sans">
      <Sidebar
        active={active}
        onSelect={onSelect}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1">
        <div className="flex items-center h-16 px-6 bg-white shadow-lg mb-6 rounded-bl-3xl">
          <button
            className="text-2xl text-[#2C3EFF] focus:outline-none mr-4"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path stroke="#2C3EFF" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
              ) : (
                <path stroke="#2C3EFF" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="text-2xl font-extrabold text-[#2C3EFF] tracking-tight">Admin Dashboard</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout; 