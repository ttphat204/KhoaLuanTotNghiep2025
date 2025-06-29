const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const auth = require("../middleware/auth");

// Lấy danh sách thông báo
router.get("/", auth, NotificationController.getNotifications);

// Đánh dấu một thông báo là đã đọc
router.patch(
  "/:notificationId/read",
  auth,
  NotificationController.markNotificationAsRead
);

// Đánh dấu tất cả thông báo là đã đọc
router.patch(
  "/read-all",
  auth,
  NotificationController.markAllNotificationsAsRead
);

// Xóa một thông báo
router.delete(
  "/:notificationId",
  auth,
  NotificationController.deleteNotification
);

// Thống kê thông báo (số lượng chưa đọc)
router.get("/stats", auth, NotificationController.getNotificationStats);

module.exports = router;
