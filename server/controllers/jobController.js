const Jobs = require("../models/Jobs");
const Employers = require("../models/Employers");
const Auth = require("../models/Auth");
const JobReports = require("../models/JobReports");
const Categories = require("../models/Categories");
const dbConnect = require("../utils/dbConnect");

class JobController {
  // Đăng tin tuyển dụng
  async createJob(req, res) {
    try {
      await dbConnect();
      const {
        jobTitle,
        description,
        requirements,
        benefits,
        salaryRange,
        location,
        province,
        district,
        addressDetail,
        jobType,
        categoryId,
        skillsRequired,
        experienceLevel,
        applicationDeadline,
        isFeatured = false,
      } = req.body;

      // Sử dụng thông tin employer từ middleware
      const employer = req.employer;

      // Kiểm tra danh mục tồn tại
      const category = await Categories.findById(categoryId);
      if (!category) {
        return res.status(400).json({ 
          success: false,
          message: "Danh mục không tồn tại" 
        });
      }

      // Xử lý location: ưu tiên lấy object location, nếu không thì lấy từng trường riêng
      let locationObj = location;
      if (!locationObj || typeof locationObj !== 'object') {
        locationObj = {
          province,
          district,
          addressDetail,
        };
      }

      // Tạo tin tuyển dụng mới
      const newJob = new Jobs({
        employerId: employer._id,
        jobTitle,
        description,
        requirements,
        benefits,
        salaryRange,
        location: locationObj,
        jobType,
        categoryId,
        skillsRequired,
        experienceLevel,
        applicationDeadline,
        isFeatured,
        status: "Active",
      });

      await newJob.save();

      res.status(201).json({
        success: true,
        message: "Đăng tin tuyển dụng thành công",
        data: { job: newJob }
      });
    } catch (error) {
      console.error("Lỗi đăng tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Lấy danh sách tin tuyển dụng của nhà tuyển dụng
  async getEmployerJobs(req, res) {
    try {
      await dbConnect();
      const { 
        page = 1, 
        limit = 10, 
        status, 
        jobType, 
        categoryId,
        search,
        sortBy = 'postedDate',
        sortOrder = 'desc'
      } = req.query;

      // Sử dụng thông tin employer từ middleware
      const employer = req.employer;

      // Xây dựng query
      const query = { employerId: employer._id };
      
      if (status) {
        query.status = status;
      }
      
      if (jobType) {
        query.jobType = jobType;
      }
      
      if (categoryId) {
        query.categoryId = categoryId;
      }
      
      if (search) {
        query.$or = [
          { jobTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Xây dựng sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Tính toán skip
      const skip = (page - 1) * limit;

      // Lấy danh sách tin tuyển dụng
      const jobs = await Jobs.find(query)
        .populate("categoryId", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Đếm tổng số tin tuyển dụng
      const total = await Jobs.countDocuments(query);

      // Lấy thống kê theo trạng thái
      const stats = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      const statusStats = {};
      stats.forEach(stat => {
        statusStats[stat._id] = stat.count;
      });

      res.json({
        success: true,
        data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
          stats: statusStats,
          employer: {
            _id: employer._id,
            companyName: employer.companyName,
            companyLogoUrl: employer.companyLogoUrl
          }
        }
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Lấy chi tiết tin tuyển dụng của employer (có thêm thông tin ứng viên)
  async getEmployerJobDetail(req, res) {
    try {
      // Sử dụng thông tin job từ middleware
      const job = req.job;

      res.json({
        success: true,
        data: { job }
      });
    } catch (error) {
      console.error("Lỗi lấy chi tiết tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Lấy thống kê tin tuyển dụng của employer
  async getEmployerJobStats(req, res) {
    try {
      const { period = '30' } = req.query; // Số ngày để thống kê

      // Sử dụng thông tin employer từ middleware
      const employer = req.employer;

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));

      // Thống kê theo trạng thái
      const statusStats = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Thống kê theo loại công việc
      const jobTypeStats = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: "$jobType",
            count: { $sum: 1 }
          }
        }
      ]);

      // Thống kê tin tuyển dụng mới trong khoảng thời gian
      const recentJobs = await Jobs.countDocuments({
        employerId: employer._id,
        postedDate: { $gte: daysAgo }
      });

      // Tổng số lượt xem
      const totalViews = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$viewsCount" },
            totalApplicants: { $sum: "$applicantsCount" }
          }
        }
      ]);

      // Tin tuyển dụng nổi bật
      const featuredJobs = await Jobs.countDocuments({
        employerId: employer._id,
        isFeatured: true
      });

      res.json({
        success: true,
        data: {
          statusStats: statusStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          jobTypeStats: jobTypeStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          recentJobs,
          totalViews: totalViews[0]?.totalViews || 0,
          totalApplicants: totalViews[0]?.totalApplicants || 0,
          featuredJobs,
          period: parseInt(period)
        }
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Cập nhật trạng thái tin tuyển dụng
  async updateJobStatus(req, res) {
    try {
      const { status } = req.body;

      // Sử dụng thông tin job từ middleware
      const job = req.job;

      // Cập nhật trạng thái
      job.status = status;
      await job.save();

      res.json({
        success: true,
        message: "Cập nhật trạng thái tin tuyển dụng thành công",
        data: { job }
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Cập nhật tin tuyển dụng nổi bật
  async toggleFeaturedJob(req, res) {
    try {
      // Sử dụng thông tin job từ middleware
      const job = req.job;

      // Toggle trạng thái nổi bật
      job.isFeatured = !job.isFeatured;
      await job.save();

      res.json({
        success: true,
        message: job.isFeatured 
          ? "Đã đặt tin tuyển dụng làm nổi bật" 
          : "Đã bỏ đặt tin tuyển dụng nổi bật",
        data: { job }
      });
    } catch (error) {
      console.error("Lỗi cập nhật tin tuyển dụng nổi bật:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Lấy chi tiết tin tuyển dụng
  async getJobById(req, res) {
    try {
      await dbConnect();
      const { jobId } = req.params;

      const job = await Jobs.findById(jobId)
        .populate("employerId", "companyName companyDescription companyLogoUrl")
        .populate("categoryId", "name");

      if (!job) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tin tuyển dụng" });
      }

      // Tăng số lượt xem
      job.viewsCount += 1;
      await job.save();

      res.json({ job });
    } catch (error) {
      console.error("Lỗi lấy chi tiết tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật tin tuyển dụng
  async updateJob(req, res) {
    try {
      const updateData = req.body;

      // Sử dụng thông tin job từ middleware
      const job = req.job;

      // Xử lý location: ưu tiên lấy object location, nếu không thì lấy từng trường riêng
      let locationObj = updateData.location;
      if (!locationObj || typeof locationObj !== 'object') {
        const { province, district, addressDetail } = updateData;
        if (province || district || addressDetail) {
          locationObj = {
            ...(province && { province }),
            ...(district && { district }),
            ...(addressDetail && { addressDetail }),
          };
        }
      }

      // Cập nhật thông tin
      Object.assign(job, updateData);
      if (locationObj) {
        // Chỉ cập nhật các trường con của location nếu có truyền lên
        job.location = {
          ...job.location,
          ...locationObj,
        };
      }
      await job.save();

      res.json({
        success: true,
        message: "Cập nhật tin tuyển dụng thành công",
        data: { job }
      });
    } catch (error) {
      console.error("Lỗi cập nhật tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Xóa tin tuyển dụng
  async deleteJob(req, res) {
    try {
      // Sử dụng thông tin job từ middleware
      const job = req.job;

      // Xóa tin tuyển dụng
      await job.deleteOne();

      res.json({ 
        success: true,
        message: "Xóa tin tuyển dụng thành công" 
      });
    } catch (error) {
      console.error("Lỗi xóa tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }

  // Tìm kiếm job theo keyword (jobTitle hoặc description)
  async searchJobs(req, res) {
    try {
      await dbConnect();
      const { keyword, page = 1, limit = 10 } = req.query;
      const query = { status: "Active" };

      // Nếu có keyword, tìm trong jobTitle hoặc description (giống Contains)
      if (keyword && keyword.trim()) {
        query.$or = [
          { jobTitle: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }
        ];
      }

      const skip = (page - 1) * limit;
      const jobs = await Jobs.find(query)
        .populate("employerId", "companyName companyLogoUrl")
        .populate("categoryId", "name")
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Jobs.countDocuments(query);

      res.json({
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
        filters: { keyword }
      });
    } catch (error) {
      console.error("Lỗi tìm kiếm tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lọc công việc dựa trên nhiều tiêu chí
  async filterJobs(req, res) {
    try {
      await dbConnect();
      const {
        categories,
        locations,
        jobTypes,
        experienceLevels,
        salaryRanges,
        page = 1,
        limit = 10,
      } = req.query;

      // Xây dựng query
      const query = { status: "Active" };

      // Lọc theo danh mục
      if (categories) {
        const categoryArray = categories.split(",");
        query.categoryId = { $in: categoryArray };
      }

      // Lọc theo địa điểm
      if (locations) {
        const locationArray = locations.split(",");
        query.location = { $in: locationArray };
      }

      // Lọc theo loại công việc
      if (jobTypes) {
        const jobTypeArray = jobTypes.split(",");
        query.jobType = { $in: jobTypeArray };
      }

      // Lọc theo cấp độ kinh nghiệm
      if (experienceLevels) {
        const experienceArray = experienceLevels.split(",");
        query.experienceLevel = { $in: experienceArray };
      }

      // Lọc theo mức lương
      if (salaryRanges) {
        const salaryArray = salaryRanges.split(",");
        const salaryQuery = [];

        salaryArray.forEach((range) => {
          const [min, max] = range.split("-");
          salaryQuery.push({
            "salaryRange.min": { $gte: parseInt(min) },
            "salaryRange.max": { $lte: parseInt(max) },
          });
        });

        if (salaryQuery.length > 0) {
          query.$or = salaryQuery;
        }
      }

      // Tính toán skip
      const skip = (page - 1) * limit;

      // Lấy danh sách tin tuyển dụng
      const jobs = await Jobs.find(query)
        .populate("employerId", "companyName companyLogoUrl")
        .populate("categoryId", "name")
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Đếm tổng số kết quả
      const total = await Jobs.countDocuments(query);

      res.json({
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
        filters: {
          categories,
          locations,
          jobTypes,
          experienceLevels,
          salaryRanges,
        },
      });
    } catch (error) {
      console.error("Lỗi lọc tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Báo cáo tin tuyển dụng
  async reportJob(req, res) {
    try {
      const userId = req.user.userId;
      const { jobId } = req.params;
      const { reason, description } = req.body;

      // Kiểm tra tin tuyển dụng tồn tại
      const job = await Jobs.findById(jobId);
      if (!job) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tin tuyển dụng" });
      }

      // Tạo báo cáo mới
      const report = new JobReports({
        jobId,
        reportedBy: userId,
        reason,
        description,
        status: "Pending",
      });

      await report.save();

      res.json({
        message: "Báo cáo tin tuyển dụng thành công",
        report,
      });
    } catch (error) {
      console.error("Lỗi báo cáo tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Chia sẻ tin tuyển dụng
  async shareJob(req, res) {
    try {
      const { jobId } = req.params;
      const { platform, message } = req.body;

      // Kiểm tra tin tuyển dụng tồn tại
      const job = await Jobs.findById(jobId)
        .populate("employerId", "companyName")
        .populate("categoryId", "name");

      if (!job) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tin tuyển dụng" });
      }

      // Tạo link chia sẻ
      const shareUrl = `${process.env.FRONTEND_URL}/jobs/${jobId}`;

      // Tạo nội dung chia sẻ
      const shareContent = {
        title: job.jobTitle,
        company: job.employerId.companyName,
        location: job.location,
        salary: `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} ${
          job.salaryRange.currency
        }`,
        description: job.description.substring(0, 200) + "...",
        url: shareUrl,
        message:
          message ||
          `Tuyển dụng ${job.jobTitle} tại ${job.employerId.companyName}`,
      };

      res.json({
        message: "Chia sẻ tin tuyển dụng thành công",
        shareContent,
        platforms: {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareContent.message
          )}&url=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`,
          email: `mailto:?subject=${encodeURIComponent(
            shareContent.title
          )}&body=${encodeURIComponent(
            shareContent.message + "\n\n" + shareUrl
          )}`,
        },
      });
    } catch (error) {
      console.error("Lỗi chia sẻ tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy tin tuyển dụng nổi bật
  async getFeaturedJobs(req, res) {
    try {
      await dbConnect();
      const { limit = 10 } = req.query;

      const jobs = await Jobs.find({
        status: "Active",
        isFeatured: true,
      })
        .populate("employerId", "companyName companyLogoUrl")
        .populate("categoryId", "name")
        .sort({ postedDate: -1 })
        .limit(parseInt(limit));

      res.json({ jobs });
    } catch (error) {
      console.error("Lỗi lấy tin tuyển dụng nổi bật:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy tin tuyển dụng mới nhất
  async getLatestJobs(req, res) {
    try {
      await dbConnect();
      const { limit = 10 } = req.query;

      const jobs = await Jobs.find({ status: "Active" })
        .populate("employerId", "companyName companyLogoUrl")
        .populate("categoryId", "name")
        .sort({ postedDate: -1 })
        .limit(parseInt(limit));

      res.json({ jobs });
    } catch (error) {
      console.error("Lỗi lấy tin tuyển dụng mới nhất:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thống kê tin tuyển dụng
  async getJobStats(req, res) {
    try {
      await dbConnect();
      const userId = req.user.userId;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res
          .status(403)
          .json({ message: "Chỉ nhà tuyển dụng mới có thể xem thống kê" });
      }

      // Tìm thông tin nhà tuyển dụng
      const employer = await Employers.findOne({ userId });
      if (!employer) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin nhà tuyển dụng" });
      }

      // Thống kê theo trạng thái
      const activeJobs = await Jobs.countDocuments({
        employerId: employer._id,
        status: "Active",
      });
      const closedJobs = await Jobs.countDocuments({
        employerId: employer._id,
        status: "Closed",
      });
      const draftJobs = await Jobs.countDocuments({
        employerId: employer._id,
        status: "Draft",
      });

      // Thống kê tổng quan
      const totalJobs = await Jobs.countDocuments({ employerId: employer._id });
      const totalViews = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        { $group: { _id: null, totalViews: { $sum: "$viewsCount" } } },
      ]);

      const totalApplicants = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: { _id: null, totalApplicants: { $sum: "$applicantsCount" } },
        },
      ]);

      res.json({
        stats: {
          totalJobs,
          activeJobs,
          closedJobs,
          draftJobs,
          totalViews: totalViews[0]?.totalViews || 0,
          totalApplicants: totalApplicants[0]?.totalApplicants || 0,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy dashboard tổng hợp cho employer
  async getEmployerDashboard(req, res) {
    try {
      await dbConnect();
      // Thêm header CORS cho route này
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
      const employerId = req.user && req.user.id;
      if (!employerId) {
        return res.status(401).json({ success: false, message: 'Không xác thực employer.' });
      }
      // Lấy danh sách jobs của employer
      const jobs = await Jobs.find({ employerId });
      // Thống kê
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter(j => j.status === 'Active').length;
      const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);
      const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
      // Trả về dữ liệu
      res.json({
        success: true,
        data: {
          jobs: { list: jobs },
          stats: {
            totalJobs,
            statusStats: { Active: activeJobs },
            totalViews,
            totalApplicants
          },
          highlights: {}
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  // Lấy TẤT CẢ jobs của employer (không phân trang)
  async getAllEmployerJobs(req, res) {
    try {
      await dbConnect();
      const { 
        status, 
        jobType, 
        categoryId,
        search,
        sortBy = 'postedDate',
        sortOrder = 'desc'
      } = req.query;

      // Sử dụng thông tin employer từ middleware
      const employer = req.employer;

      // Xây dựng query
      const query = { employerId: employer._id };
      
      if (status) {
        query.status = status;
      }
      
      if (jobType) {
        query.jobType = jobType;
      }
      
      if (categoryId) {
        query.categoryId = categoryId;
      }
      
      if (search) {
        query.$or = [
          { jobTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Xây dựng sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Lấy TẤT CẢ tin tuyển dụng (không phân trang)
      const allJobs = await Jobs.find(query)
        .populate("categoryId", "name")
        .populate("employerId", "companyName companyLogoUrl")
        .sort(sort);

      // Đếm tổng số tin tuyển dụng
      const totalJobs = allJobs.length;

      // Thống kê theo trạng thái
      const statusStats = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Thống kê theo loại công việc
      const jobTypeStats = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: "$jobType",
            count: { $sum: 1 }
          }
        }
      ]);

      // Tổng số lượt xem và ứng viên
      const totalViews = await Jobs.aggregate([
        { $match: { employerId: employer._id } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$viewsCount" },
            totalApplicants: { $sum: "$applicantsCount" }
          }
        }
      ]);

      // Tin tuyển dụng nổi bật
      const featuredJobs = await Jobs.countDocuments({
        employerId: employer._id,
        isFeatured: true
      });

      res.json({
        success: true,
        data: {
          // Thông tin employer
          employer: {
            _id: employer._id,
            companyName: employer.companyName,
            companyLogoUrl: employer.companyLogoUrl,
            companyDescription: employer.companyDescription
          },
          
          // TẤT CẢ jobs
          jobs: allJobs,
          
          // Thống kê tổng quan
          stats: {
            totalJobs,
            statusStats: statusStats.reduce((acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            }, {}),
            jobTypeStats: jobTypeStats.reduce((acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            }, {}),
            totalViews: totalViews[0]?.totalViews || 0,
            totalApplicants: totalViews[0]?.totalApplicants || 0,
            featuredJobs
          },
          
          // Thông tin filter đã áp dụng
          filters: {
            status,
            jobType,
            categoryId,
            search,
            sortBy,
            sortOrder
          }
        }
      });
    } catch (error) {
      console.error("Lỗi lấy tất cả tin tuyển dụng:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi máy chủ" 
      });
    }
  }
}

module.exports = new JobController();
