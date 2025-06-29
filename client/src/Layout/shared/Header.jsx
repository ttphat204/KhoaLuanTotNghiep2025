import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaBell, FaBriefcase, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Debug: log user object và role lấy từ context
  if (user) {
    console.log('User role:', user.role);
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getWelcomeText = () => {
    if (!user) return '';
    if (user.role === 'admin') return user.fullName || 'Admin';
    if (user.role === 'candidate') return user.fullName || 'Ứng viên';
    return '';
  };

  const handleLogoClick = () => {
    if (isAuthenticated && user?.role === 'candidate') {
      navigate('/candidate');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors"
              onClick={handleLogoClick}
            >
              JobFinder
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2 ml-8">
            <a
              href="#"
              className="text-gray-700 px-3 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Việc làm
            </a>
            <a
              href="#"
              className="text-gray-700 px-3 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Công ty
            </a>
            <a
              href="#"
              className="text-gray-700 px-3 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Cẩm nang
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isAuthenticated ? (
              // User is logged in
              <div className="flex items-center gap-3">
                {isAuthenticated && getWelcomeText() && (
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <FaUser className="w-4 h-4" />
                    <span>Xin chào, {getWelcomeText()}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Đăng xuất"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              // User is not logged in
              <>
                <button
                  className="h-12 px-4 flex flex-col items-start justify-center rounded-lg border-2 border-[#4B1CD6] bg-white text-[#4B1CD6] hover:bg-[#ede9fe] hover:text-[#4B1CD6] transition-all duration-200 focus:outline-none"
                  onClick={() => setShowLoginModal(true)}
                >
                  <span className="text-xs font-bold">Người tìm việc</span>
                  <span className="text-base font-bold leading-tight">Đăng ký/Đăng nhập</span>
                </button>
                <button
                  className="h-12 px-4 flex items-center gap-2 rounded-lg bg-[#4B1CD6] hover:bg-[#3a13b3] border border-transparent transition-all duration-200 text-white focus:outline-none"
                  onClick={() => navigate('/employer/login')}
                >
                  <FaBriefcase className="text-[#2c95ff] w-6 h-6 mr-1" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold uppercase">Dành cho</span>
                    <span className="text-base font-bold">Nhà Tuyển Dụng</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onOpenRegisterModal={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </header>
  );
};

export default Header; 