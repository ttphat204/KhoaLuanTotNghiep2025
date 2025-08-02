import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import { showSuccess, showError } from '../../utils/toast';
import { FaBuilding, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaGlobe, FaCalendarAlt, FaUsers, FaIndustry, FaEye, FaEyeSlash } from 'react-icons/fa';

const EmployerRegister = () => {
  // Add blob animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    cityCode: '',
    district: '',
    districtCode: '',
    ward: '',
    wardCode: '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    companyDescription: '',
    foundedYear: ''
  });

  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    wards: []
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    try {
      setLocationLoading(true);
      const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setLocationData(prev => ({
          ...prev,
          provinces: data
        }));
      } else {
        showError('Không thể tải danh sách tỉnh/thành phố');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      showError('Lỗi khi tải danh sách tỉnh/thành phố');
    } finally {
      setLocationLoading(false);
    }
  };

  // Lấy danh sách quận/huyện
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await response.json();
      
      if (data && data.districts) {
        setLocationData(prev => ({
          ...prev,
          districts: data.districts,
          wards: []
        }));
      } else {
        setLocationData(prev => ({
          ...prev,
          districts: [],
          wards: []
        }));
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setLocationData(prev => ({
        ...prev,
        districts: [],
        wards: []
      }));
    }
  };

  // Lấy danh sách phường/xã
  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await response.json();
      
      if (data && data.wards) {
        setLocationData(prev => ({
          ...prev,
          wards: data.wards
        }));
      } else {
        setLocationData(prev => ({
          ...prev,
          wards: []
        }));
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      setLocationData(prev => ({
        ...prev,
        wards: []
      }));
    }
  };

  // Khi chọn tỉnh/thành phố
  const handleProvinceChange = async (provinceCode) => {
    const selectedProvince = locationData.provinces.find(p => p.code === parseInt(provinceCode));
    
    setFormData({
      ...formData,
      city: selectedProvince ? selectedProvince.name : '',
      cityCode: provinceCode,
      district: '',
      districtCode: '',
      ward: '',
      wardCode: ''
    });

    if (provinceCode) {
      await fetchDistricts(provinceCode);
    } else {
      setLocationData(prev => ({
        ...prev,
        districts: [],
        wards: []
      }));
    }
  };

  // Khi chọn quận/huyện
  const handleDistrictChange = async (districtCode) => {
    const selectedDistrict = locationData.districts.find(d => d.code === parseInt(districtCode));
    
    setFormData({
      ...formData,
      district: selectedDistrict ? selectedDistrict.name : '',
      districtCode: districtCode,
      ward: '',
      wardCode: ''
    });

    if (districtCode) {
      await fetchWards(districtCode);
    } else {
      setLocationData(prev => ({
        ...prev,
        wards: []
      }));
    }
  };

  // Khi chọn phường/xã
  const handleWardChange = (wardCode) => {
    const selectedWard = locationData.wards.find(w => w.code === parseInt(wardCode));
    
    setFormData({
      ...formData,
      ward: selectedWard ? selectedWard.name : '',
      wardCode: wardCode
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.companyName || !formData.email || !formData.password || !formData.phone || 
        !formData.city || !formData.district || !formData.ward || !formData.industry) {
      showError('Vui lòng điền đầy đủ thông tin bắt buộc');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      showError('Mật khẩu phải có ít nhất 8 ký tự');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://be-khoaluan.vercel.app/api/auth/register/employer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          industry: formData.industry,
          companySize: formData.companySize || undefined,
          companyWebsite: formData.companyWebsite || undefined,
          companyDescription: formData.companyDescription || undefined,
          foundedYear: formData.foundedYear || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Đăng ký thành công! Vui lòng chờ admin duyệt tài khoản.');
        navigate('/employer/login');
      } else {
        showError(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          animationDelay: '2s',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{
          animation: 'blob 7s infinite',
          animationDelay: '4s',
          transform: 'translate(0px, 0px) scale(1)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      
      {/* Additional Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
      
      {/* Subtle Lines */}
      <div className="absolute top-1/3 left-0 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-1/3 right-0 w-32 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
      
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl w-full">
          {/* Register Card */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
              </div>
              
                             {/* Content */}
               <div className="relative z-10">
                 <h1 className="text-3xl font-bold text-white mb-2">Đăng ký nhà tuyển dụng</h1>
                 <p className="text-indigo-100 text-lg">Tham gia cộng đồng tuyển dụng hàng đầu</p>
               </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            </div>

            {/* Form Section */}
            <div className="p-8 bg-white/10 backdrop-blur-sm">
              {/* Login Link */}
              <div className="text-center mb-8">
                <p className="text-white text-sm font-medium">
                  Đã có tài khoản?{' '}
                  <a 
                    href="/employer/login" 
                    className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors duration-200"
                  >
                    Đăng nhập ngay
              </a>
            </p>
              </div>
              
              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin cơ bản */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaBuilding className="mr-3 text-indigo-300" />
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-white mb-2">
                        Tên công ty <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaBuilding className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Tên công ty"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                      </div>
              </div>

              <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                        Email <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                          placeholder="Email công ty"
                  value={formData.email}
                  onChange={handleChange}
                />
                      </div>
              </div>

              <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                        Số điện thoại <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
                      </div>
              </div>

              <div>
                      <label htmlFor="industry" className="block text-sm font-semibold text-white mb-2">
                        Ngành nghề <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaIndustry className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  required
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Ví dụ: Công nghệ thông tin"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
                    </div>
                  </div>
              </div>

                {/* Địa chỉ công ty */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-indigo-300" />
                    Địa chỉ công ty
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                        Tỉnh/Thành phố <span className="text-red-400">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  disabled={locationLoading}
                        className="block w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white disabled:bg-white/10 disabled:cursor-not-allowed"
                  value={formData.cityCode}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                >
                  <option value="">
                    {locationLoading ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                  </option>
                  {locationData.provinces.map((province) => (
                          <option key={province.code} value={province.code} className="text-gray-900">
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                      <label htmlFor="district" className="block text-sm font-semibold text-white mb-2">
                        Quận/Huyện <span className="text-red-400">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  disabled={!formData.cityCode || locationData.districts.length === 0}
                        className="block w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white disabled:bg-white/10 disabled:cursor-not-allowed"
                  value={formData.districtCode}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">
                    {!formData.cityCode ? 'Chọn tỉnh/thành phố trước' : 
                     locationData.districts.length === 0 ? 'Đang tải...' : 'Chọn quận/huyện'}
                  </option>
                  {locationData.districts.map((district) => (
                          <option key={district.code} value={district.code} className="text-gray-900">
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                      <label htmlFor="ward" className="block text-sm font-semibold text-white mb-2">
                        Phường/Xã <span className="text-red-400">*</span>
                </label>
                <select
                  id="ward"
                  name="ward"
                  required
                  disabled={!formData.districtCode || locationData.wards.length === 0}
                        className="block w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white disabled:bg-white/10 disabled:cursor-not-allowed"
                  value={formData.wardCode}
                  onChange={(e) => handleWardChange(e.target.value)}
                >
                  <option value="">
                    {!formData.districtCode ? 'Chọn quận/huyện trước' : 
                     locationData.wards.length === 0 ? 'Đang tải...' : 'Chọn phường/xã'}
                  </option>
                  {locationData.wards.map((ward) => (
                          <option key={ward.code} value={ward.code} className="text-gray-900">
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                      <label htmlFor="companySize" className="block text-sm font-semibold text-white mb-2">
                  Quy mô công ty
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUsers className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="companySize"
                  name="companySize"
                  type="number"
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Số nhân viên"
                  value={formData.companySize}
                  onChange={handleChange}
                />
                      </div>
                    </div>
                  </div>
              </div>

              {/* Thông tin bổ sung */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaGlobe className="mr-3 text-indigo-300" />
                    Thông tin bổ sung
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <label htmlFor="companyWebsite" className="block text-sm font-semibold text-white mb-2">
                  Website công ty
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaGlobe className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
                      </div>
              </div>

              <div>
                      <label htmlFor="foundedYear" className="block text-sm font-semibold text-white mb-2">
                  Năm thành lập
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                          className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Ví dụ: 2020"
                  value={formData.foundedYear}
                  onChange={handleChange}
                />
                      </div>
              </div>

              <div className="md:col-span-2">
                      <label htmlFor="companyDescription" className="block text-sm font-semibold text-white mb-2">
                  Mô tả công ty
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows="3"
                        className="block w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300 resize-none"
                  placeholder="Mô tả về công ty, lĩnh vực hoạt động..."
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>
                  </div>
              </div>

                {/* Tài khoản */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaLock className="mr-3 text-indigo-300" />
                    Tài khoản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                        Mật khẩu <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="password"
                  name="password"
                          type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                          className="block w-full pl-12 pr-12 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Mật khẩu (ít nhất 8 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
              </div>

              <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                        Xác nhận mật khẩu <span className="text-red-400">*</span>
                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                          className="block w-full pl-12 pr-12 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
              </div>
            </div>

                {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang đăng ký...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaBuilding className="mr-3" />
                        Đăng ký nhà tuyển dụng
                      </div>
                    )}
              </button>
            </div>
          </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/70 text-xs">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="/terms" className="text-white hover:text-indigo-300">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="/privacy" className="text-white hover:text-indigo-300">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerRegister; 