import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bannerImg from '../../assets/images/BannerDN.jpg';

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
  const { login } = useAuth();
  const navigate = useNavigate();

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
      console.log('Login API response:', data);
      if (data.data && data.data.user) {
        console.log('User object:', data.data.user);
      }
      if (!res.ok) {
        // Bắt lỗi trả về từ backend (401, 400, ...)
        setError(data.message || 'Đăng nhập thất bại!');
        setLoading(false);
        return;
      }
      // Chỉ lưu object user vào context
      const userData = data.user || data.data?.user || data.data;
      if (userData.role !== 'admin' && userData.role !== 'candidate') {
        setError('Không thể đăng nhập bằng tài khoản nhà tuyển dụng tại đây.');
        setLoading(false);
        return;
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
      setError('Lỗi kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.18 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl flex w-full max-w-3xl mx-4 relative overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            &times;
          </button>

          {/* Cột trái: Form */}
          <div className="flex-1 p-8 flex flex-col justify-center min-w-[320px] max-w-[400px]">
            <div className="text-center mb-6">
              <div className="text-lg font-medium text-gray-700 mb-1">Đăng nhập</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Chào mừng bạn quay trở lại!</div>
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
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base"
                  required
                  disabled={loading}
                />
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

            <div className="text-xs text-gray-500 mt-6 text-center">
              Bằng việc đăng nhập, tôi đồng ý chia sẻ thông tin cá nhân của mình với nhà tuyển dụng theo các
              <a href="#" className="text-[#4B1CD6] underline mx-1">Điều khoản sử dụng</a>,
              <a href="#" className="text-[#4B1CD6] underline mx-1">Chính sách bảo mật</a> và
              <a href="#" className="text-[#4B1CD6] underline mx-1">Chính sách dữ liệu cá nhân</a> của Vieclam24h
            </div>
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