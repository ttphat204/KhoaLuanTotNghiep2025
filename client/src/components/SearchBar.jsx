import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="w-full flex justify-center bg-gradient-to-b from-cyan-100 to-white py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-0 px-4 py-4">
        {/* Vị trí */}
        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-4">
          <FaSearch className="text-gray-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Nhập vị trí muốn ứng tuyển"
            className="w-full bg-transparent outline-none text-base placeholder-gray-400"
          />
        </div>
        {/* Nghề nghiệp */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-4 min-w-[180px]">
          <FaBriefcase className="text-gray-400 mr-2 text-lg" />
          <select className="bg-transparent outline-none text-base w-full">
            <option>Lọc theo nghề nghiệp</option>
            <option>Kế toán</option>
            <option>Nhân viên văn phòng</option>
            <option>Marketing</option>
          </select>
        </div>
        {/* Tỉnh thành */}
        <div className="flex items-center px-4 min-w-[180px]">
          <FaMapMarkerAlt className="text-gray-400 mr-2 text-lg" />
          <select className="bg-transparent outline-none text-base w-full">
            <option>Lọc theo tỉnh thành</option>
            <option>Hà Nội</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Đà Nẵng</option>
          </select>
        </div>
        {/* Button */}
        <button className="ml-0 md:ml-4 flex items-center gap-2 bg-[#4B1CD6] hover:bg-[#3a13b3] text-white font-bold px-6 py-3 rounded-xl text-base shadow-lg transition-all duration-200 mt-2 md:mt-0 w-full md:w-auto justify-center">
          <FaSearch className="text-lg" />
          Tìm việc
        </button>
      </div>
    </div>
  );
};

export default SearchBar; 