/**
 * Tính toán phần trăm hoàn thành hồ sơ ứng viên
 * @param {Object} profile - Dữ liệu profile của ứng viên
 * @returns {number} - Phần trăm hoàn thành (0-100)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  const fields = [
    // Thông tin cơ bản (25%)
    { field: 'fullName', weight: 5 },
    { field: 'phoneNumber', weight: 5 },
    { field: 'dateOfBirth', weight: 5 },
    { field: 'gender', weight: 5 },
    { field: 'email', weight: 5 },
    
    // Ảnh đại diện (10%)
    { field: 'avatarUrl', weight: 10 },
    
    // CV/Resume (15%)
    { field: 'cvUrl', weight: 15 },
    
    // Địa chỉ (15%)
    { field: 'city', weight: 5 },
    { field: 'district', weight: 5 },
    { field: 'ward', weight: 5 },
    
    // Giới thiệu bản thân (10%)
    { field: 'bio', weight: 10 },
    
    // Kỹ năng (10%)
    { field: 'skills', weight: 10, isArray: true },
    
    // Kinh nghiệm (5%)
    { field: 'experience', weight: 5, isArray: true },
    
    // Học vấn (5%)
    { field: 'education', weight: 5, isArray: true },
    
    // Ngoại ngữ (3%)
    { field: 'languages', weight: 3, isArray: true },
    
    // Chứng chỉ (2%)
    { field: 'certifications', weight: 2, isArray: true }
  ];
  
  let totalScore = 0;
  let maxScore = 0;
  
  fields.forEach(({ field, weight, isArray }) => {
    maxScore += weight;
    
    if (isArray) {
      // Cho mảng, tính điểm dựa trên số lượng item
      const arrayValue = profile[field];
      if (arrayValue && Array.isArray(arrayValue) && arrayValue.length > 0) {
        totalScore += weight;
      }
    } else {
      // Cho field đơn, kiểm tra có giá trị không
      const value = profile[field];
      if (value && value.toString().trim() !== '') {
        totalScore += weight;
      }
    }
  });
  
  return Math.round((totalScore / maxScore) * 100);
};

/**
 * Lấy thông tin chi tiết về các field đã hoàn thành
 * @param {Object} profile - Dữ liệu profile của ứng viên
 * @returns {Object} - Thông tin chi tiết về completion
 */
export const getProfileCompletionDetails = (profile) => {
  if (!profile) return { completion: 0, details: {} };
  
  const fieldDetails = {
    basicInfo: {
      fullName: !!profile.fullName?.trim(),
      phoneNumber: !!profile.phoneNumber?.trim(),
      dateOfBirth: !!profile.dateOfBirth?.trim(),
      gender: !!profile.gender?.trim(),
      email: !!profile.email?.trim()
    },
    avatar: {
      avatarUrl: !!profile.avatarUrl?.trim()
    },
    cv: {
      cvUrl: !!profile.cvUrl?.trim()
    },
    address: {
      city: !!profile.city?.trim(),
      district: !!profile.district?.trim(),
      ward: !!profile.ward?.trim()
    },
    bio: {
      bio: !!profile.bio?.trim()
    },
    skills: {
      skills: !!(profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0)
    },
    experience: {
      experience: !!(profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0)
    },
    education: {
      education: !!(profile.education && Array.isArray(profile.education) && profile.education.length > 0)
    },
    languages: {
      languages: !!(profile.languages && Array.isArray(profile.languages) && profile.languages.length > 0)
    },
    certifications: {
      certifications: !!(profile.certifications && Array.isArray(profile.certifications) && profile.certifications.length > 0)
    }
  };
  
  return {
    completion: calculateProfileCompletion(profile),
    details: fieldDetails
  };
}; 