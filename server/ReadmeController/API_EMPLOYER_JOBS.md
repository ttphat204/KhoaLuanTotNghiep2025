# API Quản lý Tin tuyển dụng cho Employer

## Tổng quan
Các API này cho phép nhà tuyển dụng (employer) quản lý tin tuyển dụng của mình, bao gồm tạo, xem, cập nhật, xóa và thống kê.

## Authentication
Tất cả API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## Danh sách API

### 1. 🚀 API Dashboard tổng hợp (RECOMMENDED)
**GET** `/api/jobs/employer/dashboard`

**Query Parameters:**
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng item mỗi trang (mặc định: 10)
- `status` (optional): Lọc theo trạng thái (Active, Closed, Draft, Archived)
- `jobType` (optional): Lọc theo loại công việc (Full-time, Part-time, Remote, Internship, Contract)
- `categoryId` (optional): Lọc theo danh mục
- `search` (optional): Tìm kiếm theo tiêu đề hoặc mô tả
- `sortBy` (optional): Sắp xếp theo trường (postedDate, jobTitle, viewsCount, applicantsCount)
- `sortOrder` (optional): Thứ tự sắp xếp (asc, desc)
- `period` (optional): Số ngày để thống kê (mặc định: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "employer": {
      "_id": "employer_id",
      "companyName": "Company Name",
      "companyLogoUrl": "logo_url",
      "companyDescription": "Company description"
    },
    "jobs": {
      "list": [
        {
          "_id": "job_id",
          "jobTitle": "Software Engineer",
          "description": "Mô tả công việc",
          "status": "Active",
          "postedDate": "2024-01-01T00:00:00.000Z",
          "viewsCount": 100,
          "applicantsCount": 5,
          "isFeatured": false,
          "categoryId": {
            "_id": "category_id",
            "name": "Technology"
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "itemsPerPage": 10
      }
    },
    "stats": {
      "statusStats": {
        "Active": 30,
        "Closed": 10,
        "Draft": 5,
        "Archived": 5
      },
      "jobTypeStats": {
        "Full-time": 25,
        "Part-time": 10,
        "Remote": 8,
        "Internship": 5,
        "Contract": 2
      },
      "recentJobs": 15,
      "totalViews": 1500,
      "totalApplicants": 120,
      "featuredJobs": 3,
      "period": 30
    },
    "highlights": {
      "recentJobs": [
        {
          "_id": "job_id",
          "jobTitle": "Recent Job",
          "postedDate": "2024-01-01T00:00:00.000Z"
        }
      ],
      "topViewedJobs": [
        {
          "_id": "job_id",
          "jobTitle": "Top Viewed Job",
          "viewsCount": 500
        }
      ]
    },
    "categories": [
      {
        "_id": "category_id",
        "name": "Technology"
      }
    ],
    "filters": {
      "statuses": ["Active", "Closed", "Draft", "Archived"],
      "jobTypes": ["Full-time", "Part-time", "Remote", "Internship", "Contract"],
      "experienceLevels": ["Entry-level", "Mid-level", "Senior", "Lead", "Manager"]
    }
  }
}
```

### 2. 📋 Lấy TẤT CẢ jobs của employer (không phân trang)
**GET** `/api/jobs/employer/all-jobs`

**Query Parameters:**
- `status` (optional): Lọc theo trạng thái (Active, Closed, Draft, Archived)
- `jobType` (optional): Lọc theo loại công việc (Full-time, Part-time, Remote, Internship, Contract)
- `categoryId` (optional): Lọc theo danh mục
- `search` (optional): Tìm kiếm theo tiêu đề hoặc mô tả
- `sortBy` (optional): Sắp xếp theo trường (postedDate, jobTitle, viewsCount, applicantsCount)
- `sortOrder` (optional): Thứ tự sắp xếp (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "employer": {
      "_id": "employer_id",
      "companyName": "Company Name",
      "companyLogoUrl": "logo_url",
      "companyDescription": "Company description"
    },
    "jobs": [
      {
        "_id": "job_id",
        "jobTitle": "Software Engineer",
        "description": "Mô tả công việc",
        "requirements": ["Requirement 1", "Requirement 2"],
        "benefits": ["Benefit 1", "Benefit 2"],
        "salaryRange": {
          "min": 10000000,
          "max": 20000000,
          "currency": "VND"
        },
        "location": {
          "province": "Ho Chi Minh",
          "district": "District 1",
          "addressDetail": "123 Street"
        },
        "jobType": "Full-time",
        "categoryId": {
          "_id": "category_id",
          "name": "Technology"
        },
        "skillsRequired": ["JavaScript", "React"],
        "experienceLevel": "Mid-level",
        "applicationDeadline": "2024-12-31T00:00:00.000Z",
        "postedDate": "2024-01-01T00:00:00.000Z",
        "status": "Active",
        "viewsCount": 100,
        "applicantsCount": 5,
        "isFeatured": false,
        "employerId": {
          "_id": "employer_id",
          "companyName": "Company Name",
          "companyLogoUrl": "logo_url"
        }
      }
    ],
    "stats": {
      "totalJobs": 50,
      "statusStats": {
        "Active": 30,
        "Closed": 10,
        "Draft": 5,
        "Archived": 5
      },
      "jobTypeStats": {
        "Full-time": 25,
        "Part-time": 10,
        "Remote": 8,
        "Internship": 5,
        "Contract": 2
      },
      "totalViews": 1500,
      "totalApplicants": 120,
      "featuredJobs": 3
    },
    "filters": {
      "status": "Active",
      "jobType": "Full-time",
      "categoryId": "category_id",
      "search": "software",
      "sortBy": "postedDate",
      "sortOrder": "desc"
    }
  }
}
```

### 3. Lấy danh sách tin tuyển dụng của employer (có phân trang)
**GET** `/api/jobs/employer/jobs`

**Query Parameters:**
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng item mỗi trang (mặc định: 10)
- `status` (optional): Lọc theo trạng thái (Active, Closed, Draft, Archived)
- `jobType` (optional): Lọc theo loại công việc (Full-time, Part-time, Remote, Internship, Contract)
- `categoryId` (optional): Lọc theo danh mục
- `search` (optional): Tìm kiếm theo tiêu đề hoặc mô tả
- `sortBy` (optional): Sắp xếp theo trường (postedDate, jobTitle, viewsCount, applicantsCount)
- `sortOrder` (optional): Thứ tự sắp xếp (asc, desc)

**Response:**
```json
{
  "jobs": [
    {
      "_id": "job_id",
      "jobTitle": "Software Engineer",
      "description": "Mô tả công việc",
      "status": "Active",
      "postedDate": "2024-01-01T00:00:00.000Z",
      "viewsCount": 100,
      "applicantsCount": 5,
      "isFeatured": false,
      "categoryId": {
        "_id": "category_id",
        "name": "Technology"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "stats": {
    "Active": 30,
    "Closed": 10,
    "Draft": 5,
    "Archived": 5
  },
  "employer": {
    "_id": "employer_id",
    "companyName": "Company Name",
    "companyLogoUrl": "logo_url"
  }
}
```

### 4. Lấy chi tiết tin tuyển dụng của employer
**GET** `/api/jobs/employer/jobs/:jobId`

**Response:**
```json
{
  "job": {
    "_id": "job_id",
    "jobTitle": "Software Engineer",
    "description": "Mô tả công việc",
    "requirements": ["Requirement 1", "Requirement 2"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "salaryRange": {
      "min": 10000000,
      "max": 20000000,
      "currency": "VND"
    },
    "location": {
      "province": "Ho Chi Minh",
      "district": "District 1",
      "addressDetail": "123 Street"
    },
    "jobType": "Full-time",
    "categoryId": {
      "_id": "category_id",
      "name": "Technology"
    },
    "skillsRequired": ["JavaScript", "React"],
    "experienceLevel": "Mid-level",
    "applicationDeadline": "2024-12-31T00:00:00.000Z",
    "postedDate": "2024-01-01T00:00:00.000Z",
    "status": "Active",
    "viewsCount": 100,
    "applicantsCount": 5,
    "isFeatured": false,
    "employerId": {
      "_id": "employer_id",
      "companyName": "Company Name",
      "companyDescription": "Company description",
      "companyLogoUrl": "logo_url"
    }
  }
}
```

### 5. Lấy thống kê tin tuyển dụng
**GET** `/api/jobs/employer/stats`

**Query Parameters:**
- `period` (optional): Số ngày để thống kê (mặc định: 30)

**Response:**
```json
{
  "statusStats": {
    "Active": 30,
    "Closed": 10,
    "Draft": 5,
    "Archived": 5
  },
  "jobTypeStats": {
    "Full-time": 25,
    "Part-time": 10,
    "Remote": 8,
    "Internship": 5,
    "Contract": 2
  },
  "recentJobs": 15,
  "totalViews": 1500,
  "totalApplicants": 120,
  "featuredJobs": 3,
  "period": 30
}
```

### 6. Tạo tin tuyển dụng mới
**POST** `/api/jobs`

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "description": "Mô tả công việc",
  "requirements": ["Requirement 1", "Requirement 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "salaryRange": {
    "min": 10000000,
    "max": 20000000,
    "currency": "VND"
  },
  "location": {
    "province": "Ho Chi Minh",
    "district": "District 1",
    "addressDetail": "123 Street"
  },
  "jobType": "Full-time",
  "categoryId": "category_id",
  "skillsRequired": ["JavaScript", "React"],
  "experienceLevel": "Mid-level",
  "applicationDeadline": "2024-12-31T00:00:00.000Z",
  "isFeatured": false
}
```

### 7. Cập nhật tin tuyển dụng
**PUT** `/api/jobs/:jobId`

**Request Body:** (tương tự như tạo mới, nhưng không bắt buộc tất cả trường)

### 8. Cập nhật trạng thái tin tuyển dụng
**PATCH** `/api/jobs/:jobId/status`

**Request Body:**
```json
{
  "status": "Active"
}
```

**Trạng thái có thể:**
- `Active`: Đang hoạt động
- `Closed`: Đã đóng
- `Draft`: Bản nháp
- `Archived`: Đã lưu trữ

### 9. Toggle tin tuyển dụng nổi bật
**PATCH** `/api/jobs/:jobId/featured`

**Response:**
```json
{
  "message": "Đã đặt tin tuyển dụng làm nổi bật",
  "job": {
    "_id": "job_id",
    "isFeatured": true
  }
}
```

### 10. Xóa tin tuyển dụng
**DELETE** `/api/jobs/:jobId`

**Response:**
```json
{
  "message": "Xóa tin tuyển dụng thành công"
}
```

## Error Responses

### 403 Forbidden
```json
{
  "message": "Chỉ nhà tuyển dụng mới có thể thực hiện hành động này"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy tin tuyển dụng"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi máy chủ"
}
```

## Ví dụ sử dụng

### 🚀 Sử dụng API Dashboard tổng hợp (Khuyến nghị)
```bash
# Lấy tất cả thông tin trong một lần gọi
GET /api/jobs/employer/dashboard?page=1&limit=20&status=Active&sortBy=postedDate&sortOrder=desc

