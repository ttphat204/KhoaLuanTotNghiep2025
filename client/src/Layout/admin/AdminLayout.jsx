import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccess } from '../../utils/toast';
import { FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, active, onSelect }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    showSuccess('👋 Đăng xuất thành công!', 'Cảm ơn bạn đã sử dụng hệ thống.');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f6fbff] to-[#e9eafc] font-sans">
      <Sidebar
        active={active}
        onSelect={onSelect}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between h-16 px-6 bg-white shadow-lg mb-6 rounded-bl-3xl">
          <div className="flex items-center">
            <button
              className="text-2xl text-[#2C3EFF] focus:outline-none mr-4 hover:bg-gray-100 p-2 rounded-lg transition-colors"
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
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <span className="hidden md:block font-medium">{user?.fullName || 'Admin'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Add settings functionality here
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaCog className="text-gray-400" />
                  Cài đặt
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
        <div>{children}</div>
      </div>
      
      {/* Overlay for mobile menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 