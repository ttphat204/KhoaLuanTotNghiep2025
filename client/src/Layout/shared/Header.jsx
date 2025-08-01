import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaBell, FaBriefcase, FaHome, FaBuilding, FaBookOpen, FaIndustry, FaCity, FaGlobe, FaUsers, FaChartBar, FaMoon, FaSun, FaInfoCircle, FaRocket, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import NotificationBell from '../../components/NotificationBell';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Kiểm tra localStorage hoặc system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Khởi tạo dark mode khi component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

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
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Lưu vào localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Áp dụng dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50 dark:border-gray-800/50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-purple-50/20 to-pink-50/20 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 pointer-events-none"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Left side - Logo with text underline effect */}
          <motion.div 
            className="flex-shrink-0 relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h1 
              className="relative text-3xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 flex items-center gap-2"
              onClick={handleLogoClick}
            >
              <FaRocket className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:animate-bounce" />
              <span className="tracking-tight relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-indigo-300 dark:hover:via-purple-300 dark:hover:to-pink-300">
                JobFinder
                {/* Text underline effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500"></span>
              </span>
              <FaStar className="w-4 h-4 text-yellow-500 group-hover:animate-spin" />
            </h1>
          </motion.div>

          {/* Center - Navigation with wavy menu path effect */}
          <nav className="hidden md:flex items-center ml-12 gap-8">
            <motion.div
              className="group relative flex items-center gap-2 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link to="/companies" className="flex items-center gap-2">
                <FaIndustry className="w-4 h-4 group-hover:animate-pulse" />
                <span>Công ty</span>
              </Link>
              {/* Wavy line effect */}
              <svg className="absolute bottom-0 left-0 w-full h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path 
                  d="M0,10 Q25,0 50,10 T100,10" 
                  stroke="url(#indigoGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  className="group-hover:animate-dash"
                />
                <defs>
                  <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
            <motion.div
              className="group relative flex items-center gap-2 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link to="/about" className="flex items-center gap-2">
                <FaInfoCircle className="w-4 h-4 group-hover:animate-pulse" />
                <span>Giới thiệu</span>
              </Link>
              {/* Wavy line effect */}
              <svg className="absolute bottom-0 left-0 w-full h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path 
                  d="M0,10 Q25,0 50,10 T100,10" 
                  stroke="url(#emeraldGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  className="group-hover:animate-dash"
                />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </nav>

          {/* Right side - Actions with 3D blend mode buttons */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Theme Toggle with sleepy birds button effect */}
            <motion.button
              onClick={toggleTheme}
              className={`relative p-2.5 rounded-xl transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-lg overflow-hidden ${
                isDarkMode 
                  ? 'text-yellow-500 hover:text-yellow-400' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              whileHover={{ y: -3, rotate: 5 }}
              whileTap={{ y: 0, rotate: 0 }}
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {/* Sleepy birds effect - floating animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              {isDarkMode ? (
                <FaSun className="relative w-4 h-4 animate-bounce" />
              ) : (
                <FaMoon className="relative w-4 h-4" />
              )}
            </motion.button>

            {isAuthenticated ? (
              // User is logged in with rainbow button effect
              <div className="flex items-center gap-3">
                {user?.role === 'candidate' && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <NotificationBell userId={user._id} />
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <UserProfileDropdown />
                </div>
              </div>
            ) : (
              // User is not logged in with don't push me buttons effect
              <div className="flex items-center gap-3">
                <motion.button
                  className="group relative h-11 px-4 flex flex-col items-start justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 overflow-hidden"
                  onClick={() => setShowLoginModal(true)}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ y: 0, scale: 0.95 }}
                >
                  {/* Don't push me effect - press down animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:animate-pulse">Người tìm việc</span>
                  <span className="relative text-sm font-semibold leading-tight group-hover:animate-pulse">Đăng ký/Đăng nhập</span>
                </motion.button>
                <motion.button
                  className="group relative h-11 px-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-pink-600 transition-all duration-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 shadow-md hover:shadow-xl overflow-hidden"
                  onClick={() => navigate('/employer/login')}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ y: 0, scale: 0.95 }}
                >
                  {/* 3D blend mode effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FaBriefcase className="relative text-white w-4 h-4 group-hover:animate-bounce" />
                  <div className="relative flex flex-col items-start leading-tight">
                    <span className="text-xs font-medium uppercase text-indigo-100 dark:text-indigo-200 group-hover:animate-pulse">Dành cho</span>
                    <span className="text-sm font-semibold group-hover:animate-pulse">Nhà Tuyển Dụng</span>
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