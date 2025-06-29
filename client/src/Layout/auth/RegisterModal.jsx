import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

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

  const validate = () => {
    const newErrors = {};
    // Email regex
    if (!form.email) newErrors.email = 'Email không được để trống';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    // Phone regex (10-11 số, bắt đầu bằng 0)
    if (!form.phone) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^0\d{9,10}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (!form.fullName) newErrors.fullName = 'Họ và tên không được để trống';
    if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!form.district) newErrors.district = 'Vui lòng nhập quận/huyện';
    if (!form.ward) newErrors.ward = 'Vui lòng nhập phường/xã';
    if (!form.city) newErrors.city = 'Vui lòng nhập thành phố';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    console.log('Payload gửi lên:', form);
    try {
      const res = await fetch('https://be-khoaluan.vercel.app/api/auth/register/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('API response:', data);
      if (res.ok) {
        toast.success('Đăng ký thành công!');
        if (onClose) onClose();
        if (onOpenLoginModal) onOpenLoginModal();
      } else {
        toast.error(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.18 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl max-w-md w-full mx-4 relative overflow-hidden max-h-screen overflow-y-auto outline-none border-none flex flex-col items-center"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-400 hover:text-[#4B1CD6] z-10 transition-colors"
            onClick={onClose}
            aria-label="Đóng"
          >
            &times;
          </button>
          <div className="p-8 md:p-10 w-full bg-white flex flex-col items-center">
            <div className="text-center mb-8 w-full">
              <div className="text-lg font-semibold text-gray-700 mb-1">Người tìm việc</div>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">Đăng ký</div>
              <div className="text-base text-gray-400">Tạo tài khoản mới để bắt đầu</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 w-full flex flex-col items-center">
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                />
                {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
              </div>
              <div className="w-full">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                />
                {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
              </div>
              <div className="w-full">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                />
                {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
              </div>
              <div className="w-full">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                />
                {errors.fullName && <div className="text-xs text-red-500 mt-1">{errors.fullName}</div>}
              </div>
              <div className="w-full">
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                >
                  <option value="">Chọn thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
                {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
              </div>
              <div className="w-full">
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.district ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-150 shadow-sm focus:bg-white`}
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
              <div className="w-full">
                <select
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.ward ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base transition-all duration-150 shadow-sm focus:bg-white`}
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
              <div className="w-full">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
                {errors.gender && <div className="text-xs text-red-500 mt-1">{errors.gender}</div>}
              </div>
              <div className="w-full">
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Ngày sinh"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 focus:outline-none focus:border-[#4B1CD6] text-base placeholder-gray-400 transition-all duration-150 shadow-sm focus:bg-white`}
                  required
                />
                {errors.dateOfBirth && <div className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</div>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold py-3 rounded-2xl text-lg transition-all duration-200 mt-4 shadow-md disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterModal; 