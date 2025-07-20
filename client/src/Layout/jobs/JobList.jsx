import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../shared/Header';
import Footer from '../../components/Footer';
import JobCard from './JobCard';
import SearchBar from './SearchBar';

const JobList = ({ keyword = '' }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  useEffect(() => {
    fetchJobs();
  }, [searchKeyword]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/all?keyword=${searchKeyword}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách việc làm...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600">Lỗi: {error}</p>
              <button 
                onClick={fetchJobs}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <SearchBar setKeyword={setSearchKeyword} />
          
          {/* Job List Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchKeyword ? `Kết quả tìm kiếm cho "${searchKeyword}"` : 'Tất cả việc làm'}
            </h1>
            <p className="text-gray-600">
              {jobs.length} việc làm được tìm thấy
            </p>
          </div>

          {/* Job Cards */}
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy việc làm
              </h3>
              <p className="text-gray-600">
                {searchKeyword 
                  ? `Không có việc làm nào phù hợp với từ khóa "${searchKeyword}"`
                  : 'Hiện tại chưa có việc làm nào được đăng tải'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobList; 