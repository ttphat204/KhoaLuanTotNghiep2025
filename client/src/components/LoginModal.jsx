import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bannerImg from '../assets/images/BannerDN.jpg';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: 'easeIn' } },
};

const LoginModal = ({ onClose }) => {
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
              <div className="text-lg font-medium text-gray-700 mb-1">Người tìm việc</div>
              <div className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập hoặc Đăng ký</div>
            </div>
            <input
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base"
            />
            <button className="w-full bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold py-3 rounded-lg text-base mb-4 transition-all duration-200">Tiếp tục</button>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-3 text-gray-400 font-bold">Hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 mb-3 text-base font-medium hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Đăng nhập bằng Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 text-base font-medium hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2"/></svg>
              Đăng nhập bằng Email
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