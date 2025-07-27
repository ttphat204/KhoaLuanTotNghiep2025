import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import { FaUsers, FaCheck, FaTimes, FaTrash, FaEye, FaBuilding, FaFilter } from 'react-icons/fa';

const EmployerManagement = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, inactive, active, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllEmployers();
  }, []);

  const fetchAllEmployers = async () => {
    setLoading(true);
    try {
      showInfo('Đang tải danh sách nhà tuyển dụng...');
      const res = await axios.get('https://be-khoaluan.vercel.app/api/admin/employer-management');
      setEmployers(res.data);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      showError('Lỗi khi tải danh sách nhà tuyển dụng: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (employerId, action) => {
    try {
      showInfo(`Đang ${action === 'approve' ? 'duyệt' : 'từ chối'} nhà tuyển dụng...`);
      
      const response = await axios.post('https://be-khoaluan.vercel.app/api/admin/employer-management', { employerId, action });
      
      // Cập nhật trạng thái employer trong danh sách
      setEmployers(prevEmployers => 
        prevEmployers.map(emp => 
          emp.id === employerId 
            ? { ...emp, status: response.data.status }
            : emp
        )
      );
      
      showSuccess(
        `✅ ${action === 'approve' ? 'Duyệt' : 'Từ chối'} thành công!`,
        response.data.message
      );
    } catch (err) {
      showError('Lỗi khi cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (employerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà tuyển dụng này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.')) {
      return;
    }

    try {
      showInfo('Đang xóa nhà tuyển dụng...');
      
      const response = await axios.delete('https://be-khoaluan.vercel.app/api/admin/employer-management', { 
        data: { employerId } 
      });
      
      // Xóa employer khỏi danh sách
      setEmployers(prevEmployers => 
        prevEmployers.filter(emp => emp.id !== employerId)
      );
      
      showSuccess('🗑️ Xóa nhà tuyển dụng thành công!', response.data.message);
    } catch (err) {
      showError('Lỗi khi xóa nhà tuyển dụng: ' + (err.response?.data?.message || err.message));
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'inactive': { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
      'active': { color: 'bg-green-100 text-green-800', text: 'Đã duyệt' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Đã từ chối' }
    };
    
    const config = statusConfig[status] || statusConfig['inactive'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusCount = (status) => {
    return employers.filter(emp => emp.status === status).length;
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesFilter = filter === 'all' || employer.status === filter;
    const matchesSearch = employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaBuilding className="text-2xl text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-800">Quản lý nhà tuyển dụng</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số</p>
              <p className="text-2xl font-bold text-gray-900">{employers.length}</p>
            </div>
            <FaUsers className="text-3xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('inactive')}</p>
            </div>
            <FaUsers className="text-3xl text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('active')}</p>
            </div>
            <FaCheck className="text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</p>
            </div>
            <FaTimes className="text-3xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tất cả</option>
            <option value="inactive">Chờ duyệt</option>
            <option value="active">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          
          <input
            type="text"
            placeholder="Tìm kiếm theo tên công ty hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          onClick={fetchAllEmployers}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Employers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách nhà tuyển dụng ({filteredEmployers.length})
          </h3>
        </div>
        
        {filteredEmployers.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'Chưa có nhà tuyển dụng nào' : 'Không tìm thấy kết quả'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Hãy chờ nhà tuyển dụng đăng ký' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployers.map((employer) => (
                  <tr key={employer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {employer.companyName?.charAt(0) || 'C'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employer.companyName || 'Chưa cập nhật'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employer.phone || 'Chưa có số điện thoại'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employer.email || 'Chưa có email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employer.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {employer.status === 'inactive' && (
                          <>
                            <button
                              onClick={() => handleAction(employer.id, 'approve')}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <FaCheck className="text-sm" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleAction(employer.id, 'reject')}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                              <FaTimes className="text-sm" />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(employer.id)}
                          className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default EmployerManagement; 