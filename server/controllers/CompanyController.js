const Employer = require("../models/Employers");
const CompanyReview = require("../models/CompanyReviews");
const JobReport = require("../models/JobReports");
const Job = require("../models/Jobs");
const Application = require("../models/Applications");
const Auth = require("../models/Auth");
const Candidate = require("../models/Candidates");

class CompanyController {
  // 1. Xây dựng trang công ty (Cập nhật thông tin công ty)
  async updateCompanyProfile(req, res) {
    try {
      const { employerId } = req.params;
      const updateData = req.body;

      // Kiểm tra xem employer có tồn tại không
      const existingEmployer = await Employer.findById(employerId);
      if (!existingEmployer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin công ty",
        });
      }

      // Cập nhật thông tin công ty
      const updatedEmployer = await Employer.findByIdAndUpdate(
        employerId,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin công ty thành công",
        data: updatedEmployer,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật thông tin công ty",
        error: error.message,
      });
    }
  }

  // 2. Xem hồ sơ công ty
  async getCompanyProfile(req, res) {
    try {
      const { employerId } = req.params;

      const employer = await Employer.findById(employerId)
        .populate("userId", "email")
        .select("-__v");

      if (!employer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin công ty",
        });
      }

      // Lấy thống kê cơ bản của công ty
      const jobCount = await Job.countDocuments({ employerId });
      const activeJobCount = await Job.countDocuments({
        employerId,
        status: "Active",
      });

      // Lấy đánh giá trung bình
      const reviews = await CompanyReview.find({ companyId: employerId });
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      const companyProfile = {
        ...employer.toObject(),
        stats: {
          totalJobs: jobCount,
          activeJobs: activeJobCount,
          totalReviews: reviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
        },
      };

      return res.status(200).json({
        success: true,
        data: companyProfile,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thông tin công ty",
        error: error.message,
      });
    }
  }

  // 3. Tìm kiếm công ty
  async searchCompanies(req, res) {
    try {
      const {
        search,
        industry,
        companySize,
        page = 1,
        limit = 10,
        sortBy = "companyName",
        sortOrder = "asc",
      } = req.query;

      const skip = (page - 1) * limit;
      let query = {};

      // Tìm kiếm theo tên công ty
      if (search) {
        query.companyName = { $regex: search, $options: "i" };
      }

      // Lọc theo ngành nghề
      if (industry) {
        query.industry = industry;
      }

      // Lọc theo quy mô công ty
      if (companySize) {
        query.companySize = companySize;
      }

      const companies = await Employer.find(query)
        .select("companyName companyLogoUrl industry companySize foundedYear")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Employer.countDocuments(query);

      // Thêm thống kê cho mỗi công ty
      const companiesWithStats = await Promise.all(
        companies.map(async (company) => {
          const jobCount = await Job.countDocuments({
            employerId: company._id,
            status: "Active",
          });
          const reviewCount = await CompanyReview.countDocuments({
            companyId: company._id,
          });

          return {
            ...company.toObject(),
            stats: {
              activeJobs: jobCount,
              totalReviews: reviewCount,
            },
          };
        })
      );

      return res.status(200).json({
        success: true,
        data: companiesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tìm kiếm công ty",
        error: error.message,
      });
    }
  }

  // 4. Đánh giá/review công ty
  async createCompanyReview(req, res) {
    try {
      const { candidateId, companyId, rating, title, reviewText, anonymous } =
        req.body;

      if (!candidateId || !companyId || !rating || !title || !reviewText) {
        return res.status(400).json({
          success: false,
          message: "Tất cả các trường bắt buộc phải được điền",
        });
      }

      // Kiểm tra xem ứng viên đã đánh giá công ty này chưa
      const existingReview = await CompanyReview.findOne({
        candidateId,
        companyId,
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đánh giá công ty này rồi",
        });
      }

      // Kiểm tra xem công ty có tồn tại không
      const company = await Employer.findById(companyId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy công ty",
        });
      }

      // Tạo đánh giá mới
      const newReview = new CompanyReview({
        candidateId,
        companyId,
        rating,
        title,
        reviewText,
        anonymous: anonymous || false,
      });

      await newReview.save();

      return res.status(201).json({
        success: true,
        message: "Đánh giá công ty thành công",
        data: newReview,
      });
    } catch (error) {
      console.error("Lỗi khi tạo đánh giá công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo đánh giá công ty",
        error: error.message,
      });
    }
  }

  // 5. Xem danh sách đánh giá công ty
  async getCompanyReviews(req, res) {
    try {
      const {
        companyId,
        page = 1,
        limit = 10,
        rating,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "CompanyId là bắt buộc",
        });
      }

      const skip = (page - 1) * limit;
      let query = { companyId };

      // Lọc theo rating
      if (rating) {
        query.rating = parseInt(rating);
      }

      const reviews = await CompanyReview.find(query)
        .populate("candidateId", "fullName avatar")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await CompanyReview.countDocuments(query);

      // Tính thống kê đánh giá
      const allReviews = await CompanyReview.find({ companyId });
      const ratingStats = {
        1: allReviews.filter((r) => r.rating === 1).length,
        2: allReviews.filter((r) => r.rating === 2).length,
        3: allReviews.filter((r) => r.rating === 3).length,
        4: allReviews.filter((r) => r.rating === 4).length,
        5: allReviews.filter((r) => r.rating === 5).length,
      };

      const averageRating =
        allReviews.length > 0
          ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
            allReviews.length
          : 0;

      return res.status(200).json({
        success: true,
        data: reviews,
        stats: {
          totalReviews: total,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution: ratingStats,
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy đánh giá công ty",
        error: error.message,
      });
    }
  }

  // 6. Cập nhật đánh giá công ty
  async updateCompanyReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { rating, title, reviewText, anonymous } = req.body;

      const review = await CompanyReview.findById(reviewId);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá",
        });
      }

      // Cập nhật đánh giá
      const updatedReview = await CompanyReview.findByIdAndUpdate(
        reviewId,
        {
          rating,
          title,
          reviewText,
          anonymous,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật đánh giá thành công",
        data: updatedReview,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật đánh giá",
        error: error.message,
      });
    }
  }

  // 7. Xóa đánh giá công ty
  async deleteCompanyReview(req, res) {
    try {
      const { reviewId } = req.params;

      const review = await CompanyReview.findById(reviewId);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá",
        });
      }

      await CompanyReview.findByIdAndDelete(reviewId);

      return res.status(200).json({
        success: true,
        message: "Xóa đánh giá thành công",
      });
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xóa đánh giá",
        error: error.message,
      });
    }
  }

  // 8. Xem thống kê báo cáo công ty
  async getCompanyReportStats(req, res) {
    try {
      const { employerId } = req.params;
      const { startDate, endDate } = req.query;

      // Kiểm tra xem employer có tồn tại không
      const employer = await Employer.findById(employerId);
      if (!employer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin công ty",
        });
      }

      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        };
      }

      // Thống kê công việc
      const totalJobs = await Job.countDocuments({
        employerId,
        ...dateFilter,
      });
      const activeJobs = await Job.countDocuments({
        employerId,
        status: "Active",
        ...dateFilter,
      });
      const closedJobs = await Job.countDocuments({
        employerId,
        status: "Closed",
        ...dateFilter,
      });

      // Thống kê ứng tuyển
      const jobIds = await Job.find({ employerId }).select("_id");
      const jobIdArray = jobIds.map((job) => job._id);

      const totalApplications = await Application.countDocuments({
        jobId: { $in: jobIdArray },
        ...dateFilter,
      });

      const applicationsByStatus = await Application.aggregate([
        {
          $match: {
            jobId: { $in: jobIdArray },
            ...dateFilter,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Thống kê đánh giá
      const totalReviews = await CompanyReview.countDocuments({
        companyId: employerId,
        ...dateFilter,
      });

      const averageRating = await CompanyReview.aggregate([
        {
          $match: {
            companyId: employer._id,
            ...dateFilter,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      // Thống kê báo cáo công việc
      const totalReports = await JobReport.countDocuments({
        jobId: { $in: jobIdArray },
        ...dateFilter,
      });

      const reportsByStatus = await JobReport.aggregate([
        {
          $match: {
            jobId: { $in: jobIdArray },
            ...dateFilter,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Thống kê theo tháng (6 tháng gần nhất)
      const monthlyStats = await Job.aggregate([
        {
          $match: {
            employerId: employer._id,
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            jobCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      const stats = {
        overview: {
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplications,
          totalReviews,
          totalReports,
          averageRating:
            averageRating.length > 0
              ? Math.round(averageRating[0].averageRating * 10) / 10
              : 0,
        },
        applications: {
          byStatus: applicationsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        reports: {
          byStatus: reportsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        monthlyStats: monthlyStats.map((item) => ({
          month: `${item._id.year}-${item._id.month
            .toString()
            .padStart(2, "0")}`,
          jobCount: item.jobCount,
        })),
      };

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê báo cáo:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê báo cáo",
        error: error.message,
      });
    }
  }

  // 9. Xem danh sách báo cáo công việc của công ty
  async getCompanyJobReports(req, res) {
    try {
      const { employerId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const skip = (page - 1) * limit;

      // Lấy danh sách job IDs của công ty
      const jobIds = await Job.find({ employerId }).select("_id");
      const jobIdArray = jobIds.map((job) => job._id);

      let query = { jobId: { $in: jobIdArray } };
      if (status) {
        query.status = status;
      }

      const reports = await JobReport.find(query)
        .populate({
          path: "jobId",
          select: "title",
        })
        .populate({
          path: "reporterId",
          select: "fullName email",
        })
        .sort({ reportedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await JobReport.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách báo cáo:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách báo cáo",
        error: error.message,
      });
    }
  }

  // 10. Cập nhật trạng thái báo cáo
  async updateReportStatus(req, res) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status là bắt buộc",
        });
      }

      const report = await JobReport.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy báo cáo",
        });
      }

      const updatedReport = await JobReport.findByIdAndUpdate(
        reportId,
        { status },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái báo cáo thành công",
        data: updatedReport,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật trạng thái báo cáo",
        error: error.message,
      });
    }
  }

  // 11. Lấy danh sách ngành nghề
  async getIndustries(req, res) {
    try {
      const industries = await Employer.distinct("industry");

      return res.status(200).json({
        success: true,
        data: industries,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ngành nghề:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách ngành nghề",
        error: error.message,
      });
    }
  }

  // 12. Lấy danh sách quy mô công ty
  async getCompanySizes(req, res) {
    try {
      const companySizes = [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ];

      return res.status(200).json({
        success: true,
        data: companySizes,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quy mô công ty:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách quy mô công ty",
        error: error.message,
      });
    }
  }
}

module.exports = new CompanyController();
