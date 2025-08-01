import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import Footer from '../../components/Footer';
import ProfileCard from '../../components/ProfileCard';

import { FaUser, FaCamera, FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaLanguage, FaCertificate, FaLink, FaSave, FaGlobe, FaEye, FaTimes, FaPlus, FaTrash, FaDownload } from 'react-icons/fa';
import vietnamProvinces from '../../assets/vietnam_provinces';
import { showSuccess, showError } from '../../utils/toast';
import { calculateProfileCompletion } from '../../utils/profileCompletion';

// Helper component để hiển thị địa chỉ đầy đủ
const FullAddressDisplay = ({ formData }) => {
  const addressParts = [];
  if (formData.city) addressParts.push(formData.city);
  if (formData.district) addressParts.push(formData.district);
  if (formData.ward) addressParts.push(formData.ward);
  if (formData.specificAddress) addressParts.push(formData.specificAddress);
  
  return (
    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {addressParts.length > 0 
        ? <span className="text-gray-900 dark:text-gray-100">{addressParts.join(', ')}</span>
        : <span className="text-gray-400 dark:text-gray-500">Chưa có thông tin</span>
      }
    </div>
  );
};

// Form Components
const BasicInfoForm = ({ formData, handleInputChange, user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Họ và tên *</label>
        <input
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Nhập họ và tên"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200">
          {user?.email || formData.email || <span className="text-gray-400 dark:text-gray-500">Chưa có email</span>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Số điện thoại</label>
        <input
          type="tel"
          value={formData.phoneNumber || ''}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          placeholder="Nhập số điện thoại"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngày sinh</label>
        <input
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Giới tính</label>
        <select
          value={formData.gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Chọn giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
          <option value="Other">Khác</option>
        </select>
      </div>
    </div>
  );
};

const AvatarForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
            {formData.avatarUrl ? (
              <>
                <img 
                  src={formData.avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    handleInputChange('avatarUrl', '');
                    showError('Đã xóa ảnh đại diện');
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Xóa ảnh đại diện"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </>
            ) : (
              <FaUser className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload ảnh đại diện
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Kiểm tra kích thước file (5MB)
                if (file.size > 5 * 1024 * 1024) {
                  showError('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
                  return;
                }
                
                // Kiểm tra loại file
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                  showError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)');
                  return;
                }
                
                try {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64String = event.target.result;
                    handleInputChange('avatarUrl', base64String);
                    showSuccess('Upload ảnh đại diện thành công!');
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  showError('Lỗi khi xử lý ảnh');
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Chọn file ảnh (JPG, PNG, GIF) - Tối đa 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

const CVForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Upload CV/Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              try {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const base64String = event.target.result;
                  handleInputChange('cvUrl', base64String);
                  showSuccess('Upload CV thành công!');
                };
                reader.readAsDataURL(file);
              } catch (error) {
                showError('Lỗi khi xử lý CV');
              }
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Chọn file PDF - Tối đa 5MB
        </p>
      </div>
      
      {formData.cvUrl && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-200">CV đã upload</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">File PDF đã sẵn sàng để nhà tuyển dụng xem</p>
          </div>
          <button
            onClick={() => {
              const pdfUrl = formData.cvUrl;
              if (pdfUrl.startsWith('data:application/pdf')) {
                const byteCharacters = atob(pdfUrl.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
              } else {
                window.open(pdfUrl, '_blank');
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            Xem CV
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = formData.cvUrl;
              link.download = 'CV.pdf';
              link.click();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Tải CV
          </button>
        </div>
      )}
    </div>
  );
};

const AddressForm = ({ formData, handleInputChange, provinces, districts, wards, loadingProvinces }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tỉnh/Thành phố</label>
        <select
          value={formData.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
          disabled={loadingProvinces}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
          </option>
          {provinces.map((province) => (
            <option key={province.code} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Quận/Huyện</label>
        <select
          value={formData.district || ''}
          onChange={(e) => handleInputChange('district', e.target.value)}
          disabled={!formData.city || loadingProvinces}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingProvinces && !formData.city ? 'Đang tải...' : 'Chọn quận/huyện'}
          </option>
          {districts.map((district) => (
            <option key={district.code} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Phường/Xã</label>
        <select
          value={formData.ward || ''}
          onChange={(e) => handleInputChange('ward', e.target.value)}
          disabled={!formData.district || loadingProvinces}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingProvinces && !formData.district ? 'Đang tải...' : 'Chọn phường/xã'}
          </option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Địa chỉ cụ thể</label>
        <input
          type="text"
          value={formData.specificAddress || ''}
          onChange={(e) => handleInputChange('specificAddress', e.target.value)}
          placeholder="Nhập địa chỉ cụ thể"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>
  );
};

const BioForm = ({ formData, handleInputChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        Mô tả bản thân
      </label>
      <textarea
        value={formData.bio || ''}
        onChange={(e) => handleInputChange('bio', e.target.value)}
        placeholder="Giới thiệu về bản thân, mục tiêu nghề nghiệp..."
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};

const SkillsForm = ({ formData, handleInputChange }) => {
  const addSkill = () => {
    const newSkills = [...(formData.skills || []), ''];
    handleInputChange('skills', newSkills);
  };

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    handleInputChange('skills', newSkills);
  };

  const updateSkill = (index, value) => {
    const newSkills = [...(formData.skills || [])];
    newSkills[index] = value;
    handleInputChange('skills', newSkills);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
      {(formData.skills || []).map((skill, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={skill}
            onChange={(e) => updateSkill(index, e.target.value)}
            placeholder="Nhập kỹ năng"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => removeSkill(index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addSkill}
        className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
      >
        <FaPlus className="w-4 h-4" />
        Thêm kỹ năng
      </button>
    </div>
  );
};

const ExperienceForm = ({ formData, handleInputChange }) => {
  const addExperience = () => {
    const newExperience = [...(formData.experience || []), {}];
    handleInputChange('experience', newExperience);
  };

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    handleInputChange('experience', newExperience);
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...(formData.experience || [])];
    newExperience[index] = { ...newExperience[index], [field]: value };
    handleInputChange('experience', newExperience);
  };

  return (
    <div className="space-y-6">
      {(formData.experience || []).map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tên công ty</label>
              <input
                type="text"
                value={exp.companyName || ''}
                onChange={(e) => updateExperience(index, 'companyName', e.target.value)}
                placeholder="Nhập tên công ty"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Vị trí</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                placeholder="Nhập vị trí công việc"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngày bắt đầu</label>
              <input
                type="date"
                value={exp.startDate || ''}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngày kết thúc</label>
              <input
                type="date"
                value={exp.endDate || ''}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Mô tả công việc</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={3}
              placeholder="Mô tả công việc và thành tựu"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => removeExperience(index)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-dashed border-indigo-300"
      >
        <FaPlus className="w-4 h-4" />
        Thêm kinh nghiệm
      </button>
    </div>
  );
};

const EducationForm = ({ formData, handleInputChange }) => {
  const addEducation = () => {
    const newEducation = [...(formData.education || []), {}];
    handleInputChange('education', newEducation);
  };

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    handleInputChange('education', newEducation);
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...(formData.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    handleInputChange('education', newEducation);
  };

  return (
    <div className="space-y-6">
      {(formData.education || []).map((edu, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Trường học</label>
              <input
                type="text"
                value={edu.school || ''}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                placeholder="Nhập tên trường"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Bằng cấp</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="Nhập bằng cấp"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Chuyên ngành</label>
              <input
                type="text"
                value={edu.fieldOfStudy || ''}
                onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                placeholder="Nhập chuyên ngành"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngày bắt đầu</label>
              <input
                type="date"
                value={edu.startDate || ''}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngày kết thúc</label>
              <input
                type="date"
                value={edu.endDate || ''}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Mô tả</label>
            <textarea
              value={edu.description || ''}
              onChange={(e) => updateEducation(index, 'description', e.target.value)}
              rows={3}
              placeholder="Mô tả về quá trình học tập"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => removeEducation(index)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-dashed border-indigo-300"
      >
        <FaPlus className="w-4 h-4" />
        Thêm học vấn
      </button>
    </div>
  );
};

const LanguageForm = ({ formData, handleInputChange }) => {
  const addLanguage = () => {
    const newLanguages = [...(formData.languages || []), {}];
    handleInputChange('languages', newLanguages);
  };

  const removeLanguage = (index) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    handleInputChange('languages', newLanguages);
  };

  const updateLanguage = (index, field, value) => {
    const newLanguages = [...(formData.languages || [])];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    handleInputChange('languages', newLanguages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ngoại ngữ</label>
      {(formData.languages || []).map((lang, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={lang.language || ''}
            onChange={(e) => updateLanguage(index, 'language', e.target.value)}
            placeholder="Ngôn ngữ"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <select
            value={lang.proficiency || ''}
            onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Trình độ</option>
            <option value="Basic">Cơ bản</option>
            <option value="Intermediate">Trung bình</option>
            <option value="Advanced">Nâng cao</option>
            <option value="Native">Bản ngữ</option>
          </select>
          <button
            onClick={() => removeLanguage(index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addLanguage}
        className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
      >
        <FaPlus className="w-4 h-4" />
        Thêm ngoại ngữ
      </button>
    </div>
  );
};

const CertificationForm = ({ formData, handleInputChange }) => {
  const addCertification = () => {
    const newCertifications = [...(formData.certifications || []), {}];
    handleInputChange('certifications', newCertifications);
  };

  const removeCertification = (index) => {
    const newCertifications = formData.certifications.filter((_, i) => i !== index);
    handleInputChange('certifications', newCertifications);
  };

  const updateCertification = (index, field, value) => {
    const newCertifications = [...(formData.certifications || [])];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    handleInputChange('certifications', newCertifications);
  };

  return (
    <div className="space-y-6">
      {(formData.certifications || []).map((cert, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên chứng chỉ</label>
              <input
                type="text"
                value={cert.name || ''}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                placeholder="Nhập tên chứng chỉ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tổ chức cấp</label>
              <input
                type="text"
                value={cert.issuer || ''}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                placeholder="Nhập tổ chức cấp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cấp</label>
              <input
                type="date"
                value={cert.date || ''}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              value={cert.description || ''}
              onChange={(e) => updateCertification(index, 'description', e.target.value)}
              rows={3}
              placeholder="Mô tả về chứng chỉ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => removeCertification(index)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addCertification}
        className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-dashed border-indigo-300"
      >
        <FaPlus className="w-4 h-4" />
        Thêm chứng chỉ
      </button>
    </div>
  );
};

const SocialLinksForm = ({ formData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">LinkedIn</label>
        <input
          type="url"
          value={formData.socialLinks?.linkedin || ''}
          onChange={(e) => handleInputChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">GitHub</label>
        <input
          type="url"
          value={formData.socialLinks?.github || ''}
          onChange={(e) => handleInputChange('github', e.target.value)}
          placeholder="https://github.com/username"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Portfolio</label>
        <input
          type="url"
          value={formData.socialLinks?.portfolio || ''}
          onChange={(e) => handleInputChange('portfolio', e.target.value)}
          placeholder="https://portfolio.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>
  );
};

const JobPreferencesForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Mức lương mong muốn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Mức lương mong muốn</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Từ (triệu VNĐ)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.expectedSalaryMin || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value < 0) return; // Không cho phép số âm
                handleInputChange('expectedSalaryMin', value);
              }}
              placeholder="Nhập mức lương tối thiểu"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Đến (triệu VNĐ)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.expectedSalaryMax || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value < 0) return; // Không cho phép số âm
                handleInputChange('expectedSalaryMax', value);
              }}
              placeholder="Nhập mức lương tối đa"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ví dụ: 10 - 20 (tương đương 10,000,000 - 20,000,000 VNĐ)</p>
        {formData.expectedSalaryMin && formData.expectedSalaryMax && parseFloat(formData.expectedSalaryMin) > parseFloat(formData.expectedSalaryMax) && (
          <p className="text-xs text-red-500 mt-1">Mức lương tối thiểu không được lớn hơn mức lương tối đa</p>
        )}
      </div>

      {/* Loại công việc */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Hình thức làm việc</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Full-time') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Full-time']
                  : currentTypes.filter(type => type !== 'Full-time');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Toàn thời gian</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Làm việc 8 tiếng/ngày, 5 ngày/tuần</div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Part-time') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Part-time']
                  : currentTypes.filter(type => type !== 'Part-time');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Bán thời gian</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Làm việc ít hơn 8 tiếng/ngày</div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Contract') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Contract']
                  : currentTypes.filter(type => type !== 'Contract');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Hợp đồng</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Làm việc theo dự án, thời hạn nhất định</div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Internship') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Internship']
                  : currentTypes.filter(type => type !== 'Internship');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Thực tập</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Dành cho sinh viên, học việc</div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Remote') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Remote']
                  : currentTypes.filter(type => type !== 'Remote');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Làm việc từ xa</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Work from home, không cần đến văn phòng</div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.preferredJobTypes?.includes('Hybrid') || false}
              onChange={(e) => {
                const currentTypes = formData.preferredJobTypes || [];
                const newTypes = e.target.checked
                  ? [...currentTypes, 'Hybrid']
                  : currentTypes.filter(type => type !== 'Hybrid');
                handleInputChange('preferredJobTypes', newTypes);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Làm việc kết hợp</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Kết hợp làm việc tại văn phòng và từ xa</div>
            </div>
          </label>
        </div>
      </div>

      {/* Địa điểm ưa thích */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Địa điểm ưa thích</label>
        <div className="space-y-2">
          {(formData.preferredLocations || []).map((location, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  const newLocations = [...(formData.preferredLocations || [])];
                  newLocations[index] = e.target.value;
                  handleInputChange('preferredLocations', newLocations);
                }}
                placeholder="Nhập địa điểm"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={() => {
                  const newLocations = formData.preferredLocations.filter((_, i) => i !== index);
                  handleInputChange('preferredLocations', newLocations);
                }}
                className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newLocations = [...(formData.preferredLocations || []), ''];
              handleInputChange('preferredLocations', newLocations);
            }}
            className="flex items-center gap-2 px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
          >
            <FaPlus className="w-4 h-4" />
            Thêm địa điểm
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivacySettingsForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isAvailable || false}
            onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Sẵn sàng tìm việc
          </span>
        </label>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPublic || false}
            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Công khai hồ sơ
          </span>
        </label>
      </div>
    </div>
  );
};

const CandidateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [selectedEditSection, setSelectedEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [autoSaving, setAutoSaving] = useState(false);
  const scrollPositionRef = useRef(0);
  
  // Address data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // Tính toán phần trăm hoàn thành hồ sơ
  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(formData);
  }, [formData]);

  // Khai báo fetchProfile trước để tránh lỗi hoisting
  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch(`https://be-khoaluan.vercel.app/api/candidate/profile?userId=${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
        setOriginalData(data.data);
        
        // Cập nhật user context với avatar nếu có
        if (data.data.avatarUrl) {
          updateUserProfile({ avatarUrl: data.data.avatarUrl });
        }
      } else {
        showError('Lỗi khi tải thông tin profile');
      }
    } catch (error) {
      showError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [user?._id, updateUserProfile]);

  // Fetch provinces data - chỉ chạy 1 lần khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        showError('Lỗi khi tải dữ liệu địa chỉ');
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Update districts when province changes - thêm editingSection vào dependencies
  useEffect(() => {
    if (formData.city && provinces.length > 0) {
      const selectedProvince = provinces.find(p => p.name === formData.city);
      if (selectedProvince) {
        setDistricts(selectedProvince.districts || []);
        // Chỉ reset khi thực sự thay đổi province, không phải khi edit
        if (editingSection !== 'Địa chỉ') {
          setFormData(prev => ({
            ...prev,
            district: '',
            ward: ''
          }));
        }
      }
    } else {
      setDistricts([]);
    }
  }, [formData.city, provinces, editingSection]);

  // Update wards when district changes - thêm editingSection vào dependencies
  useEffect(() => {
    if (formData.district && districts.length > 0) {
      const selectedDistrict = districts.find(d => d.name === formData.district);
      if (selectedDistrict) {
        setWards(selectedDistrict.wards || []);
        // Chỉ reset khi thực sự thay đổi district, không phải khi edit
        if (editingSection !== 'Địa chỉ') {
          setFormData(prev => ({
            ...prev,
            ward: ''
          }));
        }
      }
    } else {
      setWards([]);
    }
  }, [formData.district, districts, editingSection]);

  // Initialize address dropdowns when provinces are loaded and profile exists - thêm dependencies
  useEffect(() => {
    if (provinces.length > 0 && profile && profile.city && !districts.length) {
      const selectedProvince = provinces.find(p => p.name === profile.city);
      if (selectedProvince) {
        setDistricts(selectedProvince.districts || []);
        
        if (profile.district) {
          const selectedDistrict = selectedProvince.districts?.find(d => d.name === profile.district);
          if (selectedDistrict) {
            setWards(selectedDistrict.wards || []);
          }
        }
      }
    }
  }, [provinces, profile, districts.length]);

  // Fetch profile - chỉ chạy khi user thay đổi
  useEffect(() => {
    if (user?._id && !profile) {
      fetchProfile();
    }
  }, [user?._id, profile, fetchProfile]);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (window.autoSaveTimeout) {
        clearTimeout(window.autoSaveTimeout);
      }
    };
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, ...formData })
      });
      
      const data = await response.json();
      if (data.success) {
        // Cập nhật profile state mà không reload
        setProfile(prev => ({ ...prev, ...data.data }));
        setOriginalData(prev => ({ ...prev, ...data.data }));
        
        // Cập nhật user context nếu có avatar
        if (data.data.avatarUrl) {
          updateUserProfile({ avatarUrl: data.data.avatarUrl });
        }
        
        showSuccess('Cập nhật thành công!');
        setEditingSection(null);
      } else {
        showError(data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      showError('Lỗi kết nối server');
    } finally {
      setSaving(false);
    }
  }, [user._id, formData, updateUserProfile]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      // Xử lý đặc biệt cho socialLinks
      if (field === 'linkedin' || field === 'github' || field === 'portfolio') {
        return {
          ...prev,
          socialLinks: {
            ...(prev.socialLinks || {}),
            [field]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  // Auto-save cho các trường đơn giản
  const handleAutoSave = useCallback(async (field, value) => {
    // Cập nhật formData ngay lập tức
    handleInputChange(field, value);
    
    // Auto-save sau 1.5 giây nếu không có thay đổi khác
    if (window.autoSaveTimeout) {
      clearTimeout(window.autoSaveTimeout);
    }
    
    window.autoSaveTimeout = setTimeout(async () => {
      setAutoSaving(true);
      try {
        // Xử lý đặc biệt cho socialLinks
        let requestBody = { userId: user._id };
        if (field === 'linkedin' || field === 'github' || field === 'portfolio') {
          requestBody.socialLinks = {
            ...formData.socialLinks,
            [field]: value
          };
        } else {
          requestBody[field] = value;
        }
        
        const response = await fetch('https://be-khoaluan.vercel.app/api/candidate/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        if (data.success) {
          setProfile(prev => ({ ...prev, [field]: value }));
          setOriginalData(prev => ({ ...prev, [field]: value }));
          
          // Cập nhật user context nếu là avatar
          if (field === 'avatarUrl') {
            updateUserProfile({ avatarUrl: value });
          }
          
          showSuccess('Đã tự động lưu thay đổi');
        } else {
          showError(data.message || 'Lỗi khi tự động lưu');
          // Reset về giá trị cũ nếu có lỗi
          setFormData(prev => ({ ...prev, [field]: originalData[field] }));
        }
      } catch (error) {
        showError('Lỗi khi tự động lưu');
        // Reset về giá trị cũ nếu có lỗi
        setFormData(prev => ({ ...prev, [field]: originalData[field] }));
      } finally {
        setAutoSaving(false);
      }
    }, 1500);
  }, [user._id, formData.socialLinks, originalData, updateUserProfile, handleInputChange]);

  const handleSectionSave = useCallback(async (sectionName) => {
    setSaving(true);
    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, ...formData })
      });
      
      const data = await response.json();
      if (data.success) {
        // Chỉ cập nhật profile state, không reload toàn bộ
        setProfile(prev => ({ ...prev, ...data.data }));
        setOriginalData(prev => ({ ...prev, ...data.data }));
        
        // Cập nhật user context nếu có avatar
        if (data.data.avatarUrl) {
          updateUserProfile({ avatarUrl: data.data.avatarUrl });
        }
        
        showSuccess(`Cập nhật ${sectionName} thành công!`);
        setEditingSection(null);
      } else {
        showError(data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      showError('Lỗi kết nối server');
    } finally {
      setSaving(false);
    }
  }, [user._id, formData, updateUserProfile]);

  const handleArrayChange = useCallback((field, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const addArrayItem = useCallback((field, defaultItem = {}) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem]
    }));
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Reset section data without reloading
  const resetSection = useCallback((sectionName) => {
    setEditingSection(null);
    // Chỉ reset các field liên quan đến section này
    if (sectionName === 'Thông tin cơ bản') {
      setFormData(prev => ({
        ...prev,
        fullName: originalData.fullName,
        email: originalData.email,
        phoneNumber: originalData.phoneNumber,
        dateOfBirth: originalData.dateOfBirth,
        gender: originalData.gender
      }));
    } else if (sectionName === 'Địa chỉ') {
      setFormData(prev => ({
        ...prev,
        city: originalData.city,
        district: originalData.district,
        ward: originalData.ward,
        specificAddress: originalData.specificAddress
      }));
    } else if (sectionName === 'Giới thiệu') {
      setFormData(prev => ({
        ...prev,
        bio: originalData.bio
      }));
    } else if (sectionName === 'Kỹ năng') {
      setFormData(prev => ({
        ...prev,
        skills: originalData.skills
      }));
    } else if (sectionName === 'Kinh nghiệm làm việc') {
      setFormData(prev => ({
        ...prev,
        experience: originalData.experience
      }));
    } else if (sectionName === 'Học vấn') {
      setFormData(prev => ({
        ...prev,
        education: originalData.education
      }));
    } else if (sectionName === 'Ngoại ngữ') {
      setFormData(prev => ({
        ...prev,
        languages: originalData.languages
      }));
    } else if (sectionName === 'Chứng chỉ') {
      setFormData(prev => ({
        ...prev,
        certifications: originalData.certifications
      }));
    } else if (sectionName === 'Liên kết mạng xã hội') {
      setFormData(prev => ({
        ...prev,
        socialLinks: originalData.socialLinks
      }));
    } else if (sectionName === 'Sở thích công việc') {
      setFormData(prev => ({
        ...prev,
        expectedSalary: originalData.expectedSalary,
        preferredJobTypes: originalData.preferredJobTypes,
        preferredLocations: originalData.preferredLocations
      }));
    } else if (sectionName === 'Ảnh đại diện') {
      setFormData(prev => ({
        ...prev,
        avatarUrl: originalData.avatarUrl,
        cvUrl: originalData.cvUrl
      }));
    } else if (sectionName === 'Cài đặt riêng tư') {
      setFormData(prev => ({
        ...prev,
        isAvailable: originalData.isAvailable,
        isPublic: originalData.isPublic
      }));
    }
  }, [originalData]);

  // Handle section cancel
  const handleSectionCancel = useCallback((sectionName) => {
    resetSection(sectionName);
  }, [resetSection]);

  

  if (loading) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Hero Section với gradient và animation */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Title */}
              <div className="mb-4">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Hồ sơ ứng viên
                </h1>
                <p className="text-lg text-blue-100 font-medium">
                  Xây dựng hồ sơ chuyên nghiệp, mở rộng cơ hội nghề nghiệp
                </p>
              </div>
              
              {/* Progress Indicator */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-blue-100">Hoàn thành hồ sơ</span>
                  <span className="font-bold text-white">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${profileCompletion}%` }}
                  >
                    <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Profile Card Summary */}
        {profile && (
          <div className="mb-8">
            <ProfileCard 
              profile={profile} 
              user={user}
            />
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quản lý hồ sơ</h3>
              
              {/* Navigation Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setEditingSection('Thông tin cơ bản')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Thông tin cơ bản'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaUser className="w-5 h-5" title="Thông tin cá nhân cơ bản" />
                  <span className="font-medium">Thông tin cơ bản</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Thông tin cá nhân cơ bản
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Ảnh đại diện')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Ảnh đại diện'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaCamera className="w-5 h-5" title="Ảnh đại diện" />
                  <span className="font-medium">Ảnh đại diện</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Ảnh đại diện
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('CV/Resume')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'CV/Resume'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaBriefcase className="w-5 h-5" title="CV/Resume" />
                  <span className="font-medium">CV/Resume</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    CV/Resume
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Địa chỉ')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Địa chỉ'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaMapMarkerAlt className="w-5 h-5" title="Địa chỉ liên hệ" />
                  <span className="font-medium">Địa chỉ</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Địa chỉ liên hệ
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Giới thiệu')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Giới thiệu'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaUser className="w-5 h-5" title="Mô tả bản thân" />
                  <span className="font-medium">Giới thiệu</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Mô tả bản thân
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Kỹ năng')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Kỹ năng'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaBriefcase className="w-5 h-5" title="Kỹ năng chuyên môn" />
                  <span className="font-medium">Kỹ năng</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Kỹ năng chuyên môn
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Kinh nghiệm làm việc')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Kinh nghiệm làm việc'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaBriefcase className="w-5 h-5" title="Kinh nghiệm làm việc" />
                  <span className="font-medium">Kinh nghiệm làm việc</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Kinh nghiệm làm việc
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Học vấn')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Học vấn'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaGraduationCap className="w-5 h-5" title="Học vấn và bằng cấp" />
                  <span className="font-medium">Học vấn</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Học vấn và bằng cấp
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Ngoại ngữ')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Ngoại ngữ'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaLanguage className="w-5 h-5" title="Ngoại ngữ" />
                  <span className="font-medium">Ngoại ngữ</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Ngoại ngữ
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Chứng chỉ')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Chứng chỉ'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaCertificate className="w-5 h-5" title="Chứng chỉ chuyên môn" />
                  <span className="font-medium">Chứng chỉ</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Chứng chỉ chuyên môn
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Liên kết mạng xã hội')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Liên kết mạng xã hội'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaLink className="w-5 h-5" title="Liên kết mạng xã hội" />
                  <span className="font-medium">Liên kết mạng xã hội</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Liên kết mạng xã hội
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Sở thích công việc')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Sở thích công việc'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaGlobe className="w-5 h-5" title="Sở thích công việc" />
                  <span className="font-medium">Sở thích công việc</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Sở thích công việc
                  </div>
                </button>

                <button
                  onClick={() => setEditingSection('Cài đặt riêng tư')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors group relative ${
                    editingSection === 'Cài đặt riêng tư'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaEye className="w-5 h-5" title="Cài đặt riêng tư" />
                  <span className="font-medium">Cài đặt riêng tư</span>
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Cài đặt riêng tư
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="lg:col-span-2">
            {editingSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {editingSection === 'Thông tin cơ bản' && <FaUser className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Ảnh đại diện' && <FaCamera className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'CV/Resume' && <FaBriefcase className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Địa chỉ' && <FaMapMarkerAlt className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Giới thiệu' && <FaUser className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Kỹ năng' && <FaBriefcase className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Kinh nghiệm làm việc' && <FaBriefcase className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Học vấn' && <FaGraduationCap className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Ngoại ngữ' && <FaLanguage className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Chứng chỉ' && <FaCertificate className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Liên kết mạng xã hội' && <FaLink className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Sở thích công việc' && <FaGlobe className="w-5 h-5 text-indigo-600" />}
                    {editingSection === 'Cài đặt riêng tư' && <FaEye className="w-5 h-5 text-indigo-600" />}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{editingSection}</h2>
                  </div>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                    Đóng
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Render different forms based on editingSection */}
                  {editingSection === 'Thông tin cơ bản' && (
                    <BasicInfoForm formData={formData} handleInputChange={handleInputChange} user={user} />
                  )}
                  
                  {editingSection === 'Ảnh đại diện' && (
                    <AvatarForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'CV/Resume' && (
                    <CVForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Địa chỉ' && (
                    <AddressForm 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      provinces={provinces}
                      districts={districts}
                      wards={wards}
                      loadingProvinces={loadingProvinces}
                    />
                  )}
                  
                  {editingSection === 'Giới thiệu' && (
                    <BioForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Kỹ năng' && (
                    <SkillsForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Kinh nghiệm làm việc' && (
                    <ExperienceForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Học vấn' && (
                    <EducationForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Ngoại ngữ' && (
                    <LanguageForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Chứng chỉ' && (
                    <CertificationForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Liên kết mạng xã hội' && (
                    <SocialLinksForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Sở thích công việc' && (
                    <JobPreferencesForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                  
                  {editingSection === 'Cài đặt riêng tư' && (
                    <PrivacySettingsForm formData={formData} handleInputChange={handleInputChange} />
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleSectionCancel(editingSection)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSectionSave(editingSection)}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="w-4 h-4" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            ) : (
              // Welcome Section khi không chọn chức năng chỉnh sửa
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 border border-indigo-100 dark:border-indigo-800">
                <div className="text-center">
                  {/* Welcome Icon */}
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUser className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Welcome Text */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Chào mừng bạn trở lại!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    Hãy chọn một mục từ menu bên trái để cập nhật thông tin hồ sơ của bạn. 
                    Hoàn thiện hồ sơ sẽ giúp bạn có cơ hội tốt hơn trong việc tìm kiếm công việc.
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {profile?.skills?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Kỹ năng</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile?.experience?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Kinh nghiệm</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-pink-200 dark:border-pink-700">
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {profile?.education?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Học vấn</div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setEditingSection('Thông tin cơ bản')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaUser className="w-4 h-4" />
                      Cập nhật thông tin cơ bản
                    </button>
                    <button
                      onClick={() => setEditingSection('Kỹ năng')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FaBriefcase className="w-4 h-4" />
                      Thêm kỹ năng
                    </button>
                    <button
                      onClick={() => setEditingSection('Sở thích công việc')}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <FaGlobe className="w-4 h-4" />
                      Cập nhật sở thích
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandidateProfile; 