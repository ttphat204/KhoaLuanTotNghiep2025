import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaUsers, FaEye, FaFileAlt, FaChartLine, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const EmployerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalViews: 0,
    totalApplicants: 0,
    recentJobs: [],
    topViewedJobs: [],
    applicationsByMonth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Không tìm thấy token');
          return;
        }

        // Gọi API dashboard để lấy thống kê
        const response = await fetch('https://be-khoaluan.vercel.app/api/jobs/employer/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats({
              totalJobs: data.data.stats.totalJobs || 0,
              activeJobs: data.data.stats.statusStats?.Active || 0,
              totalViews: data.data.stats.totalViews || 0,
              totalApplicants: data.data.stats.totalApplicants || 0,
              recentJobs: data.data.jobs.list?.slice(0, 5) || [],
              topViewedJobs: data.data.jobs.list?.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5) || [],
              applicationsByMonth: data.data.highlights?.recentActivity || []
            });
          }
        }
      } catch (error) {
        console.error('Lỗi kết nối:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'employer') {
      fetchStats();
    }
  }, [user]);

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      return (num / 1000000).toFixed(1) + 'M';
    };
    return `${formatNumber(min)} - ${formatNumber(max)} VND`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800', text: 'Đang hoạt động' },
      'Closed': { color: 'bg-red-100 text-red-800', text: 'Đã đóng' },
      'Draft': { color: 'bg-gray-100 text-gray-800', text: 'Bản nháp' },
      'Archived': { color: 'bg-yellow-100 text-yellow-800', text: 'Đã lưu trữ' }
    };
    
    const config = statusConfig[status] || statusConfig['Draft'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaBriefcase className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tin đăng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaFileAlt className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaEye className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lượt xem</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FaUsers className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ứng viên</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tin tuyển dụng gần đây</h3>
            <FaCalendarAlt className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có tin tuyển dụng nào</p>
            ) : (
              stats.recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{job.categoryId?.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-500">{job.location?.province}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatSalary(job.salaryRange?.min || 0, job.salaryRange?.max || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(job.status)}
                    <p className="text-xs text-gray-500 mt-1">{formatDate(job.postedDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Viewed Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tin được xem nhiều nhất</h3>
            <FaChartLine className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.topViewedJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            ) : (
              stats.topViewedJobs.map((job, index) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{job.categoryId?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-600">{job.viewsCount || 0}</p>
                    <p className="text-xs text-gray-500">lượt xem</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          <FaCalendarAlt className="text-gray-400" />
        </div>
        <div className="space-y-4">
          {stats.applicationsByMonth.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
          ) : (
            stats.applicationsByMonth.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
            <FaBriefcase />
            <span>Đăng tin mới</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <FaUsers />
            <span>Xem ứng viên</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            <FaChartLine />
            <span>Xem báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerStats; 