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
  FaBuilding
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

  const getRoleInfo = useCallback(() => {
    switch (user?.role) {
      case 'candidate':
        return {
          label: 'Ứng viên',
          color: 'bg-blue-100 text-blue-800',
          icon: FaUser,
          bgGradient: 'from-blue-500 to-indigo-600'
        };
      case 'employer':
        return {
          label: 'Nhà tuyển dụng',
          color: 'bg-green-100 text-green-800',
          icon: FaBuilding,
          bgGradient: 'from-green-500 to-emerald-600'
        };
      case 'admin':
        return {
          label: 'Admin',
          color: 'bg-purple-100 text-purple-800',
          icon: FaUser,
          bgGradient: 'from-purple-500 to-pink-600'
        };
      default:
        return {
          label: 'Người dùng',
          color: 'bg-gray-100 text-gray-800',
          icon: FaUser,
          bgGradient: 'from-gray-500 to-gray-600'
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
        className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
        aria-label="Mở menu người dùng"
      >
        {/* Profile Picture */}
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-inner">
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
        
        {/* User Name */}
        <span className="font-semibold text-sm max-w-24 truncate">
          {user.fullName || user.companyName || 'Người dùng'}
        </span>
        
        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
            
            {/* Menu Content */}
            <div className="py-4">
              {/* User Info Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${roleInfo.bgGradient} flex items-center justify-center shadow-lg border-2 border-white`}>
                    {(user.avatarUrl || user.companyLogoUrl) ? (
                      <img 
                        src={user.avatarUrl || user.companyLogoUrl} 
                        alt={user.fullName || user.companyName} 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${(user.avatarUrl || user.companyLogoUrl) ? 'hidden' : ''}`}>
                      <roleInfo.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate text-lg">
                      {user.fullName || user.companyName || 'Người dùng'}
                    </p>
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {user.email}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Dashboard */}
                <motion.button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                    <FaBriefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">Dashboard</span>
                    <p className="text-xs text-gray-500">Quản lý tài khoản</p>
                  </div>
                </motion.button>

                {/* Profile */}
                <motion.button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors">
                    <FaUserEdit className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">Hồ sơ cá nhân</span>
                    <p className="text-xs text-gray-500">Chỉnh sửa thông tin</p>
                  </div>
                </motion.button>

                {/* Applications */}
                <motion.button
                  onClick={handleApplicationsClick}
                  className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                    <FaFileAlt className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">
                      {user?.role === 'candidate' ? 'Đơn ứng tuyển' : 'Quản lý ứng viên'}
                    </span>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'candidate' ? 'Xem trạng thái ứng tuyển' : 'Xem danh sách ứng viên'}
                    </p>
                  </div>
                </motion.button>

                {/* Favorites */}
                {user?.role === 'candidate' && (
                  <motion.button
                    className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center group-hover:from-pink-200 group-hover:to-rose-200 transition-colors">
                      <FaHeart className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-semibold">Công việc yêu thích</span>
                      <p className="text-xs text-gray-500">Xem việc làm đã lưu</p>
                    </div>
                  </motion.button>
                )}

                {/* Notifications */}
                <motion.button
                  className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center group-hover:from-yellow-200 group-hover:to-orange-200 transition-colors">
                    <FaBell className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">Thông báo</span>
                    <p className="text-xs text-gray-500">Xem tin nhắn mới</p>
                  </div>
                </motion.button>

                {/* Settings */}
                <motion.button
                  className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-gray-100 to-slate-100 flex items-center justify-center group-hover:from-gray-200 group-hover:to-slate-200 transition-colors">
                    <FaCog className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">Cài đặt</span>
                    <p className="text-xs text-gray-500">Tùy chỉnh tài khoản</p>
                  </div>
                </motion.button>
                
                <hr className="my-3 border-gray-200" />
                
                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200 transition-colors">
                    <FaSignOutAlt className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">Đăng xuất</span>
                    <p className="text-xs text-gray-500">Thoát khỏi tài khoản</p>
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