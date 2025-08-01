import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bannerImg from '../../assets/images/BannerDN.jpg';
import { showSuccess, showError } from '../../utils/toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: 'easeIn' } },
};

const LoginModal = ({ onClose, onOpenRegisterModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('candidate_remembered_email');
    const savedRememberMe = localStorage.getItem('candidate_remember_me');
    
    if (savedEmail && savedRememberMe === 'true') {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Debug logging


  const handleClose = () => {

    if (typeof onClose === 'function') {
      onClose();
    } else {
      console.error('onClose is not a function:', onClose);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://be-khoaluan.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      // Log response để kiểm tra role
      
      if (!res.ok) {
        // Bắt lỗi trả về từ backend (401, 400, ...)
        setError(data.message || 'Đăng nhập thất bại!');
        setLoading(false);
        return;
      }
      // Lấy user data từ response mới
      const userData = data.user || data.data?.user || data;
      if (!userData) {
        console.error('No user data in response:', data);
        setError('Dữ liệu đăng nhập không hợp lệ!');
        setLoading(false);
        return;
      }
      if (!userData.role) {
        console.error('No role in user data:', userData);
        setError('Thông tin người dùng không hợp lệ!');
        setLoading(false);
        return;
      }
      if (userData.role !== 'admin' && userData.role !== 'candidate') {
        setError('Không thể đăng nhập bằng tài khoản nhà tuyển dụng tại đây.');
        setLoading(false);
        return;
      }
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('candidate_remembered_email', email);
        localStorage.setItem('candidate_remember_me', 'true');
      } else {
        localStorage.removeItem('candidate_remembered_email');
        localStorage.removeItem('candidate_remember_me');
      }

      login(userData);
      onClose();
      // Điều hướng theo role
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'candidate':
          navigate('/candidate');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Lỗi kết nối đến máy chủ! Vui lòng thử lại.');
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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl flex w-full max-w-3xl mx-4 relative overflow-hidden modal-content debug-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            maxHeight: '85vh',
            width: '100%',
            margin: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 10000
          }}
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
            onClick={handleClose}
            aria-label="Đóng"
          >
            &times;
          </button>

          {/* Cột trái: Form */}
          <div className="flex-1 p-8 flex flex-col justify-center min-w-[320px] max-w-[400px]">
            <div className="text-center mb-6">
              <div className="text-lg font-medium text-gray-700 mb-1">Đăng nhập</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                Chào mừng bạn<br />quay trở lại!
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base"
                  required
                  disabled={loading}
                  autoComplete="current-password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#4B1CD6] focus:ring-[#4B1CD6] border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <a 
                    href="/forgot-password" 
                    className="font-medium text-[#4B1CD6] hover:text-[#3a13b3] transition-colors duration-200"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#4B1CD6] hover:bg-[#3a13b3] disabled:bg-gray-400 text-white font-bold py-3 rounded-lg text-base transition-all duration-200"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="text-sm text-gray-500 mt-2 mb-2 text-center">
              Chưa có tài khoản?{' '}
              <span
                className="text-[#4B1CD6] font-medium cursor-pointer hover:underline"
                onClick={() => {
                  if (typeof onOpenRegisterModal === 'function') {
                    onOpenRegisterModal();
                  }
                }}
              >
                Đăng ký ngay
              </span>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-3 text-gray-400 font-bold">Hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 text-base font-medium hover:bg-gray-50 transition" disabled>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Đăng nhập bằng Google (Tạm khóa)
            </button>


          </div>

          {/* Cột phải: Banner */}
          <div className="hidden md:flex flex-[1.3] items-stretch justify-center bg-[#f4f1fd] p-0 relative rounded-r-2xl overflow-hidden">
            <img
              src={bannerImg}
              alt="Banner ứng tuyển"
              className="w-full h-full object-cover rounded-r-2xl"
              style={{ minWidth: 0 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal; 