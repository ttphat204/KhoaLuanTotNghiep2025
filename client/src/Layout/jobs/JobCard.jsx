import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getDeadline(expireDate) {
  if (!expireDate) return '';
  const today = new Date();
  const end = new Date(expireDate);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `Còn ${diff} ngày` : 'Hết hạn';
}

function getSalary(salaryRange) {
  if (!salaryRange?.min || !salaryRange?.max) return 'Thoả thuận';
  const min = salaryRange.min > 1000 ? (salaryRange.min / 1e6) : salaryRange.min;
  const max = salaryRange.max > 1000 ? (salaryRange.max / 1e6) : salaryRange.max;
  return `${min} - ${max} triệu`;
}

function getLocation(location) {
  if (!location) return '';
  if (typeof location === 'string') return location;
  return [location.addressDetail, location.district, location.province].filter(Boolean).join(', ');
}

const JobCard = ({ job }) => {
  const [isHeartHover, setIsHeartHover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const companyName = job.employerId?.companyName || job.companyName || 'Không xác định';
  const companyLogoUrl = job.employerLogo || job.employerId?.companyLogoUrl || job.companyLogoUrl || '/default-logo.png';

  const handleCardClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#e0e7ef] shadow-md p-5 flex flex-col min-h-[170px] transition-all duration-200 hover:border-[#2C95FF] hover:shadow-xl relative cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') handleCardClick(); }}
    >
      {/* Tiêu đề + icon lưu */}
      <div className="flex items-start justify-between mb-2">
        <div className="font-semibold text-lg md:text-xl text-[#222] leading-tight line-clamp-1">{job.jobTitle}</div>
        <button
          className="text-blue-500 hover:text-red-500"
          onMouseEnter={e => { e.stopPropagation(); setIsHeartHover(true); setShowTooltip(true); }}
          onMouseLeave={e => { e.stopPropagation(); setIsHeartHover(false); setShowTooltip(false); }}
          onClick={e => e.stopPropagation()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C95FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {showTooltip && (
            <span className="absolute -top-8 right-1 bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap z-20">Lưu tin</span>
          )}
        </button>
      </div>
      {/* Logo + Thông tin công ty */}
      <div className="flex items-center gap-4">
        {/* Logo bên trái */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <img
            src={companyLogoUrl}
            alt="logo"
            className="w-14 h-14 object-cover rounded-lg border bg-white shadow-sm"
          />
        </div>
        {/* Thông tin bên phải */}
        <div className="flex flex-col justify-center flex-1">
          <span className="text-base font-semibold text-[#2C95FF] mb-1">{companyName}</span>
          <span className="text-[15px] text-[#2C95FF] font-medium mb-1">{getSalary(job.salaryRange)}</span>
          <span className="text-[15px] text-gray-600">{getLocation(job.location)}</span>
        </div>
      </div>
      {/* Đường kẻ ngang */}
      <div className="w-full h-[1px] bg-[#E7E7E8] my-2" />
      {/* Hạn nộp hồ sơ - bên phải */}
      <div className="flex items-center text-xs text-gray-500 justify-end">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#939295" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
        <span>{getDeadline(job.applicationDeadline)}</span>
      </div>
    </div>
  );
};

export default JobCard; 