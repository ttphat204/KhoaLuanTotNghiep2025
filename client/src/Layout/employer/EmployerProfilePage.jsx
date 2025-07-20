import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIndustry, FaGlobe, FaInfoCircle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EmployerProfile from './EmployerProfile';

const InfoBox = ({ icon, label, value, color, link, isEditing = false, onEdit = null }) => (
  <div className={`flex items-center gap-3 rounded-xl p-4 mb-3 relative group`} style={{ background: color }}>
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <div className="font-semibold text-gray-700">{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">{value}</a>
      ) : (
        <div className="text-gray-800 font-medium">{value}</div>
      )}
    </div>
    {!isEditing && onEdit && (
      <button
        onClick={onEdit}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg hover:bg-white/20"
      >
        <FaEdit className="text-gray-600 hover:text-gray-800" />
      </button>
    )}
  </div>
);

const EmployerProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchProfile();
    }
  }, [user, showEdit]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      } else {
        setProfile(null);
        setError('Không thể tải thông tin công ty');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Lỗi kết nối server');
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
            <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-2" style={{ width: '350px' }}></div>
            <div className="h-4 bg-white/20 rounded animate-pulse" style={{ width: '280px' }}></div>
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
          
          {/* Skeleton info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-4 bg-gray-50 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" style={{ width: '60%' }}></div>
                    <div className="h-3 bg-gray-200 rounded" style={{ width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-4 bg-gray-50 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" style={{ width: '70%' }}></div>
                    <div className="h-3 bg-gray-200 rounded" style={{ width: '90%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen w-full bg-white">
        {/* Header gradient */}
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl px-8 py-8 flex flex-col items-center gap-2 relative">
          <div className="flex flex-col items-center flex-1">
            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight mb-1">Thông tin nhà tuyển dụng</div>
            <div className="text-white text-base drop-shadow">Quản lý thông tin công ty & hồ sơ</div>
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
          <div className="text-white text-base drop-shadow">Thông tin công ty & hồ sơ nhà tuyển dụng</div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 mt-8">
        {/* Company Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <InfoBox 
              icon={<FaEnvelope className="text-blue-500" />} 
              label="Email" 
              value={profile.companyEmail} 
              color="#F0F6FF" 
              onEdit={() => setShowEdit(true)}
            />
            <InfoBox 
              icon={<FaPhone className="text-green-500" />} 
              label="Điện thoại" 
              value={profile.companyPhoneNumber} 
              color="#E8FFF3" 
              onEdit={() => setShowEdit(true)}
            />
          </div>
          <div>
            <InfoBox 
              icon={<FaIndustry className="text-yellow-500" />} 
              label="Ngành nghề" 
              value={profile.industry || 'Chưa cập nhật'} 
              color="#FFFBEA" 
              onEdit={() => setShowEdit(true)}
            />
            <InfoBox 
              icon={<FaMapMarkerAlt className="text-pink-500" />} 
              label="Địa chỉ" 
              value={profile.companyAddress} 
              color="#FFF6F0" 
              onEdit={() => setShowEdit(true)}
            />
            {profile.companyWebsite && (
              <InfoBox 
                icon={<FaGlobe className="text-indigo-500" />} 
                label="Website" 
                value={profile.companyWebsite} 
                color="#F0F6FF" 
                link={profile.companyWebsite}
                onEdit={() => setShowEdit(true)}
              />
            )}
            {profile.companyDescription && (
              <InfoBox 
                icon={<FaInfoCircle className="text-gray-500" />} 
                label="Mô tả" 
                value={profile.companyDescription} 
                color="#F7F7F7"
                onEdit={() => setShowEdit(true)}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            onClick={() => setShowEdit(true)}
          >
            <FaEdit />
            Cập nhật thông tin
          </button>
          
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2"
            onClick={() => window.print()}
          >
            <FaSave />
            In hồ sơ
          </button>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaBuilding className="text-indigo-500" />
            Thông tin bổ sung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Thông tin liên hệ</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Email:</strong> {profile.companyEmail}</p>
                <p><strong>Điện thoại:</strong> {profile.companyPhoneNumber}</p>
                {profile.companyWebsite && (
                  <p><strong>Website:</strong> <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.companyWebsite}</a></p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Thông tin công ty</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Tên công ty:</strong> {profile.companyName}</p>
                <p><strong>Ngành nghề:</strong> {profile.industry || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> {profile.companyAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật thông tin */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              aria-label="Đóng"
            >
              &times;
            </button>
            <EmployerProfile onSuccess={() => setShowEdit(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfilePage; 