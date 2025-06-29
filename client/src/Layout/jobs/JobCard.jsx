import { useState } from 'react';

function getDeadline(expireDate) {
  if (!expireDate) return 'x ngày';
  const today = new Date();
  const end = new Date(expireDate);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `Còn ${diff} ngày` : 'Hết hạn';
}

const JobCard = ({ job }) => {
  const [isHeartHover, setIsHeartHover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeadlineTooltip, setShowDeadlineTooltip] = useState(false);

  return (
    <div className="flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[#2C95FF] hover:shadow-lg transition-all duration-200">
      {/* Nội dung chính */}
      <div className="flex flex-col pt-2 px-2 gap-1">
        {/* Tiêu đề + Heart */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-1">
            <div className="inline-block relative group align-middle">
              <h3 className="text-[16px] leading-[24px] text-[#414045] font-bold line-clamp-1">{job.title}</h3>
            </div>
          </div>
          <button
            className="p-0 bg-transparent border-none outline-none relative"
            onMouseEnter={() => { setIsHeartHover(true); setShowTooltip(true); }}
            onMouseLeave={() => { setIsHeartHover(false); setShowTooltip(false); }}
            tabIndex={0}
            type="button"
            aria-label="Lưu tin tuyển dụng"
          >
            {isHeartHover ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C95FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C95FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            )}
            {showTooltip && (
              <span className="absolute -top-8 right-1 bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap z-20">Lưu tin</span>
            )}
          </button>
        </div>
        {/* Logo + Thông tin */}
        <div className="flex gap-2 mt-1">
          {/* Logo */}
          <figure className="bg-white box-border rounded-md w-[64px] min-w-[64px] h-[64px] min-h-[64px] flex items-center justify-center">
            <img
              className="relative w-full h-full object-contain my-auto rounded-md"
              src={job.logo || 'https://via.placeholder.com/50'}
              alt={job.company}
            />
          </figure>
          {/* Thông tin bên phải logo */}
          <div className="flex flex-col gap-1 flex-1">
            {/* Tên công ty */}
            <h3 className="text-[14px] leading-6 text-[#939295] line-clamp-1 font-semibold">{job.company}</h3>
            {/* Lương */}
            <div className="flex gap-1 pr-1 pl-[2px] items-center">
              <span className="flex items-center justify-center w-[18px] h-[24px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#b8b7b7" strokeWidth="2"/>
                  <path d="M12 17V7" stroke="#b8b7b7" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 10.5C15 9.11929 13.6569 8 12 8C10.3431 8 9 9.11929 9 10.5C9 11.8807 10.3431 13 12 13C13.6569 13 15 14.1193 15 15.5C15 16.8807 13.6569 18 12 18C10.3431 18 9 16.8807 9 15.5" stroke="#b8b7b7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="text-[14px] leading-6 text-[#2C95FF] font-semibold">{job.salary || 'Thoả thuận'}</span>
            </div>
            {/* Địa điểm */}
            <div className="flex gap-1 pr-1 pl-[2px] items-center relative province-tooltip">
              <span className="flex items-center justify-center w-[18px] h-[24px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8b7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"/><circle cx="12" cy="10" r="2"/></svg>
              </span>
              <span className="text-se-neutral-80 whitespace-nowrap text-[14px] leading-6 line-clamp-1 !whitespace-normal">{job.location}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Đường kẻ mảnh */}
      <div className="px-2 mt-1">
        <div className="w-full h-[1px] bg-[#E7E7E8]" />
      </div>
      {/* Thời hạn */}
      <div className="flex px-2 py-1">
        <div className="flex flex-1 gap-[6px] items-center"></div>
        <div className="inline-block relative group align-middle">
          <div
            className="flex pr-[2px] gap-1 items-center cursor-pointer"
            onMouseEnter={() => setShowDeadlineTooltip(true)}
            onMouseLeave={() => setShowDeadlineTooltip(false)}
          >
            <span className="flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#939295" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
            </span>
            <span className="text-[12px] leading-6 text-[#414045]">{getDeadline(job.expireDate)}</span>
          </div>
          {/* Tooltip ngày hết hạn */}
          {showDeadlineTooltip && (
            <div className="absolute hidden md:block p-2 rounded-lg max-w-[300px] text-center w-max bg-[#414045] text-white text-[13px] z-[2] right-[calc(100%+8px)] top-1/2 transform -translate-y-1/2 rounded-[8px] leading-[1] visible">
              <div>Ngày hết hạn nộp hồ sơ {job.expireDate || 'dd/mm/yyyy'}</div>
              <span className="absolute border-black font-medium transform border-t-4 border-b-4 border-t-transparent border-b-transparent border-l-4 top-1/2 -translate-y-1/2 left-full"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard; 