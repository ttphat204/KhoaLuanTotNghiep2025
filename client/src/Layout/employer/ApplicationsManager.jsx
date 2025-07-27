import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaDownload, FaCheck, FaTimes, FaEnvelope, FaPhone, FaCalendar, FaBriefcase, FaPlus, FaEdit } from 'react-icons/fa';
import UpdateStatusModal from '../../components/UpdateStatusModal';
import CVViewerModal from '../../components/CVViewerModal';
import { showSuccess, showError, showInfo } from '../../utils/toast';

const ApplicationsManager = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    jobId: '',
    status: '',
    search: ''
  });
  const [employerId, setEmployerId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);

  useEffect(() => {
    // Lấy employerId từ localStorage hoặc context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user._id) {
      setEmployerId(user._id);
    }
  }, []);

  useEffect(() => {
    if (employerId) {
      fetchJobsAndApplications();
    }
  }, [employerId]);

  const fetchJobsAndApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch tất cả jobs để filter
      const jobsResponse = await fetch(`https://be-khoa-luan2.vercel.app/api/jobs/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        if (jobsData.success) {
          setJobs(jobsData.data || []);
        }
      }

      // Fetch applications chỉ của employer này
      const applicationsResponse = await fetch(`https://be-khoa-luan2.vercel.app/api/employer-dashboard-stats?employerId=${employerId}&type=applications`, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async (cvUrl) => {
    try {
      if (cvUrl.startsWith('data:application/pdf;base64,')) {
        // Xử lý base64 PDF
        const byteCharacters = atob(cvUrl.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Xử lý URL thông thường
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
      }
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

  const getAvatarColors = (name) => {
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400', 
      'from-green-400 to-emerald-400',
      'from-orange-400 to-red-400',
      'from-indigo-400 to-purple-400',
      'from-teal-400 to-blue-400',
      'from-pink-400 to-rose-400',
      'from-yellow-400 to-orange-400'
    ];
    
    // Tạo hash từ tên để chọn màu nhất quán
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleUpdateStatus = (applicationId, newStatus, note) => {
    // Cập nhật trạng thái trong danh sách local
    setApplications(prev => prev.map(app => 
      app._id === applicationId 
        ? { ...app, status: newStatus, note, lastStatusUpdate: new Date() }
        : app
    ));
    
    // Hiển thị thông báo thành công
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
      `Đơn ứng tuyển đã được chuyển sang trạng thái: ${statusMessages[newStatus] || newStatus}`
    );
  };

  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setShowStatusModal(true);
  };

  const openCVModal = (application) => {
    const cvUrl = application.cvUrl || application.resume?.fileUrl;
    if (cvUrl) {
      setSelectedCV({
        url: cvUrl,
        candidateName: application.candidateName || application.candidate?.fullName || 'Ứng viên'
      });
      setShowCVModal(true);
    }
  };



  const filteredApplications = applications.filter(app => {
    const matchesJob = !filter.jobId || app.jobId === filter.jobId;
    const matchesStatus = !filter.status || app.status === filter.status;
    const matchesSearch = !filter.search || 
      (app.candidateName || app.candidate?.fullName || '').toLowerCase().includes(filter.search.toLowerCase()) ||
      (app.candidateEmail || app.candidate?.email || '').toLowerCase().includes(filter.search.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(filter.search.toLowerCase());
    return matchesJob && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white">
        {/* Header gradient skeleton */}
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
          <div className="flex flex-col items-center flex-1">
            <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-2" style={{ width: '350px' }}></div>
            <div className="h-4 bg-white/20 rounded animate-pulse mb-4" style={{ width: '280px' }}></div>
            <div className="flex items-center gap-4">
              <div className="h-8 bg-white/20 rounded-full animate-pulse" style={{ width: '150px' }}></div>
              <div className="h-8 bg-white/20 rounded-full animate-pulse" style={{ width: '120px' }}></div>
            </div>
          </div>
        </div>
        
        {/* Loading content */}
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
                <p className="text-lg font-semibold text-gray-700 animate-pulse">Đang tải danh sách đơn ứng tuyển...</p>
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
          
          {/* Skeleton filters */}
          <div className="bg-white rounded-lg p-4 shadow mb-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Skeleton applications table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded" style={{ width: '200px' }}></div>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded" style={{ width: '150px' }}></div>
                        <div className="h-3 bg-gray-200 rounded" style={{ width: '200px' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-gray-200 rounded-full" style={{ width: '100px' }}></div>
                      <div className="h-6 bg-gray-200 rounded-full" style={{ width: '120px' }}></div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white">
        {/* Header gradient */}
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
          <div className="flex flex-col items-center flex-1">
            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight mb-1">Quản lý đơn ứng tuyển</div>
            <div className="text-white text-base drop-shadow">Xem và quản lý các đơn ứng tuyển của bạn</div>
          </div>
        </div>
        
        {/* Error content */}
        <div className="w-full px-8 mt-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              {/* Error icon */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              {/* Error text */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">Đã xảy ra lỗi</h3>
                <p className="text-gray-600">{error}</p>
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={fetchJobsAndApplications}
                >
                  Thử lại
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                  onClick={() => navigate('/employer/dashboard')}
                >
                  Quay lại Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header gradient */}
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
        <div className="flex flex-col items-center flex-1">
          <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight mb-1">Quản lý đơn ứng tuyển</div>
          <div className="text-white text-base drop-shadow">Xem và quản lý các đơn ứng tuyển của bạn</div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium">
            {applications.length} đơn ứng tuyển
          </span>
          <button
            onClick={() => navigate('/employer/jobs')}
            className="bg-white text-indigo-600 px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md"
          >
            <FaPlus className="text-sm" />
            Đăng tin mới
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 mt-8">

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên, công việc..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter.jobId}
            onChange={(e) => setFilter({...filter, jobId: e.target.value})}
          >
            <option value="">Tất cả công việc</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.jobTitle || job.title || 'Công việc ứng tuyển'}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ xử lý</option>
            <option value="Reviewed">Đã xem xét</option>
            <option value="Interviewing">Đang phỏng vấn</option>
            <option value="Offer">Đã đề nghị</option>
            <option value="Rejected">Đã từ chối</option>
            <option value="Hired">Đã tuyển</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách đơn ứng tuyển</h2>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaBriefcase className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'Chưa có đơn ứng tuyển nào' : 'Không tìm thấy đơn ứng tuyển phù hợp'}
            </h3>
            <p className="text-gray-500">
              {applications.length === 0 
                ? 'Hãy đăng tin tuyển dụng để nhận đơn ứng tuyển' 
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
                    Công việc
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
                          {application.candidate?.avatarUrl ? (
                            <img 
                              src={application.candidate.avatarUrl} 
                              alt="Avatar" 
                              className="h-10 w-10 rounded-full object-cover shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarColors(application.candidateName || application.candidate?.fullName || 'User')} flex items-center justify-center shadow-sm ${application.candidate?.avatarUrl ? 'hidden' : 'flex'}`}>
                            <span className="text-sm font-bold text-white">
                              {(application.candidateName || application.candidate?.fullName || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.candidateName || application.candidate?.fullName || 'Chưa có tên'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {application.jobTitle || 'Công việc ứng tuyển'}
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
                        
                        <button
                          onClick={() => openCVModal(application)}
                          className={`${
                            application.cvUrl || application.resume?.fileUrl
                              ? 'text-purple-600 hover:text-purple-900'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={application.cvUrl || application.resume?.fileUrl ? "Xem CV" : "Không có CV"}
                          disabled={!application.cvUrl && !application.resume?.fileUrl}
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() => openStatusModal(application)}
                          className="text-green-600 hover:text-green-900"
                          title="Cập nhật trạng thái"
                        >
                          <FaEdit />
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
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        application={selectedApplication}
        onStatusUpdate={handleUpdateStatus}
      />

      {/* CV Viewer Modal */}
      <CVViewerModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        cvUrl={selectedCV?.url}
        candidateName={selectedCV?.candidateName}
      />
    </div>
  );
};

export default ApplicationsManager; 