import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const CustomToast = ({ type, message, title }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Thành công!';
      case 'error':
        return 'Lỗi!';
      case 'warning':
        return 'Cảnh báo!';
      case 'info':
        return 'Thông tin';
      default:
        return 'Thông báo';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-2">
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">
          {getTitle()}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {message}
        </div>
      </div>
    </div>
  );
};

export default CustomToast; 