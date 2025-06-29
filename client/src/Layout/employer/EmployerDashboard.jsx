import React from 'react';
import { FaBriefcase, FaUsers, FaEye, FaFileAlt, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Việc làm đang đăng',
      value: '8',
      icon: FaBriefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Đơn ứng tuyển mới',
      value: '24',
      icon: FaFileAlt,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Lượt xem việc làm',
      value: '156',
      icon: FaEye,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'Ứng viên tiềm năng',
      value: '12',
      icon: FaUsers,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: 'Nguyễn Văn A',
      jobTitle: 'Frontend Developer',
      appliedDate: '2024-01-15',
      status: 'Mới',
      experience: '3 năm'
    },
    {
      id: 2,
      candidateName: 'Trần Thị B',
      jobTitle: 'UI/UX Designer',
      appliedDate: '2024-01-14',
      status: 'Đã xem',
      experience: '2 năm'
    },
    {
      id: 3,
      candidateName: 'Lê Văn C',
      jobTitle: 'Backend Developer',
      appliedDate: '2024-01-13',
      status: 'Phỏng vấn',
      experience: '5 năm'
    }
  ];

  const activeJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      applications: 15,
      views: 89,
      status: 'Đang tuyển'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      applications: 8,
      views: 45,
      status: 'Đang tuyển'
    },
    {
      id: 3,
      title: 'Backend Developer',
      applications: 12,
      views: 67,
      status: 'Đang tuyển'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Xin chào, {user?.name || 'Nhà tuyển dụng'}!
        </h1>
        <p className="text-blue-100">
          Quản lý việc làm và ứng viên của bạn một cách hiệu quả.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent applications and Active jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Đơn ứng tuyển gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{application.candidateName}</h3>
                    <p className="text-sm text-gray-600">{application.jobTitle}</p>
                    <p className="text-sm text-gray-500">Kinh nghiệm: {application.experience}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'Mới' ? 'bg-green-100 text-green-800' :
                      application.status === 'Đã xem' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active jobs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Việc làm đang tuyển</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{job.applications} đơn ứng tuyển</span>
                    <span>{job.views} lượt xem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus className="w-4 h-4 mr-2" />
              Đăng việc làm mới
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <FaUsers className="w-4 h-4 mr-2" />
              Xem ứng viên
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tỷ lệ ứng tuyển</span>
              <span className="font-medium text-gray-900">12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Thời gian tuyển trung bình</span>
              <span className="font-medium text-gray-900">15 ngày</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Việc làm hot nhất</span>
              <span className="font-medium text-gray-900">Frontend Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard; 