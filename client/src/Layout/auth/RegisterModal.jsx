import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError } from '../../utils/toast';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: 'easeIn' } },
};

const RegisterModal = ({ onClose, onOpenLoginModal }) => {
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
    
    console.log('Payload gửi lên:', payload);
    console.log('Endpoint:', endpoint);
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('API response:', data);
      
      if (res.ok) {
        toast.success(`Đăng ký tài khoản ${form.role} thành công!`);
        if (onClose) onClose();
        if (onOpenLoginModal) onOpenLoginModal();
      } else {
        toast.error(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Lỗi kết nối máy chủ!');
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
          className="bg-white rounded-2xl shadow-2xl flex w-full max-w-5xl mx-4 relative overflow-hidden modal-content"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            maxHeight: '90vh',
            width: '100%',
            margin: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 10000
          }}
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            &times;
          </button>

          {/* Cột trái: Form */}
          <div className="flex-1 p-8 flex flex-col justify-center min-w-[400px] max-w-[500px]">
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-gray-900 mb-2">Đăng ký tài khoản ứng viên</div>
              <div className="text-gray-600">Tạo tài khoản mới để bắt đầu hành trình tìm việc</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    />
                    {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    />
                    {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ và tên"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    />
                    {errors.fullName && <div className="text-xs text-red-500 mt-1">{errors.fullName}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    />
                    {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                  </div>
                </div>
              </div>

              {/* Candidate specific fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Thông tin cá nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính *
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                    {errors.gender && <div className="text-xs text-red-500 mt-1">{errors.gender}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    />
                    {errors.dateOfBirth && <div className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố *
                    </label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện *
                    </label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                      disabled={!form.city}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                    {errors.district && <div className="text-xs text-red-500 mt-1">{errors.district}</div>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã *
                    </label>
                    <select
                      name="ward"
                      value={form.ward}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.ward ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-200`}
                      required
                      disabled={!form.district}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.name}>{w.name}</option>
                      ))}
                    </select>
                    {errors.ward && <div className="text-xs text-red-500 mt-1">{errors.ward}</div>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4B1CD6] hover:bg-[#3a13b3] disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký Ứng viên'}
              </button>

              <div className="text-center">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="text-[#4B1CD6] font-medium hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Banner */}
          <div className="hidden lg:flex flex-[1.2] items-stretch justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 relative rounded-r-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center text-white text-center relative z-10">
              {/* Logo */}
              <div className="mb-8">
                <div className="text-3xl font-bold mb-2">JobFinder</div>
                <div className="text-lg opacity-90">Nền tảng tuyển dụng hàng đầu</div>
              </div>
              
              {/* Main content */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Bắt đầu hành trình</h2>
                <h3 className="text-xl font-semibold drop-shadow-lg opacity-90">Tìm việc làm mơ ước</h3>
              </div>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
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
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterModal; 