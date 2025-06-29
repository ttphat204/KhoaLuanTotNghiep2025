const Jobs = require("../models/Jobs");
const Employers = require("../models/Employers");
const Auth = require("../models/Auth");
const JobReports = require("../models/JobReports");
const Categories = require("../models/Categories");

class JobController {
  // Đăng tin tuyển dụng
  async createJob(req, res) {
    try {
      const userId = req.user.userId;
      const {
        jobTitle,
        description,
        requirements,
        benefits,
        salaryRange,
        location,
        jobType,
        categoryId,
        skillsRequired,
        experienceLevel,
        applicationDeadline,
        isFeatured = false,
      } = req.body;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res.status(403).json({
          message: "Chỉ nhà tuyển dụng mới có thể đăng tin tuyển dụng",
        });
      }

      // Tìm thông tin nhà tuyển dụng
      const employer = await Employers.findOne({ userId });
      if (!employer) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin nhà tuyển dụng" });
      }

      // Kiểm tra danh mục tồn tại
      const category = await Categories.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }

      // Tạo tin tuyển dụng mới
      const newJob = new Jobs({
        employerId: employer._id,
        jobTitle,
        description,
        requirements,
        benefits,
        salaryRange,
        location,
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
        message: "Đăng tin tuyển dụng thành công",
        job: newJob,
      });
    } catch (error) {
      console.error("Lỗi đăng tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy danh sách tin tuyển dụng của nhà tuyển dụng
  async getEmployerJobs(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10, status } = req.query;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res.status(403).json({
          message: "Chỉ nhà tuyển dụng mới có thể xem tin tuyển dụng của mình",
        });
      }

      // Tìm thông tin nhà tuyển dụng
      const employer = await Employers.findOne({ userId });
      if (!employer) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin nhà tuyển dụng" });
      }

      // Xây dựng query
      const query = { employerId: employer._id };
      if (status) {
        query.status = status;
      }

      // Tính toán skip
      const skip = (page - 1) * limit;

      // Lấy danh sách tin tuyển dụng
      const jobs = await Jobs.find(query)
        .populate("categoryId", "name")
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Đếm tổng số tin tuyển dụng
      const total = await Jobs.countDocuments(query);

      res.json({
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy chi tiết tin tuyển dụng
  async getJobById(req, res) {
    try {
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
      const userId = req.user.userId;
      const { jobId } = req.params;
      const updateData = req.body;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res.status(403).json({
          message: "Chỉ nhà tuyển dụng mới có thể cập nhật tin tuyển dụng",
        });
      }

      // Tìm thông tin nhà tuyển dụng
      const employer = await Employers.findOne({ userId });
      if (!employer) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin nhà tuyển dụng" });
      }

      // Tìm tin tuyển dụng
      const job = await Jobs.findOne({
        _id: jobId,
        employerId: employer._id,
      });

      if (!job) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tin tuyển dụng" });
      }

      // Cập nhật thông tin
      Object.assign(job, updateData);
      await job.save();

      res.json({
        message: "Cập nhật tin tuyển dụng thành công",
        job,
      });
    } catch (error) {
      console.error("Lỗi cập nhật tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa tin tuyển dụng
  async deleteJob(req, res) {
    try {
      const userId = req.user.userId;
      const { jobId } = req.params;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res.status(403).json({
          message: "Chỉ nhà tuyển dụng mới có thể xóa tin tuyển dụng",
        });
      }

      // Tìm thông tin nhà tuyển dụng
      const employer = await Employers.findOne({ userId });
      if (!employer) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin nhà tuyển dụng" });
      }

      // Tìm và xóa tin tuyển dụng
      const job = await Jobs.findOneAndDelete({
        _id: jobId,
        employerId: employer._id,
      });

      if (!job) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tin tuyển dụng" });
      }

      res.json({ message: "Xóa tin tuyển dụng thành công" });
    } catch (error) {
      console.error("Lỗi xóa tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Tìm kiếm nâng cao
  async searchJobs(req, res) {
    try {
      const {
        keyword,
        location,
        jobType,
        categoryId,
        experienceLevel,
        salaryMin,
        salaryMax,
        skills,
        page = 1,
        limit = 10,
        sortBy = "postedDate",
        sortOrder = "desc",
      } = req.query;

      // Xây dựng query
      const query = { status: "Active" };

      // Tìm kiếm theo từ khóa
      if (keyword) {
        query.$or = [
          { jobTitle: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { requirements: { $in: [new RegExp(keyword, "i")] } },
        ];
      }

      // Lọc theo địa điểm
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      // Lọc theo loại công việc
      if (jobType) {
        query.jobType = jobType;
      }

      // Lọc theo danh mục
      if (categoryId) {
        query.categoryId = categoryId;
      }

      // Lọc theo cấp độ kinh nghiệm
      if (experienceLevel) {
        query.experienceLevel = experienceLevel;
      }

      // Lọc theo mức lương
      if (salaryMin || salaryMax) {
        query.salaryRange = {};
        if (salaryMin) query.salaryRange.min = { $gte: parseInt(salaryMin) };
        if (salaryMax) query.salaryRange.max = { $lte: parseInt(salaryMax) };
      }

      // Lọc theo kỹ năng
      if (skills) {
        const skillsArray = skills.split(",").map((skill) => skill.trim());
        query.skillsRequired = { $in: skillsArray };
      }

      // Tính toán skip
      const skip = (page - 1) * limit;

      // Sắp xếp
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Lấy danh sách tin tuyển dụng
      const jobs = await Jobs.find(query)
        .populate("employerId", "companyName companyLogoUrl")
        .populate("categoryId", "name")
        .sort(sortOptions)
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
          keyword,
          location,
          jobType,
          categoryId,
          experienceLevel,
          salaryMin,
          salaryMax,
          skills,
        },
      });
    } catch (error) {
      console.error("Lỗi tìm kiếm tin tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lọc công việc dựa trên nhiều tiêu chí
  async filterJobs(req, res) {
    try {
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
}

module.exports = new JobController();
