import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaCheck, FaEye, FaSpinner, FaUserTie, FaTrophy, FaTimesCircle } from 'react-icons/fa';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Polling để cập nhật thông báo mới mỗi 30 giây
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      
      // Thử fetch trực tiếp để debug
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/notifications-user?userId=${userId}`);
      
      
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        // Tạo thông báo mẫu để test scroll
        const sampleNotifications = [
          {
            _id: '1',
            title: 'Bạn đã được mời phỏng vấn',
            message: 'Công ty ABC đã mời bạn tham gia phỏng vấn cho vị trí Frontend Developer',
            type: 'interview',
            isRead: false,
            createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
          },
          {
            _id: '2',
            title: 'Bạn đã nhận được đề nghị công việc',
            message: 'Chúc mừng! Bạn đã nhận được offer từ công ty XYZ',
            type: 'offer',
            isRead: false,
            createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString()
          },
          {
            _id: '3',
            title: 'Bạn đã được mời phỏng vấn',
            message: 'Công ty DEF mời bạn phỏng vấn cho vị trí Backend Developer',
            type: 'interview',
            isRead: false,
            createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
          },
          {
            _id: '4',
            title: 'Cập nhật trạng thái đơn ứng tuyển',
            message: 'Đơn ứng tuyển của bạn đã được xem xét',
            type: 'application_status',
            isRead: true,
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            _id: '5',
            title: 'Bạn đã được mời phỏng vấn',
            message: 'Công ty GHI mời bạn phỏng vấn cho vị trí Full-stack Developer',
            type: 'interview',
            isRead: false,
            createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
          },
          {
            _id: '6',
            title: 'Cập nhật trạng thái đơn ứng tuyển',
            message: 'Đơn ứng tuyển của bạn đã bị từ chối',
            type: 'rejected',
            isRead: true,
            createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
          },
          {
            _id: '7',
            title: 'Bạn đã được mời phỏng vấn',
            message: 'Công ty JKL mời bạn phỏng vấn cho vị trí UI/UX Designer',
            type: 'interview',
            isRead: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            _id: '8',
            title: 'Bạn đã nhận được đề nghị công việc',
            message: 'Chúc mừng! Bạn đã nhận được offer từ công ty MNO',
            type: 'offer',
            isRead: false,
            createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
          }
        ];
        setNotifications(sampleNotifications);
        setUnreadCount(5);
        return;
      }
      
      const data = await response.json();
      

      if (data.success) {
        setNotifications(data.data || []);
        const unread = (data.data || []).filter(n => !n.isRead).length;
        setUnreadCount(unread);

      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('https://be-khoa-luan2.vercel.app/api/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          userId
        })
      });

      const data = await response.json();
      if (data.success) {
        // Cập nhật local state
        setNotifications(prev => prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getStatusIcon = (type) => {
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-600"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaBell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Thông báo</h3>
                  <p className="text-sm text-indigo-100">
                    {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Tất cả đã đọc'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-400 relative">
            {/* Scroll indicator */}
            {notifications.length > 4 && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent rounded-full opacity-50"></div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                </div>
                <span className="ml-3 text-gray-500 dark:text-gray-400 font-medium">Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBell className="w-8 h-8 text-indigo-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Không có thông báo</h4>
                <p className="text-gray-500 dark:text-gray-400">Bạn sẽ nhận được thông báo khi có cập nhật mới</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                                     <div
                     key={notification._id}
                     className={`group relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                       notification.isRead 
                         ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600' 
                         : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40'
                     }`}
                   >
                    {/* Status indicator */}
                    {!notification.isRead && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                                                 <div className={`p-3 rounded-xl ${
                           notification.isRead 
                             ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300' 
                             : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                         }`}>
                          {getStatusIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                                                 <div className="flex items-start justify-between mb-2">
                           <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                             {notification.title}
                           </h4>
                           <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-2 flex-shrink-0">
                             {formatTime(notification.createdAt)}
                           </span>
                         </div>
                         
                         <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                           {notification.message}
                         </p>

                        {/* Actions */}
                        {!notification.isRead && (
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                              Mới
                            </span>
                                                         <button
                               onClick={() => markAsRead(notification._id)}
                               className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center transition-colors"
                             >
                              <FaEye className="w-3 h-3 mr-1" />
                              Đánh dấu đã đọc
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

                     {/* Footer */}
           {notifications.length > 0 && (
             <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
               <div className="text-center">
                 <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                   Xem tất cả thông báo
                 </button>
               </div>
             </div>
           )}
        </div>
      )}
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 4px;
          margin: 4px 0;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c7d2fe, #a5b4fc);
          border-radius: 4px;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a5b4fc, #818cf8);
          transform: scaleX(1.2);
        }
        
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #a5b4fc #f8fafc;
        }
        
        /* Smooth scrolling */
        .scrollbar-thin {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell; 