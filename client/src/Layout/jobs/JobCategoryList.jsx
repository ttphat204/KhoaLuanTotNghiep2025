import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegHeart, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import Header from '../shared/Header';

const CATEGORY_API = 'https://be-khoaluan.vercel.app/api/admin/category-management';
const JOB_API = 'https://be-khoaluan.vercel.app/api/job/all';

function getDeadline(expireDate) {
  if (!expireDate) return '';
  const today = new Date();
  const end = new Date(expireDate);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `Còn ${diff} ngày` : 'Hết hạn';
}

function formatSalary(min, max) {
  if (!min || !max) return 'Thoả thuận';
  const minVal = min > 1000 ? Math.round(min / 1e6) : min;
  const maxVal = max > 1000 ? Math.round(max / 1e6) : max;
  return `${minVal} - ${maxVal} triệu`;
}

const JobCategoryList = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category info
    fetch(CATEGORY_API)
      .then(res => res.json())
      .then(data => {
        const found = (data.categories || []).find(cat => cat.slug === slug);
        if (!found) {
          // Nếu không tìm thấy category, chuyển hướng đến trang chính
          navigate('/jobs');
          return;
        }
        setCategory(found);
      })
      .catch(error => {
        console.error('Error fetching category:', error);
        navigate('/jobs');
      });
  }, [slug, navigate]);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(JOB_API + '?limit=1000')
      .then(res => res.json())
      .then(data => {
        const allJobs = data.data || data.jobs || [];
        const filtered = allJobs.filter(job => {
          if (typeof job.categoryId === 'object') {
            return job.categoryId._id === category._id;
          }
          return job.categoryId === category._id;
        });
        setJobs(filtered);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [category]);

  // Nếu chưa có category, hiển thị loading
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
        {/* Breadcrumb + Tiêu đề trong khung */}
        <div className="bg-white rounded-3xl shadow p-8 mb-8">
          <div className="text-gray-400 text-sm font-semibold mb-2">
            Trang Chủ / Tuyển Dụng {jobs.length.toLocaleString()} Việc Làm {category.name} Mới Nhất Năm 2025
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Tuyển dụng <span className="text-blue-600">{jobs.length.toLocaleString()}</span> việc làm <span className="text-blue-700">{category.name}</span> mới nhất năm <span className="font-bold">2025</span>
          </h1>
        </div>
        {/* Filter (có thể thêm filter nâng cao sau) */}
        {/* Danh sách jobs */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Không có công việc nào.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.map((job, idx) => {
              const companyName = job.employerId?.companyName || job.companyName || 'Không xác định';
              const companyLogoUrl = job.employerLogo || job.employerId?.companyLogoUrl || job.companyLogoUrl || '/default-logo.png';
              const salary = job.salaryRange?.min && job.salaryRange?.max
                ? formatSalary(job.salaryRange.min, job.salaryRange.max)
                : 'Thoả thuận';
              const location = typeof job.location === 'string'
                ? job.location
                : [job.location?.addressDetail, job.location?.district, job.location?.province].filter(Boolean).join(', ');
              // Badge logic demo
              const badgeReply = job.replyTime ? `Phản hồi trong ${job.replyTime} giờ` : null;
              const badgeNoCV = job.noCV ? 'Không cần CV' : null;
              return (
                <div key={job._id || idx} className="relative bg-white border border-blue-200 rounded-2xl flex items-center px-6 py-6 min-h-[100px] group transition-all duration-200 hover:border-blue-400 cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
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
                      <span>{getDeadline(job.applicationDeadline)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default JobCategoryList; 