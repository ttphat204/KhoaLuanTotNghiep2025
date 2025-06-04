import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaBell } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
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
          <div className="flex items-center space-x-2 ml-auto">
            <button
              className="p-2 text-gray-600 rounded-lg border border-transparent transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FaBell className="w-5 h-5" />
            </button>
            <button
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium border border-transparent transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-700"
            >
              Đăng nhập
            </button>
            <button
              className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg border border-transparent font-medium hover:border-indigo-500 hover:bg-indigo-200 transition-all duration-200"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 