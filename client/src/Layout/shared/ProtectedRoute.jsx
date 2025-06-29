import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/' }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang chủ
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu có yêu cầu role cụ thể và user không có role phù hợp
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Chuyển hướng dựa trên role của user
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'candidate':
        return <Navigate to="/candidate" replace />;
      case 'employer':
        return <Navigate to="/employer" replace />;
      default:
        return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 