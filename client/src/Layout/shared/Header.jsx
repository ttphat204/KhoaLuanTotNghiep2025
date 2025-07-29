import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaBell, FaBriefcase, FaHome, FaBuilding, FaBookOpen, FaIndustry, FaCity, FaGlobe, FaUsers, FaChartBar, FaMoon, FaSun, FaLanguage } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import NotificationBell from '../../components/NotificationBell';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('vi');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Đảm bảo modal không mở tự động khi component mount
  useEffect(() => {
    // Reset modal state khi component mount
    setShowLoginModal(false);
    setShowRegisterModal(false);
    
    // Kiểm tra URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const showLogin = urlParams.get('showLogin');
    const showRegister = urlParams.get('showRegister');
    
    // Chỉ mở modal nếu có URL parameter và user chưa đăng nhập
    if (showLogin === 'true' && !isAuthenticated) {
      setShowLoginModal(true);
    } else if (showRegister === 'true' && !isAuthenticated) {
      setShowRegisterModal(true);
    }
  }, [isAuthenticated]);

  // Thêm event listener để đóng modal khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLoginModal || showRegisterModal) {
        const modal = event.target.closest('.modal-content');
        if (!modal) {
          setShowLoginModal(false);
          setShowRegisterModal(false);
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && (showLoginModal || showRegisterModal)) {
        setShowLoginModal(false);
        setShowRegisterModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLoginModal, showRegisterModal]);

  // Nếu user đã đăng nhập nhưng modal vẫn mở, đóng modal
  useEffect(() => {
    if (isAuthenticated && (showLoginModal || showRegisterModal)) {
      setShowLoginModal(false);
      setShowRegisterModal(false);
    }
  }, [showLoginModal, showRegisterModal, isAuthenticated]);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual theme switching
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'vi' ? 'en' : 'vi');
    // TODO: Implement actual language switching
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Left side - Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300"
              onClick={handleLogoClick}
            >
              JobFinder
            </h1>
          </motion.div>

          {/* Center - Navigation with enhanced styling */}
          <nav className="hidden md:flex items-center ml-12">
            <motion.a
              href="/companies"
              className="flex items-center gap-3 text-gray-700 px-8 py-4 text-base font-semibold rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-lg hover:-translate-y-1"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <FaIndustry className="w-5 h-5" />
              <span>Công ty</span>
            </motion.a>
          </nav>

          {/* Right side - Quick actions and user */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ y: 0, scale: 0.95 }}
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Language Switcher */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ y: 0, scale: 0.95 }}
              title="Chuyển đổi ngôn ngữ"
            >
              <FaLanguage className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸'}
              </span>
            </motion.button>

            {isAuthenticated ? (
              // User is logged in - Show NotificationBell and UserProfileDropdown
              <div className="flex items-center gap-3">
                {user?.role === 'candidate' && (
                  <NotificationBell userId={user._id} />
                )}
                <UserProfileDropdown />
              </div>
            ) : (
              // User is not logged in
              <div className="flex items-center gap-4">
                <motion.button
                  className="h-12 px-5 flex flex-col items-start justify-center rounded-xl border-2 border-indigo-500 bg-white text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-600 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  onClick={() => setShowLoginModal(true)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                >
                  <span className="text-xs font-bold text-gray-600">Người tìm việc</span>
                  <span className="text-sm font-bold leading-tight">Đăng ký/Đăng nhập</span>
                </motion.button>
                <motion.button
                  className="h-12 px-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 border border-transparent transition-all duration-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-lg hover:shadow-xl"
                  onClick={() => navigate('/employer/login')}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                >
                  <FaBriefcase className="text-white w-4 h-4" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold uppercase text-indigo-100">Dành cho</span>
                    <span className="text-sm font-bold">Nhà Tuyển Dụng</span>
                  </div>
                </motion.button>
              </div>
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