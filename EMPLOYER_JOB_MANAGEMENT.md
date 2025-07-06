# Hướng dẫn sử dụng chức năng Quản lý Jobs của Employer

## Tổng quan

Chức năng này cho phép employer xem và quản lý danh sách việc làm của riêng mình. Mỗi employer chỉ có thể xem và quản lý jobs của chính mình, không thể xem jobs của employer khác.

## Tính năng chính

### 1. Dashboard chính (`/employer/dashboard`)
- **Xem danh sách jobs**: Hiển thị tất cả jobs của employer
- **Thống kê**: Số lượng jobs, jobs đang hoạt động, lượt xem, ứng viên
- **Bộ lọc**: Theo trạng thái, loại công việc, tìm kiếm
- **Quản lý jobs**: 
  - Tạo job mới
  - Cập nhật trạng thái (Active/Closed)
  - Đặt/bỏ nổi bật
  - Xem chi tiết job
  - Xem danh sách ứng viên
  - Xóa job

### 2. Chi tiết Job (`/employer/jobs/:jobId`)
- **Thông tin chi tiết**: Mô tả, yêu cầu, quyền lợi, kỹ năng
- **Thống kê**: Lượt xem, số ứng viên
- **Quản lý**: Cập nhật trạng thái, đặt nổi bật, xóa
- **Thông tin công ty**: Logo, tên công ty

### 3. Quản lý ứng viên (`/employer/jobs/:jobId/applications`)
- **Danh sách ứng viên**: Tất cả ứng viên đã ứng tuyển
- **Thông tin ứng viên**: Tên, email, số điện thoại
- **Quản lý trạng thái**: Chấp nhận/từ chối ứng viên
- **Tải CV**: Download CV của ứng viên
- **Bộ lọc**: Theo trạng thái, tìm kiếm theo tên/email

## Bảo mật

### Middleware Authentication
- **employerAuth**: Kiểm tra user có phải là employer không
- **jobOwnership**: Kiểm tra job có thuộc về employer này không
- **JWT Token**: Xác thực qua token trong header

### Phân quyền
- Employer A chỉ xem được jobs của A
- Employer B không thể xem jobs của A
- Mỗi employer chỉ quản lý được jobs của mình

## API Endpoints

### Lấy danh sách jobs
```
GET /api/jobs/employer/jobs
Headers: Authorization: Bearer {token}
```

### Lấy chi tiết job
```
GET /api/jobs/employer/jobs/:jobId
Headers: Authorization: Bearer {token}
```

### Tạo job mới
```
POST /api/jobs
Headers: Authorization: Bearer {token}
Body: {
  jobTitle: string,
  description: string,
  requirements: string[],
  benefits: string[],
  salaryRange: { min: number, max: number, currency: string },
  location: { province: string, district: string, addressDetail: string },
  jobType: string,
  categoryId: string,
  skillsRequired: string[],
  experienceLevel: string,
  applicationDeadline: string
}
```

### Cập nhật trạng thái job
```
PATCH /api/jobs/:jobId/status
Headers: Authorization: Bearer {token}
Body: { status: "Active" | "Closed" | "Draft" | "Archived" }
```

### Đặt/bỏ nổi bật job
```
PATCH /api/jobs/:jobId/featured
Headers: Authorization: Bearer {token}
```

### Xóa job
```
DELETE /api/jobs/:jobId
Headers: Authorization: Bearer {token}
```

### Lấy danh sách ứng viên
```
GET /api/applications/job/:jobId
Headers: Authorization: Bearer {token}
```

### Cập nhật trạng thái ứng viên
```
PATCH /api/applications/:applicationId/status
Headers: Authorization: Bearer {token}
Body: { status: "pending" | "accepted" | "rejected" | "interviewed" }
```

## Cấu trúc Database

### Jobs Collection
```javascript
{
  _id: ObjectId,
  employerId: ObjectId, // Reference to Employers collection
  jobTitle: String,
  description: String,
  requirements: [String],
  benefits: [String],
  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },
  location: {
    province: String,
    district: String,
    addressDetail: String
  },
  jobType: String, // "Full-time", "Part-time", "Remote", "Internship", "Contract"
  categoryId: ObjectId, // Reference to Categories collection
  skillsRequired: [String],
  experienceLevel: String, // "Entry-level", "Mid-level", "Senior", "Lead", "Manager"
  applicationDeadline: Date,
  postedDate: Date,
  status: String, // "Active", "Closed", "Draft", "Archived"
  viewsCount: Number,
  applicantsCount: Number,
  isFeatured: Boolean
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId, // Reference to Jobs collection
  candidateId: ObjectId, // Reference to Candidates collection
  candidateName: String,
  candidateEmail: String,
  candidatePhone: String,
  cvUrl: String,
  coverLetter: String,
  appliedDate: Date,
  status: String // "pending", "accepted", "rejected", "interviewed"
}
```

## Hướng dẫn sử dụng

### 1. Đăng nhập
- Employer đăng nhập vào hệ thống
- Hệ thống lưu token vào localStorage

### 2. Truy cập Dashboard
- Vào `/employer/dashboard`
- Xem danh sách jobs của mình
- Sử dụng bộ lọc để tìm kiếm

### 3. Tạo job mới
- Click "Đăng tin mới"
- Điền thông tin job
- Submit form

### 4. Quản lý job
- Click icon "Xem chi tiết" để xem chi tiết job
- Click icon "Xem ứng viên" để xem danh sách ứng viên
- Sử dụng các nút hành động để quản lý

### 5. Quản lý ứng viên
- Vào trang ứng viên của job
- Xem thông tin ứng viên
- Chấp nhận/từ chối ứng viên
- Tải CV của ứng viên

## Lưu ý quan trọng

1. **Bảo mật**: Luôn kiểm tra token và quyền truy cập
2. **Validation**: Validate dữ liệu trước khi lưu
3. **Error Handling**: Xử lý lỗi một cách graceful
4. **UX**: Hiển thị loading state và thông báo lỗi rõ ràng
5. **Performance**: Sử dụng pagination cho danh sách lớn

## Troubleshooting

### Lỗi thường gặp

1. **401 Unauthorized**: Token hết hạn hoặc không hợp lệ
   - Giải pháp: Đăng nhập lại

2. **403 Forbidden**: Không có quyền truy cập
   - Giải pháp: Kiểm tra role và quyền sở hữu

3. **404 Not Found**: Job không tồn tại
   - Giải pháp: Kiểm tra jobId và quyền sở hữu

4. **500 Internal Server Error**: Lỗi server
   - Giải pháp: Kiểm tra logs và thử lại

### Debug

1. Kiểm tra token trong localStorage
2. Kiểm tra network tab trong DevTools
3. Kiểm tra console logs
4. Kiểm tra server logs

## Cải tiến tương lai

1. **Real-time notifications**: Thông báo khi có ứng viên mới
2. **Advanced filtering**: Lọc theo nhiều tiêu chí hơn
3. **Bulk actions**: Thao tác hàng loạt
4. **Export data**: Xuất danh sách ứng viên
5. **Analytics**: Thống kê chi tiết hơn
6. **Email integration**: Gửi email thông báo
7. **Interview scheduling**: Lên lịch phỏng vấn 