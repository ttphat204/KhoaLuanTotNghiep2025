import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaStar, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const companyName = job.employerId?.companyName || job.companyName || 'Không xác định';
  const companyLogoUrl = job.employerLogo || job.employerId?.companyLogoUrl || job.companyLogoUrl || '/default-logo.png';

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs?candidateId=${user._id}&jobId=${job._id}`);
      const data = await response.json();
      setIsFavorite(data.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [user?._id, job._id]);

  // Kiểm tra trạng thái yêu thích khi component mount
  useEffect(() => {
    if (user && user.role === 'candidate' && job._id) {
      checkFavoriteStatus();
    }
  }, [user, job._id, checkFavoriteStatus]);

  const handleCardClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user || user.role !== 'candidate') {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Xóa khỏi yêu thích
        const response = await fetch(`https://be-khoa-luan2.vercel.app/api/favorite-jobs`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            candidateId: user._id,
            jobId: job._id
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setIsFavorite(false);
        } else {
          alert(data.message || 'Không thể xóa khỏi yêu thích');
        }
      } else {
        // Thêm vào yêu thích
        const response = await fetch('https://be-khoa-luan2.vercel.app/api/favorite-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            candidateId: user._id,
            jobId: job._id
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setIsFavorite(true);
        } else {
          alert(data.message || 'Không thể thêm vào yêu thích');
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      alert('Lỗi kết nối server');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const isUrgent = () => {
    if (!job.applicationDeadline) return false;
    const today = new Date();
    const end = new Date(job.applicationDeadline);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff <= 3 && diff > 0;
  };

  const isExpired = () => {
    if (!job.applicationDeadline) return false;
    const today = new Date();
    const end = new Date(job.applicationDeadline);
    return end < today;
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
        isHovered 
          ? 'border-blue-400 dark:border-blue-500 shadow-2xl shadow-blue-100 dark:shadow-blue-900/20 scale-[1.02]' 
          : 'border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl'
      } ${isExpired() ? 'opacity-60' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') handleCardClick(); }}
    >
      {/* Gradient Background Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Urgent Badge */}
      {isUrgent() && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            Gấp
          </span>
        </div>
      )}

      {/* Featured Badge */}
      {job.isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <FaStar className="w-3 h-3" />
            Nổi bật
          </span>
        </div>
      )}

      {/* Favorite Button */}
              <button
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-400'
          } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseEnter={e => { e.stopPropagation(); }}
        onMouseLeave={e => { e.stopPropagation(); }}
        onClick={handleFavoriteClick}
        disabled={favoriteLoading}
      >
        {favoriteLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <FaHeart className={`w-4 h-4 transition-all duration-200 ${isFavorite ? 'fill-current' : ''}`} />
        )}
      </button>

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {job.jobTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <FaBuilding className="w-4 h-4 text-blue-500" />
              <span className="truncate font-medium">{companyName}</span>
            </div>
          </div>
        </div>

        {/* Company Logo Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 p-1 shadow-sm">
              <img
                src={companyLogoUrl}
                alt="logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/default-logo.png';
                }}
              />
            </div>
            {job.isFeatured && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-800 rounded-full p-1 shadow-sm">
                <FaStar className="w-2 h-2" />
              </div>
            )}
          </div>
          
          {/* Key Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FaMoneyBillWave className="w-4 h-4 text-green-500" />
              <span className="font-bold text-green-600">{getSalary(job.salaryRange)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
              <span className="truncate">{getLocation(job.location)}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-4" />

        {/* Footer Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FaClock className="w-3 h-3" />
            <span className={getDeadline(job.applicationDeadline).includes('Hết hạn') ? 'text-red-500 font-medium' : ''}>
              {getDeadline(job.applicationDeadline)}
            </span>
          </div>
          
          {/* View Count (if available) */}
          {job.viewCount && (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <FaEye className="w-3 h-3" />
              <span>{job.viewCount}</span>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
        

      </div>

      {/* Bottom Gradient Border */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
    </div>
  );
};

export default JobCard; 