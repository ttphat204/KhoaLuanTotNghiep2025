import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaCalendarAlt, FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import JobCreateForm from '../jobs/JobCreateForm';

const StatCard = ({ icon, title, value, color, bgColor }) => (
  <div className={`flex items-center gap-4 p-6 rounded-2xl shadow-sm`} style={{ background: bgColor }}>
    <div className={`p-3 rounded-xl`} style={{ background: color }}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600 font-medium">{title}</div>
    </div>
  </div>
);

const JobCard = ({ job, onEdit, onDelete, formatDate }) => {
  // Kiểm tra trạng thái dựa trên ngày hết hạn
  const getJobStatus = () => {
    const now = new Date();
    const deadline = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
    
    if (!deadline) return { status: 'pending', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' };
    
    if (now > deadline) {
      return { status: 'expired', label: 'Đã hết hạn', color: 'bg-red-100 text-red-700' };
    } else {
      return { status: 'active', label: 'Đang tuyển', color: 'bg-green-100 text-green-700' };
    }
  };

  const jobStatus = getJobStatus();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-indigo-500" />
              <span>Đăng: {formatDate(job.createdAt)}</span>
            </div>
            {job.applicationDeadline && (
              <div className="flex items-center gap-1">
                <FaClock className="text-orange-500" />
                <span>Hết hạn: {formatDate(job.applicationDeadline)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FaUsers className="text-green-500" />
              <span>Lượt xem: {job.views || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${jobStatus.color}`}>
            {jobStatus.label}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCheckCircle className="text-green-500" />
          <span>Ứng viên: {job.applications?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(job)}
            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => onDelete(job)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Xóa"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployerJobManager = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState({ status: '', jobType: '', search: '' });

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      if (!user || !user._id) {
        setJobs([]);
        return;
      }
      const apiUrl = `https://be-khoaluan.vercel.app/api/job/manage?employerId=${user._id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok && data.success !== false) {
        setJobs(data.jobs || data.data || []);
      } else {
        setJobs([]);
      }
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetch('https://be-khoaluan.vercel.app/api/admin/category-management')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, [user]);

  // Job CRUD handlers
  const handleCreateJob = async (formData) => {
    try {
      if (!user || !user._id) {
        alert('Không tìm thấy employerId. Vui lòng đăng nhập lại.');
        return;
      }
      const payload = {
        employerId: user._id,
        jobTitle: formData.jobTitle,
        description: formData.description || '',
        jobRequirements: formData.jobRequirements || '',
        requirements: formData.requirements || [],
        benefits: formData.benefits || [],
        salaryRange: {
          min: Number(formData.salaryMin) * 1000000,
          max: Number(formData.salaryMax) * 1000000,
          currency: 'VND',
        },
        location: {
          province: formData.province,
          district: formData.district,
          addressDetail: formData.addressDetail,
        },
        jobType: formData.jobType,
        categoryId: formData.categoryId,
        skillsRequired: formData.skillsRequired || [],
        experienceLevel: formData.experienceLevel,
        quantity: Number(formData.quantity) || 1,
        level: formData.level || '',
        applicationDeadline: formData.applicationDeadline,
        isFeatured: false,
      };
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success !== false) {
        alert('Tạo tin tuyển dụng thành công!');
        setShowCreateForm(false);
        fetchJobs();
      } else {
        alert(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  };

  const handleEditJob = async (jobId, updatedFields) => {
    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, employerId: user._id, ...updatedFields }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Đã cập nhật thành công!');
        setEditingJob(null);
        fetchJobs();
      } else {
        alert(data.message || 'Có lỗi khi cập nhật!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, employerId: user._id }),
      });
      const data = await response.json();
      if (data.success) {
        setJobToDelete(null);
        fetchJobs();
        setMessage('Đã xóa thành công!');
        setTimeout(() => setMessage(''), 2000);
      } else {
        alert(data.message || 'Có lỗi khi xóa!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  // Đếm tin đang tuyển (chưa hết hạn)
  const activeJobs = jobs.filter(job => {
    if (!job.applicationDeadline) return false;
    const now = new Date();
    const deadline = new Date(job.applicationDeadline);
    return now <= deadline;
  }).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header gradient */}
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 sticky top-0 z-30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Quản lý việc làm</h1>
            <p className="text-white text-lg opacity-90">Tạo và quản lý tin tuyển dụng của bạn</p>
          </div>
          <button
            className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            onClick={() => setShowCreateForm(true)}
          >
            <FaPlus className="text-xl" />
            Đăng tin mới
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="w-full px-8 mt-8 sticky top-24 z-20 bg-white py-4">
        <StatCard 
          icon={<FaBriefcase className="text-white text-2xl" />}
          title="Tin đang tuyển"
          value={activeJobs}
          color="#10B981"
          bgColor="#ECFDF5"
        />
      </div>

      {/* Jobs list */}
      <div className="w-full px-8 mt-8">
        {loading ? (
          <div className="w-full px-8 mt-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                {/* Animated spinner */}
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
                
                {/* Loading text with animation */}
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700 animate-pulse">Đang tải danh sách việc làm...</p>
                  <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                </div>
                
                {/* Loading dots */}
                <div className="flex justify-center mt-4 space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
            
            {/* Skeleton job cards */}
            <div className="space-y-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2" style={{ width: '70%' }}></div>
                      <div className="h-4 bg-gray-200 rounded mb-3" style={{ width: '50%' }}></div>
                      <div className="flex items-center gap-4">
                        <div className="h-3 bg-gray-200 rounded" style={{ width: '100px' }}></div>
                        <div className="h-3 bg-gray-200 rounded" style={{ width: '120px' }}></div>
                        <div className="h-3 bg-gray-200 rounded" style={{ width: '80px' }}></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full px-3" style={{ width: '80px' }}></div>
                      <div className="h-6 bg-gray-200 rounded-full px-3" style={{ width: '100px' }}></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded" style={{ width: '60px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tin tuyển dụng nào</h3>
            <p className="text-gray-500 mb-6">Bắt đầu tạo tin tuyển dụng đầu tiên của bạn</p>
            <button
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              onClick={() => setShowCreateForm(true)}
            >
              Tạo tin đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <JobCard 
                key={job._id}
                job={job}
                onEdit={setEditingJob}
                onDelete={setJobToDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Success message */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow-lg z-50">
          {message}
        </div>
      )}

      {/* Modal tạo tin */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative max-w-4xl w-full max-h-screen overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowCreateForm(false)}
            >
              &times;
            </button>
            <JobCreateForm onSubmit={handleCreateJob} categories={categories} />
          </div>
        </div>
      )}

      {/* Modal sửa tin */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative max-w-4xl w-full max-h-screen overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setEditingJob(null)}
            >
              &times;
            </button>
            <JobCreateForm onSubmit={(updatedFields) => handleEditJob(editingJob._id, updatedFields)} categories={categories} />
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <FaTrash className="text-6xl text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa tin tuyển dụng <b>{jobToDelete.jobTitle}</b>?</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                  onClick={() => setJobToDelete(null)}
                >
                  Hủy
                </button>
                <button
                  className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => handleDeleteJob(jobToDelete._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobManager; 