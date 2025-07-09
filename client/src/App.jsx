import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './Layout/shared/HomePage';
import CandidateHome from './Layout/candidate/CandidateHome';
import AdminDashboard from './Layout/admin/Dashboard';
import EmployerDashboard from './Layout/employer/EmployerDashboard';
import EmployerLayout from './Layout/employer/EmployerLayout';
import JobDetail from './Layout/employer/JobDetail';
import EmployerLogin from './Layout/auth/EmployerLogin';
import EmployerRegister from './Layout/auth/EmployerRegister';
import ProtectedRoute from './Layout/shared/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import EmployerProfile from './Layout/employer/EmployerProfile';
import JobList from './Layout/jobs/JobList';
import JobCategoryList from './Layout/jobs/JobCategoryList';
import JobDetailPage from './Layout/jobs/JobDetailPage';
import JobSearchResultPage from './Layout/jobs/JobSearchResultPage';
import './App.css';

// Component để xử lý routing dựa trên authentication
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - Guest users */}
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/category/:slug" element={<JobCategoryList />} />
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />
      <Route path="/jobs/search" element={<JobSearchResultPage />} />
      <Route path="/employer/login" element={<EmployerLogin />} />
      <Route path="/employer/register" element={<EmployerRegister />} />

      {/* Protected routes based on role */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/*"
        element={
          <ProtectedRoute allowedRoles={['candidate']} redirectTo="/">
            <Routes>
              <Route path="/" element={<CandidateHome />} />
              <Route path="/jobs" element={<div className="text-center py-10">Trang tìm việc làm</div>} />
              <Route path="/profile" element={<div className="text-center py-10">Trang hồ sơ</div>} />
              <Route path="/saved" element={<div className="text-center py-10">Việc làm đã lưu</div>} />
              <Route path="/account" element={<div className="text-center py-10">Thông tin cá nhân</div>} />
              <Route path="/settings" element={<div className="text-center py-10">Cài đặt</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/*"
        element={
          <ProtectedRoute allowedRoles={['employer']} redirectTo="/">
            <EmployerLayout>
              <Routes>
                <Route path="/" element={<EmployerDashboard />} />
                <Route path="/jobs" element={<EmployerDashboard />} />
                <Route path="/jobs/:jobId" element={<JobDetail />} />
                <Route path="/candidates" element={<div className="text-center py-10">Quản lý ứng viên</div>} />
                <Route path="/applications" element={<div className="text-center py-10">Đơn ứng tuyển</div>} />
                <Route path="/reports" element={<div className="text-center py-10">Báo cáo</div>} />
                <Route path="/company" element={<div className="text-center py-10">Thông tin công ty</div>} />
                <Route path="/settings" element={<div className="text-center py-10">Cài đặt</div>} />
                <Route path="/profile" element={<EmployerProfile />} />
              </Routes>
            </EmployerLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect authenticated users to their appropriate dashboard */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'admin' ? '/admin' :
                user.role === 'employer' ? '/employer' :
                user.role === 'candidate' ? '/candidate' : '/'
              }
              replace
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
