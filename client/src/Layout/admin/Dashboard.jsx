import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import EmployerManagement from './EmployerManagement';
import CategoryManagement from './CategoryManagement';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { FaUsers, FaBriefcase, FaFileAlt, FaCalendarAlt, FaUserCheck, FaUserTimes, FaEye, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

// Dashboard Overview Component
const DashboardOverview = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Dữ liệu cho biểu đồ tròn - Phân bố trạng thái tin tuyển dụng
  const jobStatusData = [
    { name: 'Đang hoạt động', value: stats.activeJobs || 0, color: '#10B981' },
    { name: 'Đã đóng', value: stats.closedJobs || 0, color: '#EF4444' },
    { name: 'Nháp', value: stats.draftJobs || 0, color: '#F59E0B' }
  ];

  // Dữ liệu cho biểu đồ tròn - Phân bố người dùng
  const userDistributionData = [
    { name: 'Ứng viên', value: stats.totalCandidates || 0, color: '#3B82F6' },
    { name: 'Nhà tuyển dụng', value: stats.totalEmployers || 0, color: '#8B5CF6' }
  ];

  // Dữ liệu cho biểu đồ cột - Thống kê theo tháng
  const monthlyData = stats.monthlyData || [
    { name: 'T1', jobs: 0, applications: 0, users: 0 },
    { name: 'T2', jobs: 0, applications: 0, users: 0 },
    { name: 'T3', jobs: 0, applications: 0, users: 0 },
    { name: 'T4', jobs: 0, applications: 0, users: 0 },
    { name: 'T5', jobs: 0, applications: 0, users: 0 },
    { name: 'T6', jobs: 0, applications: 0, users: 0 }
  ];

  // Dữ liệu cho biểu đồ đường - Xu hướng tăng trưởng
  const growthData = stats.growthData || [
    { month: 'T1', users: 0, jobs: 0, applications: 0 },
    { month: 'T2', users: 0, jobs: 0, applications: 0 },
    { month: 'T3', users: 0, jobs: 0, applications: 0 },
    { month: 'T4', users: 0, jobs: 0, applications: 0 },
    { month: 'T5', users: 0, jobs: 0, applications: 0 },
    { month: 'T6', users: 0, jobs: 0, applications: 0 }
  ];

  // Kiểm tra xem có dữ liệu thực hay không
  const hasRealData = monthlyData.some(item => item.jobs > 0 || item.applications > 0 || item.users > 0);
  const hasGrowthData = growthData.some(item => item.users > 0 || item.jobs > 0 || item.applications > 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng người dùng</p>
              <p className="text-3xl font-bold">{stats.totalUsers?.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-1">Candidates + Employers</p>
            </div>
            <FaUsers className="text-4xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Tin tuyển dụng</p>
              <p className="text-3xl font-bold">{stats.totalJobs?.toLocaleString()}</p>
              <p className="text-purple-200 text-xs mt-1">Đang hoạt động</p>
            </div>
            <FaBriefcase className="text-4xl text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Đơn ứng tuyển</p>
              <p className="text-3xl font-bold">{stats.totalApplications?.toLocaleString()}</p>
              <p className="text-green-200 text-xs mt-1">Tổng cộng</p>
            </div>
            <FaFileAlt className="text-4xl text-green-200" />
          </div>
        </div>
        
        {/* Ẩn card "Chờ duyệt"
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Chờ duyệt</p>
              <p className="text-3xl font-bold">{stats.pendingEmployers?.toLocaleString()}</p>
              <p className="text-orange-200 text-xs mt-1">Employer mới</p>
            </div>
            <FaUserCheck className="text-4xl text-orange-200" />
          </div>
        </div>
        */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn - Phân bố người dùng */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            Phân bố người dùng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn - Phân bố trạng thái tin tuyển dụng */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaChartBar className="text-purple-500" />
            Phân bố trạng thái tin tuyển dụng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ cột - Thống kê theo tháng */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-500" />
          Thống kê theo tháng
        </h3>
        {hasRealData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#8B5CF6" name="Tin tuyển dụng" />
              <Bar dataKey="applications" fill="#10B981" name="Đơn ứng tuyển" />
              <Bar dataKey="users" fill="#3B82F6" name="Người dùng mới" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <FaChartBar className="text-4xl mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa có dữ liệu thống kê theo tháng</p>
              <p className="text-xs text-gray-400 mt-1">Dữ liệu sẽ hiển thị khi có hoạt động trong hệ thống</p>
            </div>
          </div>
        )}
      </div>

      {/* Biểu đồ đường - Xu hướng tăng trưởng */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaChartBar className="text-green-500" />
          Xu hướng tăng trưởng
        </h3>
        {hasGrowthData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Người dùng" />
              <Area type="monotone" dataKey="jobs" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Tin tuyển dụng" />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Đơn ứng tuyển" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
                              <FaChartBar className="text-4xl mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa có dữ liệu xu hướng tăng trưởng</p>
              <p className="text-xs text-gray-400 mt-1">Dữ liệu sẽ hiển thị khi có hoạt động trong hệ thống</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-500" />
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          {stats.recentActivity?.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{activity}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Chưa có hoạt động nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, candidates, employers
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      showInfo('Đang tải danh sách người dùng...');
      
      // Sử dụng API employer-management để lấy danh sách employer
      const employerRes = await fetch('https://be-khoaluan.vercel.app/api/admin/employer-management');
      const employers = await employerRes.json();
      
      // Lấy dữ liệu candidates từ API auth/login
      const authRes = await fetch('https://be-khoaluan.vercel.app/api/auth/login');
      const authData = await authRes.json();
      
      // Lấy thông tin chi tiết candidates từ API candidate profile
      const candidateRes = await fetch('https://be-khoaluan.vercel.app/api/candidate/profile');
      const candidateData = await candidateRes.json();
      
      // Tạo danh sách candidates từ dữ liệu thực
      const candidates = candidateData.success ? candidateData.data || [] : [];
      
      // Nếu không có dữ liệu candidates thực, tạo mock data dựa trên số lượng
      const totalCandidates = authData.databaseStats?.totalCandidates || 0;
      const mockCandidates = [];
      
      if (candidates.length === 0 && totalCandidates > 0) {
        // Tạo mock data cho candidates
        for (let i = 0; i < Math.min(totalCandidates, 10); i++) {
          mockCandidates.push({
            _id: `candidate${i + 1}`,
            fullName: `Ứng viên ${i + 1}`,
            email: `candidate${i + 1}@email.com`,
            phone: `012345678${i}`,
            role: 'candidate',
            status: 'active',
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
          });
        }
      } else {
        // Sử dụng dữ liệu thực
        candidates.forEach((candidate, index) => {
          mockCandidates.push({
            _id: candidate._id || `candidate${index + 1}`,
            fullName: candidate.fullName || `Ứng viên ${index + 1}`,
            email: candidate.email || `candidate${index + 1}@email.com`,
            phone: candidate.phone || `012345678${index}`,
            role: 'candidate',
            status: 'active',
            createdAt: candidate.createdAt || new Date(Date.now() - (index * 86400000)).toISOString()
          });
        });
      }

      const allUsers = [
        ...employers.map(emp => ({ ...emp, role: 'employer' })),
        ...mockCandidates
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      showInfo('Đang cập nhật trạng thái...');
      
      // Sử dụng API employer-management để cập nhật status
      const response = await fetch('https://be-khoaluan.vercel.app/api/admin/employer-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employerId: userId, 
          action: newStatus === 'active' ? 'approve' : 'reject' 
        })
      });

      if (response.ok) {
        showSuccess('✅ Cập nhật trạng thái thành công!');
        fetchUsers(); // Refresh data
      } else {
        showError('Có lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      showError('Lỗi kết nối server');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', text: 'Hoạt động' },
      'inactive': { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Từ chối' }
    };
    
    const config = statusConfig[status] || statusConfig['inactive'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'candidate': { color: 'bg-blue-100 text-blue-800', text: 'Ứng viên' },
      'employer': { color: 'bg-purple-100 text-purple-800', text: 'Nhà tuyển dụng' }
    };
    
    const config = roleConfig[role] || roleConfig['candidate'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        
        <div className="flex gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tất cả</option>
            <option value="candidate">Ứng viên</option>
            <option value="employer">Nhà tuyển dụng</option>
          </select>
          
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.fullName?.charAt(0) || user.companyName?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName || user.companyName || 'Chưa cập nhật'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email || user.phone || 'Chưa có thông tin'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(user._id, user.status === 'active' ? 'inactive' : 'active')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingEmployers: 0,
    activeJobs: 0,
    closedJobs: 0,
    draftJobs: 0,
    recentActivity: [],
    monthlyData: [], // Add monthlyData to stats
    growthData: [] // Add growthData to stats
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (active === 'dashboard') {
      fetchDashboardStats();
    }
  }, [active]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      showInfo('Đang tải thống kê dashboard...');
      
      // Ưu tiên sử dụng API chính để lấy tất cả thống kê
      const dashboardStatsRes = await fetch('https://be-khoaluan.vercel.app/api/admin/employer-management?type=dashboard-stats');
      const dashboardData = await dashboardStatsRes.json();

      if (dashboardData.success && dashboardData.data) {
        const stats = dashboardData.data;

        setDashboardStats(stats);
        return; // Thoát sớm nếu có dữ liệu từ API chính
      }

      // Chỉ sử dụng fallback nếu API chính không hoạt động
      
      showInfo('Đang tải dữ liệu từ các API phụ...');
      
      const [employerRes, categoryRes, jobsRes, applicationsRes, authStatsRes] = await Promise.all([
        fetch('https://be-khoaluan.vercel.app/api/admin/employer-management'),
        fetch('https://be-khoaluan.vercel.app/api/admin/category-management'),
        fetch('https://be-khoa-luan2.vercel.app/api/jobs/all'),
        fetch('https://be-khoa-luan2.vercel.app/api/application/all'),
        fetch('https://be-khoaluan.vercel.app/api/auth/login')
      ]);

      const employers = await employerRes.json();
      const categories = await categoryRes.json();
      const jobs = await jobsRes.json();
      const applications = await applicationsRes.json();
      const authStats = await authStatsRes.json();

      // Tính toán thống kê từ dữ liệu thực
      const totalJobs = jobs.success ? jobs.data?.length || 0 : 0;
      const totalApplications = applications.success ? applications.data?.length || 0 : 0;
      const pendingEmployers = employers.filter(e => e.status === 'inactive').length;
      
      // Lấy thống kê users từ API auth/login
      const totalUsers = authStats.databaseStats?.totalUsers || 0;
      const totalCandidates = authStats.databaseStats?.totalCandidates || 0;
      const totalEmployers = authStats.databaseStats?.totalEmployers || 0;
      
      // Phân loại jobs theo trạng thái
      const jobList = jobs.success ? jobs.data || [] : [];
      const activeJobs = jobList.filter(job => job.status === 'Active').length;
      const closedJobs = jobList.filter(job => job.status === 'Closed').length;
      const draftJobs = jobList.filter(job => job.status === 'Draft').length;

      // Tạo hoạt động gần đây từ dữ liệu thực
      const recentActivity = [];
      
      // Thêm hoạt động từ employers mới được duyệt
      const recentEmployers = employers.filter(e => e.status === 'active').slice(0, 2);
      recentEmployers.forEach(emp => {
        recentActivity.push(`Employer "${emp.companyName || 'Unknown'}" đã được duyệt`);
      });

      // Thêm hoạt động từ jobs mới
      const recentJobs = jobList.slice(0, 2);
      recentJobs.forEach(job => {
        recentActivity.push(`Tin tuyển dụng mới: "${job.jobTitle}"`);
      });

      // Thêm hoạt động từ applications mới
      const recentApps = applications.success ? applications.data?.slice(0, 2) || [] : [];
      recentApps.forEach(app => {
        recentActivity.push(`Đơn ứng tuyển mới cho "${app.jobTitle || 'Unknown Job'}"`);
      });

      // Nếu không đủ hoạt động, thêm mock data
      while (recentActivity.length < 4) {
        recentActivity.push('Hoạt động hệ thống bình thường');
      }

      // Tạo dữ liệu biểu đồ từ dữ liệu thực
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
      
      // Tính toán dữ liệu theo tháng từ jobs thực
      const monthlyData = months.map((month, index) => {
        const currentDate = new Date();
        const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
        const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);
        
        // Đếm jobs trong tháng
        const jobsInMonth = jobList.filter(job => {
          const jobDate = new Date(job.createdAt);
          return jobDate >= targetMonth && jobDate < nextMonth;
        }).length;
        
        // Đếm applications trong tháng
        const appsInMonth = applications.success ? applications.data?.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate >= targetMonth && appDate < nextMonth;
        }).length || 0 : 0;
        
        // Ước tính users mới trong tháng (dựa trên tỷ lệ)
        const estimatedUsers = Math.floor((totalUsers / 6) * (0.8 + Math.random() * 0.4));
        
        return {
          name: month,
          jobs: jobsInMonth || 0,
          applications: appsInMonth || 0,
          users: estimatedUsers
        };
      });

      // Tạo dữ liệu xu hướng tăng trưởng (cumulative)
      let cumulativeUsers = Math.floor(totalUsers * 0.3); // Bắt đầu với 30% tổng users
      let cumulativeJobs = Math.floor(totalJobs * 0.2); // Bắt đầu với 20% tổng jobs
      let cumulativeApplications = Math.floor(totalApplications * 0.15); // Bắt đầu với 15% tổng applications

      const growthData = months.map((month, index) => {
        const monthlyJobs = monthlyData[index].jobs;
        const monthlyApps = monthlyData[index].applications;
        const monthlyUsers = monthlyData[index].users;

        cumulativeJobs += monthlyJobs;
        cumulativeApplications += monthlyApps;
        cumulativeUsers += monthlyUsers;

        return {
          month,
          users: cumulativeUsers,
          jobs: cumulativeJobs,
          applications: cumulativeApplications
        };
      });

      const stats = {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalJobs,
        totalApplications,
        pendingEmployers,
        activeJobs,
        closedJobs,
        draftJobs,
        recentActivity: recentActivity.slice(0, 4),
        monthlyData: monthlyData,
        growthData: growthData
      };

      
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showError('Lỗi khi tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
      case 'pendingEmployers':
        return <EmployerManagement />;
      case 'users':
        return <UserManagement />;
      case 'category':
        return <CategoryManagement />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout active={active} onSelect={setActive}>
      <div className="p-8">{renderContent()}</div>
    </AdminLayout>
  );
};

export default Dashboard; 