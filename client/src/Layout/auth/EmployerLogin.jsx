import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import { showSuccess, showError } from '../../utils/toast';
import { FaBuilding, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBriefcase } from 'react-icons/fa';

const EmployerLogin = () => {
  // Add blob animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('employer_remembered_email');
    const savedRememberMe = localStorage.getItem('employer_remember_me');
    
    if (savedEmail && savedRememberMe === 'true') {
      setFormData(prev => ({
        ...prev,
        email: savedEmail
      }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Kiểm tra role của user
        if (data.user.role !== 'employer') {
          showError('Tài khoản này không phải là nhà tuyển dụng');
          return;
        }
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('employer_remembered_email', formData.email);
          localStorage.setItem('employer_remember_me', 'true');
        } else {
          localStorage.removeItem('employer_remembered_email');
          localStorage.removeItem('employer_remember_me');
        }
        
        // Lưu user và token
        login(data.user, data.token);
        showSuccess('Đăng nhập thành công!');
        navigate('/employer');
      } else {
        showError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      showError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          animationDelay: '2s',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          animationDelay: '4s',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      
      {/* Additional Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
      
      {/* Subtle Lines */}
      <div className="absolute top-1/3 left-0 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-1/3 right-0 w-32 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                                 
                                 <h1 className="text-xl font-bold text-white mb-2">Đăng nhập nhà tuyển dụng</h1>
                <p className="text-indigo-100 text-sm">Quản lý tuyển dụng và tìm kiếm nhân tài</p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            </div>

            {/* Form Section */}
            <div className="p-6 bg-white/10 backdrop-blur-sm">
              {/* Register Link */}
                              <div className="text-center mb-6">
                  <p className="text-white text-sm font-medium">
                  Chưa có tài khoản?{' '}
                  <a 
                    href="/employer/register" 
                    className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </a>
                </p>
              </div>

                             {/* Login Form */}
               <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                                     <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email công ty
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                                         <input
                       id="email"
                       name="email"
                       type="email"
                       autoComplete="email"
                       required
                       className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                       placeholder="Nhập email công ty"
                       value={formData.email}
                       onChange={handleChange}
                     />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                                     <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                                         <input
                       id="password"
                       name="password"
                       type={showPassword ? 'text' : 'password'}
                       autoComplete="current-password"
                       required
                       className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                       placeholder="Nhập mật khẩu"
                       value={formData.password}
                       onChange={handleChange}
                     />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                    />
                                         <label htmlFor="remember-me" className="ml-3 block text-sm text-white">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <a 
                      href="/forgot-password" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                                     <button
                     type="submit"
                     disabled={loading}
                     className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                   >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang đăng nhập...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaBriefcase className="mr-3" />
                        Đăng nhập
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Hoặc</span>
                  </div>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="mt-6 text-center">
                                 <p className="text-white text-sm mb-4">
                  Bạn là người tìm việc?
                </p>
                                 <a
                   href="/login"
                   className="inline-flex items-center px-6 py-3 border border-white/30 rounded-xl text-sm font-medium text-white bg-white/20 hover:bg-white/30 transition-all duration-200 shadow-sm backdrop-blur-sm"
                 >
                  <FaBriefcase className="mr-2" />
                  Đăng nhập người tìm việc
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
                         <p className="text-white/70 text-xs">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
                             <a href="/terms" className="text-white hover:text-indigo-300">Điều khoản sử dụng</a>
               {' '}và{' '}
               <a href="/privacy" className="text-white hover:text-indigo-300">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerLogin; 