# API Notification (Thông báo)

Quản lý và truy xuất thông báo cho người dùng.

## 1. Lấy danh sách thông báo

- **Endpoint:** `GET /notifications`
- **Query:** `page`, `limit`, `unreadOnly`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "docs": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Nhà tuyển dụng đã xem hồ sơ của bạn",
      "content": "...",
      "isRead": false,
      "createdAt": "2024-05-01T12:00:00.000Z"
    }
  ],
  "totalDocs": 10,
  "limit": 10,
  "page": 1,
  "totalPages": 1
}
```

## 2. Đánh dấu một thông báo là đã đọc

- **Endpoint:** `PATCH /notifications/:notificationId/read`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Đã đánh dấu thông báo là đã đọc",
  "notification": { ... }
}
```

## 3. Đánh dấu tất cả thông báo là đã đọc

- **Endpoint:** `PATCH /notifications/read-all`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Tất cả thông báo đã được đánh dấu là đã đọc"
}
```

## 4. Xóa một thông báo

- **Endpoint:** `DELETE /notifications/:notificationId`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Xóa thông báo thành công"
}
```

## 5. Thống kê số lượng thông báo chưa đọc

- **Endpoint:** `GET /notifications/stats`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "unreadCount": 2
}
```

---

**Lưu ý:**

- Tất cả các endpoint đều yêu cầu xác thực (token JWT qua header `Authorization`).
- Thông báo có thể là: hệ thống, nhà tuyển dụng xem hồ sơ, nhà tuyển dụng theo dõi, v.v.
