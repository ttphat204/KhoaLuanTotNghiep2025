import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showSuccess, showError, showLoading, updateLoading, showInfo } from '../../utils/toast.jsx';

const IMGUR_CLIENT_ID = '5460b1e0e6b7b7a'; // Thay bằng client id của bạn nếu cần
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Thay bằng upload preset của bạn
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Thay bằng cloud name của bạn

const EmployerRegister = () => {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    companyName: '',
    city: '',
    district: '',
    ward: '',
    industry: '',
    companyLogoUrl: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
    
    // Chỉ hiển thị thông báo nếu chưa từng hiển thị trong session này
    if (!sessionStorage.getItem('employerRegisterInfoToastShown')) {
      showInfo('Vui lòng điền đầy đủ thông tin để đăng ký tài khoản nhà tuyển dụng. Tài khoản sẽ được admin duyệt trong thời gian sớm nhất.', 'Hướng dẫn đăng ký');
      sessionStorage.setItem('employerRegisterInfoToastShown', 'true');
    }
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear validation errors when user starts typing
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      // Don't show error while typing, only validate on submit
    }
    
    if (name === 'phone' && value && !/^[0-9]{10,11}$/.test(value)) {
      // Don't show error while typing, only validate on submit
    }
    
    if (name === 'password' && value && value.length < 8) {
      // Don't show error while typing, only validate on submit
    }
  };

  const validateForm = () => {
    if (!form.email || !form.phone || !form.password || !form.companyName || !form.city || !form.district || !form.ward || !form.industry) {
      showError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showError('Email không hợp lệ!');
      return false;
    }
    
    // Validate phone (Vietnamese phone number)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(form.phone)) {
      showError('Số điện thoại không hợp lệ! (10-11 số)');
      return false;
    }
    
    // Validate password
    if (form.password.length < 8) {
      showError('Mật khẩu phải có ít nhất 8 ký tự!');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }
    
    const loadingToast = showLoading('Đang đăng ký tài khoản...');
    
    try {
      const payload = { ...form };
      const res = await fetch('https://be-khoaluan.vercel.app/api/auth/register/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        updateLoading(loadingToast, data.message || 'Đăng ký thất bại!', 'error');
        return;
      }
      
      updateLoading(loadingToast, 'Đăng ký thành công! Vui lòng chờ admin duyệt tài khoản.', 'success');
      
      // Reset form
      setForm({
        email: '',
        phone: '',
        password: '',
        companyName: '',
        city: '',
        district: '',
        ward: '',
        industry: '',
        companyLogoUrl: ''
      });
      
      // Reset dropdowns
      setDistricts([]);
      setWards([]);
      
      // Chuyển hướng sau 3 giây
      setTimeout(() => navigate('/employer/login'), 3000);
      
    } catch (err) {
      updateLoading(loadingToast, 'Lỗi kết nối máy chủ!', 'error');
    }
  };

  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, companyLogoUrl: reader.result }));
    };
    reader.readAsDataURL(file); // Chuyển file thành base64
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Đăng ký tài khoản nhà tuyển dụng</h2>
        <div className="font-bold text-xl mb-6 text-gray-700">Thông tin tài khoản</div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Email <span className="text-red-500">*</span></label>
            <input name="email" placeholder="Điền email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"/>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Số điện thoại <span className="text-red-500">*</span></label>
            <input name="phone" placeholder="Điền số điện thoại" value={form.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"/>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Mật khẩu <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Điền mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="font-bold text-xl mt-8 mb-6 text-gray-700">Thông tin công ty</div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Tên công ty <span className="text-red-500">*</span></label>
            <span className="block text-xs text-gray-500 mb-1">Theo giấy phép kinh doanh</span>
            <input name="companyName" placeholder="Điền tên công ty" value={form.companyName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"/>
          </div>

          <div>
            <label className="block font-semibold mb-1">Logo công ty</label>
            <input
              type="text"
              name="companyLogoUrl"
              value={form.companyLogoUrl}
              onChange={e => setForm({ ...form, companyLogoUrl: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Dán link ảnh logo công ty (nếu có)"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFile}
              className="mb-2"
            />
            {form.companyLogoUrl && (
              <img src={form.companyLogoUrl} alt="Logo preview" className="h-16 mt-2 rounded border" />
            )}
          </div>
          
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
            <select name="city" value={form.city} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:border-indigo-500">
              <option value="">Chọn tỉnh thành phố</option>
              {provinces.map(city => <option key={city.code} value={city.name}>{city.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Quận/Huyện <span className="text-red-500">*</span></label>
            <select name="district" value={form.district} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:border-indigo-500" disabled={!form.city}>
              <option value="">Chọn quận/huyện</option>
              {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Phường/Xã <span className="text-red-500">*</span></label>
            <select name="ward" value={form.ward} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:border-indigo-500" disabled={!form.district}>
              <option value="">Chọn phường/xã</option>
              {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">Lĩnh vực hoạt động <span className="text-red-500">*</span></label>
            <input name="industry" placeholder="Lĩnh vực hoạt động" value={form.industry} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"/>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="text-gray-700 text-sm">
              Bạn đã có tài khoản?{' '}
              <Link to="/employer/login" className="text-[#4B1CD6] font-semibold hover:underline">Đăng nhập</Link>
            </div>
            <button type="submit" className="bg-[#4B1CD6] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#3a13b3] transition-colors">Hoàn thành đăng ký</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployerRegister; 