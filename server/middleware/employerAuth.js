const Auth = require("../models/Auth");
const Employers = require("../models/Employers");

// Middleware xác thực employer và đảm bảo chỉ truy cập jobs của mình
const employerAuth = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
    const authUser = await Auth.findById(userId);
    if (!authUser || authUser.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Chỉ nhà tuyển dụng mới có thể truy cập tính năng này",
      });
    }

    // Tìm thông tin nhà tuyển dụng
    const employer = await Employers.findOne({ userId });
    if (!employer) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy thông tin nhà tuyển dụng" 
      });
    }

    // Thêm thông tin employer vào request để sử dụng trong controller
    req.employer = employer;
    next();
  } catch (error) {
    console.error("Lỗi xác thực employer:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi xác thực" 
    });
  }
};

// Middleware kiểm tra quyền sở hữu job
const jobOwnership = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employer = req.employer;

    // Kiểm tra xem job có thuộc về employer này không
    const Jobs = require("../models/Jobs");
    const job = await Jobs.findOne({
      _id: jobId,
      employerId: employer._id
    });

    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy tin tuyển dụng hoặc bạn không có quyền truy cập" 
      });
    }

    // Thêm thông tin job vào request
    req.job = job;
    next();
  } catch (error) {
    console.error("Lỗi kiểm tra quyền sở hữu job:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi kiểm tra quyền truy cập" 
    });
  }
};

module.exports = {
  employerAuth,
  jobOwnership
}; 