const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const NotificationController = require("../controllers/NotificationController");

// Middleware xác thực JWT (cần tạo middleware này)
const authenticateToken = require("../middleware/auth");

// Áp dụng middleware xác thực cho tất cả routes
router.use(authenticateToken);

// Cập nhật thông tin cá nhân (cho ứng viên)
router.put("/personal-info", UserController.updatePersonalInfo);

// Cập nhật thông tin công ty (cho nhà tuyển dụng)
router.put("/company-info", UserController.updateCompanyInfo);

// Quản lý tài khoản
router.put("/change-password", UserController.changePassword);
router.put("/account-info", UserController.updateAccountInfo);
router.delete("/account", UserController.deleteAccount);

// Lấy thông tin cá nhân
router.get("/profile/:candidateId", UserController.getPersonalInfo);

// Quản lý thông báo
router.get("/notifications", NotificationController.getNotifications);
router.put(
  "/notifications/:notificationId/read",
  NotificationController.markNotificationAsRead
);
router.put(
  "/notifications/read-all",
  NotificationController.markAllNotificationsAsRead
);
router.delete(
  "/notifications/:notificationId",
  NotificationController.deleteNotification
);
router.get("/notifications/stats", NotificationController.getNotificationStats);

// Tích hợp mạng xã hội
router.put("/social-links", UserController.updateSocialLinks);

module.exports = router;
