const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/CompanyController");
const auth = require("../middleware/auth");

// Routes cho quản lý thông tin công ty
// 1. Cập nhật thông tin công ty
router.put(
  "/profile/:employerId",
  auth,
  CompanyController.updateCompanyProfile
);

// 2. Xem hồ sơ công ty
router.get("/profile/:employerId", CompanyController.getCompanyProfile);

// 3. Tìm kiếm công ty
router.get("/search", CompanyController.searchCompanies);

// 4. Lấy danh sách ngành nghề
router.get("/industries", CompanyController.getIndustries);

// 5. Lấy danh sách quy mô công ty
router.get("/sizes", CompanyController.getCompanySizes);

// Routes cho đánh giá/review công ty
// 6. Tạo đánh giá công ty
router.post("/reviews", auth, CompanyController.createCompanyReview);

// 7. Xem danh sách đánh giá công ty
router.get("/reviews", CompanyController.getCompanyReviews);

// 8. Cập nhật đánh giá công ty
router.put("/reviews/:reviewId", auth, CompanyController.updateCompanyReview);

// 9. Xóa đánh giá công ty
router.delete(
  "/reviews/:reviewId",
  auth,
  CompanyController.deleteCompanyReview
);

// Routes cho thống kê báo cáo
// 10. Xem thống kê báo cáo công ty
router.get("/stats/:employerId", auth, CompanyController.getCompanyReportStats);

// 11. Xem danh sách báo cáo công việc của công ty
router.get(
  "/reports/:employerId",
  auth,
  CompanyController.getCompanyJobReports
);

// 12. Cập nhật trạng thái báo cáo
router.put(
  "/reports/:reportId/status",
  auth,
  CompanyController.updateReportStatus
);

module.exports = router;
