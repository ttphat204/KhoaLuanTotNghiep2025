# API Interview (Phỏng vấn)

Quản lý lịch phỏng vấn và gửi tin nhắn giữa nhà tuyển dụng và ứng viên.

## 1. Lấy danh sách phỏng vấn

- **Endpoint:** `GET /interviews`
- **Query:** `candidateId`, `employerId`, `page`, `limit`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "data": [
    {
      "_id": "...",
      "applicationId": "...",
      "employerId": "...",
      "candidateId": "...",
      "interviewDate": "2024-05-01T09:00:00.000Z",
      "interviewTime": "09:00 AM",
      "interviewType": "Online",
      "interviewLocation": "Google Meet",
      "interviewerNames": ["Nguyen Van A"],
      "status": "Scheduled",
      "feedback": "",
      "notes": "...",
      "messages": [ ... ]
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## 2. Tạo mới phỏng vấn

- **Endpoint:** `POST /interviews`
- **Body:** (xem các trường trong response mẫu ở trên)
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Tạo phỏng vấn thành công",
  "interview": { ... }
}
```

## 3. Cập nhật phỏng vấn

- **Endpoint:** `PUT /interviews/:id`
- **Body:** (các trường cần cập nhật)
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Cập nhật thành công",
  "interview": { ... }
}
```

## 4. Xóa phỏng vấn

- **Endpoint:** `DELETE /interviews/:id`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Đã xóa phỏng vấn"
}
```

## 5. Gửi tin nhắn trong phỏng vấn

- **Endpoint:** `POST /interviews/:id/messages`
- **Body:**

```json
{
  "senderId": "...",
  "senderRole": "employer|candidate",
  "message": "Nội dung tin nhắn"
}
```

- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "message": "Gửi tin nhắn thành công",
  "messages": [ ... ]
}
```

## 6. Lấy danh sách tin nhắn của phỏng vấn

- **Endpoint:** `GET /interviews/:id/messages`
- **Query:** `page`, `limit`
- **Yêu cầu đăng nhập**
- **Response mẫu:**

```json
{
  "data": [
    {
      "senderId": "...",
      "senderRole": "employer",
      "message": "Xin chào, bạn có thể tham gia phỏng vấn lúc 9h không?",
      "time": "2024-05-01T08:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

**Lưu ý:**

- Tất cả các endpoint đều yêu cầu xác thực (token JWT qua header `Authorization`).
- Chỉ employer/candidate liên quan mới được thao tác với phỏng vấn của mình.
- Trường `messages` là mảng các tin nhắn, mỗi tin nhắn gồm: senderId, senderRole, message, time.
