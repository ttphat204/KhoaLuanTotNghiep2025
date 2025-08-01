import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUserTie, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import Footer from '../../components/Footer';

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login');
      return;
    }
    fetchApplications();
    // Polling để cập nhật trạng thái mỗi 30 giây
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Sử dụng API đơn giản đang hoạt động
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/simple-candidate-applications?candidateId=${user._id}`);
      
      // Fallback: nếu API đơn giản không hoạt động, sử dụng API cũ
      if (!response.ok) {

        const fallbackResponse = await fetch(`https://be-khoa-luan2.vercel.app/api/application/all`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.success) {
            const applications = fallbackData.data.filter(app => app.candidateId === user._id);
            setApplications(applications);
            return;
          }
        }
        throw new Error('Không thể kết nối API');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Xử lý dữ liệu từ API đơn giản
        const processedApplications = data.data.map(app => {
          // Tạo job object từ dữ liệu có sẵn
          return {
            ...app,
            jobId: {
              _id: app.jobId,
              jobTitle: app.jobTitle,
              title: app.jobTitle,
              employerId: {
                companyName: app.companyName || app.employerCompanyName,
                logo: app.employerLogo
              },
              location: app.jobLocation,
              salary: app.jobSalary
            },
            resumeId: {
              _id: app.resumeId,
              title: app.cvFromProfile ? 'CV từ hồ sơ' : 'CV'
            }
          };
        });
        

        setApplications(processedApplications);
      } else {
        setError(data.message || 'Không thể tải danh sách đơn ứng tuyển');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Fallback: Hiển thị dữ liệu mẫu nếu API không hoạt động

      setApplications([]);
      setError('Không thể kết nối server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      'Pending': {
        label: 'Chờ xử lý',
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
        icon: FaHourglassHalf,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/10'
      },
      'Reviewed': {
        label: 'Đã xem xét',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
        icon: FaEye,
        bgColor: 'bg-blue-50 dark:bg-blue-900/10'
      },
      'Interviewing': {
        label: 'Phỏng vấn',
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
        icon: FaUserTie,
        bgColor: 'bg-purple-50 dark:bg-purple-900/10'
      },
      'Offer': {
        label: 'Đề nghị',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
        icon: FaCheckCircle,
        bgColor: 'bg-green-50 dark:bg-green-900/10'
      },
      'Rejected': {
        label: 'Từ chối',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
        icon: FaTimesCircle,
        bgColor: 'bg-red-50 dark:bg-red-900/10'
      },
      'Hired': {
        label: 'Đã tuyển',
        color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
        icon: FaCheckCircle,
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/10'
      }
    };

    return statusConfig[status] || statusConfig['Pending'];
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
    
    // Xử lý salary object khác
    if (salary.min) {
      const minVal = salary.min > 1000 ? Math.round(salary.min / 1e6 * 10) / 10 : salary.min;
      return `Từ ${minVal} triệu`;
    }
    
    if (salary.max) {
      const maxVal = salary.max > 1000 ? Math.round(salary.max / 1e6 * 10) / 10 : salary.max;
      return `Đến ${maxVal} triệu`;
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
    
    // Xử lý location object
    const parts = [];
    if (location.addressDetail) parts.push(location.addressDetail);
    if (location.district) parts.push(location.district);
    if (location.province) parts.push(location.province);
    
    return parts.length > 0 ? parts.join(', ') : 'Không xác định';
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

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
                <FaFileAlt className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p>Lỗi: {error}</p>
              </div>
              <button 
                onClick={fetchApplications}
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
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
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
                    Đơn ứng tuyển
                  </h1>
                  <p className="text-lg text-blue-100 font-medium">
                    {applications.length > 0 
                      ? `Bạn có ${applications.length} đơn ứng tuyển`
                      : 'Theo dõi trạng thái các đơn ứng tuyển của bạn'
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

          {/* Filter Section */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                Tất cả ({applications.length})
              </button>
              {['Pending', 'Reviewed', 'Interviewing', 'Offer', 'Rejected', 'Hired'].map(status => {
                const count = applications.filter(app => app.status === status).length;
                if (count === 0) return null;
                
                const statusInfo = getStatusInfo(status);
                const IconComponent = statusInfo.icon;
                
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === status
                        ? `${statusInfo.color} shadow-lg`
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {statusInfo.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFileAlt className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {filter === 'all' ? 'Chưa có đơn ứng tuyển nào' : 'Không có đơn ứng tuyển nào'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  {filter === 'all' 
                    ? 'Hãy khám phá các công việc hấp dẫn và nộp đơn ứng tuyển'
                    : `Không có đơn ứng tuyển nào ở trạng thái "${getStatusInfo(filter).label}"`
                  }
                </p>
                {filter === 'all' && (
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                  >
                    Khám phá việc làm
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredApplications.map((application) => {
                const job = application.jobId;
                const statusInfo = getStatusInfo(application.status);
                const StatusIcon = statusInfo.icon;
                
                if (!job) return null;
                
                return (
                  <div key={application._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Application Header */}
                    <div className={`p-6 ${statusInfo.bgColor} border-b border-gray-100 dark:border-gray-700`}>
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
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md hidden">
                                <FaBuilding className="text-white text-xl" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                              <FaBuilding className="text-white text-xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2">
                              {job.jobTitle || job.title || 'Không có tiêu đề'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                              {job.employerId?.companyName || 'Công ty'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaMapMarkerAlt className="mr-3 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">{getLocation(job.location)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaMoneyBillWave className="mr-3 text-green-500 flex-shrink-0" />
                          <span className="font-medium">{formatSalary(job.salary)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          <FaCalendarAlt className="mr-3 text-orange-500 flex-shrink-0" />
                          <span className="font-medium">Nộp {formatDate(application.applicationDate)}</span>
                        </div>
                      </div>

                      {/* Application Info */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Thông tin đơn ứng tuyển</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">#{application._id.slice(-8)}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">CV sử dụng:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {application.resumeId?.title || 'CV từ hồ sơ'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Cập nhật lần cuối:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(application.lastStatusUpdate || application.applicationDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          Xem chi tiết việc làm
                        </button>
                                                 {application.coverLetter && (
                           <button
                             onClick={() => {
                               setSelectedCoverLetter(application.coverLetter);
                               setShowCoverLetterModal(true);
                             }}
                             className="px-4 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                           >
                             Xem thư xin việc
                           </button>
                         )}
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

      {/* Cover Letter Modal */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thư xin việc</h3>
              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedCoverLetter}
                </p>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="px-6 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory;

// Add CSS for line-clamp
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 