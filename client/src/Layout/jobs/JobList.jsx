import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';

const JobList = ({ filters }) => {
  const [jobs, setJobs] = useState([]);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Fetch jobs từ API khi component mount
  useEffect(() => {
    fetch('https://be-khoaluan.vercel.app/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

  // Ref cho container filter tags
  const tagScrollRef = useRef(null);

  // Hàm scroll khi bấm prev/next
  const handleScrollTags = (direction) => {
    if (tagScrollRef.current) {
      tagScrollRef.current.scrollBy({
        left: direction === 'next' ? 200 : -200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full bg-[#e8effc]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Tiêu đề và filter tags */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-800">
            <span className="text-4xl">🔥</span>
            Việc làm tuyển gấp
          </div>
          <div className="flex items-center gap-2 mb-6">
            {/* Nút prev */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f1fd] text-[#a78bfa] hover:bg-[#ede9fe] transition mr-1 shrink-0"
              onClick={() => handleScrollTags('prev')}
              type="button"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap scrollbar-hide overflow-x-hidden w-full" ref={tagScrollRef}>
              <button className="bg-[#7c3aed] text-white font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition whitespace-nowrap">Tất cả</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Bán hàng - Kinh doanh</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Hành chính - Thư ký</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Chăm sóc khách hàng</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Bán sỉ - Bán lẻ - Quản lý cửa hàng</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Kế toán</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Nhân sự</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Khoa học - Kỹ thuật</button>
              <button className="bg-[#f4f1fd] text-[#7c3aed] font-semibold px-4 py-1.5 text-sm rounded-[2rem] shadow-sm transition hover:bg-[#ede9fe] whitespace-nowrap">Thu mua - Kho Vận - Chuỗi cung ứng</button>
            </div>
            {/* Nút next */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f1fd] text-[#a78bfa] hover:bg-[#ede9fe] transition ml-1 shrink-0"
              onClick={() => handleScrollTags('next')}
              type="button"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8"
      >
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </motion.div>
    </div>
  );
};

export default JobList; 