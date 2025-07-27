import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaUsers, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError, showInfo } from '../../utils/toast';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://be-khoaluan.vercel.app/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setJob(data.data);
          } else {
            showError('Không tìm thấy tin tuyển dụng');
            navigate('/employer');
          }
        } else {
          showError('Có lỗi khi tải thông tin tin tuyển dụng');
          navigate('/employer');
        }
      } catch (error) {
        console.error('Lỗi kết nối:', error);
        showError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      showInfo('Đang cập nhật trạng thái tin tuyển dụng...');
      
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
        setJob(prev => ({ ...prev, status: newStatus }));
        showSuccess('✅ Cập nhật trạng thái thành công!', 'Trạng thái tin tuyển dụng đã được cập nhật.');
      } else {
        showError('Có lỗi khi cập nhật trạng thái!');
      }
    } catch (error) {
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  const handleToggleFeatured = async () => {
    try {
      showInfo('Đang cập nhật trạng thái nổi bật...');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`https://be-khoaluan.vercel.app/api/jobs/${jobId}/featured`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setJob(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
        showSuccess(
          job.isFeatured ? '⭐ Đã bỏ nổi bật tin tuyển dụng!' : '⭐ Đã đặt nổi bật tin tuyển dụng!',
          job.isFeatured ? 'Tin tuyển dụng không còn hiển thị nổi bật.' : 'Tin tuyển dụng đã được đặt nổi bật.'
        );
      } else {
        showError('Có lỗi khi cập nhật tin nổi bật!');
      }
    } catch (error) {
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  const handleDeleteJob = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://be-khoaluan.vercel.app/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Xóa tin tuyển dụng thành công!");
        navigate('/employer');
      } else {
        alert("Có lỗi khi xóa tin tuyển dụng!");
      }
    } catch (error) {
      alert("Lỗi kết nối!");
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
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

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy tin tuyển dụng</h2>
        <button
          onClick={() => navigate('/employer')}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
        >
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employer')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
            <p className="text-gray-600">{job.categoryId?.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleFeatured}
            className={`p-2 rounded-lg transition-colors ${
              job.isFeatured 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={job.isFeatured ? "Bỏ nổi bật" : "Đặt nổi bật"}
          >
            <FaStar className={job.isFeatured ? "text-yellow-500" : ""} />
          </button>
          <button
            onClick={() => handleUpdateStatus(job.status === 'Active' ? 'Closed' : 'Active')}
            className={`p-2 rounded-lg transition-colors ${
              job.status === 'Active'
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            title={job.status === 'Active' ? "Tạm dừng" : "Kích hoạt"}
          >
            {job.status === 'Active' ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDeleteJob}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Xóa"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Status and Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getStatusBadge(job.status)}
            {getJobTypeBadge(job.jobType)}
            {job.isFeatured && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Nổi bật
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Đăng ngày: {formatDate(job.postedDate)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{job.viewsCount || 0}</div>
            <div className="text-sm text-gray-600">Lượt xem</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{job.applicantsCount || 0}</div>
            <div className="text-sm text-gray-600">Ứng viên</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{job.applicantsCount || 0}</div>
            <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{job.applicantsCount || 0}</div>
            <div className="text-sm text-gray-600">Phỏng vấn</div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả công việc</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu công việc</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền lợi</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng yêu cầu</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công việc</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Mức lương</p>
                  <p className="font-medium text-gray-900">
                    {formatSalary(job.salaryRange?.min || 0, job.salaryRange?.max || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Địa điểm</p>
                  <p className="font-medium text-gray-900">
                    {job.location?.province}
                    {job.location?.district && `, ${job.location.district}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaBriefcase className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Kinh nghiệm</p>
                  <p className="font-medium text-gray-900">{job.experienceLevel}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Hạn nộp</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUsers className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Số lượng tuyển</p>
                  <p className="font-medium text-gray-900">{job.applicantsCount || 1} người</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tên công ty</p>
                <p className="font-medium text-gray-900">{user?.companyName || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Địa chỉ</p>
                <p className="font-medium text-gray-900">{user?.address || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <p className="font-medium text-gray-900">{user?.website || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 