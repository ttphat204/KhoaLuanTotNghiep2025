import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRegHeart, FaHeart, FaMoneyBillWave, FaPaperPlane } from 'react-icons/fa';

const JobCard = ({ job }) => {
  const [isHeartHover, setIsHeartHover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 w-full max-w-[430px] flex flex-col relative transition-all duration-300 hover:border-indigo-500 hover:shadow-lg"
    >
      {/* Nút lưu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          className="p-0 bg-transparent border-none outline-none relative"
          onMouseEnter={() => { setIsHeartHover(true); setShowTooltip(true); }}
          onMouseLeave={() => { setIsHeartHover(false); setShowTooltip(false); }}
          tabIndex={0}
          type="button"
          aria-label="Lưu tin tuyển dụng"
        >
          {isHeartHover ? (
            <FaHeart size={18} className="text-red-500" />
          ) : (
            <FaRegHeart size={18} className="text-gray-400" />
          )}
          {showTooltip && (
            <span className="absolute -top-8 right-1 bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap z-20">Lưu tin</span>
          )}
        </button>
      </div>

      {/* Header: Logo + Thông tin chính */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <img
            src={job.logo}
            alt={job.company}
            className="w-10 h-10 object-contain rounded-md"
          />
        </div>
        {/* Thông tin chính */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 truncate">{job.title}</h3>
          <p className="text-gray-500 text-xs truncate mt-0.5">{job.company}</p>
          <div className="flex items-center gap-2 mt-1">
            <FaMoneyBillWave className="text-green-400" />
            <span className="text-green-600 font-bold text-base truncate">{job.salary}</span>
          </div>
        </div>
      </div>

      {/* Đường kẻ mảnh */}
      <div className="border-t border-gray-100 my-3" />

      {/* Địa điểm và thời hạn */}
      <div className="flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center gap-1 min-w-0">
          <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
          <span className="truncate max-w-[180px]">{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-7.25V7h-1.5v6h6v-1.5h-4.5Z"/></svg>
          </span>
          <span className="truncate">Còn {job.deadline || 'x ngày'}</span>
        </div>
      </div>

      {/* Nút ứng tuyển nhỏ góc phải dưới */}
      <div className="flex justify-end mt-3">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors duration-200"
          aria-label="Ứng tuyển công việc này"
        >
          <FaPaperPlane size={14} className="mb-0.5" />
          Ứng tuyển
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JobCard; 