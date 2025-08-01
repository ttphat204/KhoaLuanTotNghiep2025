import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../shared/Header';
import JobCard from './JobCard';
import { FaRegHeart, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const JOB_SEARCH_API = 'https://be-khoaluan.vercel.app/api/job/all';

const JobSearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim() && !location.trim()) return;
    setLoading(true);
    fetch(JOB_SEARCH_API)
      .then(res => res.json())
      .then(data => {
        const allJobs = data.data || data.jobs || [];
        // Lọc theo từ khóa và địa điểm
        const filtered = allJobs.filter(job => {
          // Lọc theo từ khóa
          const matchesKeyword = !keyword.trim() ||
            job.jobTitle?.toLowerCase().includes(keyword.toLowerCase()) ||
            job.employerId?.companyName?.toLowerCase().includes(keyword.toLowerCase()) ||
            job.description?.toLowerCase().includes(keyword.toLowerCase());
          
          // Lọc theo địa điểm
          const matchesLocation = !location.trim() || (() => {
            const locationLower = location.toLowerCase();
            const jobLocation = job.location;
            
            // Kiểm tra các trường địa điểm khác nhau
            if (typeof jobLocation === 'string') {
              return jobLocation.toLowerCase().includes(locationLower);
            }
            
            // Kiểm tra object location
            const addressDetail = jobLocation?.addressDetail?.toLowerCase() || '';
            const district = jobLocation?.district?.toLowerCase() || '';
            const province = jobLocation?.province?.toLowerCase() || '';
            const city = jobLocation?.city?.toLowerCase() || '';
            
            // Kiểm tra từng phần của địa điểm
            return addressDetail.includes(locationLower) ||
              district.includes(locationLower) ||
              province.includes(locationLower) ||
              city.includes(locationLower) ||
              // Kiểm tra tên tỉnh/thành phố rút gọn
              province.includes(locationLower.replace('tp.', '').replace('thành phố ', '').replace('tỉnh ', '')) ||
              district.includes(locationLower.replace('quận ', '').replace('huyện ', '').replace('thị xã ', ''));
          })();
          
          return matchesKeyword && matchesLocation;
        });
        // Debug: Log một số job để kiểm tra cấu trúc location
        if (filtered.length > 0) {
          
          setJobs(filtered);
        }
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [keyword, location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto py-8 pt-20">
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="text-gray-400 text-sm mb-2">
            Trang Chủ / Tìm kiếm việc làm
            {keyword && ` / ${keyword}`}
            {location && location !== 'Toàn quốc' && ` / ${location}`}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Kết quả tìm kiếm cho: 
            {keyword && <span className="text-blue-600"> "{keyword}"</span>}
            {location && location !== 'Toàn quốc' && (
              <span className="text-green-600"> tại {location}</span>
            )}
          </h2>
          <div className="mt-2 text-gray-500 text-base">
            {loading ? null : jobs.length > 0
              ? `Tìm thấy ${jobs.length} công việc phù hợp${keyword ? ` với từ khóa "${keyword}"` : ''}${location && location !== 'Toàn quốc' ? ` tại ${location}` : ''}.`
              : `Không tìm thấy công việc nào phù hợp${keyword ? ` với từ khóa "${keyword}"` : ''}${location && location !== 'Toàn quốc' ? ` tại ${location}` : ''}.`}
          </div>
        </div>
        
        {/* Hiển thị bộ lọc hiện tại */}
        {(keyword || (location && location !== 'Toàn quốc')) && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6 border border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-600 font-medium">Bộ lọc hiện tại:</span>
              {keyword && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Từ khóa: {keyword}
                </span>
              )}
              {location && location !== 'Toàn quốc' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Địa điểm: {location}
                </span>
              )}
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Không tìm thấy công việc phù hợp.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.map((job, idx) => {
              const companyName = job.employerId?.companyName || job.companyName || 'Không xác định';
              // Lấy logo giống JobCategoryList.jsx
              const companyLogoUrl = job.employerLogo || job.employerId?.companyLogoUrl || job.companyLogoUrl || '/default-logo.png';
              // Hiển thị giá tiền giống JobCard.jsx
              let salary = 'Thoả thuận';
              if (job.salaryRange?.min && job.salaryRange?.max) {
                const min = job.salaryRange.min > 1000 ? (job.salaryRange.min / 1e6) : job.salaryRange.min;
                const max = job.salaryRange.max > 1000 ? (job.salaryRange.max / 1e6) : job.salaryRange.max;
                salary = `${min} - ${max} triệu`;
              }
              const location = typeof job.location === 'string'
                ? job.location
                : [job.location?.addressDetail, job.location?.district, job.location?.province].filter(Boolean).join(', ');
              // Debug logo
              
              return (
                <div key={job._id || idx} className="relative bg-white border border-blue-200 rounded-2xl flex items-center px-6 py-6 min-h-[100px] group transition-all duration-200 hover:border-blue-400 cursor-pointer">
                  {/* Logo */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center mr-4">
                    <img
                      src={companyLogoUrl}
                      alt="logo"
                      className="w-20 h-20 object-cover rounded-lg border bg-white shadow-sm"
                    />
                  </div>
                  {/* Thông tin job */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xl text-gray-900 leading-tight cursor-pointer truncate">
                          {job.jobTitle}
                        </div>
                        <div className="text-gray-500 text-base font-medium truncate mb-1">{companyName}</div>
                      </div>
                      {/* Icon yêu thích */}
                      <button className="ml-2 text-blue-200 hover:text-blue-500 transition-all text-xl">
                        <FaRegHeart />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 mt-1">
                      <span className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                        <FaMoneyBillWave className="inline-block text-xl" /> {salary}
                      </span>
                      {location && (
                        <span className="flex items-center gap-1 text-gray-700 text-lg">
                          <FaMapMarkerAlt className="inline-block text-xl" /> {location}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-[1px] bg-blue-100 my-2"></div>
                    <div className="flex items-center justify-end text-base text-gray-500">
                      <FaClock className="mr-1 text-lg" />
                      <span>Hết hạn</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchResultPage; 