# Với filter và search
GET /api/jobs/employer/dashboard?search=software&jobType=Full-time&categoryId=tech_category_id
```

### 📋 Lấy TẤT CẢ jobs (không phân trang)
```bash
# Lấy tất cả jobs
GET /api/jobs/employer/all-jobs

# Lấy tất cả jobs với filter
GET /api/jobs/employer/all-jobs?status=Active&jobType=Full-time

# Lấy tất cả jobs với search
GET /api/jobs/employer/all-jobs?search=software engineer

# Lấy tất cả jobs với sort
GET /api/jobs/employer/all-jobs?sortBy=viewsCount&sortOrder=desc
```

### Lấy danh sách tin tuyển dụng với filter (có phân trang)
```bash
GET /api/jobs/employer/jobs?status=Active&jobType=Full-time&page=1&limit=20&sortBy=postedDate&sortOrder=desc
```

### Tìm kiếm tin tuyển dụng
```bash
GET /api/jobs/employer/jobs?search=software engineer&categoryId=tech_category_id
```

### Cập nhật trạng thái
```bash
PATCH /api/jobs/job_id/status
Content-Type: application/json

{
  "status": "Closed"
}
```

## 💡 Lưu ý quan trọng

**📋 API `/employer/all-jobs` - Lấy TẤT CẢ jobs:**
- ✅ Không có phân trang - trả về tất cả jobs
- ✅ Bao gồm thông tin chi tiết đầy đủ của mỗi job
- ✅ Có thống kê tổng quan
- ✅ Hỗ trợ filter và search
- ✅ Phù hợp khi cần lấy toàn bộ dữ liệu để xử lý

**🚀 API `/employer/dashboard` - Dashboard tổng hợp:**
- ✅ Có phân trang cho danh sách jobs
- ✅ Bao gồm highlights và categories
- ✅ Phù hợp cho dashboard UI

**📄 API `/employer/jobs` - Danh sách có phân trang:**
- ✅ Có phân trang
- ✅ Phù hợp cho danh sách jobs thông thường

**Chọn API phù hợp:**
- **Lấy TẤT CẢ jobs:** Sử dụng `/employer/all-jobs`
- **Dashboard UI:** Sử dụng `/employer/dashboard`
- **Danh sách thông thường:** Sử dụng `/employer/jobs` 