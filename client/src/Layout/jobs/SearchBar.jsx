import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import img1 from '../../assets/images/1.png';
import img6 from '../../assets/images/6.png';
import img12 from '../../assets/images/12.png';
import img13 from '../../assets/images/13.png';
import img17 from '../../assets/images/17.png';
import img26 from '../../assets/images/26.png';
import img34 from '../../assets/images/34.png';
import img53 from '../../assets/images/53.png';
import imgAll from '../../assets/images/all.png';
import bannerImg from '../../assets/images/banner-cts-timdungviec-pc_174740689238.jpg';

const jobTags = [
  'Kế toán',
  'Nhân Viên Văn Phòng',
  'Chăm sóc khách hàng',
  'Hành chính nhân sự',
  'Nhân Viên Bán Hàng',
];

const popularKeywords = [
  'Kế toán',
  'Nhân Viên Văn Phòng',
  'Chăm sóc khách hàng',
  'Hành chính nhân sự',
  'Nhân Viên Bán Hàng',
];

const jobProfessions = [
  'Hành chính - Thư ký',
  'Khách sạn - Nhà hàng - Du lịch',
  'Bán sỉ - Bán lẻ - Quản lý cửa hàng',
  'Marketing',
  'Bán hàng - Kinh doanh',
  'Kế toán',
  'Tài chính - Đầu tư - Chứng Khoán',
  // ... thêm nghề khác nếu muốn
];

const jobCategories = [
  { icon: <img src={img6} alt="Bán sỉ - Bán lẻ - Quản lý cửa hàng" className="w-8 h-8" />, count: '3,107', label: 'Bán sỉ - Bán lẻ - Quản lý cửa hàng' },
  { icon: <img src={img13} alt="Bán hàng - Kinh doanh" className="w-8 h-8" />, count: '7,376', label: 'Bán hàng - Kinh doanh' },
  { icon: <img src={img12} alt="Marketing" className="w-8 h-8" />, count: '1,888', label: 'Marketing' },
  { icon: <img src={img34} alt="Khoa học - Kỹ thuật" className="w-8 h-8" />, count: '1,756', label: 'Khoa học - Kỹ thuật' },
  { icon: <img src={img26} alt="Kiểm toán" className="w-8 h-8" />, count: '1,150', label: 'Kiểm toán' },
  { icon: <img src={img1} alt="Hành chính - Thư ký" className="w-8 h-8" />, count: '2,263', label: 'Hành chính - Thư ký' },
  { icon: <img src={img17} alt="Kế toán" className="w-8 h-8" />, count: '2,375', label: 'Kế toán' },
  { icon: <img src={img53} alt="Thực tập sinh" className="w-8 h-8" />, count: '544', label: 'Thực tập sinh' },
  { icon: <img src={imgAll} alt="Tất cả các ngành" className="w-8 h-8" />, count: '', label: <span className="text-[#2c95ff] text-[1.25rem]" style={{fontSize: '16px', fontWeight: 'bold'}}>Tất cả các ngành</span>, all: true },
];

const SearchBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const inputRef = useRef(null);

  const handleProfessionToggle = (profession) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession]
    );
  };

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=2')
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  return (
    <div className="relative w-full">
      {/* Banner */}
      <div className="w-screen h-[320px] flex items-center justify-center relative overflow-hidden left-1/2 -translate-x-1/2">
        <img
          src={bannerImg}
          alt="Banner"
          className="absolute inset-0 w-screen h-full object-contain object-center z-0"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Overlay tối toàn màn hình khi dropdown từ khóa mở */}
      {showDropdown && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={() => setShowDropdown(false)}
          tabIndex={-1}
        />
      )}
      {/* Overlay cho dropdown nghề nghiệp và tỉnh thành (nền trong suốt) */}
      {(showProfessionDropdown || showProvinceDropdown) && !showDropdown && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 z-40"
          onClick={() => {
            setShowProfessionDropdown(false);
            setShowProvinceDropdown(false);
          }}
          tabIndex={-1}
        />
      )}

      {/* Search Box + Tags + Categories */}
      <div className="relative w-full flex justify-center" style={{ marginTop: '-80px' }}>
        {/* Hiệu ứng đổ bóng phía trên card */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-cyan-400 opacity-60 blur-2xl rounded-t-2xl z-0"></div>
        <div className="relative bg-white rounded-2xl shadow-xl flex flex-col p-0 max-w-6xl w-full z-50">
          {/* Hiệu ứng đổ màu nhẹ chỉ chiếm 20% phía trên card */}
          <div className="absolute left-0 top-0 w-full h-[20%] rounded-t-2xl bg-gradient-to-b from-cyan-100 via-white to-transparent opacity-70 blur-md pointer-events-none z-0"></div>
          <div className="relative z-10">
            {/* Search Row - Redesigned */}
            <div className="flex flex-col gap-0 p-6">
              <div className="flex flex-col md:flex-row items-stretch gap-0 w-full">
                {/* Vị trí */}
                <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-4 relative">
                  <FaSearch className="text-gray-400 mr-2 text-lg" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nhập vị trí muốn ứng tuyển"
                    className="w-full bg-transparent outline-none text-base placeholder-gray-400"
                    onFocus={() => {
                      setShowDropdown(true);
                      setShowProfessionDropdown(false);
                      setShowProvinceDropdown(false);
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  />
                  {/* Dropdown và glow */}
                  {showDropdown && (
                    <>
                      {/* Glow trắng bo góc, blur lớn, chỉ quanh dropdown, sát input */}
                      <div className="absolute left-0 top-[110%] w-full z-40 pointer-events-none">
                        <div className="w-full h-full rounded-2xl bg-white opacity-80 blur-lg"></div>
                      </div>
                      {/* Dropdown gợi ý, sát input, bo góc lớn, shadow vừa phải */}
                      <div className="absolute left-0 top-[110%] w-full bg-white rounded-2xl shadow-2xl z-50 p-6">
                        <div className="font-bold text-blue-500 mb-2 text-lg">Từ khóa phổ biến</div>
                        <ul>
                          {popularKeywords.map((kw, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded-lg cursor-pointer text-base"
                              onMouseDown={() => {
                                inputRef.current.value = kw;
                                setShowDropdown(false);
                              }}
                            >
                              <AiFillStar className="text-yellow-400 text-lg" />
                              <span className="font-medium text-gray-800">{kw}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                {/* Nghề nghiệp - custom dropdown */}
                <div className="flex items-center bg-white border-t md:border-t-0 border-b-0 border-l-0 border-r border-gray-200 px-4 h-14 min-w-[260px] shadow-sm relative w-full max-w-xs">
                  <FaBriefcase className="text-gray-400 mr-2 text-lg" />
                  <div
                    className="w-full cursor-pointer select-none text-base flex items-center justify-between"
                    onClick={() => {
                      setShowProfessionDropdown((v) => !v);
                      setShowDropdown(false);
                      setShowProvinceDropdown(false);
                    }}
                  >
                    <span className="flex gap-1 items-center w-full">
                      {selectedProfessions.length === 0 && (
                        <span className="truncate text-gray-700">Lọc theo nghề nghiệp</span>
                      )}
                      {selectedProfessions.length === 1 && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-sm font-medium truncate max-w-[120px] block">{selectedProfessions[0]}</span>
                      )}
                      {selectedProfessions.length > 1 && (
                        <>
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-sm font-medium truncate max-w-[100px]">{selectedProfessions[0]}</span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">+{selectedProfessions.length - 1}</span>
                        </>
                      )}
                    </span>
                    <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {showProfessionDropdown && (
                    <div className="absolute left-0 top-[110%] w-full bg-white rounded-2xl shadow-2xl z-50 p-4 max-h-[400px] overflow-y-auto border border-gray-100">
                      <div className="flex items-center mb-2">
                        <span className="uppercase text-xs font-bold text-gray-400 tracking-wider">Nghề nổi bật</span>
                        <div className="flex-1 border-t border-gray-200 ml-2"></div>
                      </div>
                      <div>
                        {jobProfessions.map((prof, idx) => (
                          <label key={idx} className="flex items-center gap-2 py-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedProfessions.includes(prof)}
                              onChange={() => handleProfessionToggle(prof)}
                              className="form-checkbox rounded-none border-2 border-blue-400 w-5 h-5 text-blue-500 focus:ring-0"
                            />
                            <span className="font-semibold text-base text-gray-800">{prof}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Tỉnh thành - fetch API */}
                <div className="flex items-center bg-white border-t md:border-t-0 border-b-0 border-l-0 border-r border-gray-200 px-4 h-14 min-w-[220px] shadow-sm relative w-full max-w-xs">
                  <FaMapMarkerAlt className="text-gray-400 mr-2 text-lg" />
                  <div
                    className="w-full cursor-pointer select-none text-base flex items-center justify-between"
                    onClick={() => {
                      setShowProvinceDropdown((v) => !v);
                      setShowDropdown(false);
                      setShowProfessionDropdown(false);
                    }}
                  >
                    <span className="truncate text-gray-700">
                      {selectedProvince && selectedDistrict
                        ? `${selectedProvince.name.replace('Tỉnh ', '').replace('Thành phố ', '')}, ${selectedDistrict.name.replace('Quận ', '').replace('Huyện ', '').replace('Thị xã ', '').replace('Thành phố ', '')}`
                        : selectedProvince
                          ? selectedProvince.name.replace('Tỉnh ', '').replace('Thành phố ', '')
                          : 'Toàn quốc'}
                    </span>
                    <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {showProvinceDropdown && (
                    <div className="absolute left-0 top-[110%] w-full bg-white rounded-2xl shadow-2xl z-50 p-0 max-h-[400px] overflow-y-auto border border-gray-100">
                      {/* Danh sách tỉnh/thành hoặc quận/huyện */}
                      {selectedProvince == null ? (
                        <>
                          <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-3 font-semibold text-base">Toàn quốc</div>
                          <div className="divide-y divide-gray-50">
                            <div
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base"
                              onClick={() => {
                                setSelectedProvince(null);
                                setSelectedDistrict(null);
                                setShowProvinceDropdown(false);
                              }}
                            >Toàn quốc</div>
                            {provinces.map((province) => (
                              <div
                                key={province.code}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer text-base"
                                onClick={() => {
                                  setSelectedProvince(province);
                                  setSelectedDistrict(null);
                                }}
                              >
                                <span>{province.name.replace('Tỉnh ', '').replace('Thành phố ', 'TP.')}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-3 flex items-center gap-2">
                            <button
                              className="text-gray-500 hover:text-blue-500 focus:outline-none"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedProvince(null);
                                setSelectedDistrict(null);
                              }}
                            >
                              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                              <span className="align-middle">Tỉnh/thành phố</span>
                            </button>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {selectedProvince.districts && selectedProvince.districts.length > 0 ? (
                              selectedProvince.districts.map((district) => (
                                <div
                                  key={district.code}
                                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base"
                                  onClick={() => {
                                    setSelectedDistrict(district);
                                    setShowProvinceDropdown(false);
                                  }}
                                >{district.name.replace('Quận ', '').replace('Huyện ', '').replace('Thị xã ', '').replace('Thành phố ', '')}</div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-400">Không có quận/huyện</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Button */}
                <button className="flex items-center gap-2 bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold px-8 h-14 rounded-r-xl text-base shadow-lg transition-all duration-200 w-full md:w-auto justify-center ml-0 md:ml-2 mt-2 md:mt-0">
                  <FaSearch className="text-lg" />
                  Tìm việc
                </button>
              </div>
            </div>

            {/* Job Tags */}
            <div className="flex flex-wrap gap-2 px-6 pb-2">
              {jobTags.map((tag, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-100 transition flex items-center gap-1">
                  <span className="text-blue-400 text-base">↗</span> {tag}
                </span>
              ))}
            </div>

            {/* Job Categories Row */}
            <div className="w-full px-4 pb-6">
              <div className="flex flex-row flex-wrap justify-between items-stretch gap-2 md:gap-0 overflow-x-auto">
                {jobCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center flex-1 min-w-[120px] max-w-[140px] py-2 px-1 bg-white rounded-2xl transition cursor-pointer border border-transparent hover:border-[#2c95ff] hover:shadow-lg ${cat.all ? 'text-blue-600 font-bold' : ''}`}
                  >
                    <div className="mb-1">{cat.icon}</div>
                    {cat.count && <div className="font-bold text-lg" style={{color: '#2c95ff'}}>{cat.count} <span className="text-xs font-normal text-gray-500">việc</span></div>}
                    <div className="text-sm text-gray-700 text-center mt-1 font-medium break-words w-full">{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 