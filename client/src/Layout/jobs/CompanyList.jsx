import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaIndustry, FaUsers, FaSearch, FaFilter, FaStar, FaBriefcase } from 'react-icons/fa';
import Header from '../shared/Header';
import Footer from '../../components/Footer';

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Fetch jobs để lấy danh sách employer IDs
      const response = await fetch('https://be-khoaluan.vercel.app/api/job/all?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      const allJobs = data.data || data.jobs || [];
      
      // Lọc và nhóm các công ty từ jobs
      const companyMap = new Map();
      allJobs.forEach(job => {
        const employerId = job.employerId;
        if (employerId) {
          const companyId = typeof employerId === 'object' ? employerId._id : employerId;
          if (!companyMap.has(companyId)) {
            companyMap.set(companyId, {
              _id: companyId,
              companyName: employerId.companyName || job.companyName || 'Không xác định',
              companyLogoUrl: employerId.companyLogoUrl || job.employerLogo || job.companyLogoUrl || '/default-logo.png',
              companyAddress: employerId.companyAddress || 'Chưa cập nhật',
              industry: employerId.industry || 'Chưa cập nhật',
              companySize: employerId.companySize || 'Chưa cập nhật',
              companyDescription: employerId.companyDescription || 'Chưa có mô tả',
              jobCount: 1,
              location: job.location
            });
          } else {
            companyMap.get(companyId).jobCount += 1;
          }
        }
      });
      
      // Lấy thông tin chi tiết cho từng công ty
      const companiesList = Array.from(companyMap.values());
      const detailedCompanies = await Promise.all(
        companiesList.map(async (company) => {
          try {
            const companyResponse = await fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${company._id}`);
            if (companyResponse.ok) {
              const companyData = await companyResponse.json();
              if (companyData.success) {
                return {
                  ...company,
                  ...companyData.data,
                  companyName: companyData.data.companyName || company.companyName,
                  companyLogoUrl: companyData.data.companyLogoUrl || company.companyLogoUrl,
                  companyAddress: companyData.data.companyAddress || company.companyAddress,
                  industry: companyData.data.industry || company.industry,
                  companySize: companyData.data.companySize || company.companySize,
                  companyDescription: companyData.data.companyDescription || company.companyDescription,
                  companyEmail: companyData.data.companyEmail,
                  companyPhoneNumber: companyData.data.companyPhoneNumber,
                  companyWebsite: companyData.data.companyWebsite,
                  foundedYear: companyData.data.foundedYear
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching details for company ${company._id}:`, error);
          }
          return company;
        })
      );
      
      setCompanies(detailedCompanies);
      
      // Tạo danh sách industries và locations
      const uniqueIndustries = [...new Set(detailedCompanies.map(c => c.industry).filter(Boolean))];
      const uniqueLocations = [...new Set(detailedCompanies.map(c => {
        if (c.location) {
          if (typeof c.location === 'string') return c.location;
          return [c.location.addressDetail, c.location.district, c.location.province].filter(Boolean).join(', ');
        }
        return c.companyAddress;
      }).filter(Boolean))];
      
      setIndustries(uniqueIndustries);
      setLocations(uniqueLocations);
      
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = (location, address) => {
    if (location) {
      if (typeof location === 'string') return location;
      return [location.addressDetail, location.district, location.province].filter(Boolean).join(', ');
    }
    return address || 'Chưa cập nhật';
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesLocation = !selectedLocation || 
                           getLocation(company.location, company.companyAddress).includes(selectedLocation);
    
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Header Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Khám phá các công ty
                  </h1>
                  <p className="text-lg text-blue-100 font-medium">
                    Tìm hiểu về các công ty đang tuyển dụng và cơ hội nghề nghiệp
                  </p>
                </div>
                
                {/* Stats */}
                <div className="mt-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{companies.length}</div>
                      <div className="text-sm text-blue-100">Công ty</div>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {companies.reduce((total, company) => total + company.jobCount, 0)}
                      </div>
                      <div className="text-sm text-blue-100">Việc làm</div>
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

          {/* Search và Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm công ty, ngành nghề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              
              {/* Industry Filter */}
              <div>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Tất cả ngành nghề</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              {/* Location Filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Tất cả địa điểm</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredCompanies.length} công ty được tìm thấy
              </h2>
              <div className="text-gray-600 bg-gray-50 px-3 py-1 rounded-lg text-sm">
                Hiển thị {filteredCompanies.length} kết quả
              </div>
            </div>
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <div key={company._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                {/* Company Header with Gradient */}
                <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md ring-2 ring-white">
                      <img 
                        src={company.companyLogoUrl} 
                        alt={company.companyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center hidden">
                        <FaBuilding className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{company.companyName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <FaIndustry className="text-indigo-500" />
                        <span className="truncate font-medium">{company.industry}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      <FaMapMarkerAlt className="mr-3 text-red-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium truncate">
                        {getLocation(company.location, company.companyAddress)}
                      </span>
                    </div>
                    
                    {company.companySize !== 'Chưa cập nhật' && (
                      <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <FaUsers className="mr-3 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{company.companySize}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      <FaBriefcase className="mr-3 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{company.jobCount} việc làm đang tuyển</span>
                    </div>
                  </div>

                  {/* Description */}
                  {company.companyDescription && company.companyDescription !== 'Chưa có mô tả' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {company.companyDescription}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    <button 
                      onClick={() => navigate(`/companies/${company._id}`)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBuilding className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy công ty</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm công ty phù hợp
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedIndustry('');
                    setSelectedLocation('');
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyList; 