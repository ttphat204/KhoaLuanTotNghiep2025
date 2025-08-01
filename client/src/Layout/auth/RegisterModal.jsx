import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError } from '../../utils/toast';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaEyeSlash, FaVenusMars } from 'react-icons/fa';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: 'easeIn' } },
};

const RegisterModal = ({ onClose, onOpenLoginModal }) => {
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

  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    district: '',
    ward: '',
    city: '',
    role: 'candidate',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  useEffect(() => {
    if (form.city) {
      const selected = provinces.find(p => p.name === form.city);
      setDistricts(selected ? selected.districts : []);
      setForm(f => ({ ...f, district: '', ward: '' }));
      setWards([]);
    }
  }, [form.city, provinces]);

  useEffect(() => {
    if (form.district) {
      const selected = districts.find(d => d.name === form.district);
      setWards(selected ? selected.wards : []);
      setForm(f => ({ ...f, ward: '' }));
    }
  }, [form.district, districts]);

  useEffect(() => {
    const address = `${form.city || ''}, ${form.district || ''}, ${form.ward || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '');
    setForm(f => ({ ...f, address }));
  }, [form.city, form.district, form.ward]);

  const validate = () => {
    const newErrors = {};
    
    if (!form.email) newErrors.email = 'Email không được để trống';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    
    if (!form.phone) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^0\d{9,10}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    
    if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    
    if (!form.fullName) newErrors.fullName = 'Họ và tên không được để trống';
    
    // Validation cho candidate
    if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!form.district) newErrors.district = 'Vui lòng nhập quận/huyện';
    if (!form.ward) newErrors.ward = 'Vui lòng nhập phường/xã';
    if (!form.city) newErrors.city = 'Vui lòng nhập thành phố';
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined });
    
    if (name === 'role') {
      setForm(prev => ({
        ...prev,
        [name]: value,
        gender: '',
        dateOfBirth: '',
        district: '',
        ward: '',
        city: '',
        address: ''
      }));
      setErrors({});
    }
  };

  const getApiEndpoint = () => {
    return 'https://be-khoaluan.vercel.app/api/auth/register/candidate';
  };

  const getPayload = () => {
    return {
      email: form.email,
      phone: form.phone,
      password: form.password,
      fullName: form.fullName,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      city: form.city,
      district: form.district,
      ward: form.ward
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    
    const payload = getPayload();
    const endpoint = getApiEndpoint();
    
    
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      
      if (res.ok) {
        showSuccess(`Đăng ký tài khoản ${form.role} thành công!`);
        if (onClose) onClose();
        if (onOpenLoginModal) onOpenLoginModal();
      } else {
        showError(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      console.error('Registration error:', err);
      showError('Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'employer': return 'Nhà tuyển dụng';
      case 'candidate': return 'Ứng viên';
      default: return 'Ứng viên';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'employer': return '🏢';
      case 'candidate': return '👤';
      default: return '👤';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex w-full max-w-5xl mx-4 relative overflow-hidden modal-content border border-white/30"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            maxHeight: '90vh',
            width: '100%',
            margin: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            zIndex: 10000
          }}
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-700 hover:text-gray-900 z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            &times;
          </button>

          {/* Cột trái: Form */}
          <div className="flex-[6] p-4 flex flex-col justify-center min-w-[400px] bg-white/30 backdrop-blur-sm">
                        <div className="text-center mb-3">
              <div className="text-xl font-bold text-gray-900">Đăng ký tài khoản ứng viên</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
                            {/* Basic Info Section */}
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
                  <FaUser className="mr-2 text-indigo-600" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-4 w-4 text-gray-400" />
                        </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Nhập email của bạn"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-400' : 'border-white/30'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 placeholder-gray-600 text-sm`}
                        required
                      />
                    </div>
                    {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.phone ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 placeholder-gray-600`}
                        required
                      />
                    </div>
                    {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.fullName ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 placeholder-gray-600`}
                        required
                      />
                    </div>
                    {errors.fullName && <div className="text-xs text-red-600 mt-1">{errors.fullName}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3 border ${errors.password ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 placeholder-gray-600`}
                        required
                        autoComplete="new-password"
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
                    {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
                  </div>
                </div>
              </div>

                            {/* Candidate specific fields */}
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
                  <FaUser className="mr-2 text-indigo-600" />
                  Thông tin cá nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaVenusMars className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.gender ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 disabled:bg-white/30 disabled:cursor-not-allowed`}
                        required
                      >
                        <option value="" className="text-gray-900">Chọn giới tính</option>
                        <option value="Male" className="text-gray-900">Nam</option>
                        <option value="Female" className="text-gray-900">Nữ</option>
                        <option value="Other" className="text-gray-900">Khác</option>
                      </select>
                    </div>
                    {errors.gender && <div className="text-xs text-red-600 mt-1">{errors.gender}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.dateOfBirth ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900`}
                        required
                      />
                    </div>
                    {errors.dateOfBirth && <div className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.city ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 disabled:bg-white/30 disabled:cursor-not-allowed`}
                        required
                      >
                        <option value="" className="text-gray-900">Chọn tỉnh/thành phố</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.name} className="text-gray-900">{p.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.city && <div className="text-xs text-red-600 mt-1">{errors.city}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.district ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 disabled:bg-white/30 disabled:cursor-not-allowed`}
                        required
                        disabled={!form.city}
                      >
                        <option value="" className="text-gray-900">Chọn quận/huyện</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.name} className="text-gray-900">{d.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.district && <div className="text-xs text-red-600 mt-1">{errors.district}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.ward ? 'border-red-400' : 'border-white/30'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/60 focus:bg-white/80 text-gray-900 disabled:bg-white/30 disabled:cursor-not-allowed`}
                        required
                        disabled={!form.district}
                      >
                        <option value="" className="text-gray-900">Chọn phường/xã</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.name} className="text-gray-900">{w.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.ward && <div className="text-xs text-red-600 mt-1">{errors.ward}</div>}
                  </div>
                </div>
              </div>

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
                    <FaUser className="mr-3" />
                    Đăng ký Ứng viên
                  </div>
                )}
              </button>

              <div className="text-center">
                <span className="text-gray-700">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors duration-200"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Banner */}
          <div className="hidden lg:flex flex-[4] items-stretch justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 relative rounded-r-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
            </div>
            
                          <div className="flex flex-col items-center justify-center text-white text-center relative z-10">
                {/* Logo */}
                <div className="mb-6">
                  <div className="text-2xl font-bold mb-2">JobFinder</div>
                  <div className="text-sm opacity-90">Nền tảng tuyển dụng hàng đầu</div>
                </div>
                
                {/* Main content */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">Bắt đầu hành trình</h2>
                  <h3 className="text-lg font-semibold drop-shadow-lg opacity-90">Tìm việc làm mơ ước</h3>
                </div>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Hàng nghìn việc làm chất lượng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Ứng tuyển nhanh chóng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Kết nối trực tiếp với nhà tuyển dụng</span>
                </div>
              </div>
              
                              {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm opacity-80">Việc làm</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm opacity-80">Công ty</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Ứng viên</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterModal; 