import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai';
import img1 from '../../assets/images/bsbl.png';
import img2 from '../../assets/images/bhkd.png';
import img3 from '../../assets/images/marketing.png';
import img4 from '../../assets/images/khkt.png';
import img5 from '../../assets/images/kiemtoan.png';
import img6 from '../../assets/images/hc-tk.png';
import img7 from '../../assets/images/kt.png';
import img8 from '../../assets/images/tts.png';
import imgAll from '../../assets/images/all.png';
import bannerImg from '../../assets/images/banner-cts-timdungviec-pc_174740689238.jpg';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

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

const CATEGORY_API = 'https://be-khoaluan.vercel.app/api/admin/category-management';
const JOB_API = 'https://be-khoaluan.vercel.app/api/job/all';

const categoryIcons = {
  "thu-mua-kho-v-n-chu-i-cung-ng": img1,
  "khoa-h-c-k-thu-t": img4,
  "nh-n-s": img8,
  "k-to-n": img7,
  "b-n-s-b-n-l-qu-n-l-c-a-h-ng": img1,
  "ch-m-s-c-kh-ch-h-ng": img3,
  "h-nh-ch-nh-th-k": img6,
  "b-n-h-ng-kinh-doanh": img2,
  "all": imgAll
};

function DynamicJobCategories({ selected, setSelected }) {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobCountByCategory, setJobCountByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(CATEGORY_API)
      .then(res => res.json())
      .then(data => setCategories((data.categories || []).slice(0, 8)));
    fetch(JOB_API + '?limit=1000')
      .then(res => res.json())
      .then(data => setJobs(data.data || data.jobs || []));
  }, []);

  useEffect(() => {
    const count = {};
    jobs.forEach(job => {
      const catId = job.categoryId?._id || job.categoryId;
      if (catId) count[catId] = (count[catId] || 0) + 1;
    });
    setJobCountByCategory(count);
  }, [jobs]);

  const getIcon = (cat) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return categoryIcons[slug] || imgAll;
  };

  const handleCategoryClick = (cat) => {
    if (cat === 'all') {
      navigate('/jobs');
    } else {
      navigate(`/jobs/category/${cat.slug}`);
    }
  };

  return (
    <div className="flex flex-row gap-0 overflow-x-auto py-4 px-2 scrollbar-hide custom-scrollbar">
      {categories.map(cat => (
        <div
          key={cat._id}
          className={`flex flex-col items-center justify-between w-[140px] h-[170px] bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer
            border-transparent hover:border-blue-400 hover:shadow-md hover:scale-105`}
          onClick={() => handleCategoryClick(cat)}
          style={{ minWidth: 110, maxWidth: 150 }}
        >
          <div className="flex flex-col items-center w-full mt-4 mb-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
              <img src={getIcon(cat)} alt={cat.name} className="w-10 h-10 object-contain" />
            </div>
            <div className="text-blue-600 font-bold text-base mt-2">
              {(jobCountByCategory[cat._id] || 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">việc</span>
            </div>
          </div>
          <div
            className="text-gray-800 font-semibold text-sm text-center px-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.5em',
              maxWidth: '120px',
            }}
            title={cat.name}
          >
            {cat.name}
          </div>
        </div>
      ))}
      {/* Card tất cả các ngành */}
      <div
        className={`flex flex-col items-center justify-between w-[140px] h-[170px] bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer
          border-transparent hover:border-blue-400 hover:scale-105 text-blue-500`}
        onClick={() => handleCategoryClick('all')}
        style={{ minWidth: 110, maxWidth: 150 }}
      >
        <div className="flex flex-col items-center w-full mt-4 mb-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
            <img src={imgAll} alt="Tất cả" className="w-10 h-10 object-contain" />
          </div>
          <div className="text-blue-600 font-bold text-base mt-2">
            {jobs.length.toLocaleString()} <span className="text-xs font-normal text-gray-500">việc</span>
          </div>
        </div>
        <div
          className="text-gray-800 font-semibold text-sm text-center px-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.5em',
            maxWidth: '120px',
          }}
          title="Tất cả các ngành"
        >
          Tất cả các ngành
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 640px) {
          .custom-scrollbar > div, .custom-scrollbar > .flex { min-width: 110px !important; max-width: 120px !important; }
        }
      `}</style>
    </div>
  );
}

// Hook quản lý từ khóa gần đây và phổ biến
function useSearchKeywords(keyRecent = 'recent_job_searches', keyCount = 'search_keyword_counts', maxRecent = 5, minPopular = 3) {
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem(keyRecent);
    if (data) setRecent(JSON.parse(data));
    const countData = localStorage.getItem(keyCount);
    if (countData) {
      const counts = JSON.parse(countData);
      const pop = Object.entries(counts)
        .filter(([k, v]) => v >= minPopular)
        .map(([k]) => k);
      setPopular(pop);
    }
  }, [keyRecent, keyCount]);
  const addSearch = (term) => {
    if (!term || !term.trim()) return;
    // Gần đây
    let arr = [term, ...recent.filter((t) => t !== term)];
    if (arr.length > maxRecent) arr = arr.slice(0, maxRecent);
    setRecent(arr);
    localStorage.setItem(keyRecent, JSON.stringify(arr));
    // Đếm số lần
    let counts = {};
    try { counts = JSON.parse(localStorage.getItem(keyCount)) || {}; } catch { counts = {}; }
    counts[term] = (counts[term] || 0) + 1;
    localStorage.setItem(keyCount, JSON.stringify(counts));
    // Cập nhật phổ biến
    if (counts[term] >= minPopular && !popular.includes(term)) {
      setPopular([term, ...popular]);
    }
  };
  return [recent, popular, addSearch];
}

const SearchBar = ({ setKeyword }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const inputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const [recentSearches, popularKeywordsDynamic, addRecentSearch] = useSearchKeywords();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  const handleSearch = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      const keyword = inputRef.current.value.trim();
      addRecentSearch(keyword);
      setShowDropdown(false);
      navigate(`/jobs/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

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
        <div className="relative bg-white rounded-2xl shadow-xl flex flex-col p-0 max-w-6xl w-full z-50 border-2 border-blue-200">
          {/* Hiệu ứng đổ màu nhẹ chỉ chiếm 20% phía trên card */}
          <div className="absolute left-0 top-0 w-full h-[20%] rounded-t-2xl bg-gradient-to-b from-cyan-100 via-white to-transparent opacity-70 blur-md pointer-events-none z-0"></div>
          <div className="relative z-10">
            {/* Search Row - Redesigned */}
            <div className="flex flex-col gap-0 p-6 pb-0">
              <div className="flex flex-col md:flex-row items-stretch gap-0 w-full bg-white rounded-full shadow-lg border-2 border-blue-200 focus-within:border-blue-400 transition-all duration-200">
                {/* Vị trí */}
                <div className="flex-1 flex items-center px-5 h-16 bg-transparent rounded-l-full focus-within:bg-blue-50 transition-all duration-200 relative">
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
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  {/* Dropdown và glow */}
                  {showDropdown && (
                    <>
                      <div className="absolute left-0 top-full w-full z-50 mt-3">
                        <div className="w-full bg-white rounded-2xl shadow-2xl p-0 animate-fadeIn">
                          {/* Tìm kiếm gần đây */}
                          {recentSearches.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 px-6 pt-6 pb-2">
                                <AiOutlineClockCircle className="text-blue-400 text-2xl" />
                                <span className="font-extrabold text-xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow">Tìm kiếm gần đây</span>
                              </div>
                              <ul className="px-2 pb-2">
                                {recentSearches.map((kw, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-3 py-3 px-4 my-2 rounded-xl cursor-pointer text-lg font-semibold text-gray-800 transition-all duration-150 hover:bg-blue-50"
                                    onMouseDown={() => {
                                      inputRef.current.value = kw;
                                      setShowDropdown(false);
                                    }}
                                  >
                                    <AiOutlineClockCircle className="text-blue-400 text-xl" />
                                    <span className="truncate">{kw}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                          {/* Từ khóa phổ biến */}
                          {popularKeywordsDynamic.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 px-6 pt-6 pb-2">
                                <AiFillStar className="text-yellow-400 text-2xl" />
                                <span className="font-extrabold text-xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow">Từ khóa phổ biến</span>
                      </div>
                              <ul className="px-2 pb-4">
                                {popularKeywordsDynamic.map((kw, idx) => (
                            <li
                              key={idx}
                                    className="flex items-center gap-3 py-3 px-4 my-2 rounded-xl cursor-pointer text-lg font-semibold text-gray-800 transition-all duration-150 hover:bg-blue-50"
                              onMouseDown={() => {
                                inputRef.current.value = kw;
                                setShowDropdown(false);
                              }}
                            >
                                    <AiFillStar className="text-yellow-400 text-xl" />
                                    <span className="truncate">{kw}</span>
                            </li>
                          ))}
                        </ul>
                            </>
                          )}
                        </div>
                        <style>{`
                          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
                          .animate-fadeIn { animation: fadeIn 0.25s ease; }
                        `}</style>
                      </div>
                    </>
                  )}
                </div>
                {/* Nghề nghiệp - custom dropdown */}
                <div className="flex items-center px-5 h-16 bg-transparent border-l border-gray-100 focus-within:bg-blue-50 transition-all duration-200">
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
                <div className="flex items-center px-5 h-16 bg-transparent border-l border-gray-100 focus-within:bg-blue-50 transition-all duration-200">
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
                <button
                  className="flex items-center gap-2 bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold px-8 h-16 rounded-r-full text-base shadow-lg transition-all duration-200 w-full md:w-auto justify-center ml-0 md:ml-2 mt-2 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={handleSearch}
                >
                  <FaSearch className="text-lg" />
                  Tìm việc
                </button>
              </div>
            </div>

            {/* Job Categories Row */}
            <div className="w-full px-4 pt-0 pb-0">
              <DynamicJobCategories selected={selectedCategory} setSelected={setSelectedCategory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 