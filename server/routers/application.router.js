const express = require("express");
const router = express.Router();
const ApplicationController = require("../controllers/ApplicationController");
const auth = require("../middleware/auth");

// Routes cho ứng viên (candidate)
// 1. Lưu/bỏ yêu thích công việc
router.post("/favorites/toggle", auth, ApplicationController.toggleFavoriteJob);

// 2. Xem danh sách việc làm yêu thích
router.get("/favorites", auth, ApplicationController.getFavoriteJobs);

// 3. Xem lịch sử ứng tuyển
router.get("/history", auth, ApplicationController.getApplicationHistory);

// 4. Xem việc làm chờ ứng tuyển (trạng thái CV)
router.get("/pending", auth, ApplicationController.getPendingApplications);

// 5. Nộp hồ sơ
router.post("/submit", auth, ApplicationController.submitApplication);

// 6. Xem thống kê ứng tuyển (cho ứng viên)
router.get("/stats", auth, ApplicationController.getApplicationStats);

// Routes cho nhà tuyển dụng (employer)
// 7. Xem/tải về hồ sơ ứng viên
router.get(
  "/candidate/:applicationId",
  auth,
  ApplicationController.getCandidateResume
);

// 8. Lọc/sắp xếp hồ sơ ứng viên
router.get("/filter", auth, ApplicationController.filterApplications);

// 9. Cập nhật trạng thái đơn ứng tuyển
router.put(
  "/status/:applicationId",
  auth,
  ApplicationController.updateApplicationStatus
);

// 10. Xem thống kê ứng tuyển (cho nhà tuyển dụng)
router.get("/employer/stats", auth, ApplicationController.getApplicationStats);

module.exports = router;
