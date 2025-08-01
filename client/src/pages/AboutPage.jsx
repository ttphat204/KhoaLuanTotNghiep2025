import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaChartLine, FaRocket, FaShieldAlt, FaLightbulb, FaHeart, FaStar, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../Layout/shared/CommonLayout';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBriefcase className="w-8 h-8" />,
      title: "Tìm Việc Làm Thông Minh",
      description: "Hệ thống tìm kiếm việc làm thông minh với AI, giúp bạn tìm được công việc phù hợp nhất dựa trên kỹ năng và kinh nghiệm.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Kết Nối Doanh Nghiệp",
      description: "Nền tảng kết nối trực tiếp giữa ứng viên và doanh nghiệp, tạo cơ hội việc làm chất lượng cao.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Phân Tích CV AI",
      description: "Công nghệ AI tiên tiến phân tích CV, đánh giá sự phù hợp và đưa ra gợi ý cải thiện chuyên nghiệp.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Tuyển Dụng Hiệu Quả",
      description: "Giải pháp tuyển dụng toàn diện giúp doanh nghiệp tìm kiếm và quản lý ứng viên một cách hiệu quả.",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "1000+", label: "Việc làm chất lượng", icon: <FaBriefcase /> },
    { number: "500+", label: "Doanh nghiệp uy tín", icon: <FaUsers /> },
    { number: "95%", label: "Tỷ lệ hài lòng", icon: <FaHeart /> },
    { number: "24/7", label: "Hỗ trợ khách hàng", icon: <FaShieldAlt /> }
  ];

  const benefits = [
    "Tìm kiếm việc làm thông minh với AI",
    "Phân tích CV chuyên nghiệp",
    "Kết nối trực tiếp với nhà tuyển dụng",
    "Quản lý ứng tuyển dễ dàng",
    "Thông báo việc làm real-time",
    "Bảo mật thông tin tuyệt đối"
  ];

  return (
    <CommonLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8"
            >
              <FaLightbulb className="w-5 h-5" />
              Nền tảng tuyển dụng thông minh hàng đầu Việt Nam
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Kết nối{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                tài năng
              </span>
              <br />
              với{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                cơ hội
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              JobFinder - Nền tảng tuyển dụng hiện đại kết hợp công nghệ AI tiên tiến, 
              giúp ứng viên tìm được việc làm mơ ước và doanh nghiệp tuyển được nhân tài phù hợp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Tìm việc ngay
                <FaArrowRight className="w-4 h-4" />
              </motion.button>
              
                              <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/employer/login')}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center gap-2"
                >
                  Đăng tin tuyển dụng
                  <FaBriefcase className="w-4 h-4" />
                </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

             {/* Stats Section */}
       <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl">
                  {stat.icon}
                </div>
                                 <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                 <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
                         <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
               Tại sao chọn JobFinder?
             </h2>
             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chúng tôi cung cấp giải pháp tuyển dụng toàn diện với công nghệ AI tiên tiến, 
              giúp tối ưu hóa quy trình tìm kiếm việc làm và tuyển dụng.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                                 className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Lợi ích khi sử dụng JobFinder
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Trải nghiệm tuyển dụng hiện đại với những tính năng độc đáo và tiện ích vượt trội.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <FaCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

             {/* CTA Section */}
       <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
                         <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
               Sẵn sàng bắt đầu hành trình mới?
             </h2>
             <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Tham gia cùng hàng nghìn ứng viên và doanh nghiệp đã tin tưởng JobFinder
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaStar className="w-5 h-5" />
                Tìm việc làm ngay
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/employer/register')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaRocket className="w-5 h-5" />
                Đăng ký tuyển dụng
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
    </CommonLayout>
  );
};

export default AboutPage; 