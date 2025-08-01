import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaUsers, FaIndustry, FaBriefcase, FaGraduationCap, FaCalendarAlt, FaStar, FaHeart, FaPaperPlane, FaEnvelope, FaPhone, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import Header from '../shared/Header';
import Footer from '../../components/Footer';
import ApplicationModal from '../../components/ApplicationModal';

const JOB_API = 'https://be-khoaluan.vercel.app/api/job/all';
const JOB_MANAGE_API = 'https://be-khoaluan.vercel.app/api/job/manage';
const CATEGORY_API = 'https://be-khoaluan.vercel.app/api/admin/category-management';

// Component hiển thị thông tin công ty
const CompanyInfo = ({ companyData }) => {
  if (!companyData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow text-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Không có thông tin công ty</div>
      </div>
    );
  }

  const companyName = companyData.companyName || 'Không xác định';
  const companyLogoUrl = companyData.companyLogoUrl || '/default-logo.png';
  const companyEmail = companyData.companyEmail || 'Chưa cập nhật';
  const companyPhone = companyData.companyPhoneNumber || 'Chưa cập nhật';
  const companyAddress = companyData.companyAddress || 'Chưa cập nhật';
  const companyWebsite = companyData.companyWebsite || null;
  const companyDescription = companyData.companyDescription || 'Chưa có mô tả';
  const industry = companyData.industry || 'Chưa cập nhật';
  const companySize = companyData.companySize || 'Chưa cập nhật';
  const foundedYear = companyData.foundedYear || 'Chưa cập nhật';

  return (
    <div className="space-y-6">
      {/* Header công ty */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center overflow-hidden">
            <img 
              src={companyLogoUrl} 
              alt={companyName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <FaBuilding className="w-12 h-12 text-gray-400 hidden" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{companyName}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <FaIndustry className="text-blue-500" />
                {industry}
              </span>
              {companySize !== 'Chưa cập nhật' && (
                <span className="flex items-center gap-2">
                  <FaUsers className="text-green-500" />
                  {companySize}
                </span>
              )}
              {foundedYear !== 'Chưa cập nhật' && (
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" />
                  Thành lập {foundedYear}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaEnvelope className="text-blue-500" />
          Thông tin liên hệ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <FaEnvelope className="text-blue-500 text-xl" />
            <div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">Email</div>
              <div className="text-gray-600 dark:text-gray-400">{companyEmail}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <FaPhone className="text-green-500 text-xl" />
            <div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">Điện thoại</div>
              <div className="text-gray-600 dark:text-gray-400">{companyPhone}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <FaMapMarkerAlt className="text-purple-500 text-xl" />
            <div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">Địa chỉ</div>
              <div className="text-gray-600 dark:text-gray-400">{companyAddress}</div>
            </div>
          </div>
          {companyWebsite && (
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
              <FaGlobe className="text-indigo-500 text-xl" />
              <div>
                <div className="font-semibold text-gray-700">Website</div>
                <a 
                  href={companyWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {companyWebsite}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mô tả công ty */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-indigo-500" />
          Giới thiệu công ty
        </h3>
        <div className="text-gray-700 leading-relaxed">
          {companyDescription}
        </div>
      </div>

      {/* Đã xóa phần Thông tin bổ sung */}
    </div>
  );
};

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [jobDetail, setJobDetail] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('job'); // 'job' hoặc 'company'
  const [companyDetails, setCompanyDetails] = useState(null); // Thêm state cho thông tin công ty chi tiết
  const [favoriteLoading, setFavoriteLoading] = useState(false); // Loading state cho favorite action

  useEffect(() => {
    fetchJobDetails();
    // Kiểm tra user đăng nhập
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
        // Kiểm tra trạng thái yêu thích nếu user là candidate
        if (parsedUser && parsedUser.role === 'candidate' && jobId) {
          checkFavoriteStatus(parsedUser._id, jobId);
        }
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all jobs to find the specific job
      const response = await fetch(JOB_API + '?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      const allJobs = data.data || data.jobs || [];
      const found = allJobs.find(j => j._id === jobId);
      
      if (!found) {
        throw new Error('Job not found');
      }
      
      setJob(found);
      
      // Lấy thông tin công ty chi tiết nếu có employerId
      if (found.employerId) {
        const employerId = typeof found.employerId === 'object' ? found.employerId._id : found.employerId;
        try {
          const companyResponse = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${employerId}`);
          if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            if (companyData.success) {
              setCompanyDetails(companyData.data);
            } else if (companyData.message === 'Không tìm thấy employer') {
              // Tự động tạo profile nếu chưa có
              const createResponse = await fetch('https://be-khoaluan.vercel.app/api/employer/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employerId })
              });
              if (createResponse.ok) {
                const createData = await createResponse.json();
                if (createData.success) {
                  setCompanyDetails(createData.data);
                }
              }
            }
          }
        } catch (companyError) {
          console.error('Error fetching company details:', companyError);
          // Fallback to job data if company API fails
          setCompanyDetails(found.employerId);
        }
      }
      
      // Find similar jobs from same category
      if (found.categoryId) {
        const catId = typeof found.categoryId === 'object' ? found.categoryId._id : found.categoryId;
        const similar = allJobs.filter(j => {
          const jCatId = typeof j.categoryId === 'object' ? j.categoryId._id : j.categoryId;
          return jCatId === catId && j._id !== jobId;
        }).slice(0, 5);
        setSimilarJobs(similar);
      }
      
      // Fetch detailed job info from manage API
      if (found.employerId && found._id) {
        const employerId = typeof found.employerId === 'object' ? found.employerId._id : found.employerId;
        const detailResponse = await fetch(`${JOB_MANAGE_API}?employerId=${employerId}&jobId=${found._id}`);
        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          if (detailData && detailData.job) {
            setJobDetail(detailData.job);
          }
        }
      }
      
      // Fetch category info
      const catSlug = typeof found.categoryId === 'object' ? found.categoryId.slug : null;
      if (catSlug) {
        const catResponse = await fetch(CATEGORY_API);
        if (catResponse.ok) {
          const catData = await catResponse.json();
          const foundCategory = (catData.categories || []).find(cat => cat.slug === catSlug);
          setCategory(foundCategory || null);
        }
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      navigate('/login', { 
        state: { 
          from: `/jobs/${jobId}`,
          message: 'Vui lòng đăng nhập để nộp hồ sơ'
        }
      });
      return;
    }
    
    // Kiểm tra xem user có phải là candidate không
    if (user.role !== 'candidate') {
      alert('Chỉ ứng viên mới có thể nộp hồ sơ!');
      return;
    }
    
    setShowApplicationModal(true);
  };

  const checkFavoriteStatus = async (candidateId, jobId) => {
    try {
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs?candidateId=${candidateId}&jobId=${jobId}`);
      const data = await response.json();
      setIsFavorite(data.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user || user.role !== 'candidate') {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Xóa khỏi yêu thích
        const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            candidateId: user._id,
            jobId: jobId
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setIsFavorite(false);
        } else {
          alert(data.message || 'Không thể xóa khỏi yêu thích');
        }
      } else {
        // Thêm vào yêu thích
        const response = await fetch('https://be-khoa-luan2.vercel.app/api/favorite-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            candidateId: user._id,
            jobId: jobId
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setIsFavorite(true);
        } else {
          alert(data.message || 'Không thể thêm vào yêu thích');
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      alert('Lỗi kết nối server');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCheckCV = () => {

    
    navigate('/cv-check', { 
      state: { 
        jobData: {
          title: job.jobTitle,
          description: job.description,
          jobRequirements: jobDetail?.jobRequirements || job.jobRequirements || job.requirements || '',
          benefits: job.benefits,
          salary: formatSalary(job.salaryMin, job.salaryMax)
        }
      }
    });
  };

  const formatSalary = (min, max) => {
    if (!min || !max) return 'Thoả thuận';
    const minVal = min > 1000 ? Math.round(min / 1e6 * 10) / 10 : min;
    const maxVal = max > 1000 ? Math.round(max / 1e6 * 10) / 10 : max;
    return `${minVal} - ${maxVal} triệu`;
  };

  const getDeadlineStatus = (createdAt, deadline) => {
    if (!deadline) return 'Không xác định';
    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end - now;
    if (diffMs <= 0) return 'Đã hết hạn';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `Còn ${diffDays} ngày`;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return `Còn ${diffHours} giờ`;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes > 0) return `Còn ${diffMinutes} phút`;
    return 'Sắp hết hạn';
  };

  const getLocation = (location) => {
    if (!location) return 'Không xác định';
    if (typeof location === 'string') return location;
    return [location.addressDetail, location.district, location.province].filter(Boolean).join(', ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Utility function để xử lý HTML entities
  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    
    // Nếu là array, xử lý từng phần tử
    if (Array.isArray(text)) {
      return text.map(item => decodeHtmlEntities(item)).join('<br>');
    }
    
    // Chuyển đổi thành string nếu không phải string
    const textString = String(text);
    
    return textString
      .replace(/&nbsp;/g, ' ') // Thay thế &nbsp; bằng space
      .replace(/&amp;/g, '&') // Thay thế &amp; bằng &
      .replace(/&lt;/g, '<') // Thay thế &lt; bằng <
      .replace(/&gt;/g, '>') // Thay thế &gt; bằng >
      .replace(/&quot;/g, '"') // Thay thế &quot; bằng "
      .replace(/&#39;/g, "'") // Thay thế &#39; bằng '
      .replace(/&apos;/g, "'"); // Thay thế &apos; bằng '
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              {/* Loading Spinner */}
              <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
                  <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                
                {/* Inner dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
              
              {/* Loading Text */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Đang tải thông tin việc làm
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Vui lòng chờ trong giây lát...
                </p>
              </div>
              
              {/* Loading Dots */}
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600">Lỗi: {error || 'Không tìm thấy việc làm'}</p>
              <button 
                onClick={() => navigate('/jobs')}
                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const companyName = job.employerId?.companyName || job.companyName || 'Không xác định';
  const companyLogoUrl = job.employerLogo || job.employerId?.companyLogoUrl || job.companyLogoUrl || '/default-logo.png';
  const salary = job.salaryRange?.min && job.salaryRange?.max ? formatSalary(job.salaryRange.min, job.salaryRange.max) : 'Thoả thuận';
  const location = getLocation(job.location);
  const deadline = job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('vi-VN') : '';
  const updatedAt = job.updatedAt ? new Date(job.updatedAt).toLocaleString('vi-VN') : '';

  // Thông tin chung lấy từ jobDetail nếu có, fallback về job
  const info = [
    { icon: <FaCalendarAlt />, label: 'Ngày đăng', value: jobDetail?.createdAt ? new Date(jobDetail.createdAt).toLocaleDateString('vi-VN') : (job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : '') },
    { icon: <FaGraduationCap />, label: 'Cấp bậc', value: jobDetail?.level || job.level || '---' },
    { icon: <FaUsers />, label: 'Số lượng tuyển', value: jobDetail?.quantity || job.quantity || '---' },
    { icon: <FaBriefcase />, label: 'Hình thức làm việc', value: jobDetail?.jobType || job.jobType || '---' },
    { icon: <FaStar />, label: 'Kinh nghiệm', value: jobDetail?.experienceLevel || job.experienceLevel || '---' },
    { icon: <FaBriefcase />, label: 'Trạng thái', value: getDeadlineStatus(jobDetail?.createdAt || job.createdAt, jobDetail?.applicationDeadline || job.applicationDeadline) },
  ];
  const skills = jobDetail?.skillsRequired || job.skillsRequired || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
          >
            <FaArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </button>

          {/* Header lớn */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between relative">
            <div className="flex items-center gap-8 flex-1">
              <img src={companyLogoUrl} alt="logo" className="w-28 h-28 object-contain rounded-xl border bg-white dark:bg-gray-700 shadow" />
              <div className="flex-1 min-w-0">
                <div className="text-gray-500 dark:text-gray-400 text-base font-semibold mb-1">{companyName}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{job.jobTitle}</div>
                <div className="flex flex-wrap gap-6 mb-4">
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaMoneyBillWave /> Mức lương <span className="text-[#7c3aed]">{salary}</span></span>
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaCalendarAlt /> Hạn nộp hồ sơ <span className="text-[#7c3aed]">{deadline}</span></span>
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaMapMarkerAlt /> Khu vực tuyển <span className="text-[#7c3aed]">{location}</span></span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold flex items-center gap-2">🎯 Cơ hội hấp dẫn!</span>
                  <span className="text-gray-500 dark:text-gray-400">Công việc đang rất được quan tâm! Ứng tuyển ngay để không lỡ cơ hội!</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <button 
                    onClick={handleApply}
                    className="bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold px-8 py-3 rounded-xl text-base shadow transition flex items-center gap-2"
                  >
                    <FaPaperPlane /> Nộp hồ sơ
                  </button>
                  <button
                    onClick={handleCheckCV}
                    className="bg-green-50 text-green-700 font-bold px-8 py-3 rounded-xl text-base shadow transition flex items-center gap-2 border border-green-400 hover:bg-green-100"
                  >
                    📝 Kiểm tra CV
                  </button>
                  <button 
                    onClick={handleFavoriteClick}
                    disabled={favoriteLoading}
                    className={`font-bold px-5 py-3 rounded-xl text-base shadow transition flex items-center gap-2 border ${
                      isFavorite 
                        ? 'bg-red-50 text-red-600 border-red-600 hover:bg-red-100' 
                        : 'bg-purple-50 text-[#7c3aed] border-[#7c3aed] hover:bg-purple-100'
                    } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {favoriteLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <FaHeart className={isFavorite ? 'text-red-500 fill-current' : ''} />
                    )}
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-8 right-8 text-gray-400 dark:text-gray-500 text-sm flex items-center gap-2">
              <FaCalendarAlt /> Ngày cập nhật: {updatedAt}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs và nội dung chính */}
            <div className="flex-1">
              <div className="flex gap-2 border-b mb-6">
                <button 
                  onClick={() => setActiveTab('job')}
                  className={`px-6 py-3 font-bold rounded-t-xl transition-all duration-200 ${
                    activeTab === 'job' 
                      ? 'text-[#2563eb] border-b-2 border-[#2563eb] bg-white' 
                      : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Chi tiết tuyển dụng
                </button>
                <button 
                  onClick={() => setActiveTab('company')}
                  className={`px-6 py-3 font-bold rounded-t-xl transition-all duration-200 ${
                    activeTab === 'company' 
                      ? 'text-[#2563eb] border-b-2 border-[#2563eb] bg-white' 
                      : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Công ty
                </button>
              </div>
              
              {/* Nội dung tab */}
              {activeTab === 'job' ? (
                <>
                  {/* Thông tin chung */}
                  <div className="bg-[#f5f3ff] rounded-2xl p-6 mb-8">
                    <div className="text-2xl font-bold mb-4">Thông tin chung</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {info.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl p-6 shadow-sm h-full min-h-[90px]">
                          <span className="text-[#7c3aed] text-2xl mb-1">{item.icon}</span>
                          <span className="font-semibold text-gray-800 text-base text-center">
                            {item.label}:
                            <span className="font-normal text-gray-700 ml-1">{item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    {skills.length > 0 && (
                      <div className="mt-4">
                        <div className="font-semibold text-gray-700 mb-2">Kỹ năng yêu cầu:</div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mô tả công việc, yêu cầu, quyền lợi */}
                  <div className="bg-white rounded-2xl p-6 shadow mb-8">
                    <div className="text-xl font-bold mb-2">Mô tả công việc</div>
                    <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(job.description || 'Đang cập nhật...') }} />
                    
                    <div className="text-xl font-bold mb-2">Yêu cầu công việc</div>
                    <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(jobDetail?.jobRequirements || job.jobRequirements || 'Đang cập nhật...') }} />
                    
                    <div className="text-xl font-bold mb-2">Quyền lợi và đãi ngộ</div>
                    <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(job.benefits || 'Chưa có thông tin quyền lợi') }} />
                  </div>
                </>
              ) : (
                <div>
                  <CompanyInfo companyData={companyDetails || job.employerId || job} />
                  {/* Đã xóa nút Xem trang công ty chi tiết */}
                </div>
              )}
            </div>
            
            {/* Sidebar việc làm tương tự */}
            <div className="w-full md:w-[350px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow p-4 mb-4">
                <div className="font-bold text-lg mb-3 text-[#4B1CD6] border-b pb-2">Việc làm tương tự cho bạn</div>
                {similarJobs.length === 0 && <div className="text-gray-400 text-sm">Không có việc làm tương tự.</div>}
                {similarJobs.map((sj, idx) => (
                  <div key={sj._id || idx} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                    <img src={sj.employerLogo || sj.employerId?.companyLogoUrl || sj.companyLogoUrl || '/default-logo.png'} alt="logo" className="w-10 h-10 object-cover rounded-lg border bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{sj.jobTitle}</div>
                      <div className="text-xs text-gray-500 truncate">{sj.employerId?.companyName || sj.companyName || 'Không xác định'}</div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="text-blue-600 font-bold">{sj.salaryRange?.min && sj.salaryRange?.max ? formatSalary(sj.salaryRange.min, sj.salaryRange.max) : 'Thoả thuận'}</span>
                        <span className="text-gray-600 flex items-center gap-1"><FaMapMarkerAlt /> {getLocation(sj.location)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><FaClock /> {sj.applicationDeadline ? new Date(sj.applicationDeadline).toLocaleDateString('vi-VN') : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={job}
          candidateId={user?._id}
        />
      )}
    </div>
  );
};

export default JobDetailPage; 