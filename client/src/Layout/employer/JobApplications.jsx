import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaDownload, FaCheck, FaTimes, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
import { showSuccess, showError, showInfo } from '../../utils/toast';

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  useEffect(() => {
  
    if (jobId) {
      fetchJobAndApplications();
    } else {
      setError('Không tìm thấy ID công việc');
      setLoading(false);
    }
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra jobId
      if (!jobId) {
        setError('Không tìm thấy ID công việc');
        return;
      }

  

      // Fetch job details từ API mới
      const jobResponse = await fetch(`https://be-khoa-luan2.vercel.app/api/job/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const jobData = await jobResponse.json();
      if (jobResponse.ok && jobData.success) {
        setJob(jobData.data);
      } else {
        console.error('Lỗi khi lấy thông tin job:', jobData.message);
        setError('Không tìm thấy tin tuyển dụng');
        showError('Không tìm thấy tin tuyển dụng');
        return;
      }

      // Fetch applications từ API mới
      const applicationsResponse = await fetch(`https://be-khoa-luan2.vercel.app/api/application/job/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const applicationsData = await applicationsResponse.json();
      if (applicationsResponse.ok && applicationsData.success) {
        setApplications(applicationsData.data || []);
      } else {
        console.error('Lỗi khi lấy danh sách ứng viên:', applicationsData.message);
        setApplications([]);
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setError('Lỗi kết nối server');
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      showInfo('Đang cập nhật trạng thái đơn ứng tuyển...');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`https://be-khoaluan.vercel.app/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        
        const statusMessages = {
          'Pending': 'Chờ xử lý',
          'Reviewed': 'Đã xem xét',
          'Interviewing': 'Đang phỏng vấn',
          'Offer': 'Đã đề nghị',
          'Rejected': 'Đã từ chối',
          'Hired': 'Đã tuyển'
        };
        
        showSuccess(
          `✅ Cập nhật trạng thái thành công!`, 
          `Đơn ứng tuyển đã được chuyển sang: ${statusMessages[newStatus] || newStatus}`
        );
      } else {
        showError(data.message || 'Có lỗi khi cập nhật trạng thái!');
      }
    } catch (error) {
      console.error('Lỗi cập nhật status:', error);
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  const handleDownloadCV = async (cvUrl) => {
    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Lỗi tải CV:', error);
      showError('Lỗi khi tải CV! Vui lòng thử lại sau.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      'Reviewed': { color: 'bg-blue-100 text-blue-800', text: 'Đã xem xét' },
      'Interviewing': { color: 'bg-purple-100 text-purple-800', text: 'Đang phỏng vấn' },
      'Offer': { color: 'bg-green-100 text-green-800', text: 'Đã đề nghị' },
      'Rejected': { color: 'bg-red-100 text-red-800', text: 'Đã từ chối' },
      'Hired': { color: 'bg-emerald-100 text-emerald-800', text: 'Đã tuyển' }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !filter.status || app.status === filter.status;
    const matchesSearch = !filter.search || 
      app.candidateName?.toLowerCase().includes(filter.search.toLowerCase()) ||
      app.candidateEmail?.toLowerCase().includes(filter.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Lỗi</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/employer/dashboard')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/employer/dashboard')}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại Dashboard
        </button>
        
        {job && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ứng viên cho: {job.jobTitle || job.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center">
                <FaCalendar className="mr-1" />
                {formatDate(job.postedDate || job.createdAt)}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {applications.length} ứng viên
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="accepted">Đã chấp nhận</option>
            <option value="rejected">Đã từ chối</option>
            <option value="interviewed">Đã phỏng vấn</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách ứng viên</h2>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaEye className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'Chưa có ứng viên nào' : 'Không tìm thấy ứng viên phù hợp'}
            </h3>
            <p className="text-gray-500">
              {applications.length === 0 
                ? 'Hãy chờ ứng viên nộp đơn ứng tuyển' 
                : 'Thử thay đổi bộ lọc tìm kiếm'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ứng viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-800">
                              {application.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.candidateName || application.candidate?.fullName || 'Chưa có tên'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.candidateEmail || application.candidate?.email || 'Chưa có email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {application.candidateEmail || application.candidate?.email || 'N/A'}
                        </div>
                        {(application.candidatePhone || application.candidate?.phoneNumber) && (
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            {application.candidatePhone || application.candidate?.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.applicationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        {application.cvFromProfile ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            CV từ hồ sơ
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            CV riêng
                          </span>
                        )}
                        {application.coverLetter && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            Có tin nhắn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {(application.cvUrl || application.resume?.fileUrl) && (
                          <button
                            onClick={() => handleDownloadCV(application.cvUrl || application.resume?.fileUrl)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Tải CV"
                          >
                            <FaDownload />
                          </button>
                        )}
                        
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateApplicationStatus(application._id, 'accepted')}
                              className="text-green-600 hover:text-green-900"
                              title="Chấp nhận"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        
                        {application.coverLetter && (
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowCoverLetter(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Xem tin nhắn"
                          >
                            <FaEye />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cover Letter Modal */}
      {showCoverLetter && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tin nhắn từ {selectedApplication.candidateName || selectedApplication.candidate?.fullName}
                </h3>
                <button
                  onClick={() => {
                    setShowCoverLetter(false);
                    setSelectedApplication(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Ứng viên:</strong> {selectedApplication.candidateName || selectedApplication.candidate?.fullName}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> {selectedApplication.candidateEmail || selectedApplication.candidate?.email}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Điện thoại:</strong> {selectedApplication.candidatePhone || selectedApplication.candidate?.phoneNumber || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Ngày nộp:</strong> {formatDate(selectedApplication.applicationDate)}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Tin nhắn:</h4>
                <div className="bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {selectedApplication.coverLetter || 'Không có tin nhắn'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications; 