const Notifications = require("../models/Notifications");

class NotificationController {
  // Lấy danh sách thông báo của người dùng
  async getNotifications(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10, unreadOnly = false } = req.query;

      const query = { userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
      };

      const notifications = await Notifications.paginate(query, options);

      res.json(notifications);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Đánh dấu một thông báo là đã đọc
  async markNotificationAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.userId;

      const notification = await Notifications.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }

      res.json({ message: "Đã đánh dấu thông báo là đã đọc", notification });
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Đánh dấu tất cả thông báo là đã đọc
  async markAllNotificationsAsRead(req, res) {
    try {
      const userId = req.user.userId;
      await Notifications.updateMany({ userId }, { isRead: true });
      res.json({ message: "Tất cả thông báo đã được đánh dấu là đã đọc" });
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa một thông báo
  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.userId;

      const notification = await Notifications.findOneAndDelete({
        _id: notificationId,
        userId,
      });

      if (!notification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }

      res.json({ message: "Xóa thông báo thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thống kê thông báo
  async getNotificationStats(req, res) {
    try {
      const userId = req.user.userId;
      const unreadCount = await Notifications.countDocuments({
        userId,
        isRead: false,
      });
      res.json({ unreadCount });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê thông báo:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}

module.exports = new NotificationController();
