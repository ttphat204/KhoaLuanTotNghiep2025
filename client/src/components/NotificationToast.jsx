import React, { useEffect, useState } from 'react';
import { FaBell, FaTimes, FaCheck, FaUserTie, FaTrophy, FaTimesCircle } from 'react-icons/fa';

const NotificationToast = ({ notification, onClose, onMarkAsRead }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tự động ẩn sau 5 giây
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Đợi animation kết thúc
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'application_status':
        return <FaCheck className="w-4 h-4" />;
      case 'interview':
        return <FaUserTie className="w-4 h-4" />;
      case 'offer':
        return <FaTrophy className="w-4 h-4" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaBell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'application_status':
        return 'green-500';
      case 'interview':
        return 'purple-500';
      case 'offer':
        return 'emerald-500';
      case 'rejected':
        return 'red-500';
      default:
        return 'blue-500';
    }
  };

  const getIconBgColor = (type) => {
    switch (type) {
      case 'application_status':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'interview':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white';
      case 'offer':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'rejected':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 border-l-${getStatusColor(notification.type)} rounded-xl shadow-2xl p-4 transition-all duration-500 transform translate-x-0 hover:scale-105`}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-xl ${getIconBgColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900 leading-tight">
              {notification.title}
            </h4>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {new Date(notification.createdAt).toLocaleTimeString('vi-VN')}
            </span>
            {onMarkAsRead && (
              <button
                onClick={() => {
                  onMarkAsRead(notification._id);
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center transition-colors"
              >
                <FaEye className="w-3 h-3 mr-1" />
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-xl" 
        style={{ 
          width: '100%',
          animation: 'shrink 5s linear forwards'
        }}
      ></div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast; 