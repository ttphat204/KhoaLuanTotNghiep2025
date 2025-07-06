import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';

const CATEGORY_API = 'https://be-khoaluan.vercel.app/api/admin/category-management';
const JOB_API = 'https://be-khoaluan.vercel.app/api/job/all';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('all');
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const tagScrollRef = useRef(null);

  // Lấy danh mục động từ API
  useEffect(() => {
    fetch(CATEGORY_API)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  // Fetch jobs theo danh mục
  useEffect(() => {
    setLoading(true);
    let url = JOB_API;
    if (selected !== 'all') url += `?categoryId=${selected}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && (data.success || data.jobs)) {
          setJobs(data.data || data.jobs || []);
        } else {
          setJobs([]);
        }
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [selected]);

  // Scroll ngang cho danh mục
  const handleScrollTags = (direction) => {
    if (tagScrollRef.current) {
      tagScrollRef.current.scrollBy({
        left: direction === 'next' ? 200 : -200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full bg-[#e8effc] mt-8">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* Tiêu đề và filter tags */}
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-800">
            <span className="text-4xl">🔥</span>
            Việc làm tuyển gấp
          </div>
          <div className="flex items-center gap-2 mb-2">
            {/* Nút prev */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f1fd] text-[#a78bfa] hover:bg-[#ede9fe] transition mr-1 shrink-0"
              onClick={() => handleScrollTags('prev')}
              type="button"
              aria-label="Xem danh mục trước"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap scrollbar-hide overflow-x-hidden w-full" ref={tagScrollRef}>
              <button
                className={`font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition whitespace-nowrap ${selected === 'all' ? 'bg-[#7c3aed] text-white' : 'bg-[#f4f1fd] text-[#7c3aed] hover:bg-[#ede9fe]'}`}
                onClick={() => setSelected('all')}
                aria-label="Tất cả việc làm"
              >Tất cả</button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  className={`font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition whitespace-nowrap ${selected === cat._id ? 'bg-[#7c3aed] text-white' : 'bg-[#f4f1fd] text-[#7c3aed] hover:bg-[#ede9fe]'}`}
                  onClick={() => setSelected(cat._id)}
                  aria-label={cat.name}
                >{cat.name}</button>
              ))}
            </div>
            {/* Nút next */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f1fd] text-[#a78bfa] hover:bg-[#ede9fe] transition ml-1 shrink-0"
              onClick={() => handleScrollTags('next')}
              type="button"
              aria-label="Xem danh mục tiếp"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">Đang tải danh sách việc làm...</div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 py-4"
        >
          {jobs.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-8">Không có công việc nào.</div>
          )}
          {jobs.map((job, idx) => (
            <JobCard key={job._id || idx} job={job} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JobList; 