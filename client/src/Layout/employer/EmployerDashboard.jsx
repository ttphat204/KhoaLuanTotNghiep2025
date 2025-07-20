import React, { useState, useEffect } from 'react';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

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
      purple: {
        bg: 'rgba(139, 92, 246, 0.8)',
        border: 'rgba(139, 92, 246, 1)',
        hover: 'rgba(139, 92, 246, 0.9)'
      },
      green: {
        bg: 'rgba(16, 185, 129, 0.8)',
        border: 'rgba(16, 185, 129, 1)',
        hover: 'rgba(16, 185, 129, 0.9)'
      },
      blue: {
        bg: 'rgba(59, 130, 246, 0.8)',
        border: 'rgba(59, 130, 246, 1)',
        hover: 'rgba(59, 130, 246, 0.9)'
      },
      indigo: {
        bg: 'rgba(99, 102, 241, 0.8)',
        border: 'rgba(99, 102, 241, 1)',
        hover: 'rgba(99, 102, 241, 0.9)'
      }
    };
    return colors[color] || colors.indigo;
  };

  const colors = getColorByType(color);
  
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: colors.hover,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Số đơn: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// Component biểu đồ tròn
const DoughnutChart = ({ data, title }) => {
  const colors = [
    'rgba(99, 102, 241, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(236, 72, 153, 0.8)',
  ];

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div style={{ height: '350px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

// Component biểu đồ đường
const LineChart = ({ data, title, color = "blue" }) => {
  const getColorByType = (type) => {
    const colors = {
      blue: {
        border: 'rgba(59, 130, 246, 1)',
        bg: 'rgba(59, 130, 246, 0.1)',
        point: 'rgba(59, 130, 246, 1)'
      },
      purple: {
        border: 'rgba(139, 92, 246, 1)',
        bg: 'rgba(139, 92, 246, 0.1)',
        point: 'rgba(139, 92, 246, 1)'
      },
      green: {
        border: 'rgba(16, 185, 129, 1)',
        bg: 'rgba(16, 185, 129, 0.1)',
        point: 'rgba(16, 185, 129, 1)'
      }
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorByType(color);
  
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        borderColor: colors.border,
        backgroundColor: colors.bg,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.point,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
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
        <FaChartLine className="text-4xl text-orange-200" />
      </div>
    </div>
  </div>
);

// Component thống kê chi tiết
const DetailedStats = ({ chartData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-indigo-500" />
        Thống kê tháng này
      </h3>
      <div className="space-y-3">
        {chartData.applicationsByMonth.slice(-1).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">{item.label}</span>
            <span className="text-2xl font-bold text-indigo-600">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaUsers className="text-green-500" />
        Trạng thái hiện tại
      </h3>
      <div className="space-y-2">
        {chartData.applicationsByStatus.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaBriefcase className="text-purple-500" />
        Việc làm hot nhất
      </h3>
      <div className="space-y-2">
        {chartData.topJobs.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
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
      // Fetch profile
      const profileRes = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`);
      const profileData = await profileRes.json();
      if (profileData.success) setProfile(profileData.data);

      // Fetch jobs
      const jobsRes = await fetch('https://be-khoa-luan2.vercel.app/api/jobs/all');
      const jobsData = await jobsRes.json();
      const jobs = jobsData.success ? jobsData.data : [];

      // Fetch applications
      const appsRes = await fetch('https://be-khoa-luan2.vercel.app/api/application/all');
      const appsData = await appsRes.json();
      const applications = appsData.success ? appsData.data : [];

      // Calculate stats
      const totalJobs = jobs.length;
      const totalApplications = applications.length;
      const hiredCount = applications.filter(app => app.status === 'Hired').length;
      const successRate = totalApplications > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0;

      setStats({ totalJobs, totalApplications, hiredCount, successRate });

      // Prepare chart data
      const statusCounts = {};
      const monthCounts = {};
      const jobCounts = {};

      // Status mapping for Vietnamese
      const statusLabels = {
        'Pending': 'Chờ xử lý',
        'Reviewed': 'Đã xem xét',
        'Interviewing': 'Đang phỏng vấn',
        'Offer': 'Đã đề nghị',
        'Rejected': 'Đã từ chối',
        'Hired': 'Đã tuyển'
      };

      applications.forEach(app => {
        // Status counts with Vietnamese labels
        const status = app.status || 'Pending';
        const statusLabel = statusLabels[status] || status;
        statusCounts[statusLabel] = (statusCounts[statusLabel] || 0) + 1;

        // Month counts - get last 6 months
        const date = new Date(app.createdAt || app.appliedAt || Date.now());
        if (!isNaN(date.getTime())) {
          const month = date.toLocaleDateString('vi-VN', { month: 'short' });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        }

        // Job counts
        const jobTitle = app.jobTitle || 'Không xác định';
        jobCounts[jobTitle] = (jobCounts[jobTitle] || 0) + 1;
      });

      // Generate last 6 months data
      const currentDate = new Date();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const month = date.toLocaleDateString('vi-VN', { month: 'short' });
        last6Months.push(month);
      }

      // Create month counts with actual data or default to 0
      const sortedMonthCounts = {};
      last6Months.forEach(month => {
        sortedMonthCounts[month] = monthCounts[month] || 0;
      });

      setChartData({
        applicationsByStatus: Object.entries(statusCounts).map(([status, count]) => ({
          label: status,
          value: count
        })),
        applicationsByMonth: Object.entries(sortedMonthCounts).map(([month, count]) => ({
          label: month,
          value: count
        })),
        topJobs: Object.entries(jobCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([job, count]) => ({
            label: job.length > 30 ? job.substring(0, 30) + '...' : job,
            value: count
          }))
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
            data={chartData.applicationsByStatus} 
            title="Phân bố trạng thái ứng viên" 
          />
          <LineChart 
            data={chartData.applicationsByMonth} 
            title="Xu hướng đơn ứng tuyển theo tháng" 
            color="blue" 
          />
        </div>

        {/* Top Jobs Chart */}
        <div className="mb-8">
          <BarChart 
            data={chartData.topJobs} 
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