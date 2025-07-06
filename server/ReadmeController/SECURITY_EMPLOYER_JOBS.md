# 🔒 Bảo mật cho Employer Jobs API

## Tổng quan
Hệ thống đã được thiết kế để đảm bảo rằng **mỗi employer chỉ có thể xem và quản lý jobs của chính mình**, không thể truy cập jobs của employer khác.

## 🛡️ Các lớp bảo mật

### 1. **JWT Authentication**
- Tất cả API đều yêu cầu JWT token hợp lệ
- Token chứa thông tin `userId` và `role`
- Middleware `authenticateToken` kiểm tra token trước khi cho phép truy cập

### 2. **Role-based Authorization**
- Chỉ user có `role = "employer"` mới có thể truy cập
- Middleware `employerAuth` kiểm tra role và tìm thông tin employer
- Trả về lỗi 403 nếu không phải employer

### 3. **Data Isolation**
- Mỗi employer chỉ có thể truy cập jobs có `employerId` trùng với `_id` của mình
- Query luôn bao gồm điều kiện `{ employerId: employer._id }`
- Middleware `jobOwnership` kiểm tra quyền sở hữu job

### 4. **Middleware Stack**
```
Request → authenticateToken → employerAuth → jobOwnership → Controller
```

## 🔐 Middleware chi tiết

### `employerAuth` Middleware
```javascript
// Kiểm tra:
// 1. User có role "employer" không
// 2. Tìm thông tin employer từ userId
// 3. Thêm employer vào req.employer
```

### `jobOwnership` Middleware
```javascript
// Kiểm tra:
// 1. Job có tồn tại không
// 2. Job có thuộc về employer hiện tại không
// 3. Thêm job vào req.job
```

## 📋 API Security Matrix

| API | Authentication | Authorization | Data Isolation |
|-----|---------------|---------------|----------------|
| `POST /api/jobs` | ✅ JWT | ✅ Employer Role | ✅ Tự động gán employerId |
| `GET /api/jobs/employer/dashboard` | ✅ JWT | ✅ Employer Role | ✅ Chỉ jobs của employer |
| `GET /api/jobs/employer/all-jobs` | ✅ JWT | ✅ Employer Role | ✅ Chỉ jobs của employer |
| `GET /api/jobs/employer/jobs` | ✅ JWT | ✅ Employer Role | ✅ Chỉ jobs của employer |
| `GET /api/jobs/employer/jobs/:jobId` | ✅ JWT | ✅ Employer Role | ✅ Job Ownership |
| `GET /api/jobs/employer/stats` | ✅ JWT | ✅ Employer Role | ✅ Chỉ stats của employer |
| `PUT /api/jobs/:jobId` | ✅ JWT | ✅ Employer Role | ✅ Job Ownership |
| `PATCH /api/jobs/:jobId/status` | ✅ JWT | ✅ Employer Role | ✅ Job Ownership |
| `PATCH /api/jobs/:jobId/featured` | ✅ JWT | ✅ Employer Role | ✅ Job Ownership |
| `DELETE /api/jobs/:jobId` | ✅ JWT | ✅ Employer Role | ✅ Job Ownership |

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Chỉ nhà tuyển dụng mới có thể truy cập tính năng này"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy tin tuyển dụng hoặc bạn không có quyền truy cập"
}
```

## 🔍 Ví dụ bảo mật

### Scenario 1: Employer A cố gắng xem jobs của Employer B
```
1. Employer A gửi request với token của mình
2. authenticateToken kiểm tra token → OK
3. employerAuth kiểm tra role → OK (là employer)
4. Query chỉ lấy jobs có employerId = Employer A
5. Kết quả: Chỉ thấy jobs của Employer A
```

### Scenario 2: Employer A cố gắng cập nhật job của Employer B
```
1. Employer A gửi request cập nhật job ID của Employer B
2. authenticateToken kiểm tra token → OK
3. employerAuth kiểm tra role → OK
4. jobOwnership kiểm tra job có thuộc Employer A không → FAIL
5. Trả về lỗi 404: "Không tìm thấy tin tuyển dụng hoặc bạn không có quyền truy cập"
```

### Scenario 3: User thường cố gắng truy cập API employer
```
1. User thường gửi request với token của mình
2. authenticateToken kiểm tra token → OK
3. employerAuth kiểm tra role → FAIL (không phải employer)
4. Trả về lỗi 403: "Chỉ nhà tuyển dụng mới có thể truy cập tính năng này"
```

## 🛠️ Implementation Details

### Database Query Pattern
```javascript
// Luôn đảm bảo query chỉ lấy jobs của employer hiện tại
const query = { employerId: employer._id };

// Thêm các filter khác
if (status) query.status = status;
if (jobType) query.jobType = jobType;

// Thực hiện query
const jobs = await Jobs.find(query);
```

### Middleware Chain
```javascript
// Router setup
router.get("/employer/jobs/:jobId", 
  authenticateToken,    // Kiểm tra JWT
  employerAuth,         // Kiểm tra role employer
  jobOwnership,        // Kiểm tra quyền sở hữu job
  JobController.getEmployerJobDetail
);
```

## ✅ Kết luận

Hệ thống đã được thiết kế với **4 lớp bảo mật**:
1. **JWT Authentication** - Xác thực người dùng
2. **Role-based Authorization** - Phân quyền theo vai trò
3. **Data Isolation** - Cô lập dữ liệu theo employer
4. **Job Ownership** - Kiểm tra quyền sở hữu job

**Đảm bảo 100% rằng mỗi employer chỉ có thể xem và quản lý jobs của chính mình!** 🔒 