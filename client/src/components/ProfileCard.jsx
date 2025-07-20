import React from 'react';
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBriefcase, FaGraduationCap, FaLanguage, FaCertificate, FaCalendar, FaGlobe, FaCheckCircle, FaEye } from 'react-icons/fa';

const ProfileCard = ({ profile, onEditClick, user }) => {
  const FullAddressDisplay = ({ formData }) => {
    const addressParts = [];
    if (formData.city) addressParts.push(formData.city);
    if (formData.district) addressParts.push(formData.district);
    if (formData.ward) addressParts.push(formData.ward);
    if (formData.specificAddress) addressParts.push(formData.specificAddress);
    return addressParts.length > 0 ? addressParts.join(', ') : 'Chưa có thông tin';
  };

  // Format ngày sinh
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Chưa có thông tin';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Chưa có thông tin';
    }
  };

  // Format giới tính
  const formatGender = (gender) => {
    if (!gender) return 'Chưa có thông tin';
    const genderMap = {
      'Male': 'Nam',
      'Female': 'Nữ',
      'Other': 'Khác',
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    };
    return genderMap[gender] || gender;
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'Chưa có số điện thoại';
    // Loại bỏ tất cả ký tự không phải số
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 0) return 'Chưa có số điện thoại';
    return phone;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header với avatar và thông tin cơ bản */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{profile.fullName || 'Chưa có tên'}</h1>
            <p className="text-indigo-100 text-sm opacity-90">
              {profile.bio || 'Đam mê công nghệ, mong muốn tìm được công ty thực sự phù hợp để phát triển bản thân...'}
            </p>
          </div>
        </div>
      </div>

      {/* Main content - 2 cột */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột trái */}
          <div className="space-y-6">
            {/* Thông tin liên hệ */}
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaUser className="w-6 h-6 text-blue-600" />
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">{user?.email || profile.email || 'Chưa có email'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="font-medium text-gray-900">{formatPhone(profile.phone || profile.phoneNumber)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaCalendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Ngày sinh</div>
                    <div className="font-medium text-gray-900">{formatDateOfBirth(profile.dateOfBirth)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Giới tính</div>
                    <div className="font-medium text-gray-900">{formatGender(profile.gender)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="bg-green-50 rounded-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaMapMarkerAlt className="w-6 h-6 text-green-600" />
                Địa chỉ
              </h3>
              <div className="space-y-3">
                {/* Địa chỉ hiện tại */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                    <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Địa chỉ hiện tại</div>
                    <div className="font-medium text-gray-900">
                      <FullAddressDisplay formData={profile} />
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết địa chỉ */}
                {(profile.city || profile.district || profile.ward || profile.specificAddress) && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-gray-500 mb-2">Chi tiết địa chỉ</div>
                    <div className="space-y-2 text-sm">
                      {profile.city && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tỉnh/Thành phố:</span>
                          <span className="font-medium text-gray-900">{profile.city}</span>
                        </div>
                      )}
                      {profile.district && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quận/Huyện:</span>
                          <span className="font-medium text-gray-900">{profile.district}</span>
                        </div>
                      )}
                      {profile.ward && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phường/Xã:</span>
                          <span className="font-medium text-gray-900">{profile.ward}</span>
                        </div>
                      )}
                      {profile.specificAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Địa chỉ cụ thể:</span>
                          <span className="font-medium text-gray-900">{profile.specificAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kỹ năng */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaBriefcase className="w-6 h-6 text-indigo-600" />
                  Kỹ năng ({profile.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Kinh nghiệm làm việc */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaBriefcase className="w-6 h-6 text-orange-600" />
                  Kinh nghiệm làm việc ({profile.experience.length})
                </h3>
                <div className="space-y-3">
                  {profile.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="font-medium text-gray-900">{exp.position || exp.jobTitle || 'Chưa có thông tin'}</div>
                      <div className="text-sm text-gray-600">{exp.companyName || exp.company || 'Chưa có thông tin'}</div>
                      {exp.startDate && exp.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString('vi-VN')} - {new Date(exp.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chứng chỉ */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="bg-red-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaCertificate className="w-6 h-6 text-red-600" />
                  Chứng chỉ ({profile.certifications.length})
                </h3>
                <div className="space-y-3">
                  {profile.certifications.slice(0, 2).map((cert, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="font-medium text-gray-900">{cert.name || cert.certificateName || 'Chưa có thông tin'}</div>
                      <div className="text-sm text-gray-600">{cert.issuer || cert.issuingOrganization || 'Chưa có thông tin'}</div>
                      {cert.issueDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(cert.issueDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải */}
          <div className="space-y-6">
            {/* Học vấn */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaGraduationCap className="w-6 h-6 text-yellow-600" />
                  Học vấn ({profile.education.length})
                </h3>
                <div className="space-y-3">
                  {profile.education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="font-medium text-gray-900">{edu.degree || edu.qualification || 'Chưa có thông tin'}</div>
                      <div className="text-sm text-gray-600">{edu.institution || edu.school || edu.university || 'Chưa có thông tin'}</div>
                      {edu.startDate && edu.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(edu.startDate).toLocaleDateString('vi-VN')} - {new Date(edu.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ngoại ngữ */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="bg-teal-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaLanguage className="w-6 h-6 text-teal-600" />
                  Ngoại ngữ ({profile.languages.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span key={index} className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium border border-teal-200">
                      {lang.language || lang.name} ({lang.level || lang.proficiency || 'Chưa có thông tin'})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sở thích công việc */}
            {(profile.expectedSalaryMin || profile.expectedSalaryMax || profile.expectedSalary || 
              (profile.preferredJobTypes && profile.preferredJobTypes.length > 0) || 
              (profile.preferredLocations && profile.preferredLocations.length > 0) ||
              profile.jobPreferences || profile.workPreferences) ? (
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaGlobe className="w-6 h-6 text-purple-600" />
                  Sở thích công việc
                </h3>
                <div className="space-y-4">
                  {/* Mức lương mong muốn */}
                  {(profile.expectedSalaryMin || profile.expectedSalaryMax || profile.expectedSalary) && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-500 mb-1">Mức lương mong muốn</div>
                      <div className="font-medium text-gray-900">
                        {profile.expectedSalaryMin && profile.expectedSalaryMax 
                          ? `${profile.expectedSalaryMin} - ${profile.expectedSalaryMax} triệu VNĐ`
                          : profile.expectedSalaryMin 
                            ? `Từ ${profile.expectedSalaryMin} triệu VNĐ`
                            : profile.expectedSalaryMax 
                              ? `Đến ${profile.expectedSalaryMax} triệu VNĐ`
                              : profile.expectedSalary 
                                ? `${profile.expectedSalary} triệu VNĐ`
                                : 'Chưa có thông tin'
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Hình thức làm việc */}
                  {profile.preferredJobTypes && profile.preferredJobTypes.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-500 mb-2">Hình thức làm việc</div>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredJobTypes.map(type => {
                          const typeMap = {
                            'Full-time': 'Toàn thời gian',
                            'Part-time': 'Bán thời gian',
                            'Contract': 'Hợp đồng',
                            'Internship': 'Thực tập',
                            'Remote': 'Làm việc từ xa',
                            'Hybrid': 'Làm việc kết hợp'
                          };
                          return (
                            <span key={type} className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                              {typeMap[type] || type}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Địa điểm ưa thích */}
                  {profile.preferredLocations && profile.preferredLocations.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-500 mb-2">Địa điểm ưa thích</div>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredLocations.map((location, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Các sở thích khác */}
                  {(profile.jobPreferences || profile.workPreferences) && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-500 mb-2">Sở thích khác</div>
                      <div className="text-sm text-gray-900">
                        {profile.jobPreferences || profile.workPreferences || 'Chưa có thông tin'}
                      </div>
                    </div>
                  )}

                  {/* Thông tin bổ sung */}
                  {(profile.expectedSalaryMin || profile.expectedSalaryMax || profile.expectedSalary) && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-500 mb-2">Thông tin bổ sung</div>
                      <div className="space-y-2 text-sm">
                        {profile.expectedSalaryMin && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mức lương tối thiểu:</span>
                            <span className="font-medium text-gray-900">{profile.expectedSalaryMin} triệu VNĐ</span>
                          </div>
                        )}
                        {profile.expectedSalaryMax && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mức lương tối đa:</span>
                            <span className="font-medium text-gray-900">{profile.expectedSalaryMax} triệu VNĐ</span>
                          </div>
                        )}
                        {profile.expectedSalary && !profile.expectedSalaryMin && !profile.expectedSalaryMax && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mức lương mong muốn:</span>
                            <span className="font-medium text-gray-900">{profile.expectedSalary} triệu VNĐ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Trạng thái */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trạng thái</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Sẵn sàng tìm việc</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEye className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Hồ sơ công khai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 