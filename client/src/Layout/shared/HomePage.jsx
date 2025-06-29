import React from 'react';
import CommonLayout from './CommonLayout';

const HomePage = () => {
  return (
    <CommonLayout>
      {/* Guest-specific content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome section for guests */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tìm việc làm mơ ước của bạn
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu. 
            Tạo hồ sơ và ứng tuyển ngay hôm nay!
          </p>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tìm kiếm thông minh</h3>
            <p className="text-gray-600">
              Tìm việc làm phù hợp với kỹ năng và kinh nghiệm của bạn
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ứng tuyển dễ dàng</h3>
            <p className="text-gray-600">
              Đăng ký tài khoản và ứng tuyển chỉ với vài cú nhấp chuột
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cơ hội phát triển</h3>
            <p className="text-gray-600">
              Khám phá những cơ hội thăng tiến và phát triển sự nghiệp
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu sự nghiệp mới?
          </h2>
          <p className="text-xl mb-6 text-indigo-100">
            Đăng ký tài khoản ngay hôm nay để truy cập đầy đủ tính năng
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Đăng ký miễn phí
          </button>
        </div>
      </div>
    </CommonLayout>
  );
};

export default HomePage; 