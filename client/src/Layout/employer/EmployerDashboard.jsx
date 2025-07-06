import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaUsers, FaEye, FaFileAlt, FaPlus, FaEdit, FaTrash, FaEyeSlash, FaStar, FaChartBar, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import JobCreateForm from '../jobs/JobCreateForm';
import EmployerStats from './EmployerStats';
import { useNavigate } from 'react-router-dom';
import EmployerProfile from './EmployerProfile';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalViews: 0,
    totalApplicants: 0
  });
  const [filter, setFilter] = useState({
    status: "",
    jobType: "",
    search: ""
  });
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'stats'
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [employerProfile, setEmployerProfile] = useState(null);

  // Lấy danh sách jobs và thống kê từ API mới
  const fetchEmployerData = async () => {
    try {
      setLoading(true);
      if (!user || !user._id) {
        setJobs([]);
        setStats({ totalJobs: 0, activeJobs: 0, totalViews: 0, totalApplicants: 0 });
        return;
      }
      const apiUrl = `https://be-khoaluan.vercel.app/api/job/manage?employerId=${user._id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok && data.success !== false) {
        setJobs(data.jobs || data.data || []);
        setStats({
          totalJobs: (data.jobs || data.data || []).length,
          activeJobs: (data.jobs || data.data || []).filter(j => j.status === 'Active').length,
          totalViews: (data.jobs || data.data || []).reduce((sum, j) => sum + (j.viewsCount || 0), 0),
          totalApplicants: (data.jobs || data.data || []).reduce((sum, j) => sum + (j.applicantsCount || 0), 0)
        });
      } else {
        setJobs([]);
        setStats({ totalJobs: 0, activeJobs: 0, totalViews: 0, totalApplicants: 0 });
      }
    } catch (error) {
      setJobs([]);
      setStats({ totalJobs: 0, activeJobs: 0, totalViews: 0, totalApplicants: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh mục ngành nghề khi load dashboard
  useEffect(() => {
      fetch('https://be-khoaluan.vercel.app/api/admin/category-management')
        .then(res => res.json())
        .then(data => setCategories(data.categories || []))
        .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (user && user.role === 'employer') {
      fetchEmployerData();
    }
  }, [user]);

  // Lấy profile employer khi load dashboard
  useEffect(() => {
    if (user && user._id) {
      fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setEmployerProfile(data.data);
          else setEmployerProfile(null);
        })
        .catch(() => setEmployerProfile(null));
    }
  }, [user]);

  const handleCreateJob = async (formData) => {
    try {
      console.log('Form data received:', formData);
      if (!user || !user._id) {
        alert("Không tìm thấy employerId. Vui lòng đăng nhập lại.");
        return;
      }
      
      // Kiểm tra các trường bắt buộc
      const requiredFields = ['jobTitle', 'description', 'jobRequirements', 'experienceLevel', 'quantity', 'level', 'jobType', 'categoryId', 'applicationDeadline', 'province', 'salaryMin', 'salaryMax'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        alert(`Thiếu các trường: ${missingFields.join(', ')}`);
        return;
      }
      const payload = {
        employerId: user._id,
        jobTitle: formData.jobTitle,
        description: formData.description || "",
        jobRequirements: formData.jobRequirements || "",
        requirements: formData.requirements || [],
        benefits: formData.benefits || [],
        salaryRange: {
          min: Number(formData.salaryMin) * 1000000,
          max: Number(formData.salaryMax) * 1000000,
          currency: "VND"
        },
        location: {
          province: formData.province,
          district: formData.district,
          addressDetail: formData.addressDetail
        },
        jobType: formData.jobType,
        categoryId: formData.categoryId,
        skillsRequired: formData.skillsRequired || [],
        experienceLevel: formData.experienceLevel,
        quantity: Number(formData.quantity) || 1,
        level: formData.level || "",
        applicationDeadline: formData.applicationDeadline,
        isFeatured: false
      };
      console.log('Payload being sent:', payload);
      const response = await fetch("https://be-khoaluan.vercel.app/api/job/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('Response:', data);
      if (response.ok && data.success !== false) {
        alert("Tạo tin tuyển dụng thành công!");
        setShowCreateForm(false);
        fetchEmployerData();
      } else {
        alert(data.message || "Có lỗi xảy ra!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://be-khoaluan.vercel.app/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchEmployerData(); // Refresh lại dữ liệu
      } else {
        alert("Có lỗi khi cập nhật trạng thái!");
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    }
  };

  const handleToggleFeatured = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://be-khoaluan.vercel.app/api/jobs/${jobId}/featured`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchEmployerData(); // Refresh lại dữ liệu
      } else {
        alert("Có lỗi khi cập nhật tin nổi bật!");
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, employerId: user._id })
      });
      const data = await response.json();
      if (data.success) {
        setJobToDelete(null);
        fetchEmployerData();
        setMessage('Đã xóa thành công!');
        setTimeout(() => setMessage(''), 2000);
      } else {
        alert(data.message || 'Có lỗi khi xóa!');
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
        body: JSON.stringify({ jobId, employerId: user._id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success) {
        alert('Đã cập nhật thành công!');
        setEditingJob(null);
        fetchEmployerData();
      } else {
        alert(data.message || 'Có lỗi khi cập nhật!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  };

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

  const getJobTypeBadge = (jobType) => {
    const typeConfig = {
      'Full-time': { color: 'bg-blue-100 text-blue-800', text: 'Toàn thời gian' },
      'Part-time': { color: 'bg-purple-100 text-purple-800', text: 'Bán thời gian' },
      'Remote': { color: 'bg-green-100 text-green-800', text: 'Làm từ xa' },
      'Internship': { color: 'bg-orange-100 text-orange-800', text: 'Thực tập' },
      'Contract': { color: 'bg-indigo-100 text-indigo-800', text: 'Hợp đồng' }
    };
    
    const config = typeConfig[jobType] || typeConfig['Full-time'];
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
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Avatar + Thông tin công ty */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {employerProfile?.companyLogoUrl ? (
              <img
                src={employerProfile.companyLogoUrl}
                alt="Logo công ty"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200 shadow">
                <FaBuilding className="text-4xl text-purple-400" />
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <div className="text-xl font-bold text-gray-900">{employerProfile?.companyName || "Tên công ty"}</div>
            <div className="text-gray-500">{employerProfile?.companyEmail || "Email công ty"}</div>
          </div>
        </div>
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">Dashboard</h1>
            <p className="text-gray-600 text-center md:text-left">Quản lý tin tuyển dụng của bạn</p>
          </div>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-purple-700 font-semibold px-6 py-2 rounded shadow-md transition mb-2 md:mb-0"
            onClick={() => setShowProfileModal(true)}
          >
            Cập nhật tài khoản
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-purple-700 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaBriefcase className="inline mr-2" />
            Danh sách tin tuyển dụng
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-purple-700 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Thống kê & Báo cáo
          </button>
        </div>

        <div>
        {activeTab === 'stats' ? (
          <EmployerStats />
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <button
                className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-800 transition-colors shadow-md"
                onClick={() => setShowCreateForm(true)}
              >
                <FaPlus /> Đăng tin mới
              </button>

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tuyển dụng..."
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-56"
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                />
                <select
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-44"
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Closed">Đã đóng</option>
                  <option value="Draft">Bản nháp</option>
                  <option value="Archived">Đã lưu trữ</option>
                </select>
                <select
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-44"
                  value={filter.jobType}
                  onChange={(e) => setFilter({...filter, jobType: e.target.value})}
                >
                  <option value="">Tất cả loại</option>
                  <option value="Full-time">Toàn thời gian</option>
                  <option value="Part-time">Bán thời gian</option>
                  <option value="Remote">Làm từ xa</option>
                  <option value="Internship">Thực tập</option>
                  <option value="Contract">Hợp đồng</option>
                </select>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách tin tuyển dụng</h2>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FaBriefcase className="text-6xl mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tin tuyển dụng nào</h3>
                  <p className="text-gray-500 mb-4">Bắt đầu đăng tin tuyển dụng đầu tiên của bạn</p>
                  <button
                    className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                    onClick={() => setShowCreateForm(true)}
                  >
                    Đăng tin ngay
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tin tuyển dụng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lượt xem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ứng viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đăng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {job.isFeatured && (
                                  <FaStar className="text-yellow-500 text-sm" />
                                )}
                              </div>
                              <div className="ml-2">
                                <div className="font-semibold text-gray-900">{job.jobTitle}</div>
                                <div className="text-xs text-gray-500">{job.categoryId?.name || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                          <td className="px-6 py-4">{job.viewsCount || 0}</td>
                          <td className="px-6 py-4">{job.applicantsCount || 0}</td>
                          <td className="px-6 py-4">{formatDate(job.createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleToggleFeatured(job._id)}
                                title={job.isFeatured ? "Bỏ nổi bật" : "Đặt nổi bật"}
                              >
                                <FaStar className={job.isFeatured ? "text-yellow-500" : "text-gray-400"} />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleUpdateJobStatus(job._id, job.status === 'Active' ? 'Closed' : 'Active')}
                                title={job.status === 'Active' ? "Tạm dừng" : "Kích hoạt"}
                              >
                                {job.status === 'Active' ? <FaEyeSlash /> : <FaEye />}
                              </button>
                              <button
                                className="text-purple-600 hover:text-purple-900"
                                title="Chỉnh sửa"
                                onClick={() => setEditingJob(job)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => setJobToDelete(job)}
                                title="Xóa"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
        </div>

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
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
              <p>Bạn có chắc chắn muốn xóa tin tuyển dụng <b>{jobToDelete.jobTitle}</b>?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setJobToDelete(null)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDeleteJob(jobToDelete._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                aria-label="Đóng"
              >
                &times;
              </button>
              <EmployerProfile onSuccess={() => setShowProfileModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard; 