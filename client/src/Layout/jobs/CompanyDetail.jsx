import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaIndustry, FaUsers, FaEnvelope, FaPhone, FaGlobe, FaInfoCircle, FaCalendarAlt, FaBriefcase, FaStar, FaHeart, FaMoneyBillWave } from 'react-icons/fa';
import Header from '../shared/Header';
import Footer from '../../components/Footer';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy thông tin công ty chi tiết
      const companyResponse = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${companyId}`);
      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        if (companyData.success) {
          setCompany(companyData.data);
        } else {
          throw new Error('Không tìm thấy thông tin công ty');
        }
      } else {
        throw new Error('Lỗi khi tải thông tin công ty');
      }
      
      // Fetch all jobs để lấy danh sách việc làm của công ty
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/all?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch company jobs');
      }
      const data = await response.json();
      const allJobs = data.data || data.jobs || [];
      
      // Lấy tất cả việc làm của công ty này
      const jobs = allJobs.filter(job => {
        const jobEmployerId = job.employerId;
        if (jobEmployerId) {
          const id = typeof jobEmployerId === 'object' ? jobEmployerId._id : jobEmployerId;
          return id === companyId;
        }
        return false;
      });
      
      setCompanyJobs(jobs);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min || !max) return 'Thoả thuận';
    const minVal = min > 1000 ? Math.round(min / 1e6 * 10) / 10 : min;
    const maxVal = max > 1000 ? Math.round(max / 1e6 * 10) / 10 : max;
    return `${minVal} - ${maxVal} triệu`;
  };

  const getLocation = (location) => {
    if (!location) return 'Không xác định';
    if (typeof location === 'string') return location;
    return [location.addressDetail, location.district, location.province].filter(Boolean).join(', ');
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải thông tin công ty...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">Lỗi: {error || 'Không tìm thấy công ty'}</p>
              <button 
                onClick={() => navigate('/companies')}
                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Quay lại danh sách công ty
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/companies')}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Quay lại danh sách công ty
          </button>

          {/* Company Header */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-32 h-32 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src={company.companyLogoUrl} 
                  alt={company.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <FaBuilding className="w-16 h-16 text-gray-400 hidden" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{company.companyName}</h1>
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaIndustry className="text-blue-500" />
                    <span>{company.industry}</span>
                  </div>
                  {company.companySize !== 'Chưa cập nhật' && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-green-500" />
                      <span>{company.companySize}</span>
                    </div>
                  )}
                  {company.foundedYear !== 'Chưa cập nhật' && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>Thành lập {company.foundedYear}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                    Xem việc làm ({companyJobs.length})
                  </button>
                  <button 
                    onClick={handleFollowClick}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      isFollowing 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FaHeart className={isFollowing ? 'text-red-500 fill-current' : ''} />
                    {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-500" />
                  Giới thiệu công ty
                </h2>
                <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  {company.companyDescription}
                </div>
              </div>

              {/* Company Jobs */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaBriefcase className="text-indigo-500" />
                  Việc làm đang tuyển ({companyJobs.length})
                </h2>
                
                {companyJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Hiện tại không có việc làm nào đang tuyển</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div key={job._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{job.jobTitle}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-red-500" />
                                {getLocation(job.location)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaMoneyBillWave className="text-green-500" />
                                {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="text-blue-500" />
                                {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('vi-VN') : 'Không xác định'}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  Thông tin liên hệ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" />
                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-200">Email</div>
                      <div className="text-gray-600 dark:text-gray-300">{company.companyEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-500" />
                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-200">Điện thoại</div>
                      <div className="text-gray-600 dark:text-gray-300">{company.companyPhoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500" />
                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-200">Địa chỉ</div>
                      <div className="text-gray-600 dark:text-gray-300">{company.companyAddress}</div>
                    </div>
                  </div>
                  {company.companyWebsite && (
                    <div className="flex items-center gap-3">
                      <FaGlobe className="text-indigo-500" />
                      <div>
                        <div className="font-semibold text-gray-700 dark:text-gray-200">Website</div>
                        <a 
                          href={company.companyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {company.companyWebsite}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Đã xóa phần Thông tin bổ sung */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetail; 