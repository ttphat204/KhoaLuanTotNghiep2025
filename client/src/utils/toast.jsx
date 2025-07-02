import React from 'react';
import { toast } from 'react-toastify';

// Toast configuration
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const errorConfig = {
  ...defaultConfig,
  autoClose: 5000,
};

// Success notification
export const showSuccess = (message, customConfig = {}) => {
  toast.success(message, { ...defaultConfig, ...customConfig });
};

// Error notification
export const showError = (message, customConfig = {}) => {
  toast.error(message, { ...errorConfig, ...customConfig });
};

// Warning notification
export const showWarning = (message, customConfig = {}) => {
  toast.warning(message, { ...defaultConfig, ...customConfig });
};

// Info notification
export const showInfo = (message, customConfig = {}) => {
  toast.info(message, { ...defaultConfig, ...customConfig });
};

// Custom notification with icon and title (simplified version)
export const showCustomToast = (type, message, title = null, customConfig = {}) => {
  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';
  
  const displayTitle = title || (type === 'success' ? 'Thành công!' : 
                                type === 'error' ? 'Lỗi!' : 
                                type === 'warning' ? 'Cảnh báo!' : 'Thông tin');
  
  toast(
    <div className="flex items-start space-x-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="font-semibold text-sm">{displayTitle}</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>,
    { ...defaultConfig, ...customConfig }
  );
};

// Loading notification
export const showLoading = (message) => {
  return toast.loading(message, {
    position: "top-right",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
  });
};

// Update loading notification
export const updateLoading = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
  });
};

// Dismiss notification
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all notifications
export const dismissAll = () => {
  toast.dismiss();
}; 