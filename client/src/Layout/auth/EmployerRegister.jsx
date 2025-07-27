import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../shared/Header';
import { showSuccess, showError } from '../../utils/toast';

const EmployerRegister = () => {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Đăng ký nhà tuyển dụng
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{' '}
              <a href="/employer/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                đăng nhập nếu đã có tài khoản
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thông tin cơ bản */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Tên công ty"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Ngành nghề <span className="text-red-500">*</span>
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Ví dụ: Công nghệ thông tin"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ công ty</h3>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  disabled={locationLoading}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.cityCode}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                >
                  <option value="">
                    {locationLoading ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                  </option>
                  {locationData.provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  Quận/Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  disabled={!formData.cityCode || locationData.districts.length === 0}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.districtCode}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">
                    {!formData.cityCode ? 'Chọn tỉnh/thành phố trước' : 
                     locationData.districts.length === 0 ? 'Đang tải...' : 'Chọn quận/huyện'}
                  </option>
                  {locationData.districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select
                  id="ward"
                  name="ward"
                  required
                  disabled={!formData.districtCode || locationData.wards.length === 0}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.wardCode}
                  onChange={(e) => handleWardChange(e.target.value)}
                >
                  <option value="">
                    {!formData.districtCode ? 'Chọn quận/huyện trước' : 
                     locationData.wards.length === 0 ? 'Đang tải...' : 'Chọn phường/xã'}
                  </option>
                  {locationData.wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                  Quy mô công ty
                </label>
                <input
                  id="companySize"
                  name="companySize"
                  type="number"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Số nhân viên"
                  value={formData.companySize}
                  onChange={handleChange}
                />
              </div>

              {/* Thông tin bổ sung */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bổ sung</h3>
              </div>

              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                  Website công ty
                </label>
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                  Năm thành lập
                </label>
                <input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Ví dụ: 2020"
                  value={formData.foundedYear}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                  Mô tả công ty
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows="3"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mô tả về công ty, lĩnh vực hoạt động..."
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>

              {/* Mật khẩu */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tài khoản</h3>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu (ít nhất 8 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployerRegister; 