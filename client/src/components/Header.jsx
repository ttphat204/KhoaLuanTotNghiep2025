import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaBell, FaBriefcase } from 'react-icons/fa';
import { useState } from 'react';
import LoginModal from './LoginModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600">JobFinder</h1>
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
            <button
              className="h-12 px-4 flex flex-col items-start justify-center rounded-lg border-2 border-[#4B1CD6] bg-white text-[#4B1CD6] hover:bg-[#ede9fe] hover:text-[#4B1CD6] transition-all duration-200 focus:outline-none"
              onClick={() => setShowLoginModal(true)}
            >
              <span className="text-xs font-bold">Người tìm việc</span>
              <span className="text-base font-bold leading-tight">Đăng ký/Đăng nhập</span>
            </button>
            <button
              className="h-12 px-4 flex items-center gap-2 rounded-lg bg-[#4B1CD6] hover:bg-[#3a13b3] border border-transparent transition-all duration-200 text-white focus:outline-none"
            >
              <FaBriefcase className="text-[#2c95ff] w-6 h-6 mr-1" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-bold uppercase">Dành cho</span>
                <span className="text-base font-bold">Nhà Tuyển Dụng</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Header; 