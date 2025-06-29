import React from 'react';
import CommonLayout from '../shared/CommonLayout';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaFileAlt, FaHeart, FaEye } from 'react-icons/fa';

const CandidateHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Việc làm đã ứng tuyển',
      value: '12',
      icon: FaFileAlt,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Việc làm đã lưu',
      value: '8',
      icon: FaHeart,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      title: 'Lượt xem hồ sơ',
      value: '45',
      icon: FaEye,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Việc làm phù hợp',
      value: '23',
      icon: FaUser,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    }
  ];

  return (
    <CommonLayout>
      {/* Candidate-specific content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {user && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Xin chào, {user.fullName || 'Ứng viên'}!
            </h1>
            <p className="text-indigo-100">
              Chào mừng bạn trở lại. Hãy khám phá những cơ hội việc làm mới nhất phù hợp với bạn.
            </p>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hồ sơ của tôi</h3>
            <p className="text-gray-600 mb-4">Cập nhật thông tin cá nhân và kinh nghiệm làm việc</p>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Cập nhật hồ sơ
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn ứng tuyển</h3>
            <p className="text-gray-600 mb-4">Xem trạng thái các đơn ứng tuyển của bạn</p>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Xem đơn ứng tuyển
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Việc làm đã lưu</h3>
            <p className="text-gray-600 mb-4">Quản lý danh sách việc làm yêu thích</p>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Xem việc làm đã lưu
            </button>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
};

export default CandidateHome; 