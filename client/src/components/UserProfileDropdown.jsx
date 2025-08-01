import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FaUser, 
  FaChevronDown, 
  FaSignOutAlt, 
  FaUserEdit, 
  FaCog, 
  FaBell, 
  FaBriefcase,
  FaHeart,
  FaFileAlt,
  FaBuilding,
  FaCrown,
  FaStar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Đóng dropdown khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setIsOpen(false);
  }, [logout, navigate]);

  const handleProfileClick = useCallback(() => {
    if (user?.role === 'candidate') {
      navigate('/candidate/profile');
    } else if (user?.role === 'employer') {
      navigate('/employer/profile');
    }
    setIsOpen(false);
  }, [user?.role, navigate]);

  const handleDashboardClick = useCallback(() => {
    if (user?.role === 'candidate') {
      navigate('/candidate');
    } else if (user?.role === 'employer') {
      navigate('/employer');
    }
    setIsOpen(false);
  }, [user?.role, navigate]);

  const handleApplicationsClick = useCallback(() => {
    if (user?.role === 'candidate') {
      navigate('/candidate/applications');
    } else if (user?.role === 'employer') {
      navigate('/employer/applications');
    }
    setIsOpen(false);
  }, [user?.role, navigate]);

  const handleFavoriteJobsClick = useCallback(() => {
    if (user?.role === 'candidate') {
      navigate('/candidate/favorite-jobs');
    }
    setIsOpen(false);
  }, [user?.role, navigate]);

  const getRoleInfo = useCallback(() => {
    switch (user?.role) {
      case 'candidate':
        return {
          label: 'Ứng viên',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: FaUser,
          bgGradient: 'from-blue-500 to-indigo-600',
          borderColor: 'border-blue-200 dark:border-blue-600'
        };
      case 'employer':
        return {
          label: 'Nhà tuyển dụng',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: FaBuilding,
          bgGradient: 'from-green-500 to-emerald-600',
          borderColor: 'border-green-200 dark:border-green-600'
        };
      case 'admin':
        return {
          label: 'Admin',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          icon: FaCrown,
          bgGradient: 'from-purple-500 to-pink-600',
          borderColor: 'border-purple-200 dark:border-purple-600'
        };
      default:
        return {
          label: 'Người dùng',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: FaUser,
          bgGradient: 'from-gray-500 to-gray-600',
          borderColor: 'border-gray-200 dark:border-gray-600'
        };
    }
  }, [user?.role]);

  const roleInfo = getRoleInfo();

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 group"
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        aria-label="Mở menu người dùng"
      >
        {/* Profile Picture - Lighter Design */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden border border-white/60 shadow-sm group-hover:shadow-md transition-all duration-200">
          {(user.avatarUrl || user.companyLogoUrl) ? (
            <img 
              src={user.avatarUrl || user.companyLogoUrl} 
              alt={user.fullName || user.companyName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${(user.avatarUrl || user.companyLogoUrl) ? 'hidden' : ''}`}>
            <roleInfo.icon className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* User Name - Simplified */}
        <span className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-20">
          {user.fullName || user.companyName || 'Người dùng'}
        </span>
        
        {/* Dropdown Arrow - Smaller */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-indigo-500 transition-colors"
        >
          <FaChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu - Lighter Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/40 dark:border-gray-700/40 overflow-hidden z-50"
          >
            {/* Arrow pointing up - Smaller */}
            <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white/90 dark:bg-gray-800/90 border-l border-t border-gray-200/40 dark:border-gray-700/40 transform rotate-45"></div>
            
            {/* Menu Content - Lighter */}
            <div className="py-2">
              {/* Menu Items */}
              <div className="py-1">
                {/* Dashboard */}
                <motion.button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                  whileHover={{ x: 3 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-200 shadow-sm">
                    <FaBriefcase className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Bảng điều khiển</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Quản lý tài khoản</p>
                  </div>
                </motion.button>

                {/* Profile */}
                <motion.button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                  whileHover={{ x: 3 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-200 shadow-sm">
                    <FaUserEdit className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Hồ sơ cá nhân</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Chỉnh sửa thông tin</p>
                  </div>
                </motion.button>

                {/* Applications */}
                <motion.button
                  onClick={handleApplicationsClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                  whileHover={{ x: 3 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-200 shadow-sm">
                    <FaFileAlt className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {user?.role === 'candidate' ? 'Đơn ứng tuyển' : 'Quản lý ứng viên'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role === 'candidate' ? 'Xem trạng thái ứng tuyển' : 'Xem danh sách ứng viên'}
                    </p>
                  </div>
                </motion.button>

                {/* Favorites */}
                {user?.role === 'candidate' && (
                  <motion.button
                    onClick={handleFavoriteJobsClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                    whileHover={{ x: 3 }}
                    whileTap={{ x: 0 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center group-hover:from-pink-500 group-hover:to-rose-600 transition-all duration-200 shadow-sm">
                      <FaHeart className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Công việc yêu thích</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Xem việc làm đã lưu</p>
                    </div>
                  </motion.button>
                )}

                <hr className="my-2 border-gray-200/30 dark:border-gray-700/30" />
                
                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-150 group"
                  whileHover={{ x: 3 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center group-hover:from-red-500 group-hover:to-pink-600 transition-all duration-200 shadow-sm">
                    <FaSignOutAlt className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors">Đăng xuất</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Thoát khỏi tài khoản</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown; 