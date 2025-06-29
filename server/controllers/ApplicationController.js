const Application = require("../models/Applications");
const FavoriteJob = require("../models/FavoriteJobs");
const Resume = require("../models/Resumes");
const Job = require("../models/Jobs");
const Notification = require("../models/Notifications");
const Candidate = require("../models/Candidates");
const Employer = require("../models/Employers");

class ApplicationController {
  // 1. Lưu việc yêu thích
  async toggleFavoriteJob(req, res) {
    try {
      const { candidateId, jobId } = req.body;

      if (!candidateId || !jobId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId và JobId là bắt buộc",
        });
      }

      // Kiểm tra xem đã yêu thích chưa
      const existingFavorite = await FavoriteJob.findOne({
        candidateId,
        jobId,
      });

      if (existingFavorite) {
        // Nếu đã yêu thích thì xóa
        await FavoriteJob.findByIdAndDelete(existingFavorite._id);
        return res.status(200).json({
          success: true,
          message: "Đã bỏ yêu thích công việc",
          isFavorite: false,
        });
      } else {
        // Nếu chưa yêu thích thì thêm mới
        const newFavorite = new FavoriteJob({
          candidateId,
          jobId,
        });
        await newFavorite.save();

        return res.status(201).json({
          success: true,
          message: "Đã thêm vào danh sách yêu thích",
          isFavorite: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi toggle favorite job:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xử lý yêu thích công việc",
        error: error.message,
      });
    }
  }

  // 2. Xem danh sách việc làm yêu thích
  async getFavoriteJobs(req, res) {
    try {
      const { candidateId, page = 1, limit = 10 } = req.query;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId là bắt buộc",
        });
      }

      const skip = (page - 1) * limit;

      const favorites = await FavoriteJob.find({ candidateId })
        .populate({
          path: "jobId",
          populate: {
            path: "employerId",
            select: "companyName logo",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await FavoriteJob.countDocuments({ candidateId });

      return res.status(200).json({
        success: true,
        data: favorites,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách yêu thích",
        error: error.message,
      });
    }
  }

  // 3. Xem lịch sử ứng tuyển
  async getApplicationHistory(req, res) {
    try {
      const { candidateId, page = 1, limit = 10, status } = req.query;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId là bắt buộc",
        });
      }

      const skip = (page - 1) * limit;
      let query = { candidateId };

      // Lọc theo trạng thái nếu có
      if (status) {
        query.status = status;
      }

      const applications = await Application.find(query)
        .populate({
          path: "jobId",
          populate: {
            path: "employerId",
            select: "companyName logo",
          },
        })
        .populate("resumeId", "title fileName")
        .sort({ applicationDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Application.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ứng tuyển:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy lịch sử ứng tuyển",
        error: error.message,
      });
    }
  }

  // 4. Xem việc làm chờ ứng tuyển (trạng thái CV)
  async getPendingApplications(req, res) {
    try {
      const { candidateId, page = 1, limit = 10 } = req.query;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId là bắt buộc",
        });
      }

      const skip = (page - 1) * limit;

      const pendingApplications = await Application.find({
        candidateId,
        status: { $in: ["Pending", "Reviewed"] },
      })
        .populate({
          path: "jobId",
          populate: {
            path: "employerId",
            select: "companyName logo",
          },
        })
        .populate("resumeId", "title fileName")
        .sort({ lastStatusUpdate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Application.countDocuments({
        candidateId,
        status: { $in: ["Pending", "Reviewed"] },
      });

      return res.status(200).json({
        success: true,
        data: pendingApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chờ ứng tuyển:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách chờ ứng tuyển",
        error: error.message,
      });
    }
  }

  // 5. Nộp hồ sơ
  async submitApplication(req, res) {
    try {
      const { candidateId, jobId, resumeId, coverLetter } = req.body;

      if (!candidateId || !jobId || !resumeId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId, JobId và ResumeId là bắt buộc",
        });
      }

      // Kiểm tra xem đã ứng tuyển chưa
      const existingApplication = await Application.findOne({
        candidateId,
        jobId,
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã ứng tuyển cho công việc này rồi",
        });
      }

      // Kiểm tra xem công việc còn tuyển không
      const job = await Job.findById(jobId);
      if (!job || job.status !== "Active") {
        return res.status(400).json({
          success: false,
          message: "Công việc không tồn tại hoặc đã đóng",
        });
      }

      // Tạo đơn ứng tuyển mới
      const newApplication = new Application({
        candidateId,
        jobId,
        resumeId,
        coverLetter,
        status: "Pending",
      });

      await newApplication.save();

      // Tạo thông báo cho ứng viên
      const notification = new Notification({
        userId: candidateId,
        type: "application_status",
        message: `Đơn ứng tuyển của bạn đã được gửi thành công cho công việc "${job.title}"`,
        link: `/applications/${newApplication._id}`,
      });
      await notification.save();

      // Tạo thông báo cho nhà tuyển dụng
      const employerNotification = new Notification({
        userId: job.employerId,
        type: "application_status",
        message: `Có đơn ứng tuyển mới cho công việc "${job.title}"`,
        link: `/employer/applications/${newApplication._id}`,
      });
      await employerNotification.save();

      return res.status(201).json({
        success: true,
        message: "Nộp hồ sơ thành công",
        data: newApplication,
      });
    } catch (error) {
      console.error("Lỗi khi nộp hồ sơ:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi nộp hồ sơ",
        error: error.message,
      });
    }
  }

  // 6. Xem/tải về hồ sơ ứng viên (cho nhà tuyển dụng)
  async getCandidateResume(req, res) {
    try {
      const { applicationId } = req.params;
      const { employerId } = req.query;

      if (!employerId) {
        return res.status(400).json({
          success: false,
          message: "EmployerId là bắt buộc",
        });
      }

      const application = await Application.findById(applicationId)
        .populate({
          path: "jobId",
          match: { employerId: employerId },
        })
        .populate({
          path: "resumeId",
          populate: {
            path: "candidateId",
            select: "fullName email phone avatar",
          },
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn ứng tuyển",
        });
      }

      if (!application.jobId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem đơn ứng tuyển này",
        });
      }

      return res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ ứng viên:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy hồ sơ ứng viên",
        error: error.message,
      });
    }
  }

  // 7. Lọc/sắp xếp hồ sơ ứng viên (cho nhà tuyển dụng)
  async filterApplications(req, res) {
    try {
      const {
        jobId,
        employerId,
        status,
        sortBy = "applicationDate",
        sortOrder = "desc",
        page = 1,
        limit = 10,
        search,
      } = req.query;

      if (!employerId) {
        return res.status(400).json({
          success: false,
          message: "EmployerId là bắt buộc",
        });
      }

      const skip = (page - 1) * limit;
      let query = {};

      // Lọc theo jobId
      if (jobId) {
        query.jobId = jobId;
      }

      // Lọc theo trạng thái
      if (status) {
        query.status = status;
      }

      // Kiểm tra quyền truy cập (chỉ xem ứng viên của công việc thuộc về employer)
      const jobQuery = jobId ? { _id: jobId, employerId } : { employerId };
      const allowedJobs = await Job.find(jobQuery).select("_id");
      const allowedJobIds = allowedJobs.map((job) => job._id);
      query.jobId = { $in: allowedJobIds };

      // Tìm kiếm theo tên ứng viên
      let applications;
      if (search) {
        applications = await Application.find(query)
          .populate({
            path: "candidateId",
            match: {
              $or: [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            },
          })
          .populate({
            path: "jobId",
            select: "title",
          })
          .populate("resumeId", "title fileName")
          .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
          .skip(skip)
          .limit(parseInt(limit));

        // Lọc kết quả có candidateId
        applications = applications.filter((app) => app.candidateId);
      } else {
        applications = await Application.find(query)
          .populate("candidateId", "fullName email phone avatar")
          .populate({
            path: "jobId",
            select: "title",
          })
          .populate("resumeId", "title fileName")
          .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      const total = await Application.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
        filters: {
          jobId,
          status,
          sortBy,
          sortOrder,
          search,
        },
      });
    } catch (error) {
      console.error("Lỗi khi lọc hồ sơ ứng viên:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lọc hồ sơ ứng viên",
        error: error.message,
      });
    }
  }

  // 8. Cập nhật trạng thái đơn ứng tuyển (cho nhà tuyển dụng)
  async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, employerId, note } = req.body;

      if (!status || !employerId) {
        return res.status(400).json({
          success: false,
          message: "Status và EmployerId là bắt buộc",
        });
      }

      const application = await Application.findById(applicationId)
        .populate({
          path: "jobId",
          match: { employerId: employerId },
        })
        .populate("candidateId", "fullName email");

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn ứng tuyển",
        });
      }

      if (!application.jobId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền cập nhật đơn ứng tuyển này",
        });
      }

      // Cập nhật trạng thái
      application.status = status;
      application.lastStatusUpdate = new Date();
      if (note) {
        application.note = note;
      }

      await application.save();

      // Tạo thông báo cho ứng viên
      const statusMessages = {
        Pending: "Đơn ứng tuyển của bạn đang được xem xét",
        Reviewed: "Hồ sơ của bạn đã được xem xét",
        Interviewing: "Bạn đã được mời phỏng vấn",
        Offer: "Bạn đã nhận được lời mời làm việc",
        Rejected: "Rất tiếc, đơn ứng tuyển của bạn không được chấp nhận",
        Hired: "Chúc mừng! Bạn đã được tuyển dụng",
      };

      const notification = new Notification({
        userId: application.candidateId._id,
        type: "application_status",
        message: `${statusMessages[status]} cho công việc "${application.jobId.title}"`,
        link: `/applications/${application._id}`,
      });
      await notification.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: application,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật trạng thái",
        error: error.message,
      });
    }
  }

  // 9. Xem thống kê ứng tuyển
  async getApplicationStats(req, res) {
    try {
      const { candidateId, employerId } = req.query;

      if (!candidateId && !employerId) {
        return res.status(400).json({
          success: false,
          message: "CandidateId hoặc EmployerId là bắt buộc",
        });
      }

      let stats;

      if (candidateId) {
        // Thống kê cho ứng viên
        const totalApplications = await Application.countDocuments({
          candidateId,
        });
        const pendingApplications = await Application.countDocuments({
          candidateId,
          status: { $in: ["Pending", "Reviewed"] },
        });
        const interviewApplications = await Application.countDocuments({
          candidateId,
          status: "Interviewing",
        });
        const offerApplications = await Application.countDocuments({
          candidateId,
          status: "Offer",
        });
        const hiredApplications = await Application.countDocuments({
          candidateId,
          status: "Hired",
        });
        const rejectedApplications = await Application.countDocuments({
          candidateId,
          status: "Rejected",
        });

        stats = {
          total: totalApplications,
          pending: pendingApplications,
          interviewing: interviewApplications,
          offer: offerApplications,
          hired: hiredApplications,
          rejected: rejectedApplications,
        };
      } else {
        // Thống kê cho nhà tuyển dụng
        const allowedJobs = await Job.find({ employerId }).select("_id");
        const allowedJobIds = allowedJobs.map((job) => job._id);

        const totalApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
        });
        const pendingApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
          status: { $in: ["Pending", "Reviewed"] },
        });
        const interviewApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
          status: "Interviewing",
        });
        const offerApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
          status: "Offer",
        });
        const hiredApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
          status: "Hired",
        });
        const rejectedApplications = await Application.countDocuments({
          jobId: { $in: allowedJobIds },
          status: "Rejected",
        });

        stats = {
          total: totalApplications,
          pending: pendingApplications,
          interviewing: interviewApplications,
          offer: offerApplications,
          hired: hiredApplications,
          rejected: rejectedApplications,
        };
      }

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê",
        error: error.message,
      });
    }
  }
}

module.exports = new ApplicationController();
