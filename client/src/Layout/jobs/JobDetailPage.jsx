import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaUsers, FaIndustry, FaBriefcase, FaGraduationCap, FaCalendarAlt, FaStar, FaHeart, FaMedal, FaPaperPlane } from 'react-icons/fa';
import Header from '../shared/Header';
import Footer from '../../components/Footer';
import ApplicationModal from '../../components/ApplicationModal';

const JOB_API = 'https://be-khoaluan.vercel.app/api/job/all';
const JOB_MANAGE_API = 'https://be-khoaluan.vercel.app/api/job/manage';
const CATEGORY_API = 'https://be-khoaluan.vercel.app/api/admin/category-management';

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

  useEffect(() => {
    fetchJobDetails();
    // Kiểm tra user đăng nhập
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        setUser(JSON.parse(userFromStorage));
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

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCheckCV = () => {
    alert('Chức năng kiểm tra CV sẽ được phát triển!');
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin việc làm...</p>
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
    { icon: <FaMedal />, label: 'Cấp bậc', value: jobDetail?.level || job.level || '---' },
    { icon: <FaUsers />, label: 'Số lượng tuyển', value: jobDetail?.quantity || job.quantity || '---' },
    { icon: <FaBriefcase />, label: 'Hình thức làm việc', value: jobDetail?.jobType || job.jobType || '---' },
    { icon: <FaMedal />, label: 'Kinh nghiệm', value: jobDetail?.experienceLevel || job.experienceLevel || '---' },
    { icon: <FaBriefcase />, label: 'Trạng thái', value: getDeadlineStatus(jobDetail?.createdAt || job.createdAt, jobDetail?.applicationDeadline || job.applicationDeadline) },
  ];
  const skills = jobDetail?.skillsRequired || job.skillsRequired || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Quay lại danh sách việc làm
          </button>

          {/* Header lớn */}
          <div className="bg-white rounded-3xl shadow p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between relative">
            <div className="flex items-center gap-8 flex-1">
              <img src={companyLogoUrl} alt="logo" className="w-28 h-28 object-contain rounded-xl border bg-white shadow" />
              <div className="flex-1 min-w-0">
                <div className="text-gray-500 text-base font-semibold mb-1">{companyName}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{job.jobTitle}</div>
                <div className="flex flex-wrap gap-6 mb-4">
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaMoneyBillWave /> Mức lương <span className="text-[#7c3aed]">{salary}</span></span>
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaCalendarAlt /> Hạn nộp hồ sơ <span className="text-[#7c3aed]">{deadline}</span></span>
                  <span className="flex items-center gap-2 text-blue-500 font-bold text-lg"><FaMapMarkerAlt /> Khu vực tuyển <span className="text-[#7c3aed]">{location}</span></span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold flex items-center gap-2">🎯 Cơ hội hấp dẫn!</span>
                  <span className="text-gray-500">Công việc đang rất được quan tâm! Ứng tuyển ngay để không lỡ cơ hội!</span>
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
                    className="bg-purple-50 text-[#7c3aed] font-bold px-5 py-3 rounded-xl text-base shadow transition flex items-center gap-2 border border-[#7c3aed]"
                  >
                    <FaHeart className={isFavorite ? 'text-red-500 fill-current' : ''} />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-8 right-8 text-gray-400 text-sm flex items-center gap-2">
              <FaCalendarAlt /> Ngày cập nhật: {updatedAt}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs và nội dung chính */}
            <div className="flex-1">
              <div className="flex gap-2 border-b mb-6">
                <button className="px-6 py-3 font-bold text-[#2563eb] border-b-2 border-[#2563eb] bg-white rounded-t-xl">Chi tiết tuyển dụng</button>
                <button className="px-6 py-3 font-bold text-gray-500 bg-gray-50 rounded-t-xl">Công ty</button>
              </div>
              
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
              
              {/* Mô tả công việc, yêu cầu... */}
              <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <div className="text-xl font-bold mb-2">Mô tả công việc</div>
                <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: job.description || 'Đang cập nhật...' }} />
                <div className="text-xl font-bold mb-2">Yêu cầu công việc</div>
                <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: jobDetail?.jobRequirements || job.jobRequirements || 'Đang cập nhật...' }} />
              </div>
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