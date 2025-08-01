import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import Footer from '../../components/Footer';

const FavoriteJobs = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login');
      return;
    }
    fetchFavoriteJobs();
  }, [user, navigate]);

  const fetchFavoriteJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs?candidateId=${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setFavoriteJobs(data.data);
      } else {
        setError(data.message || 'Không thể tải danh sách yêu thích');
      }
    } catch (error) {
      console.error('Error fetching favorite jobs:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId, jobId) => {
    try {
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: user._id,
          favoriteId: favoriteId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Cập nhật state local
        setFavoriteJobs(prev => prev.filter(fav => fav._id !== favoriteId));
      } else {
        alert(data.message || 'Không thể xóa khỏi yêu thích');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Lỗi kết nối server');
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    if (typeof salary === 'string') return salary;
    
    // Xử lý salaryRange object
    if (salary.min && salary.max) {
      const minVal = salary.min > 1000 ? Math.round(salary.min / 1e6 * 10) / 10 : salary.min;
      const maxVal = salary.max > 1000 ? Math.round(salary.max / 1e6 * 10) / 10 : salary.max;
      return `${minVal} - ${maxVal} triệu`;
    }
    
    // Xử lý single value
    if (typeof salary === 'number') {
      const val = salary > 1000 ? Math.round(salary / 1e6 * 10) / 10 : salary;
      return `${val} triệu`;
    }
    
    return 'Thỏa thuận';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getLocation = (location) => {
    if (!location) return 'Không xác định';
    if (typeof location === 'string') return location;
    return [location.addressDetail, location.district, location.province].filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <FaHeart className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p>Lỗi: {error}</p>
              </div>
              <button 
                onClick={fetchFavoriteJobs}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Công việc yêu thích
                  </h1>
                  <p className="text-lg text-blue-100 font-medium">
                    {favoriteJobs.length > 0 
                      ? `Bạn có ${favoriteJobs.length} công việc trong danh sách yêu thích`
                      : 'Quản lý và theo dõi những công việc bạn quan tâm'
                    }
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Jobs List */}
          {favoriteJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaHeart className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Chưa có công việc yêu thích</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  Hãy khám phá các công việc hấp dẫn và thêm vào danh sách yêu thích của bạn
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Khám phá việc làm
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {favoriteJobs.map((favorite) => {
                const job = favorite.jobId;
                if (!job) return null;
                
                return (
                  <div key={favorite._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Job Header with Gradient */}
                    <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {job.employerId?.logo ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                              <img 
                                src={job.employerId.logo} 
                                alt="Company Logo" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md hidden">
                                <FaBuilding className="text-white text-xl" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                              <FaBuilding className="text-white text-xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {job.jobTitle || job.title || 'Không có tiêu đề'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                              {job.employerId?.companyName || 'Công ty'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFavorite(favorite._id, job._id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group/btn"
                          title="Xóa khỏi yêu thích"
                        >
                          <FaTrash size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaMapMarkerAlt className="mr-3 text-indigo-500 flex-shrink-0" />
                          <span className="font-medium">{getLocation(job.location)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaMoneyBillWave className="mr-3 text-green-500 flex-shrink-0" />
                          <span className="font-medium">{formatSalary(job.salary || job.salaryRange)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaClock className="mr-3 text-orange-500 flex-shrink-0" />
                          <span className="font-medium">Đăng {formatDate(job.postedDate || job.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => navigate(`/jobs/${job._id}?tab=apply`)}
                          className="flex-1 px-4 py-3 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 transform hover:scale-105"
                        >
                          Ứng tuyển
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoriteJobs; 