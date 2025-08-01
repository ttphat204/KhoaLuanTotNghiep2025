import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                JobFinder
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu Việt Nam. 
              Chúng tôi cam kết mang đến những cơ hội việc làm tốt nhất cho bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Tìm việc làm
                </a>
              </li>
              <li>
                <a href="/companies" className="text-gray-300 hover:text-white transition-colors">
                  Công ty
                </a>
              </li>
              <li>
                <a href="/guide" className="text-gray-300 hover:text-white transition-colors">
                  Cẩm nang nghề nghiệp
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2">
              <li>
                <a href="/employer/register" className="text-gray-300 hover:text-white transition-colors">
                  Đăng ký tuyển dụng
                </a>
              </li>
              <li>
                <a href="/employer/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Quản lý tuyển dụng
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Bảng giá dịch vụ
                </a>
              </li>
              <li>
                <a href="/employer/guide" className="text-gray-300 hover:text-white transition-colors">
                  Hướng dẫn sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  (84) 28-1234-5678
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  contact@jobfinder.vn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Đăng ký nhận thông báo</h3>
            <p className="text-gray-300 mb-4">
              Nhận thông tin về việc làm mới nhất và cơ hội nghề nghiệp
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 rounded-l-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-r-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 JobFinder. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 