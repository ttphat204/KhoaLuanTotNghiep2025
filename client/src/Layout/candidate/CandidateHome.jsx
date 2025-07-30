import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../shared/CommonLayout';
import { useAuth } from '../../context/AuthContext';
import { FaBriefcase, FaFire, FaChevronLeft, FaChevronRight, FaBuilding, FaMapMarkerAlt, FaIndustry, FaUsers } from 'react-icons/fa';
import JobCard from '../jobs/JobCard';
import SearchBar from '../jobs/SearchBar';
import { showError } from '../../utils/toast';


// Utility function to check if job is active (not expired)
const isJobActive = (job) => {
  if (!job.applicationDeadline) return true; // No deadline = always active
  const currentDate = new Date();
  const deadline = new Date(job.applicationDeadline);
  return deadline > currentDate;
};

// Job List Component
const JobList = ({ jobs, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách việc làm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FaBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Lỗi: {error}</p>
        </div>
        <button
          onClick={onRetry}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FaBriefcase className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không có việc làm nào đang tuyển
        </h3>
        <p className="text-gray-600">
          Hiện tại chưa có việc làm nào đang tuyển hoặc tất cả đã hết hạn
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

// Urgent Jobs Filter Component
const UrgentJobsFilter = ({ selectedCategory, onCategoryChange }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    // Fetch categories from API
    fetch('https://be-khoaluan.vercel.app/api/admin/category-management')
      .then(res => res.json())
      .then(data => {
        console.log('Categories from API:', data.categories); // Debug log
        const categoriesData = data.categories || [];
        setCategories(categoriesData);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        // Fallback categories if API fails
        setCategories([
          'Thu mua - Kho Vận - Chuỗi cung ứng',
          'Khoa học - Kỹ thuật',
          'Nhân sự',
          'Kế toán',
          'Bán sỉ - Bán lẻ - Quản lý cửa hàng',
          'Chăm sóc khách hàng'
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  // Check if scroll arrows should be visible
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
      };

      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  return (
    <div>
      {/* Enhanced Category Filter Container */}
      <div className="relative">
        {/* Gradient Overlay for Arrows */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                  {/* Enhanced Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-blue-100"
            >
              <FaChevronLeft className="w-4 h-4 text-blue-600" />
            </button>
          )}

          {/* Enhanced Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-blue-100"
            >
              <FaChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          )}

        {/* Enhanced Filter Buttons */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={() => {
            const container = scrollContainerRef.current;
            if (container) {
              setShowLeftArrow(container.scrollLeft > 0);
              setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
              );
            }
          }}
        >
          {/* Enhanced "All" Button */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-8 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Tất cả
            </span>
          </button>

          {/* Enhanced Category Buttons */}
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="px-8 py-3 rounded-xl bg-gray-100 animate-pulse"
                style={{ width: '140px' }}
              >
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            categories.map((cat, index) => (
              <button
                key={cat._id || cat}
                onClick={() => onCategoryChange(cat._id || cat)}
                className={`px-8 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === (cat._id || cat)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
                title={cat.name || cat}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedCategory === (cat._id || cat) ? 'bg-white' : 'bg-blue-400'
                  }`}></span>
                  {cat.name || cat}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Job list states
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Đã xóa state featuredCompanies

  // Fetch jobs function
  const fetchJobs = useCallback(async () => {
    try {
      setJobsLoading(true);
      setJobsError(null);
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/all');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      // API trả về data.data hoặc data.jobs
      const jobsData = data.data || data.jobs || [];

      // Lọc bỏ những job đã hết hạn
      const activeJobs = jobsData.filter(isJobActive);

      setJobs(activeJobs);
      setFilteredJobs(activeJobs);
      // Đã xóa logic lấy featuredCompanies
    } catch (error) {
      setJobsError(error.message);
      showError('Lỗi khi tải danh sách việc làm');
    } finally {
      setJobsLoading(false);
    }
  }, []);

  // Filter jobs based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => {
        if (typeof job.categoryId === 'object') {
          return job.categoryId._id === selectedCategory;
        }
        return job.categoryId === selectedCategory;
      });
      setFilteredJobs(filtered);
    }
  }, [selectedCategory, jobs]);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <CommonLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section with Search */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-indigo-600/8"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-2 py-6">
            {/* Search Bar */}
            <div className="mb-2">
              <SearchBar setKeyword={setSearchKeyword} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 pb-12 -mt-1">
          {/* Đã xóa section Công ty nổi bật */}

          {/* Connection Area */}
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none"></div>
          </div>

          {/* Unified Content Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
            {/* Top Connection */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full"></div>
            {/* Urgent Jobs Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FaFire className="text-2xl animate-pulse text-yellow-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Việc làm tuyển gấp</h1>
                    <p className="text-emerald-100 text-lg">Khám phá những cơ hội việc làm hấp dẫn nhất hiện tại</p>
                    <p className="text-emerald-200 text-sm mt-1">✨ Chỉ hiển thị việc làm đang tuyển</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">⚡ Hot</span>
                  <span className="text-xs">Cập nhật hàng giờ</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-blue-50/50 relative z-10">
              <UrgentJobsFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Jobs Results */}
            <div className="p-8 bg-gradient-to-br from-white to-blue-50/30">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Kết quả tìm kiếm</h2>
                    <p className="text-gray-600 text-sm">
                      {jobsLoading ? 'Đang tải...' : `${filteredJobs.length} việc làm đang tuyển được tìm thấy`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Đang cập nhật</span>
                </div>
              </div>

              {/* Jobs List */}
              <JobList 
                jobs={filteredJobs}
                loading={jobsLoading}
                error={jobsError}
                onRetry={fetchJobs}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </CommonLayout>
  );
};
