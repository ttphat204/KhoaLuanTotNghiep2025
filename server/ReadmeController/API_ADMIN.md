# API Admin Documentation

## Overview
Các API dành cho admin để quản lý hệ thống.

## Base URL
```
https://be-khoaluan.vercel.app/api/admin
```

## Endpoints

### 1. Quản lý Employer

#### 1.1 Lấy danh sách tất cả employer
- **URL:** `/employer-management`
- **Method:** `GET`
- **Description:** Lấy danh sách tất cả employer trong hệ thống
- **Response:**
```json
[
  {
    "id": "employer_id",
    "email": "employer@example.com",
    "phone": "0987654321",
    "companyName": "Công ty ABC",
    "address": "Hà Nội, Việt Nam",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profile": {
      "companyAddress": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường ABC",
      "industry": "Công nghệ thông tin",
      "companyWebsite": "https://company.com",
      "companyDescription": "Mô tả công ty",
      "companySize": 100,
      "foundedYear": 2020
    }
  }
]
```

#### 1.2 Duyệt/Từ chối employer
- **URL:** `/employer-management`
- **Method:** `POST`
- **Body:**
```json
{
  "employerId": "employer_id",
  "action": "approve" // hoặc "reject"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Đã duyệt đăng ký",
  "status": "approved"
}
```

#### 1.3 Xóa employer
- **URL:** `/employer-management`
- **Method:** `DELETE`
- **Body:**
```json
{
  "employerId": "employer_id"
}
```
- **Description:** Xóa vĩnh viễn employer và tất cả dữ liệu liên quan (jobs, applications, interviews, notifications)
- **Response:**
```json
{
  "success": true,
  "message": "Đã xóa employer và tất cả dữ liệu liên quan thành công",
  "deletedEmployer": {
    "id": "employer_id",
    "email": "employer@example.com",
    "companyName": "Công ty ABC"
  }
}
```

#### 1.4 Lấy chi tiết employer
- **URL:** `/employer-management?employerId=employer_id`
- **Method:** `GET`
- **Description:** Lấy chi tiết một employer cụ thể
- **Response:** Thông tin chi tiết của employer

## Error Responses

### 400 Bad Request
```json
{
  "message": "Thiếu thông tin hoặc action không hợp lệ"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy tài khoản employer"
}
```

### 405 Method Not Allowed
```json
{
  "message": "Method Not Allowed"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi khi xóa employer",
  "error": "Error details"
}
```

## Security Notes
- Các API này chỉ dành cho admin
- Cần implement authentication/authorization middleware
- Xóa employer sẽ xóa tất cả dữ liệu liên quan, không thể hoàn tác

## Data Deletion Cascade
Khi xóa employer, hệ thống sẽ xóa:
1. Tất cả jobs của employer
2. Tất cả applications liên quan đến jobs của employer
3. Tất cả interviews liên quan đến jobs của employer
4. Tất cả notifications liên quan đến employer
5. Profile employer
6. Auth user

## Usage Examples

### JavaScript/React
```javascript
// Lấy danh sách employer
const response = await axios.get('https://be-khoaluan.vercel.app/api/admin/employer-management');

// Duyệt employer
const approveResponse = await axios.post('https://be-khoaluan.vercel.app/api/admin/employer-management', {
  employerId: 'employer_id',
  action: 'approve'
});

// Xóa employer
const deleteResponse = await axios.delete('https://be-khoaluan.vercel.app/api/admin/employer-management', {
  data: { employerId: 'employer_id' }
});
```

### cURL
```bash
# Lấy danh sách employer
curl -X GET https://be-khoaluan.vercel.app/api/admin/employer-management

# Duyệt employer
curl -X POST https://be-khoaluan.vercel.app/api/admin/employer-management \
  -H "Content-Type: application/json" \
  -d '{"employerId": "employer_id", "action": "approve"}'

# Xóa employer
curl -X DELETE https://be-khoaluan.vercel.app/api/admin/employer-management \
  -H "Content-Type: application/json" \
  -d '{"employerId": "employer_id"}'
``` 