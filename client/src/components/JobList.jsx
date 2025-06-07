import { motion } from 'framer-motion';
import JobCard from './JobCard';

const JobList = ({ filters }) => {
  // Mock data for demonstration
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '25 - 35 triệu',
      description: 'Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm...',
      postedDate: '2 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      location: 'TP. Hồ Chí Minh',
      type: 'Toàn thời gian',
      industry: 'Thiết kế',
      salary: '20 - 30 triệu',
      description: 'Tìm kiếm UI/UX Designer có kinh nghiệm để tham gia vào các dự án thiết kế sản phẩm số...',
      postedDate: '1 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '25 - 35 triệu',
      description: 'Tìm kiếm Backend Developer có kinh nghiệm với Node.js và MongoDB...',
      postedDate: '3 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 4,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      industry: 'Sản phẩm',
      salary: '30 - 40 triệu',
      description: 'Tìm kiếm Product Manager có kinh nghiệm trong lĩnh vực công nghệ...',
      postedDate: '1 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'TP. Hồ Chí Minh',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '28 - 38 triệu',
      description: 'Tìm kiếm DevOps Engineer có kinh nghiệm với AWS và Kubernetes...',
      postedDate: '2 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 6,
      title: 'Mobile Developer',
      company: 'App Solutions',
      location: 'Remote',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '25 - 35 triệu',
      description: 'Tìm kiếm Mobile Developer có kinh nghiệm với React Native...',
      postedDate: '3 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 7,
      title: 'Data Scientist',
      company: 'AI Research Lab',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '30 - 45 triệu',
      description: 'Tìm kiếm Data Scientist có kinh nghiệm với Machine Learning...',
      postedDate: '1 ngày trước',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 8,
      title: 'QA Engineer',
      company: 'Quality First',
      location: 'TP. Hồ Chí Minh',
      type: 'Toàn thời gian',
      industry: 'Công nghệ thông tin',
      salary: '20 - 30 triệu',
      description: 'Tìm kiếm QA Engineer có kinh nghiệm với automation testing...',
      postedDate: '2 ngày trước',
      logo: 'https://via.placeholder.com/50'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8"
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </motion.div>
    </div>
  );
};

export default JobList; 