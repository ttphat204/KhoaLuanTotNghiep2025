import React, { useState, useEffect } from 'react';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { showSuccess, showError, showInfo } from '../../utils/toast';

const InfoBox = ({ icon, label, value, color, link }) => (
  <div className={`flex items-center gap-3 rounded-xl p-4 mb-3`} style={{ background: color }}>
    <span className="text-2xl">{icon}</span>
    <div>
      <div className="font-semibold text-gray-700">{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">{value}</a>
      ) : (
        <div className="text-gray-800 font-medium">{value}</div>
      )}
    </div>
  </div>
);

// Component biểu đồ cột
const BarChart = ({ data, title, color = "indigo" }) => {
  const getColorByType = (type) => {
    const colors = {
      purple: '#8B5CF6',
      green: '#10B981',
      blue: '#3B82F6',
      indigo: '#6366F1'
    };
    return colors[color] || colors.indigo;
  };

  const barColor = getColorByType(color);
  
  // Đảm bảo có dữ liệu, nếu không thì tạo dữ liệu mẫu
  const chartData = data && data.length > 0 ? data : [
    { name: 'Job 1', value: 0 },
    { name: 'Job 2', value: 0 },
    { name: 'Job 3', value: 0 },
    { name: 'Job 4', value: 0 },
    { name: 'Job 5', value: 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        {title}
      </h3>
      
      <div className="h-80 flex items-center justify-center">
        {chartData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #fff',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="value" 
                fill={barColor}
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500">
            <div className="w-32 h-32 border-4 border-gray-200 border-dashed rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm">Chưa có dữ liệu top jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component biểu đồ tròn
const DoughnutChart = ({ data, title }) => {
  console.log('DoughnutChart received data:', data); // Debug log
  console.log('DoughnutChart data type:', typeof data); // Debug log
  console.log('DoughnutChart data length:', data ? data.length : 'undefined'); // Debug log
  
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  // Đảm bảo có dữ liệu, nếu không thì tạo dữ liệu mẫu
  const chartData = data && data.length > 0 ? data : [
    { name: 'Chờ xử lý', value: 0 },
    { name: 'Đang phỏng vấn', value: 0 },
    { name: 'Đã đề nghị', value: 0 },
    { name: 'Đã tuyển', value: 0 },
    { name: 'Đã từ chối', value: 0 }
  ];

  console.log('Processed chartData:', chartData); // Debug log
  console.log('ChartData has values > 0:', chartData.some(item => item.value > 0)); // Debug log
  console.log('ChartData values:', chartData.map(item => `${item.name}: ${item.value}`)); // Debug log

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        {title}
      </h3>
      
      <div className="h-80 flex items-center justify-center">
        {chartData.some(item => item.value > 0) ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid #fff',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => <span style={{ color: '#6B7280' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="w-32 h-32 border-4 border-gray-200 border-dashed rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm">Chưa có dữ liệu ứng tuyển</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component biểu đồ đường
const LineChart = ({ data, title, color = "blue" }) => {
  console.log('LineChart data:', data); // Debug log
  
  const getColorByType = (type) => {
    const colors = {
      purple: '#8B5CF6',
      green: '#10B981',
      blue: '#3B82F6'
    };
    return colors[color] || colors.blue;
  };

  const lineColor = getColorByType(color);
  
  // Đảm bảo có dữ liệu, nếu không thì tạo dữ liệu mẫu
  const chartData = data && data.length > 0 ? data : [
    { name: 'Tháng 1', value: 0 },
    { name: 'Tháng 2', value: 0 },
    { name: 'Tháng 3', value: 0 },
    { name: 'Tháng 4', value: 0 },
    { name: 'Tháng 5', value: 0 },
    { name: 'Tháng 6', value: 0 }
  ];

  console.log('Processed chartData:', chartData); // Debug log

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        {title}
      </h3>
      
      <div className="h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #fff',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor} 
              strokeWidth={3}
              fill={lineColor}
              fillOpacity={0.1}
              dot={{ fill: lineColor, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: lineColor, strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component thống kê tổng quan
const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Tổng việc làm</p>
          <p className="text-3xl font-bold">{stats.totalJobs}</p>
          <p className="text-blue-200 text-xs mt-1">Tin đã đăng</p>
        </div>
        <FaBriefcase className="text-4xl text-blue-200" />
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-sm font-medium">Đơn ứng tuyển</p>
          <p className="text-3xl font-bold">{stats.totalApplications}</p>
          <p className="text-purple-200 text-xs mt-1">CV đã nhận</p>
        </div>
        <FaFileAlt className="text-4xl text-purple-200" />
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Đã tuyển</p>
          <p className="text-3xl font-bold">{stats.hiredCount}</p>
          <p className="text-green-200 text-xs mt-1">Thành công</p>
        </div>
        <FaUsers className="text-4xl text-green-200" />
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Tỷ lệ thành công</p>
          <p className="text-3xl font-bold">{stats.successRate}%</p>
          <p className="text-orange-200 text-xs mt-1">Hiệu quả</p>
        </div>
                        <FaChartBar className="text-4xl text-orange-200" />
      </div>
    </div>
  </div>
);

// Component thống kê chi tiết
const DetailedStats = ({ chartData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {/* Đã xóa 3 trường thống kê:
    - Thống kê tháng này
    - Trạng thái hiện tại  
    - Việc làm hot nhất
    */}
  </div>
);

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    hiredCount: 0,
    successRate: 0
  });
  const [chartData, setChartData] = useState({
    applicationsByStatus: [],
    applicationsByMonth: [],
    topJobs: []
  });

  useEffect(() => {
    if (user && user._id) {
      setLoading(true);
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      showInfo('Đang tải dữ liệu dashboard...');
      
      console.log('Fetching dashboard data for employerId:', user._id); // Debug log
      
      // Fetch profile
      const profileRes = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`);
      const profileData = await profileRes.json();
      console.log('Profile data:', profileData); // Debug log
      if (profileData.success) setProfile(profileData.data);

      // Fetch dashboard stats từ API mới
      const statsRes = await fetch(`https://be-khoa-luan2.vercel.app/api/employer-dashboard-stats?employerId=${user._id}`);
      console.log('Stats response status:', statsRes.status); // Debug log
      const statsData = await statsRes.json();
      console.log('Raw stats data:', statsData); // Debug log
      
      if (statsData.success) {
        const stats = statsData.data;
        
        console.log('Dashboard stats:', stats); // Debug log
        
        setStats({ 
          totalJobs: stats.totalJobs, 
          totalApplications: stats.totalApplications, 
          hiredCount: stats.hiredCount, 
          successRate: stats.successRate 
        });

        // Tạo dữ liệu cho biểu đồ từ thống kê
        const statusCounts = {
          'Chờ xử lý': stats.statusCounts.pending || 0,
          'Đang phỏng vấn': stats.statusCounts.interviewing || 0,
          'Đã đề nghị': stats.statusCounts.offer || 0,
          'Đã tuyển': stats.statusCounts.hired || 0,
          'Đã từ chối': stats.statusCounts.rejected || 0
        };

        console.log('Status counts:', statusCounts); // Debug log

        // Sử dụng dữ liệu từ API thay vì tạo dữ liệu mẫu
        const chartDataToSet = {
          applicationsByStatus: Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count
          })),
          applicationsByMonth: stats.monthlyData || [],
          topJobs: stats.topJobs || []
        };

        console.log('Final chart data:', chartDataToSet); // Debug log
        setChartData(chartDataToSet);
      } else {
        console.error('API returned error:', statsData); // Debug log
        showError('Không thể tải thống kê dashboard');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Lỗi khi tải dữ liệu dashboard! Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white">
        {/* Header gradient skeleton */}
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
          <div className="flex flex-col items-center flex-1">
            <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-2" style={{ width: '300px' }}></div>
            <div className="h-4 bg-white/20 rounded animate-pulse" style={{ width: '250px' }}></div>
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
                <p className="text-lg font-semibold text-gray-700 animate-pulse">Đang tải thông tin công ty...</p>
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
          
          
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-white">
        {/* Header gradient */}
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
          <div className="flex flex-col items-center flex-1">
            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight mb-1">Dashboard</div>
            <div className="text-white text-base drop-shadow">Quản lý thông tin công ty & tuyển dụng</div>
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
                <h3 className="text-xl font-bold text-gray-800">Không tìm thấy thông tin công ty</h3>
                <p className="text-gray-600">Vui lòng cập nhật thông tin công ty để sử dụng đầy đủ tính năng</p>
              </div>
              
              {/* Action button */}
              <div className="mt-6">
                <button
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                  onClick={() => setShowEdit(true)}
                >
                  Cập nhật thông tin ngay
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
          <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight mb-1">{profile.companyName}</div>
          <div className="text-white text-base drop-shadow">Quản lý thông tin công ty & tuyển dụng</div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 mt-8">
        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DoughnutChart 
            data={chartData.applicationsByStatus || []} 
            title="Phân bố trạng thái ứng viên" 
          />
          <LineChart 
            data={chartData.applicationsByMonth || []} 
            title="Xu hướng đơn ứng tuyển theo tháng" 
            color="blue" 
          />
        </div>

        {/* Top Jobs Chart */}
        <div className="mb-8">
          <BarChart 
            data={chartData.topJobs || []} 
            title="Top 5 việc làm được ứng tuyển nhiều nhất" 
            color="green" 
          />
        </div>

        {/* Detailed Stats */}
        <DetailedStats chartData={chartData} />


      </div>

    </div>
  );
};

export default EmployerDashboard; 