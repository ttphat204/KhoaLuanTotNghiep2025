import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSuccess, showError, showLoading, updateLoading, showCustomToast, dismissToast } from '../../utils/toast.jsx';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const EmployerManagement = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, inactive, active, rejected
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  useEffect(() => {
    fetchAllEmployers();
  }, []);

  const fetchAllEmployers = async () => {
    setLoading(true);
    try {
      // API lấy danh sách tất cả employer
      const res = await axios.get('https://be-khoaluan.vercel.app/api/admin/employer-management');
      console.log('API Response:', res.data); // Debug log
      setEmployers(res.data);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message); // Debug log
      setError('Lỗi khi tải danh sách employer: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleAction = async (employerId, action) => {
    const loadingToast = showLoading(`Đang ${action === 'approve' ? 'duyệt' : 'từ chối'} employer...`);
    
    try {
      const response = await axios.post('https://be-khoaluan.vercel.app/api/admin/employer-management', { employerId, action });
      
      // Cập nhật trạng thái employer trong danh sách
      setEmployers(prevEmployers => 
        prevEmployers.map(emp => 
          emp.id === employerId 
            ? { ...emp, status: response.data.status }
            : emp
        )
      );
      
      showCustomToast(
        'success', 
        response.data.message, 
        action === 'approve' ? 'Đã duyệt thành công!' : 'Đã từ chối thành công!'
      );
      dismissToast(loadingToast);
    } catch (err) {
      updateLoading(loadingToast, 'Lỗi khi cập nhật trạng thái: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDelete = async (employerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa employer này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.')) {
      return;
    }

    const loadingToast = showLoading('Đang xóa employer...');

    try {
      const response = await axios.delete('https://be-khoaluan.vercel.app/api/admin/employer-management', { 
        data: { employerId } 
      });
      
      // Xóa employer khỏi danh sách
      setEmployers(prevEmployers => 
        prevEmployers.filter(emp => emp.id !== employerId)
      );
      
      // Hiển thị thông báo tùy chỉnh
      showCustomToast(
        'success', 
        response.data.message, 
        'Đã xóa thành công!'
      );
      // Đóng toast loading
      dismissToast(loadingToast);
    } catch (err) {
      updateLoading(loadingToast, 'Lỗi khi xóa employer: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'inactive':
        return 'Chờ duyệt';
      case 'active':
        return 'Đã duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'inactive':
        return 'text-yellow-600 bg-yellow-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Lọc employer theo trạng thái
  const filteredEmployers = employers.filter(emp => {
    if (filter === 'all') return true;
    return emp.status === filter;
  });

  // Đếm số lượng theo trạng thái
  const getStatusCount = (status) => {
    return employers.filter(emp => emp.status === status).length;
  };

  const openDeleteModal = (employerId) => {
    setSelectedEmployerId(employerId);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedEmployerId(null);
  };

  const confirmDelete = () => {
    if (selectedEmployerId) {
      handleDelete(selectedEmployerId);
      closeDeleteModal();
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản lý Employer</h2>
        <p className="text-gray-600">Quản lý tất cả tài khoản employer trong hệ thống</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tất cả ({employers.length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'inactive'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Chờ duyệt ({getStatusCount('inactive')})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'active'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đã duyệt ({getStatusCount('active')})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'rejected'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đã từ chối ({getStatusCount('rejected')})
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin cơ bản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {filter === 'all' 
                      ? 'Không có employer nào.' 
                      : `Không có employer nào có trạng thái "${getStatusText(filter)}".`
                    }
                  </td>
                </tr>
              ) : (
                filteredEmployers.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{emp.email}</div>
                        <div className="text-sm text-gray-500">{emp.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.companyName}</div>
                      {emp.profile?.industry && (
                        <div className="text-sm text-gray-500">{emp.profile.industry}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(emp.status)}`}>
                        {getStatusText(emp.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(emp.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {emp.status === 'inactive' && (
                          <>
                            <button 
                              onClick={() => handleAction(emp.id, 'approve')} 
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                            >
                              Duyệt
                            </button>
                            <button 
                              onClick={() => handleAction(emp.id, 'reject')} 
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => openDeleteModal(emp.id)} 
                          className="bg-red-700 text-white px-3 py-1 rounded text-xs hover:bg-red-800 transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal open={modalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} />
    </div>
  );
};

export default EmployerManagement; 