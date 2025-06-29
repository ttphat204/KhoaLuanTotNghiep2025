# User Management API Documentation

## Tổng quan

UserController cung cấp các API để quản lý thông tin người dùng, bao gồm cập nhật thông tin cá nhân, thông tin công ty, quản lý tài khoản và thông báo.

## Base URL

```
/api/user
```

## Authentication

Tất cả các API endpoints đều yêu cầu authentication thông qua middleware `auth`.

## API Endpoints

### 1. Cập nhật thông tin cá nhân (cho ứng viên)

**PUT** `/personal-info`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "fullName": "Tên ứng viên",
  "phoneNumber": "0123456789",
  "city": "Hà Nội",
  "district": "Cầu Giấy",
  "ward": "Dịch Vọng",
  "specificAddress": "123 Đường ABC",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bio": "Mô tả bản thân",
  "skills": ["JavaScript", "React", "Node.js"],
  "expectedSalary": 15000000,
  "preferredJobTypes": ["Full-time", "Remote"],
  "preferredLocations": ["Hà Nội", "TP.HCM"],
  "isAvailable": true,
  "isPublic": true
}
```

**Response:**

```json
{
  "message": "Cập nhật thông tin cá nhân thành công",
  "candidate": {
    "_id": "candidate_id",
    "userId": "user_id",
    "fullName": "Tên ứng viên",
    "phoneNumber": "0123456789",
    "city": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng",
    "specificAddress": "123 Đường ABC",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "bio": "Mô tả bản thân",
    "skills": ["JavaScript", "React", "Node.js"],
    "expectedSalary": 15000000,
    "preferredJobTypes": ["Full-time", "Remote"],
    "preferredLocations": ["Hà Nội", "TP.HCM"],
    "isAvailable": true,
    "isPublic": true
  }
}
```

### 2. Cập nhật thông tin công ty (cho nhà tuyển dụng)

**PUT** `/company-info`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "companyName": "Tên công ty",
  "companyEmail": "company@email.com",
  "companyPhoneNumber": "0123456789",
  "companyAddress": "Địa chỉ công ty",
  "companyWebsite": "https://company.com",
  "companyDescription": "Mô tả công ty",
  "companyLogoUrl": "logo_url",
  "industry": "Công nghệ",
  "companySize": "51-200",
  "foundedYear": 2020
}
```

**Response:**

```json
{
  "message": "Cập nhật thông tin công ty thành công",
  "employer": {
    "_id": "employer_id",
    "userId": "user_id",
    "companyName": "Tên công ty",
    "companyEmail": "company@email.com",
    "companyPhoneNumber": "0123456789",
    "companyAddress": "Địa chỉ công ty",
    "companyWebsite": "https://company.com",
    "companyDescription": "Mô tả công ty",
    "companyLogoUrl": "logo_url",
    "industry": "Công nghệ",
    "companySize": "51-200",
    "foundedYear": 2020
  }
}
```

### 3. Thay đổi mật khẩu

**PUT** `/change-password`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

**Response:**

```json
{
  "message": "Thay đổi mật khẩu thành công"
}
```

### 4. Cập nhật thông tin tài khoản

**PUT** `/account-info`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "email": "new_email@email.com",
  "phone": "0987654321",
  "address": "Địa chỉ mới"
}
```

**Response:**

```json
{
  "message": "Cập nhật thông tin tài khoản thành công",
  "user": {
    "_id": "user_id",
    "email": "new_email@email.com",
    "phone": "0987654321",
    "role": "candidate",
    "address": "Địa chỉ mới"
  }
}
```

### 5. Xóa tài khoản

**DELETE** `/account`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "password": "current_password"
}
```

**Response:**

```json
{
  "message": "Xóa tài khoản thành công"
}
```

### 6. Lấy thông tin cá nhân

**GET** `/personal-info`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "candidate_id",
    "userId": "user_id",
    "fullName": "Tên ứng viên",
    "phoneNumber": "0123456789",
    "city": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng",
    "specificAddress": "123 Đường ABC",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "bio": "Mô tả bản thân",
    "skills": ["JavaScript", "React", "Node.js"],
    "expectedSalary": 15000000,
    "preferredJobTypes": ["Full-time", "Remote"],
    "preferredLocations": ["Hà Nội", "TP.HCM"],
    "isAvailable": true,
    "isPublic": true
  }
}
```

### 7. Lấy danh sách thông báo

**GET** `/notifications?page=1&limit=10&read=false`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `read` (optional): Lọc theo trạng thái đọc (true/false)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "notification_id",
      "userId": "user_id",
      "type": "application_status",
      "message": "Đơn ứng tuyển của bạn đã được xem xét",
      "read": false,
      "link": "/applications/application_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 8. Đánh dấu thông báo đã đọc

**PUT** `/notifications/:notificationId/read`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Path Parameters:**

- `notificationId`: ID của thông báo

**Response:**

```json
{
  "success": true,
  "message": "Đánh dấu thông báo đã đọc thành công"
}
```

### 9. Đánh dấu tất cả thông báo đã đọc

**PUT** `/notifications/read-all`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Đánh dấu tất cả thông báo đã đọc thành công"
}
```

### 10. Xóa thông báo

**DELETE** `/notifications/:notificationId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Path Parameters:**

- `notificationId`: ID của thông báo

**Response:**

```json
{
  "success": true,
  "message": "Xóa thông báo thành công"
}
```

### 11. Cập nhật liên kết mạng xã hội

**PUT** `/social-links`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "linkedin": "https://linkedin.com/in/username",
  "github": "https://github.com/username",
  "facebook": "https://facebook.com/username",
  "twitter": "https://twitter.com/username",
  "portfolio": "https://portfolio.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật liên kết mạng xã hội thành công",
  "data": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "facebook": "https://facebook.com/username",
    "twitter": "https://twitter.com/username",
    "portfolio": "https://portfolio.com"
  }
}
```

### 12. Thống kê thông báo

**GET** `/notifications/stats`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 50,
    "unread": 15,
    "read": 35,
    "byType": {
      "application_status": 20,
      "job_match": 15,
      "system": 10,
      "new_message": 5
    }
  }
}
```

## Loại thông báo

- `application_status`: Cập nhật trạng thái ứng tuyển
- `job_match`: Công việc phù hợp
- `system`: Thông báo hệ thống
- `new_message`: Tin nhắn mới

## Giới tính

- `male`: Nam
- `female`: Nữ
- `other`: Khác

## Quy mô công ty

- `1-10`: 1-10 nhân viên
- `11-50`: 11-50 nhân viên
- `51-200`: 51-200 nhân viên
- `201-500`: 201-500 nhân viên
- `501-1000`: 501-1000 nhân viên
- `1000+`: Trên 1000 nhân viên

## Lưu ý

- Chỉ ứng viên mới có thể cập nhật thông tin cá nhân
- Chỉ nhà tuyển dụng mới có thể cập nhật thông tin công ty
- Mật khẩu được mã hóa bằng bcrypt
- Thông báo được phân trang và có thể lọc theo trạng thái
- Liên kết mạng xã hội là tùy chọn
